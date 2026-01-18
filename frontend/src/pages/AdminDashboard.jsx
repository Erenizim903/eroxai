import { useEffect, useRef, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import {
  addTemplateField,
  createAdminUser,
  createPremiumKey,
  deleteAdminUser,
  deleteTemplateField,
  fetchAdminLogs,
  fetchAdminUsers,
  fetchPremiumKeys,
  updateSiteSettings,
  updateTemplateField,
} from '../services/adminService'
import { createTemplate, listTemplates } from '../services/templateService'
import { fetchSiteSettings } from '../services/siteService'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min?url'

GlobalWorkerOptions.workerSrc = workerSrc

const AdminDashboard = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [tab, setTab] = useState('users')
  const [users, setUsers] = useState([])
  const [logs, setLogs] = useState([])
  const [keys, setKeys] = useState([])
  const [templates, setTemplates] = useState([])
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    is_staff: false,
    is_superuser: false,
    is_active: true,
  })
  const [siteSettings, setSiteSettings] = useState({
    site_name: '',
    contact_email: '',
    contact_phone: '',
    contact_whatsapp: '',
    address: '',
    hero_title: '',
    hero_subtitle: '',
    logo: null,
  })
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    template_type: 'pdf',
    output_language: 'ja',
    file: null,
  })
  const [premiumKey, setPremiumKey] = useState({ code: '', max_uses: 1 })
  const [fieldDraft, setFieldDraft] = useState({
    templateId: '',
    key: '',
    label: '',
    field_type: 'text',
    required: false,
    mapping: {
      page: 1,
      x: 72,
      y: 72,
      font_size: 11,
      sheet: '',
      cell: '',
    },
  })
  const [previewTemplate, setPreviewTemplate] = useState(null)
  const [selectedField, setSelectedField] = useState(null)
  const [mappingDraft, setMappingDraft] = useState({ page: 1, x: 0, y: 0, font_size: 11 })
  const canvasRef = useRef(null)
  const [pdfScale] = useState(1.6)
  const [pdfDoc, setPdfDoc] = useState(null)
  const [pageCount, setPageCount] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)

  const loadAll = async () => {
    const [userData, logData, keyData, templateData, siteData] = await Promise.all([
      fetchAdminUsers(),
      fetchAdminLogs(),
      fetchPremiumKeys(),
      listTemplates(),
      fetchSiteSettings(),
    ])
    setUsers(userData)
    setLogs(logData)
    setKeys(keyData)
    setTemplates(templateData)
    setSiteSettings((prev) => ({ ...prev, ...siteData }))
  }

  useEffect(() => {
    loadAll()
  }, [])

  const handleCreateUser = async () => {
    try {
      await createAdminUser(newUser)
      enqueueSnackbar('Kullanıcı oluşturuldu', { variant: 'success' })
      setNewUser({
        username: '',
        email: '',
        password: '',
        is_staff: false,
        is_superuser: false,
        is_active: true,
      })
      loadAll()
    } catch (error) {
      enqueueSnackbar('Kullanıcı oluşturma hatası', { variant: 'error' })
    }
  }

  const handleDeleteUser = async (userId) => {
    await deleteAdminUser(userId)
    enqueueSnackbar('Kullanıcı silindi', { variant: 'success' })
    loadAll()
  }

  const handleCreateKey = async () => {
    const data = await createPremiumKey(premiumKey)
    enqueueSnackbar(`Key oluşturuldu: ${data.code}`, { variant: 'success' })
    setPremiumKey({ code: '', max_uses: 1 })
    loadAll()
  }

  const handleAddField = async () => {
    await addTemplateField(fieldDraft.templateId, fieldDraft)
    enqueueSnackbar('Alan eklendi', { variant: 'success' })
    setFieldDraft({ templateId: '', key: '', label: '', field_type: 'text', required: false })
    loadAll()
  }

  const handleDeleteField = async (templateId, fieldId) => {
    await deleteTemplateField(templateId, fieldId)
    enqueueSnackbar('Alan silindi', { variant: 'success' })
    loadAll()
  }

  const handleUpdateField = async (templateId, fieldId, mapping) => {
    await updateTemplateField(templateId, fieldId, { mapping })
    enqueueSnackbar('Alan güncellendi', { variant: 'success' })
    loadAll()
  }

  const handleSaveSettings = async () => {
    const payload = new FormData()
    payload.append('site_name', siteSettings.site_name)
    payload.append('contact_email', siteSettings.contact_email)
    payload.append('contact_phone', siteSettings.contact_phone)
    payload.append('contact_whatsapp', siteSettings.contact_whatsapp)
    payload.append('address', siteSettings.address)
    payload.append('hero_title', siteSettings.hero_title)
    payload.append('hero_subtitle', siteSettings.hero_subtitle)
    if (siteSettings.logo) {
      payload.append('logo', siteSettings.logo)
    }
    await updateSiteSettings(payload)
    enqueueSnackbar('Site ayarları güncellendi', { variant: 'success' })
  }

  const handleCreateTemplate = async () => {
    const payload = new FormData()
    payload.append('name', newTemplate.name)
    payload.append('description', newTemplate.description)
    payload.append('template_type', newTemplate.template_type)
    payload.append('output_language', newTemplate.output_language)
    if (newTemplate.file) {
      payload.append('file', newTemplate.file)
    }
    await createTemplate(payload)
    enqueueSnackbar('Şablon oluşturuldu', { variant: 'success' })
    setNewTemplate({ name: '', description: '', template_type: 'pdf', output_language: 'ja', file: null })
    loadAll()
  }

  useEffect(() => {
    const loadPdf = async () => {
      if (!previewTemplate?.file) return
      const pdf = await getDocument(previewTemplate.file).promise
      setPdfDoc(pdf)
      setPageCount(pdf.numPages || 1)
      setCurrentPage(1)
    }
    loadPdf()
  }, [previewTemplate])

  useEffect(() => {
    const renderCurrentPage = async () => {
      if (!pdfDoc) return
      const canvas = canvasRef.current
      if (!canvas) return
      const page = await pdfDoc.getPage(currentPage)
      const viewport = page.getViewport({ scale: pdfScale })
      const context = canvas.getContext('2d')
      canvas.width = viewport.width
      canvas.height = viewport.height
      await page.render({ canvasContext: context, viewport }).promise

      const template = templates.find((item) => item.id === previewTemplate?.id)
      const fields = template?.fields || []
      context.fillStyle = 'rgba(91, 140, 255, 0.9)'
      fields
        .filter((field) => Number(field.mapping?.page || 1) === currentPage)
        .forEach((field) => {
          const x = Number(field.mapping?.x || 0) * pdfScale
          const y = Number(field.mapping?.y || 0) * pdfScale
          context.beginPath()
          context.arc(x, y, 6, 0, Math.PI * 2)
          context.fill()
        })
    }
    renderCurrentPage()
  }, [pdfDoc, currentPage, pdfScale, templates, previewTemplate])

  const handleCanvasClick = async (event) => {
    if (!selectedField || !previewTemplate) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = (event.clientX - rect.left) / pdfScale
    const y = (event.clientY - rect.top) / pdfScale
    const mapping = {
      ...(selectedField.mapping || {}),
      page: currentPage,
      x: Math.round(x),
      y: Math.round(y),
    }
    setMappingDraft({ ...mapping, font_size: Number(mapping.font_size || 11) })
    await handleUpdateField(previewTemplate.id, selectedField.id, mapping)
  }

  return (
    <Box>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Admin Panel
        </Typography>
        <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mb: 3 }}>
          <Tab value="users" label="Kullanıcılar" />
          <Tab value="templates" label="Şablon Alanları" />
          <Tab value="keys" label="Premium Key" />
          <Tab value="logs" label="Loglar" />
          <Tab value="settings" label="Site Ayarları" />
        </Tabs>

        {tab === 'users' && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h6">Yeni Kullanıcı</Typography>
                    <TextField
                      label="Kullanıcı adı"
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    />
                    <TextField
                      label="E-posta"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                    <TextField
                      label="Şifre"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={newUser.is_staff}
                          onChange={(e) => setNewUser({ ...newUser, is_staff: e.target.checked })}
                        />
                      }
                      label="Admin yetkisi"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={newUser.is_superuser}
                          onChange={(e) => setNewUser({ ...newUser, is_superuser: e.target.checked })}
                        />
                      }
                      label="Superuser"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={newUser.is_active}
                          onChange={(e) => setNewUser({ ...newUser, is_active: e.target.checked })}
                        />
                      }
                      label="Aktif"
                    />
                    <Button variant="contained" onClick={handleCreateUser}>
                      Oluştur
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={7}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Kullanıcılar</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Stack spacing={1}>
                    {users.map((u) => (
                      <Stack key={u.id} direction="row" justifyContent="space-between">
                        <Typography>
                          {u.username} · {u.email} {u.is_staff ? '· admin' : ''}
                        </Typography>
                        <Button color="error" onClick={() => handleDeleteUser(u.id)}>Sil</Button>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {tab === 'templates' && (
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">Yeni Şablon</Typography>
                <TextField
                  label="Şablon adı"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                />
                <TextField
                  label="Açıklama"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                />
                <TextField
                  select
                  label="Tür"
                  value={newTemplate.template_type}
                  onChange={(e) => setNewTemplate({ ...newTemplate, template_type: e.target.value })}
                  SelectProps={{ native: true }}
                >
                  <option value="pdf">PDF</option>
                  <option value="xlsx">XLSX</option>
                  <option value="blank">Blank</option>
                </TextField>
                <TextField
                  label="Çıktı dili"
                  value={newTemplate.output_language}
                  onChange={(e) => setNewTemplate({ ...newTemplate, output_language: e.target.value })}
                />
                <input type="file" onChange={(e) => setNewTemplate({ ...newTemplate, file: e.target.files?.[0] })} />
                <Button variant="contained" onClick={handleCreateTemplate}>
                  Şablon Oluştur
                </Button>
                <Divider />
                <Typography variant="h6">Şablon Alanı Ekle</Typography>
                <TextField
                  select
                  label="Şablon"
                  value={fieldDraft.templateId}
                  onChange={(e) => setFieldDraft({ ...fieldDraft, templateId: e.target.value })}
                  SelectProps={{ native: true }}
                >
                  <option value="">Seçin</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </TextField>
                <TextField
                  label="Alan anahtarı"
                  value={fieldDraft.key}
                  onChange={(e) => setFieldDraft({ ...fieldDraft, key: e.target.value })}
                />
                <TextField
                  label="Etiket"
                  value={fieldDraft.label}
                  onChange={(e) => setFieldDraft({ ...fieldDraft, label: e.target.value })}
                />
                <TextField
                  label="Sayfa"
                  type="number"
                  value={fieldDraft.mapping.page}
                  onChange={(e) =>
                    setFieldDraft({ ...fieldDraft, mapping: { ...fieldDraft.mapping, page: Number(e.target.value) } })
                  }
                />
                <TextField
                  label="X"
                  type="number"
                  value={fieldDraft.mapping.x}
                  onChange={(e) =>
                    setFieldDraft({ ...fieldDraft, mapping: { ...fieldDraft.mapping, x: Number(e.target.value) } })
                  }
                />
                <TextField
                  label="Y"
                  type="number"
                  value={fieldDraft.mapping.y}
                  onChange={(e) =>
                    setFieldDraft({ ...fieldDraft, mapping: { ...fieldDraft.mapping, y: Number(e.target.value) } })
                  }
                />
                <TextField
                  label="Font"
                  type="number"
                  value={fieldDraft.mapping.font_size}
                  onChange={(e) =>
                    setFieldDraft({
                      ...fieldDraft,
                      mapping: { ...fieldDraft.mapping, font_size: Number(e.target.value) },
                    })
                  }
                />
                <TextField
                  label="Excel Sheet (opsiyonel)"
                  value={fieldDraft.mapping.sheet}
                  onChange={(e) =>
                    setFieldDraft({ ...fieldDraft, mapping: { ...fieldDraft.mapping, sheet: e.target.value } })
                  }
                />
                <TextField
                  label="Excel Cell (opsiyonel)"
                  value={fieldDraft.mapping.cell}
                  onChange={(e) =>
                    setFieldDraft({ ...fieldDraft, mapping: { ...fieldDraft.mapping, cell: e.target.value } })
                  }
                />
                <Button variant="contained" onClick={handleAddField}>
                  Alan Ekle
                </Button>
                <Divider />
                {templates.map((template) => (
                  <Box key={template.id}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography fontWeight={600}>{template.name}</Typography>
                      {template.file && (
                        <Button onClick={() => setPreviewTemplate(template)}>Önizle</Button>
                      )}
                    </Stack>
                    <Stack spacing={1} sx={{ mt: 1 }}>
                      {template.fields?.map((field) => (
                        <Stack key={field.id} direction="row" justifyContent="space-between">
                          <Stack>
                            <Typography>{field.label}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Sayfa {field.mapping?.page || 1} · x:{field.mapping?.x || 0} · y:{field.mapping?.y || 0}
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={1}>
                            <Button
                              onClick={() =>
                                handleUpdateField(template.id, field.id, {
                                  ...field.mapping,
                                  page: Number(field.mapping?.page || 1),
                                })
                              }
                            >
                              Güncelle
                            </Button>
                            <Button
                              onClick={() => {
                                setSelectedField(field)
                                setMappingDraft({
                                  page: Number(field.mapping?.page || 1),
                                  x: Number(field.mapping?.x || 0),
                                  y: Number(field.mapping?.y || 0),
                                  font_size: Number(field.mapping?.font_size || 11),
                                })
                              }}
                            >
                              Haritala
                            </Button>
                            <Button color="error" onClick={() => handleDeleteField(template.id, field.id)}>
                              Sil
                            </Button>
                          </Stack>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>
                ))}
                {previewTemplate?.file && (
                  <Card variant="outlined">
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2">
                          PDF Önizleme · Sayfa {currentPage}/{pageCount}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="outlined"
                            disabled={currentPage <= 1}
                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                          >
                            Önceki
                          </Button>
                          <Button
                            variant="outlined"
                            disabled={currentPage >= pageCount}
                            onClick={() => setCurrentPage((prev) => Math.min(pageCount, prev + 1))}
                          >
                            Sonraki
                          </Button>
                        </Stack>
                      </Stack>
                      <Box sx={{ overflow: 'auto', borderRadius: 2, mt: 2 }}>
                        <canvas ref={canvasRef} onClick={handleCanvasClick} />
                      </Box>
                      {selectedField && (
                        <Stack spacing={1} sx={{ mt: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            Seçili alan: {selectedField.label} · Sayfa {currentPage}
                          </Typography>
                          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <TextField
                              label="Sayfa"
                              type="number"
                              value={mappingDraft.page}
                              onChange={(e) =>
                                setMappingDraft({ ...mappingDraft, page: Number(e.target.value) })
                              }
                            />
                            <TextField
                              label="X"
                              type="number"
                              value={mappingDraft.x}
                              onChange={(e) =>
                                setMappingDraft({ ...mappingDraft, x: Number(e.target.value) })
                              }
                            />
                            <TextField
                              label="Y"
                              type="number"
                              value={mappingDraft.y}
                              onChange={(e) =>
                                setMappingDraft({ ...mappingDraft, y: Number(e.target.value) })
                              }
                            />
                            <TextField
                              label="Font"
                              type="number"
                              value={mappingDraft.font_size}
                              onChange={(e) =>
                                setMappingDraft({
                                  ...mappingDraft,
                                  font_size: Number(e.target.value),
                                })
                              }
                            />
                            <Button
                              variant="outlined"
                              onClick={() =>
                                handleUpdateField(previewTemplate.id, selectedField.id, mappingDraft)
                              }
                            >
                              Kaydet
                            </Button>
                          </Stack>
                        </Stack>
                      )}
                    </CardContent>
                  </Card>
                )}
              </Stack>
            </CardContent>
          </Card>
        )}

        {tab === 'keys' && (
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">Premium Key</Typography>
                <TextField
                  label="Key (boş bırak otomatik)"
                  value={premiumKey.code}
                  onChange={(e) => setPremiumKey({ ...premiumKey, code: e.target.value })}
                />
                <TextField
                  label="Maks kullanım"
                  type="number"
                  value={premiumKey.max_uses}
                  onChange={(e) => setPremiumKey({ ...premiumKey, max_uses: e.target.value })}
                />
                <Button variant="contained" onClick={handleCreateKey}>
                  Oluştur
                </Button>
                <Divider />
                <Stack spacing={1}>
                  {keys.map((key) => (
                    <Typography key={key.id}>
                      {key.code} · {key.used_count}/{key.max_uses}
                    </Typography>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        )}

        {tab === 'logs' && (
          <Card>
            <CardContent>
              <Typography variant="h6">Loglar</Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={1}>
                {logs.map((log) => (
                  <Typography key={log.id}>
                    {log.user} · {log.action} · {new Date(log.created_at).toLocaleString()}
                  </Typography>
                ))}
              </Stack>
            </CardContent>
          </Card>
        )}

        {tab === 'settings' && (
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">Site Ayarları</Typography>
                <TextField
                  label="Site adı"
                  value={siteSettings.site_name}
                  onChange={(e) => setSiteSettings({ ...siteSettings, site_name: e.target.value })}
                />
                <TextField
                  label="İletişim mail"
                  value={siteSettings.contact_email}
                  onChange={(e) => setSiteSettings({ ...siteSettings, contact_email: e.target.value })}
                />
                <TextField
                  label="Telefon"
                  value={siteSettings.contact_phone}
                  onChange={(e) => setSiteSettings({ ...siteSettings, contact_phone: e.target.value })}
                />
                <TextField
                  label="WhatsApp"
                  value={siteSettings.contact_whatsapp}
                  onChange={(e) => setSiteSettings({ ...siteSettings, contact_whatsapp: e.target.value })}
                />
                <TextField
                  label="Adres"
                  value={siteSettings.address}
                  onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                />
                <TextField
                  label="Hero başlık"
                  value={siteSettings.hero_title}
                  onChange={(e) => setSiteSettings({ ...siteSettings, hero_title: e.target.value })}
                />
                <TextField
                  label="Hero alt başlık"
                  value={siteSettings.hero_subtitle}
                  onChange={(e) => setSiteSettings({ ...siteSettings, hero_subtitle: e.target.value })}
                />
                <input type="file" onChange={(e) => setSiteSettings({ ...siteSettings, logo: e.target.files?.[0] })} />
                <Button variant="contained" onClick={handleSaveSettings}>
                  Kaydet
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Container>
      <Footer />
    </Box>
  )
}

export default AdminDashboard
