import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  Switch,
  Slider,
  Chip,
  alpha,
  LinearProgress,
} from '@mui/material'
import { motion } from 'framer-motion'
import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import TypewriterText from '../components/common/TypewriterText'
import { useAuthStore } from '../store/useAuthStore'
import { listTemplates, fillTemplate } from '../services/templateService'
import DocumentTranslatePanel from '../components/user/DocumentTranslatePanel'
import BlankPagePanel from '../components/user/BlankPagePanel'
import AreaCalculatorPanel from '../components/user/AreaCalculatorPanel'
import PremiumKeyPanel from '../components/user/PremiumKeyPanel'
import DescriptionIcon from '@mui/icons-material/Description'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import CalculateIcon from '@mui/icons-material/Calculate'
import PendingIcon from '@mui/icons-material/Pending'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import StarIcon from '@mui/icons-material/Star'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ViewWeekIcon from '@mui/icons-material/ViewWeek'

const FloatingCard = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
)

const Dashboard = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { i18n } = useTranslation()
  const user = useAuthStore((state) => state.user)
  const loadMe = useAuthStore((state) => state.loadMe)
  const [activeTab, setActiveTab] = useState(0)
  const [showKeyBanner, setShowKeyBanner] = useState(false)
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [inputData, setInputData] = useState({})
  const [fieldSearch, setFieldSearch] = useState('')
  const [showRequiredOnly, setShowRequiredOnly] = useState(false)
  const [compactRows, setCompactRows] = useState(false)
  const [customRows, setCustomRows] = useState([])
  const [columnWidths, setColumnWidths] = useState({
    field: 220,
    type: 160,
    value: 280,
    note: 220,
  })
  const [viewPreset, setViewPreset] = useState('default')
  const [resizing, setResizing] = useState(null)
  const [resizeLineX, setResizeLineX] = useState(null)
  const [groupByType, setGroupByType] = useState(true)
  const tableRef = useRef(null)

  useEffect(() => {
    loadMe()
    listTemplates().then(setTemplates)
  }, [loadMe])

  const getFieldLabel = (field) => {
    const labels = field?.mapping?.labels
    if (!labels) return field.label
    return labels[i18n.language] || labels.tr || labels.en || labels.ja || field.label
  }

  const getFieldDescription = (field) => {
    const descriptions = field?.mapping?.descriptions
    if (!descriptions) return ''
    return descriptions[i18n.language] || descriptions.tr || descriptions.en || descriptions.ja || ''
  }

  const handleSelect = (template) => {
    setSelectedTemplate(template)
    setInputData({})
  }

  const handleFill = async () => {
    if (!selectedTemplate) return
    try {
      const result = await fillTemplate(selectedTemplate.id, inputData)
      enqueueSnackbar(
        i18n.language === 'tr' ? '✅ Çıktı hazır!' : i18n.language === 'ja' ? '✅ 出力の準備ができました！' : '✅ Output ready!',
        { variant: 'success' }
      )
      if (result.output_file) {
        const url = result.output_file.startsWith('http')
          ? result.output_file
          : `${window.location.origin}${result.output_file}`
        window.open(url, '_blank')
      }
    } catch (error) {
      enqueueSnackbar(
        i18n.language === 'tr' ? 'Şablon doldurma hatası' : i18n.language === 'ja' ? 'テンプレート入力エラー' : 'Template fill error',
        { variant: 'error' }
      )
    }
  }

  const usageCount = user?.profile?.usage_count || 0
  const isPremium = user?.profile?.is_premium || false
  const usageLimit = 5

  const keyPromptKey = user ? `eroxai-key-prompt-seen-${user.id || user.username}` : null
  const keyRedeemedKey = user ? `eroxai-key-redeemed-${user.id || user.username}` : null
  const showPremiumTab = Boolean(user)
  const hasSeenKeyBanner = keyPromptKey ? localStorage.getItem(keyPromptKey) : null
  const isKeyRedeemed = keyRedeemedKey ? localStorage.getItem(keyRedeemedKey) : null

  const tabItems = useMemo(() => {
    const items = [
      {
        key: 'templates',
        icon: <DescriptionIcon />,
        label: i18n.language === 'tr' ? 'Şablonlar' : i18n.language === 'ja' ? 'テンプレート' : 'Templates',
      },
      {
        key: 'ocr',
        icon: <AutoAwesomeIcon />,
        label: i18n.language === 'tr' ? 'OCR & Çeviri' : i18n.language === 'ja' ? 'OCR & 翻訳' : 'OCR & Translate',
      },
      {
        key: 'blank',
        icon: <NoteAddIcon />,
        label: i18n.language === 'tr' ? 'Boş Sayfa' : i18n.language === 'ja' ? '空白ページ' : 'Blank Page',
      },
      {
        key: 'area',
        icon: <CalculateIcon />,
        label: i18n.language === 'tr' ? 'Subo Hesaplama' : i18n.language === 'ja' ? '坪計算' : 'Area Calculator',
      },
    ]
    if (showPremiumTab) {
      items.push({
        key: 'premium',
        icon: <VpnKeyIcon />,
        label: i18n.language === 'tr' ? 'Premium Key' : i18n.language === 'ja' ? 'プレミアムキー' : 'Premium Key',
      })
    }
    return items
  }, [i18n.language, showPremiumTab])

  useEffect(() => {
    if (activeTab >= tabItems.length) {
      setActiveTab(0)
    }
  }, [activeTab, tabItems.length])

  useEffect(() => {
    if (!user) return
    if (!isPremium && !hasSeenKeyBanner && !isKeyRedeemed) {
      setShowKeyBanner(true)
    }
  }, [user, isPremium, hasSeenKeyBanner, isKeyRedeemed])

  const handleDismissKeyBanner = () => {
    if (keyPromptKey) {
      localStorage.setItem(keyPromptKey, '1')
    }
    setShowKeyBanner(false)
  }

  const handleOpenPremiumTab = () => {
    const idx = tabItems.findIndex((item) => item.key === 'premium')
    if (idx >= 0) {
      setActiveTab(idx)
    }
    handleDismissKeyBanner()
  }

  const activeKey = tabItems[activeTab]?.key || tabItems[0]?.key

  const columnLetters = useMemo(() => ['A', 'B', 'C', 'D'], [])
  const [activeSheet, setActiveSheet] = useState('sheet-1')

  const filteredFields = useMemo(() => {
    if (!selectedTemplate?.fields) return []
    let fields = selectedTemplate.fields.slice().sort((a, b) => (a.order || 0) - (b.order || 0))
    if (showRequiredOnly) {
      fields = fields.filter((field) => field.required)
    }
    if (fieldSearch.trim()) {
      const q = fieldSearch.trim().toLowerCase()
      fields = fields.filter((field) => {
        const label = getFieldLabel(field)?.toLowerCase() || ''
        const key = field.key?.toLowerCase() || ''
        const desc = getFieldDescription(field)?.toLowerCase() || ''
        return `${label} ${key} ${desc}`.includes(q)
      })
    }
    return fields
  }, [selectedTemplate, showRequiredOnly, fieldSearch, i18n.language])

  const isEmptyRequired = (field) => {
    if (!field?.required) return false
    const value = inputData[field.key]
    return value === undefined || value === null || String(value).trim() === ''
  }

  const missingRequiredCount = useMemo(
    () => filteredFields.filter((field) => isEmptyRequired(field)).length,
    [filteredFields, inputData],
  )

  useEffect(() => {
    const saved = localStorage.getItem('eroxai-dashboard-view')
    if (!saved) return
    try {
      const parsed = JSON.parse(saved)
      if (parsed?.viewPreset) setViewPreset(parsed.viewPreset)
      if (parsed?.columnWidths) setColumnWidths(parsed.columnWidths)
      if (typeof parsed?.compactRows === 'boolean') setCompactRows(parsed.compactRows)
    } catch (error) {
      // ignore parse errors
    }
  }, [])

  useEffect(() => {
    if (viewPreset === 'compact') {
      setCompactRows(true)
      setColumnWidths({ field: 200, type: 140, value: 240, note: 200 })
    } else if (viewPreset === 'review') {
      setCompactRows(false)
      setColumnWidths({ field: 260, type: 180, value: 360, note: 260 })
    } else {
      setCompactRows(false)
      setColumnWidths({ field: 220, type: 160, value: 280, note: 220 })
    }
  }, [viewPreset])

  useEffect(() => {
    if (!resizing) return
    const handleMove = (event) => {
      const delta = event.clientX - resizing.startX
      const next = Math.max(140, Math.min(520, resizing.startWidth + delta))
      setColumnWidths((prev) => ({ ...prev, [resizing.key]: next }))
      setViewPreset('custom')
      const bounds = tableRef.current?.getBoundingClientRect()
      if (bounds) {
        const nextLine = Math.max(0, Math.min(bounds.width, event.clientX - bounds.left))
        setResizeLineX(nextLine)
      }
    }
    const handleUp = () => {
      setResizing(null)
      setResizeLineX(null)
    }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [resizing])

  useEffect(() => {
    const payload = {
      viewPreset,
      columnWidths,
      compactRows,
    }
    localStorage.setItem('eroxai-dashboard-view', JSON.stringify(payload))
  }, [viewPreset, columnWidths, compactRows])

  const typeLabel = (type) => {
    if (i18n.language === 'tr') {
      if (type === 'text') return 'Metin'
      if (type === 'number') return 'Sayı'
      if (type === 'date') return 'Tarih'
      if (type === 'select') return 'Seçim'
      return 'Diğer'
    }
    if (i18n.language === 'ja') {
      if (type === 'text') return 'テキスト'
      if (type === 'number') return '数値'
      if (type === 'date') return '日付'
      if (type === 'select') return '選択'
      return 'その他'
    }
    if (type === 'text') return 'Text'
    if (type === 'number') return 'Number'
    if (type === 'date') return 'Date'
    if (type === 'select') return 'Select'
    return 'Other'
  }

  const baseRows = useMemo(
    () => [
      ...filteredFields.map((field) => ({ kind: 'template', field })),
      ...customRows.map((row) => ({ kind: 'custom', row })),
    ],
    [filteredFields, customRows],
  )

  const rows = useMemo(() => {
    if (!groupByType) return baseRows
    const buckets = new Map()
    filteredFields.forEach((field) => {
      const key = field.field_type || 'text'
      if (!buckets.has(key)) buckets.set(key, [])
      buckets.get(key).push(field)
    })
    const order = ['text', 'number', 'date', 'select']
    const sortedKeys = [...order.filter((key) => buckets.has(key)), ...[...buckets.keys()].filter((key) => !order.includes(key))]
    const grouped = []
    sortedKeys.forEach((key) => {
      const fields = buckets.get(key) || []
      grouped.push({
        kind: 'group',
        key,
        label: typeLabel(key),
        count: fields.length,
      })
      fields.forEach((field) => grouped.push({ kind: 'template', field }))
    })
    if (customRows.length) {
      grouped.push({
        kind: 'group',
        key: 'custom',
        label: i18n.language === 'tr' ? 'Özel Alanlar' : i18n.language === 'ja' ? 'カスタム項目' : 'Custom Fields',
        count: customRows.length,
        variant: 'custom',
      })
      customRows.forEach((row) => grouped.push({ kind: 'custom', row }))
    }
    return grouped
  }, [baseRows, customRows, filteredFields, groupByType, i18n.language])

  const handleAddRow = () => {
    setCustomRows((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        label: '',
        type: 'text',
      },
    ])
  }

  const handleRemoveRow = (rowId) => {
    setCustomRows((prev) => prev.filter((row) => row.id !== rowId))
  }

  const tableInputSx = useMemo(
    () => ({
      '& .MuiOutlinedInput-root': {
        background: alpha('#fff', 0.05),
        color: 'white',
        '& fieldset': { borderColor: alpha('#667eea', 0.3) },
        '&:hover fieldset': { borderColor: alpha('#667eea', 0.5) },
        '&.Mui-focused fieldset': { borderColor: '#667eea' },
      },
      '& .MuiInputLabel-root': { color: alpha('#fff', 0.7) },
    }),
    [],
  )

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%)' }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mb: 4 }}>
            <TypewriterText
              text={i18n.language === 'tr' ? 'Kullanıcı Paneli' : i18n.language === 'ja' ? 'ユーザーパネル' : 'User Dashboard'}
              variant="h3"
              speed={50}
              sx={{
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" flexWrap="wrap" gap={2}>
              <Chip
                icon={<VerifiedUserIcon />}
                label={user?.username || 'User'}
                sx={{
                  background: alpha('#667eea', 0.2),
                  color: '#667eea',
                  fontWeight: 600,
                }}
              />
              <Chip
                icon={isPremium ? <StarIcon /> : <PendingIcon />}
                label={
                  isPremium
                    ? i18n.language === 'tr'
                      ? 'Premium Üye'
                      : i18n.language === 'ja'
                      ? 'プレミアムメンバー'
                      : 'Premium Member'
                    : i18n.language === 'tr'
                    ? `Ücretsiz: ${usageCount}/${usageLimit}`
                    : i18n.language === 'ja'
                    ? `無料: ${usageCount}/${usageLimit}`
                    : `Free: ${usageCount}/${usageLimit}`
                }
                sx={{
                  background: isPremium
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : alpha('#F59E0B', 0.2),
                  color: isPremium ? 'white' : '#F59E0B',
                  fontWeight: 600,
                }}
              />
              {!isPremium && (
                <Box sx={{ width: { xs: '100%', sm: 200 } }}>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((usageCount / usageLimit) * 100, 100)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      background: alpha('#667eea', 0.1),
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #667eea 0%, #10B981 100%)',
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
              )}
            </Stack>
          </Box>
        </motion.div>

        {showKeyBanner && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Card
              sx={{
                mb: 4,
                background: alpha('#F59E0B', 0.15),
                border: `1px solid ${alpha('#F59E0B', 0.3)}`,
                backdropFilter: 'blur(20px)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <CardContent>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
                  <Stack spacing={0.5}>
                    <Typography variant="h6" sx={{ color: '#F59E0B', fontWeight: 700 }}>
                      Premium Key eksik
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
                      Premium özellikleri açmak için key girmeniz gerekiyor. İsterseniz şimdi aktif edebilirsiniz.
                    </Typography>
                    <LinearProgress
                      variant="indeterminate"
                      sx={{
                        mt: 1.5,
                        height: 6,
                        borderRadius: 999,
                        background: alpha('#F59E0B', 0.15),
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #F59E0B 0%, #667eea 100%)',
                        },
                      }}
                    />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                    <Button
                      variant="contained"
                      onClick={handleOpenPremiumTab}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        fontWeight: 700,
                      }}
                    >
                      Key Gir
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleDismissKeyBanner}
                      sx={{
                        borderColor: alpha('#fff', 0.4),
                        color: 'white',
                        '&:hover': { borderColor: '#fff', background: alpha('#fff', 0.1) },
                      }}
                    >
                      Daha Sonra
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Card
                sx={{
                  p: 1.5,
                  borderRadius: 3,
                  background: alpha('#fff', 0.03),
                  border: `1px solid ${alpha('#667eea', 0.2)}`,
                  backdropFilter: 'blur(20px)',
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" justifyContent="flex-end">
                  {tabItems
                    .filter((item) => item.key !== 'premium')
                    .map((item, index) => (
                      <Button
                        key={item.key}
                        onClick={() => setActiveTab(index)}
                        startIcon={item.icon}
                        sx={{
                          color: activeKey === item.key ? 'white' : alpha('#fff', 0.7),
                          background: activeKey === item.key ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                          borderRadius: 3,
                          py: 0.9,
                          fontWeight: 600,
                          minHeight: 40,
                          '&:hover': {
                            background: activeKey === item.key ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)' : alpha('#667eea', 0.12),
                          },
                        }}
                      >
                        {item.label}
                      </Button>
                    ))}
                  {tabItems.some((item) => item.key === 'premium') && (
                    <Button
                      onClick={() => setActiveTab(tabItems.findIndex((item) => item.key === 'premium'))}
                      startIcon={<VpnKeyIcon />}
                      sx={{
                        color: activeKey === 'premium' ? 'white' : alpha('#fff', 0.7),
                        background: activeKey === 'premium' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                        borderRadius: 3,
                        py: 0.9,
                        fontWeight: 600,
                        minHeight: 40,
                        '&:hover': {
                          background: activeKey === 'premium' ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)' : alpha('#667eea', 0.12),
                        },
                      }}
                    >
                      {i18n.language === 'tr' ? 'Premium Key' : i18n.language === 'ja' ? 'プレミアムキー' : 'Premium Key'}
                    </Button>
                  )}
                </Stack>
              </Card>
            </Box>
          </Grid>
          <Grid item xs={12} md={12}>
            {activeKey === 'templates' && (
              <FloatingCard delay={0}>
                <Card
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: alpha('#fff', 0.03),
                    border: `1px solid ${alpha('#667eea', 0.2)}`,
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <CardContent>
                    <Stack spacing={4}>
                      <Box>
                        <DescriptionIcon sx={{ fontSize: 40, color: '#667eea', mb: 2 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                          {i18n.language === 'tr' ? 'Şablonlar' : i18n.language === 'ja' ? 'テンプレート' : 'Templates'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                          {i18n.language === 'tr'
                            ? 'Mevcut şablonları seçin ve doldurun. Çıktı Japonca olarak hazırlanacaktır.'
                            : i18n.language === 'ja'
                            ? '利用可能なテンプレートを選択して入力してください。出力は日本語で準備されます。'
                            : 'Select and fill available templates. Output will be prepared in Japanese.'}
                        </Typography>
                      </Box>
                      <Divider sx={{ borderColor: alpha('#667eea', 0.2) }} />
                      {templates.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                          <Typography variant="h6" sx={{ color: alpha('#fff', 0.5) }}>
                            {i18n.language === 'tr' ? 'Henüz şablon yok' : i18n.language === 'ja' ? 'テンプレートがまだありません' : 'No templates yet'}
                          </Typography>
                        </Box>
                      ) : (
                        <Grid container spacing={3}>
                          {templates.map((template) => (
                            <Grid item xs={12} md={6} key={template.id}>
                              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                                <Card
                                  variant="outlined"
                                  sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    background: alpha('#fff', 0.05),
                                    border: `1px solid ${alpha('#667eea', 0.2)}`,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      borderColor: '#667eea',
                                      background: alpha('#667eea', 0.1),
                                    },
                                  }}
                                  onClick={() => handleSelect(template)}
                                >
                                  <Stack spacing={2}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
                                      {template.name || template.name_tr || template.name_en || 'Şablon'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                                      {template.description ||
                                        template.description_tr ||
                                        template.description_en ||
                                        (i18n.language === 'tr' ? 'Şablon' : i18n.language === 'ja' ? 'テンプレート' : 'Template')}
                                    </Typography>
                                    <Chip
                                      label={template.template_type.toUpperCase()}
                                      size="small"
                                      sx={{
                                        alignSelf: 'flex-start',
                                        background: alpha('#667eea', 0.2),
                                        color: '#667eea',
                                      }}
                                    />
                                  </Stack>
                                </Card>
                              </motion.div>
                            </Grid>
                          ))}
                        </Grid>
                      )}
                      {selectedTemplate && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <Card
                            variant="outlined"
                            sx={{
                              p: 4,
                              borderRadius: 3,
                              background: alpha('#667eea', 0.1),
                              border: `2px solid #667eea`,
                            }}
                          >
                            <Stack spacing={3}>
                              <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                                  {selectedTemplate.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                                  {i18n.language === 'tr'
                                    ? 'Alanları doldurun ve Japonca çıktı alın'
                                    : i18n.language === 'ja'
                                    ? 'フィールドを入力して日本語の出力を取得'
                                    : 'Fill the fields and get Japanese output'}
                                </Typography>
                              </Box>
                              <Divider sx={{ borderColor: alpha('#667eea', 0.3) }} />
                              <Stack spacing={2}>
                                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                                  <TextField
                                    label={i18n.language === 'tr' ? 'Alan ara' : i18n.language === 'ja' ? '検索' : 'Search fields'}
                                    value={fieldSearch}
                                    onChange={(event) => setFieldSearch(event.target.value)}
                                    sx={{ ...tableInputSx, flex: 1 }}
                                  />
                                  <Button
                                    variant="outlined"
                                    onClick={handleAddRow}
                                    sx={{
                                      borderColor: alpha('#667eea', 0.5),
                                      color: 'white',
                                      '&:hover': { borderColor: '#667eea', background: alpha('#667eea', 0.1) },
                                    }}
                                  >
                                    {i18n.language === 'tr' ? 'Satır Ekle' : i18n.language === 'ja' ? '行を追加' : 'Add Row'}
                                  </Button>
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.6) }}>
                                      {i18n.language === 'tr' ? 'Sadece zorunlu' : i18n.language === 'ja' ? '必須のみ' : 'Required only'}
                                    </Typography>
                                    <Switch
                                      checked={showRequiredOnly}
                                      onChange={(event) => setShowRequiredOnly(event.target.checked)}
                                    />
                                  </Stack>
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.6) }}>
                                      {i18n.language === 'tr' ? 'Sıkı görünüm' : i18n.language === 'ja' ? '圧縮表示' : 'Compact'}
                                    </Typography>
                                  <Switch
                                    checked={compactRows}
                                    onChange={(event) => {
                                      setCompactRows(event.target.checked)
                                      setViewPreset('custom')
                                    }}
                                  />
                                  </Stack>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Typography variant="body2" sx={{ color: alpha('#fff', 0.6) }}>
                                    {i18n.language === 'tr' ? 'Türlere göre' : i18n.language === 'ja' ? 'タイプ別' : 'Group by type'}
                                  </Typography>
                                  <Switch checked={groupByType} onChange={(event) => setGroupByType(event.target.checked)} />
                                </Stack>
                                  <Chip
                                  label={`${baseRows.length} ${i18n.language === 'tr' ? 'alan' : i18n.language === 'ja' ? '項目' : 'fields'}`}
                                    sx={{ background: alpha('#667eea', 0.2), color: 'white' }}
                                  />
                                {missingRequiredCount > 0 && (
                                  <Chip
                                    label={`${missingRequiredCount} ${i18n.language === 'tr' ? 'eksik' : i18n.language === 'ja' ? '未入力' : 'missing'}`}
                                    sx={{ background: alpha('#EF4444', 0.2), color: '#EF4444' }}
                                  />
                                )}
                                </Stack>
                                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <ViewWeekIcon sx={{ color: alpha('#fff', 0.6) }} />
                                    <Chip
                                      label="Default"
                                      onClick={() => setViewPreset('default')}
                                      sx={{
                                        background: viewPreset === 'default' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : alpha('#fff', 0.08),
                                        color: 'white',
                                        cursor: 'pointer',
                                      }}
                                    />
                                    <Chip
                                      label="Compact"
                                      onClick={() => setViewPreset('compact')}
                                      sx={{
                                        background: viewPreset === 'compact' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : alpha('#fff', 0.08),
                                        color: 'white',
                                        cursor: 'pointer',
                                      }}
                                    />
                                    <Chip
                                      label="Review"
                                      onClick={() => setViewPreset('review')}
                                      sx={{
                                        background: viewPreset === 'review' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : alpha('#fff', 0.08),
                                        color: 'white',
                                        cursor: 'pointer',
                                      }}
                                    />
                                  {viewPreset === 'custom' && (
                                    <Chip label="Custom" sx={{ background: alpha('#fff', 0.12), color: 'white' }} />
                                  )}
                                  </Stack>
                                </Stack>
                                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                                  <Stack spacing={0.5} sx={{ minWidth: 180 }}>
                                    <Typography variant="caption" sx={{ color: alpha('#fff', 0.6) }}>
                                      {i18n.language === 'tr' ? 'Değer sütunu' : i18n.language === 'ja' ? '値列' : 'Value column'}
                                    </Typography>
                                    <Slider
                                      value={columnWidths.value}
                                      min={200}
                                      max={420}
                                    onChange={(_e, value) => {
                                      setColumnWidths((prev) => ({ ...prev, value: value }))
                                      setViewPreset('custom')
                                    }}
                                    />
                                  </Stack>
                                  <Stack spacing={0.5} sx={{ minWidth: 180 }}>
                                    <Typography variant="caption" sx={{ color: alpha('#fff', 0.6) }}>
                                      {i18n.language === 'tr' ? 'Not sütunu' : i18n.language === 'ja' ? '備考列' : 'Note column'}
                                    </Typography>
                                    <Slider
                                      value={columnWidths.note}
                                      min={180}
                                      max={360}
                                    onChange={(_e, value) => {
                                      setColumnWidths((prev) => ({ ...prev, note: value }))
                                      setViewPreset('custom')
                                    }}
                                    />
                                  </Stack>
                                </Stack>
                                <Box
                                  ref={tableRef}
                                  sx={{
                                    borderRadius: 2,
                                    border: `1px solid ${alpha('#667eea', 0.2)}`,
                                    overflow: 'hidden',
                                    backgroundColor: alpha('#0f172a', 0.5),
                                    backgroundImage:
                                      'linear-gradient(to right, rgba(102,126,234,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(102,126,234,0.08) 1px, transparent 1px)',
                                    backgroundSize: '120px 40px',
                                    maxHeight: 520,
                                    overflowY: 'auto',
                                    overflowX: 'hidden',
                                    position: 'relative',
                                  }}
                                >
                                  {resizeLineX !== null && (
                                    <Box
                                      sx={{
                                        position: 'absolute',
                                        top: 0,
                                        bottom: 0,
                                        left: resizeLineX,
                                        width: 2,
                                        background: 'linear-gradient(180deg, #667eea 0%, #22d3ee 100%)',
                                        opacity: 0.9,
                                        zIndex: 5,
                                        pointerEvents: 'none',
                                      }}
                                    />
                                  )}
                                  <Box
                                    sx={{
                                      display: 'grid',
                                      gridTemplateColumns: {
                                        xs: '1fr',
                                        md: `60px ${columnWidths.field}px ${columnWidths.type}px ${columnWidths.value}px ${columnWidths.note}px`,
                                      },
                                      gap: 1,
                                      px: 2,
                                      py: 1,
                                      background: alpha('#0b1220', 0.9),
                                      borderBottom: `1px solid ${alpha('#667eea', 0.25)}`,
                                      position: 'sticky',
                                      top: 0,
                                      zIndex: 2,
                                    }}
                                  >
                                    <Typography variant="caption" sx={{ color: alpha('#fff', 0.5), fontWeight: 700 }}>
                                      {' '}
                                    </Typography>
                                    {columnLetters.map((letter) => (
                                      <Typography key={letter} variant="caption" sx={{ color: alpha('#fff', 0.6), fontWeight: 700 }}>
                                        {letter}
                                      </Typography>
                                    ))}
                                  </Box>
                                  <Box
                                    sx={{
                                      display: 'grid',
                                      gridTemplateColumns: {
                                        xs: '1fr',
                                        md: `60px ${columnWidths.field}px ${columnWidths.type}px ${columnWidths.value}px ${columnWidths.note}px`,
                                      },
                                      gap: 1,
                                      px: 2,
                                      py: 1.5,
                                      background: alpha('#667eea', 0.2),
                                      borderBottom: `1px solid ${alpha('#667eea', 0.2)}`,
                                      position: 'sticky',
                                      top: 28,
                                      zIndex: 1,
                                    }}
                                  >
                                    <Typography variant="caption" sx={{ color: alpha('#fff', 0.8), fontWeight: 700 }}>
                                      #
                                    </Typography>
                                    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                      <Typography variant="caption" sx={{ color: alpha('#fff', 0.8), fontWeight: 700 }}>
                                        {i18n.language === 'tr' ? 'Alan' : i18n.language === 'ja' ? '項目' : 'Field'}
                                      </Typography>
                                      <Box
                                        onMouseDown={(event) => {
                                          const bounds = tableRef.current?.getBoundingClientRect()
                                          if (bounds) setResizeLineX(event.clientX - bounds.left)
                                          setResizing({ key: 'field', startX: event.clientX, startWidth: columnWidths.field })
                                        }}
                                        sx={{
                                          position: 'absolute',
                                          right: -4,
                                          top: 0,
                                          height: '100%',
                                          width: 8,
                                          cursor: 'col-resize',
                                        }}
                                      />
                                    </Box>
                                    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                      <Typography variant="caption" sx={{ color: alpha('#fff', 0.8), fontWeight: 700 }}>
                                        {i18n.language === 'tr' ? 'Tür' : i18n.language === 'ja' ? 'タイプ' : 'Type'}
                                      </Typography>
                                      <Box
                                        onMouseDown={(event) => {
                                          const bounds = tableRef.current?.getBoundingClientRect()
                                          if (bounds) setResizeLineX(event.clientX - bounds.left)
                                          setResizing({ key: 'type', startX: event.clientX, startWidth: columnWidths.type })
                                        }}
                                        sx={{
                                          position: 'absolute',
                                          right: -4,
                                          top: 0,
                                          height: '100%',
                                          width: 8,
                                          cursor: 'col-resize',
                                        }}
                                      />
                                    </Box>
                                    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                      <Typography variant="caption" sx={{ color: alpha('#fff', 0.8), fontWeight: 700 }}>
                                        {i18n.language === 'tr' ? 'Değer' : i18n.language === 'ja' ? '入力' : 'Value'}
                                      </Typography>
                                      <Box
                                        onMouseDown={(event) => {
                                          const bounds = tableRef.current?.getBoundingClientRect()
                                          if (bounds) setResizeLineX(event.clientX - bounds.left)
                                          setResizing({ key: 'value', startX: event.clientX, startWidth: columnWidths.value })
                                        }}
                                        sx={{
                                          position: 'absolute',
                                          right: -4,
                                          top: 0,
                                          height: '100%',
                                          width: 8,
                                          cursor: 'col-resize',
                                        }}
                                      />
                                    </Box>
                                    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                      <Typography variant="caption" sx={{ color: alpha('#fff', 0.8), fontWeight: 700 }}>
                                        {i18n.language === 'tr' ? 'Not' : i18n.language === 'ja' ? '備考' : 'Note'}
                                      </Typography>
                                      <Box
                                        onMouseDown={(event) => {
                                          const bounds = tableRef.current?.getBoundingClientRect()
                                          if (bounds) setResizeLineX(event.clientX - bounds.left)
                                          setResizing({ key: 'note', startX: event.clientX, startWidth: columnWidths.note })
                                        }}
                                        sx={{
                                          position: 'absolute',
                                          right: -4,
                                          top: 0,
                                          height: '100%',
                                          width: 8,
                                          cursor: 'col-resize',
                                        }}
                                      />
                                    </Box>
                                  </Box>
                                  {rows.map((rowItem, index) => {
                                    if (rowItem.kind === 'group') {
                                      return (
                                        <Box
                                          key={`group-${rowItem.key}`}
                                          sx={{
                                            display: 'grid',
                                            gridTemplateColumns: {
                                              xs: '1fr',
                                              md: `60px ${columnWidths.field}px ${columnWidths.type}px ${columnWidths.value}px ${columnWidths.note}px`,
                                            },
                                            px: 2,
                                            py: compactRows ? 0.8 : 1.1,
                                            borderBottom: `1px solid ${alpha('#667eea', 0.15)}`,
                                            background: rowItem.variant === 'custom' ? alpha('#1f2937', 0.7) : alpha('#111827', 0.7),
                                          }}
                                        >
                                          <Typography
                                            variant="caption"
                                            sx={{
                                              gridColumn: '1 / -1',
                                              color: alpha('#fff', 0.8),
                                              fontWeight: 700,
                                              letterSpacing: 0.3,
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: 1,
                                            }}
                                          >
                                            {rowItem.label}
                                            <Box component="span" sx={{ color: alpha('#fff', 0.5) }}>
                                              · {rowItem.count}
                                            </Box>
                                          </Typography>
                                        </Box>
                                      )
                                    }
                                    return (
                                      <Box
                                        key={rowItem.kind === 'template' ? rowItem.field.id : rowItem.row.id}
                                        sx={{
                                          display: 'grid',
                                          gridTemplateColumns: {
                                            xs: '1fr',
                                            md: `60px ${columnWidths.field}px ${columnWidths.type}px ${columnWidths.value}px ${columnWidths.note}px`,
                                          },
                                          gap: 1,
                                          px: 2,
                                          py: compactRows ? 0.8 : 1.5,
                                          borderBottom: `1px solid ${alpha('#667eea', 0.15)}`,
                                          background: index % 2 === 0 ? alpha('#0f172a', 0.45) : alpha('#111827', 0.45),
                                          outline:
                                            rowItem.kind === 'template' && isEmptyRequired(rowItem.field)
                                              ? `1px solid ${alpha('#EF4444', 0.6)}`
                                              : 'none',
                                        }}
                                      >
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            color: alpha('#fff', 0.6),
                                            position: 'sticky',
                                            left: 0,
                                            background: alpha('#0f172a', 0.9),
                                            paddingRight: 1,
                                          }}
                                        >
                                          {index + 1}
                                        </Typography>
                                        {rowItem.kind === 'template' ? (
                                          <>
                                            <Stack spacing={0.5}>
                                              <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                                                  {getFieldLabel(rowItem.field)}
                                                </Typography>
                                                {rowItem.field.required && (
                                                  <Chip
                                                    size="small"
                                                    label={i18n.language === 'tr' ? 'Zorunlu' : i18n.language === 'ja' ? '必須' : 'Required'}
                                                    sx={{ background: alpha('#F59E0B', 0.2), color: '#F59E0B' }}
                                                  />
                                                )}
                                              </Stack>
                                              {getFieldDescription(rowItem.field) && (
                                                <Typography variant="caption" sx={{ color: alpha('#fff', 0.5) }}>
                                                  {getFieldDescription(rowItem.field)}
                                                </Typography>
                                              )}
                                            </Stack>
                                            <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                                              {rowItem.field.field_type}
                                            </Typography>
                                            <TextField
                                              fullWidth
                                              label={getFieldLabel(rowItem.field)}
                                              value={inputData[rowItem.field.key] || ''}
                                              onChange={(event) =>
                                                setInputData((prev) => ({
                                                  ...prev,
                                                  [rowItem.field.key]: event.target.value,
                                                }))
                                              }
                                              sx={{
                                                ...tableInputSx,
                                                '& .MuiOutlinedInput-root': {
                                                  ...tableInputSx['& .MuiOutlinedInput-root'],
                                                  '& fieldset': {
                                                    borderColor: isEmptyRequired(rowItem.field)
                                                      ? alpha('#EF4444', 0.8)
                                                      : tableInputSx['& .MuiOutlinedInput-root']['& fieldset'].borderColor,
                                                  },
                                                },
                                              }}
                                            />
                                            <TextField
                                              fullWidth
                                              label={i18n.language === 'tr' ? 'Not' : i18n.language === 'ja' ? '備考' : 'Note'}
                                              value={inputData[`note_${rowItem.field.key}`] || ''}
                                              onChange={(event) =>
                                                setInputData((prev) => ({
                                                  ...prev,
                                                  [`note_${rowItem.field.key}`]: event.target.value,
                                                }))
                                              }
                                              sx={tableInputSx}
                                            />
                                          </>
                                        ) : (
                                          <>
                                            <TextField
                                              fullWidth
                                              label={i18n.language === 'tr' ? 'Özel Alan' : i18n.language === 'ja' ? 'カスタム項目' : 'Custom field'}
                                              value={rowItem.row.label}
                                              onChange={(event) =>
                                                setCustomRows((prev) =>
                                                  prev.map((row) =>
                                                    row.id === rowItem.row.id ? { ...row, label: event.target.value } : row,
                                                  ),
                                                )
                                              }
                                              sx={tableInputSx}
                                            />
                                            <TextField
                                              fullWidth
                                              label={i18n.language === 'tr' ? 'Tür' : i18n.language === 'ja' ? 'タイプ' : 'Type'}
                                              value={rowItem.row.type}
                                              onChange={(event) =>
                                                setCustomRows((prev) =>
                                                  prev.map((row) =>
                                                    row.id === rowItem.row.id ? { ...row, type: event.target.value } : row,
                                                  ),
                                                )
                                              }
                                              sx={tableInputSx}
                                            />
                                            <TextField
                                              fullWidth
                                              label={rowItem.row.label || (i18n.language === 'tr' ? 'Değer' : i18n.language === 'ja' ? '入力' : 'Value')}
                                              value={inputData[rowItem.row.id] || ''}
                                              onChange={(event) =>
                                                setInputData((prev) => ({
                                                  ...prev,
                                                  [rowItem.row.id]: event.target.value,
                                                }))
                                              }
                                              sx={tableInputSx}
                                            />
                                            <Stack direction="row" spacing={1} alignItems="center">
                                              <TextField
                                                fullWidth
                                                label={i18n.language === 'tr' ? 'Not' : i18n.language === 'ja' ? '備考' : 'Note'}
                                                value={inputData[`note_${rowItem.row.id}`] || ''}
                                                onChange={(event) =>
                                                  setInputData((prev) => ({
                                                    ...prev,
                                                    [`note_${rowItem.row.id}`]: event.target.value,
                                                  }))
                                                }
                                                sx={tableInputSx}
                                              />
                                              <Tooltip title={i18n.language === 'tr' ? 'Satır sil' : i18n.language === 'ja' ? '行を削除' : 'Remove'}>
                                                <IconButton
                                                  onClick={() => handleRemoveRow(rowItem.row.id)}
                                                  sx={{
                                                    color: alpha('#EF4444', 0.8),
                                                    border: `1px solid ${alpha('#EF4444', 0.4)}`,
                                                    borderRadius: 2,
                                                    height: 40,
                                                  }}
                                                >
                                                  <DeleteOutlineIcon />
                                                </IconButton>
                                              </Tooltip>
                                            </Stack>
                                          </>
                                        )}
                                      </Box>
                                    )
                                  })}
                                </Box>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ pt: 1 }}>
                                  <Chip
                                    label="Sheet 1"
                                    onClick={() => setActiveSheet('sheet-1')}
                                    sx={{
                                      background: activeSheet === 'sheet-1' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : alpha('#fff', 0.08),
                                      color: 'white',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                    }}
                                  />
                                  <Chip
                                    label="Sheet 2"
                                    onClick={() => setActiveSheet('sheet-2')}
                                    sx={{
                                      background: activeSheet === 'sheet-2' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : alpha('#fff', 0.08),
                                      color: 'white',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                    }}
                                  />
                                  <Chip label={selectedTemplate.name} sx={{ background: alpha('#fff', 0.08), color: 'white' }} />
                                  <Chip label="Output" sx={{ background: alpha('#10B981', 0.2), color: '#10B981' }} />
                                </Stack>
                                {activeSheet === 'sheet-2' && (
                                  <Card
                                    sx={{
                                      p: 3,
                                      borderRadius: 3,
                                      background: alpha('#0f172a', 0.6),
                                      border: `1px solid ${alpha('#667eea', 0.2)}`,
                                    }}
                                  >
                                    <Stack spacing={2}>
                                      <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700 }}>
                                        {i18n.language === 'tr' ? 'Özet & Önizleme' : i18n.language === 'ja' ? '概要とプレビュー' : 'Summary & Preview'}
                                      </Typography>
                                      <Stack direction="row" spacing={2} alignItems="center">
                                        <Chip
                                          label={`${filteredFields.length} ${i18n.language === 'tr' ? 'alan' : i18n.language === 'ja' ? '項目' : 'fields'}`}
                                          sx={{ background: alpha('#667eea', 0.2), color: 'white' }}
                                        />
                                        <Chip
                                          label={`${Object.keys(inputData).length} ${i18n.language === 'tr' ? 'girdi' : i18n.language === 'ja' ? '入力' : 'inputs'}`}
                                          sx={{ background: alpha('#10B981', 0.2), color: '#10B981' }}
                                        />
                                      </Stack>
                                      <TextField
                                        multiline
                                        minRows={6}
                                        value={JSON.stringify(inputData, null, 2)}
                                        InputProps={{ readOnly: true }}
                                        sx={tableInputSx}
                                      />
                                    </Stack>
                                  </Card>
                                )}
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                  <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleFill}
                                    sx={{
                                      py: 1.5,
                                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                      fontWeight: 700,
                                      fontSize: '1rem',
                                    }}
                                  >
                                    {i18n.language === 'tr' ? 'Doldur ve İndir' : i18n.language === 'ja' ? '入力してダウンロード' : 'Fill and Download'}
                                  </Button>
                                </motion.div>
                              </Stack>
                            </Stack>
                          </Card>
                        </motion.div>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </FloatingCard>
            )}
            {activeKey === 'ocr' && (
              <FloatingCard delay={0}>
                <DocumentTranslatePanel />
              </FloatingCard>
            )}
            {activeKey === 'blank' && (
              <FloatingCard delay={0}>
                <BlankPagePanel />
              </FloatingCard>
            )}
            {activeKey === 'area' && (
              <FloatingCard delay={0}>
                <AreaCalculatorPanel />
              </FloatingCard>
            )}
            {activeKey === 'premium' && (
              <FloatingCard delay={0}>
                <PremiumKeyPanel />
              </FloatingCard>
            )}
          </Grid>
        </Grid>

      </Container>
      <Footer />
    </Box>
  )
}

export default Dashboard
