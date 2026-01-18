import { isPdfFile, fileToDataUrl } from '../utils/fileUtils'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min?url'
import { cloudOcr } from './cloudService'

GlobalWorkerOptions.workerSrc = workerSrc

const OCR_WORKER_OPTIONS = {
  langPath: 'https://tessdata.projectnaptha.com/4.0.0',
  workerPath: 'https://unpkg.com/tesseract.js@v5.0.3/dist/worker.min.js',
  corePath: 'https://unpkg.com/tesseract.js-core@v5.0.0/tesseract-core.wasm.js',
}

const createOcrWorker = async (onProgress) => {
  const { createWorker } = await import('tesseract.js')
  return createWorker({
    ...OCR_WORKER_OPTIONS,
    logger: (message) => onProgress?.(message),
  })
}

const recognizeImageDataUrl = async (dataUrl, language, onProgress) => {
  const worker = await createOcrWorker(onProgress)
  await worker.loadLanguage(language)
  await worker.initialize(language)
  const { data } = await worker.recognize(dataUrl)
  await worker.terminate()
  return data.text || ''
}

const renderPdfPageToImage = async (page, scale = 2) => {
  const viewport = page.getViewport({ scale })
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  canvas.width = viewport.width
  canvas.height = viewport.height
  await page.render({ canvasContext: context, viewport }).promise
  return canvas.toDataURL('image/png')
}

export const runOcr = async ({ file, language, onProgress, onPageProgress }) => {
  if (!file) {
    return ''
  }

  if (!isPdfFile(file)) {
    const dataUrl = await fileToDataUrl(file)
    return recognizeImageDataUrl(dataUrl, language, onProgress)
  }

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await getDocument({ data: arrayBuffer }).promise
  const totalPages = pdf.numPages
  let combinedText = ''

  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const dataUrl = await renderPdfPageToImage(page)
    const pageText = await recognizeImageDataUrl(dataUrl, language, onProgress)
    combinedText += `\n\n--- Page ${pageNumber} ---\n${pageText.trim()}`
    onPageProgress?.(pageNumber, totalPages)
  }

  return combinedText.trim()
}

export const runCloudOcr = async ({
  file,
  language,
  workerUrl,
  onProgress,
  onPageProgress,
  signal,
}) => {
  if (!file) {
    return ''
  }

  if (!isPdfFile(file)) {
    const dataUrl = await fileToDataUrl(file)
    return cloudOcr({ dataUrl, language, workerUrl, signal })
  }

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await getDocument({ data: arrayBuffer }).promise
  const totalPages = pdf.numPages
  let combinedText = ''

  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const dataUrl = await renderPdfPageToImage(page)
    const pageText = await cloudOcr({ dataUrl, language, workerUrl, signal })
    combinedText += `\n\n--- Page ${pageNumber} ---\n${pageText.trim()}`
    onPageProgress?.(pageNumber, totalPages)
    onProgress?.({ progress: pageNumber / totalPages })
  }

  return combinedText.trim()
}
