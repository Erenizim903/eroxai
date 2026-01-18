import { useEffect, useRef, useState } from 'react'
import {
  Avatar,
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
  TextField,
  Typography,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import KeyIcon from '@mui/icons-material/Key'
import DescriptionIcon from '@mui/icons-material/Description'
import ListAltIcon from '@mui/icons-material/ListAlt'
import SettingsIcon from '@mui/icons-material/Settings'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import BarChartIcon from '@mui/icons-material/BarChart'
import TimelineIcon from '@mui/icons-material/Timeline'
import CategoryIcon from '@mui/icons-material/Category'
import SearchIcon from '@mui/icons-material/Search'
import RequestQuoteIcon from '@mui/icons-material/RequestQuote'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import StarIcon from '@mui/icons-material/Star'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Chip from '@mui/material/Chip'
import Badge from '@mui/material/Badge'
import InputBase from '@mui/material/InputBase'
import Paper from '@mui/material/Paper'
import Collapse from '@mui/material/Collapse'
import { useSnackbar } from 'notistack'
import { motion } from 'framer-motion'
import { alpha } from '@mui/material/styles'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import AnimatedText from '../components/common/AnimatedText'
import TypewriterText from '../components/common/TypewriterText'
import AnimatedCounter from '../components/common/AnimatedCounter'
import ChatBot from '../components/common/ChatBot'
import {
  addTemplateField,
  createAdminUser,
  createPremiumKey,
  deleteAdminUser,
  deleteTemplateField,
  fetchAdminLogs,
  fetchAdminActivityLogs,
  fetchAdminUsers,
  fetchPremiumKeys,
  updateSiteSettings,
  updateTemplateField,
  fetchAdminAnalytics,
} from '../services/adminService'
import {
  getAdminPremiumRequests,
  approvePremiumRequest,
  rejectPremiumRequest,
} from '../services/premiumRequestService'
import { createTemplate, listTemplates } from '../services/templateService'
import { fetchSiteSettings } from '../services/siteService'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min?url'

GlobalWorkerOptions.workerSrc = workerSrc

const AdminDashboard = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [tab, setTab] = useState('overview')
  const [users, setUsers] = useState([])
  const [logs, setLogs] = useState([])
  const [activityLogs, setActivityLogs] = useState([])
  const [keys, setKeys] = useState([])
  const [templates, setTemplates] = useState([])
  const [premiumRequests, setPremiumRequests] = useState([])
  const [requestStatusFilter, setRequestStatusFilter] = useState(null)
  const [approveDialog, setApproveDialog] = useState({ open: false, request: null })
  const [rejectDialog, setRejectDialog] = useState({ open: false, request: null })
  const [approveForm, setApproveForm] = useState({ key_code: '', max_uses: 1, admin_note: '' })
  const [rejectForm, setRejectForm] = useState({ admin_note: '' })
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
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
    copyright_text: '',
    social_facebook: '',
    social_instagram: '',
    social_twitter: '',
    social_linkedin: '',
    social_youtube: '',
    social_github: '',
    social_telegram: '',
    google_ai_endpoint: 'https://vision.googleapis.com/v1/images:annotate',
    openai_endpoint: 'https://api.openai.com/v1/chat/completions',
    deepseek_endpoint: 'https://api.deepseek.com/v1/chat/completions',
    blackbox_endpoint: 'https://www.blackbox.ai/api/chat',
    chat_provider: 'openai',
    theme_primary_color: '#667eea',
    theme_secondary_color: '#764ba2',
    theme_preset: 'ocean',
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
  const [analytics, setAnalytics] = useState(null)
  const [menuSearch, setMenuSearch] = useState('')
  const [expandedCategories, setExpandedCategories] = useState({ dashboard: true, management: true, settings: true })
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const stats = [
    { label: 'Kullanıcılar', value: users.length, icon: <PeopleIcon color="primary" /> },
    { label: 'Şablonlar', value: templates.length, icon: <DescriptionIcon color="primary" /> },
    { label: 'Premium Key', value: keys.length, icon: <KeyIcon color="primary" /> },
    { label: 'Loglar', value: logs.length, icon: <ListAltIcon color="primary" /> },
  ]

  const menuCategories = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardIcon />,
      items: [
        { key: 'overview', label: 'Genel Bakış', icon: <DashboardIcon />, badge: null },
        { key: 'analytics', label: 'Analytics', icon: <AnalyticsIcon />, badge: null },
      ],
    },
    {
      id: 'management',
      label: 'Yönetim',
      icon: <CategoryIcon />,
      items: [
        { key: 'users', label: 'Kullanıcılar', icon: <PeopleIcon />, badge: users.length },
        { key: 'templates', label: 'Şablonlar', icon: <DescriptionIcon />, badge: templates.length },
        { key: 'keys', label: 'Premium Key', icon: <KeyIcon />, badge: keys.length },
        { key: 'requests', label: 'Key Başvuruları', icon: <RequestQuoteIcon />, badge: premiumRequests.filter(r => r.status === 'pending').length },
        { key: 'logs', label: 'Loglar', icon: <ListAltIcon />, badge: logs.length },
      ],
    },
    {
      id: 'settings',
      label: 'Ayarlar',
      icon: <SettingsIcon />,
      items: [
        { key: 'settings', label: 'Site Ayarları', icon: <SettingsIcon />, badge: null },
      ],
    },
  ]

  const allMenuItems = menuCategories.flatMap((cat) => cat.items)
  const filteredMenuItems = menuCategories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) => item.label.toLowerCase().includes(menuSearch.toLowerCase()) || item.key.includes(menuSearch.toLowerCase())
      ),
    }))
    .filter((cat) => cat.items.length > 0)

  const loadAll = async () => {
    const [userData, logData, activityLogData, keyData, templateData, siteData, analyticsData, requestsData] = await Promise.all([
      fetchAdminUsers(),
      fetchAdminLogs(),
      fetchAdminActivityLogs().catch(() => []),
      fetchPremiumKeys(),
      listTemplates(),
      fetchSiteSettings(),
      fetchAdminAnalytics().catch(() => null),
      getAdminPremiumRequests().catch(() => []),
    ])
    setUsers(userData)
    setLogs(logData)
    setActivityLogs(activityLogData)
    setKeys(keyData)
    setTemplates(templateData)
    setSiteSettings((prev) => ({ ...prev, ...siteData }))
    setAnalytics(analyticsData)
    setPremiumRequests(requestsData)
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
        first_name: '',
        last_name: '',
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

  const handleApproveRequest = async () => {
    if (!approveDialog.request) return
    try {
      await approvePremiumRequest(
        approveDialog.request.id,
        approveForm.key_code || undefined,
        approveForm.max_uses,
        approveForm.admin_note
      )
      enqueueSnackbar('Başvuru onaylandı ve premium key oluşturuldu', { variant: 'success' })
      setApproveDialog({ open: false, request: null })
      setApproveForm({ key_code: '', max_uses: 1, admin_note: '' })
      loadAll()
    } catch (error) {
      enqueueSnackbar('Onaylama hatası', { variant: 'error' })
    }
  }

  const handleRejectRequest = async () => {
    if (!rejectDialog.request) return
    try {
      await rejectPremiumRequest(rejectDialog.request.id, rejectForm.admin_note)
      enqueueSnackbar('Başvuru reddedildi', { variant: 'success' })
      setRejectDialog({ open: false, request: null })
      setRejectForm({ admin_note: '' })
      loadAll()
    } catch (error) {
      enqueueSnackbar('Reddetme hatası', { variant: 'error' })
    }
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
    payload.append('copyright_text', siteSettings.copyright_text || '')
    payload.append('social_facebook', siteSettings.social_facebook || '')
    payload.append('social_instagram', siteSettings.social_instagram || '')
    payload.append('social_twitter', siteSettings.social_twitter || '')
    payload.append('social_linkedin', siteSettings.social_linkedin || '')
    payload.append('social_youtube', siteSettings.social_youtube || '')
    payload.append('social_github', siteSettings.social_github || '')
    payload.append('social_telegram', siteSettings.social_telegram || '')
    payload.append('google_ai_endpoint', siteSettings.google_ai_endpoint || '')
    payload.append('openai_endpoint', siteSettings.openai_endpoint || '')
    payload.append('deepseek_endpoint', siteSettings.deepseek_endpoint || '')
    payload.append('blackbox_endpoint', siteSettings.blackbox_endpoint || '')
    payload.append('chat_provider', siteSettings.chat_provider || 'openai')
    payload.append('theme_primary_color', siteSettings.theme_primary_color || '#667eea')
    payload.append('theme_secondary_color', siteSettings.theme_secondary_color || '#764ba2')
    payload.append('theme_preset', siteSettings.theme_preset || 'ocean')
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
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid item xs={12} md={sidebarCollapsed ? 1 : 3}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card sx={{ position: { xs: 'static', md: 'sticky' }, top: 20, background: alpha('#667eea', 0.05), border: `1px solid ${alpha('#667eea', 0.2)}` }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                      {!sidebarCollapsed && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>AD</Avatar>
                            <Box>
                              <Typography fontWeight={700} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                {siteSettings.site_name || 'EroxAI'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Admin Panel
                              </Typography>
                            </Box>
                          </Stack>
                        </motion.div>
                      )}
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          size="small"
                          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                          sx={{
                            minWidth: 0,
                            px: 1,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                            },
                          }}
                        >
                          {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </Button>
                      </motion.div>
                    </Stack>
                    {!sidebarCollapsed && (
                      <>
                        <Divider />
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Paper
                            component="form"
                            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', mb: 1 }}
                            elevation={0}
                          >
                            <InputBase
                              sx={{ ml: 1, flex: 1 }}
                              placeholder="Menü ara..."
                              value={menuSearch}
                              onChange={(e) => setMenuSearch(e.target.value)}
                              startAdornment={<SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />}
                            />
                          </Paper>
                        </motion.div>
                        <Stack spacing={1}>
                          {filteredMenuItems.map((category, catIdx) => (
                            <motion.div
                              key={category.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + catIdx * 0.1 }}
                            >
                              <Box>
                                <motion.div
                                  whileHover={{ x: 4 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <Button
                                    fullWidth
                                    startIcon={category.icon}
                                    endIcon={expandedCategories[category.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    onClick={() =>
                                      setExpandedCategories((prev) => ({
                                        ...prev,
                                        [category.id]: !prev[category.id],
                                      }))
                                    }
                                    sx={{
                                      justifyContent: 'flex-start',
                                      textTransform: 'none',
                                      color: 'text.secondary',
                                      fontWeight: 600,
                                      borderRadius: 2,
                                      transition: 'all 0.3s ease',
                                      '&:hover': {
                                        background: alpha('#667eea', 0.1),
                                        color: '#667eea',
                                      },
                                    }}
                                  >
                                    {category.label}
                                  </Button>
                                </motion.div>
                                <Collapse in={expandedCategories[category.id]} timeout={300}>
                                  <Stack spacing={0.5} sx={{ pl: 2, mt: 0.5 }}>
                                    {category.items.map((item, itemIdx) => (
                                      <motion.div
                                        key={item.key}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: itemIdx * 0.05 }}
                                      >
                                        <motion.div
                                          whileHover={{ x: 4, scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                        >
                                          <Button
                                            startIcon={item.icon}
                                            variant={tab === item.key ? 'contained' : 'text'}
                                            onClick={() => setTab(item.key)}
                                            sx={{
                                              width: '100%',
                                              justifyContent: 'flex-start',
                                              textTransform: 'none',
                                              fontSize: '0.875rem',
                                              borderRadius: 2,
                                              transition: 'all 0.3s ease',
                                              ...(tab === item.key && {
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                color: 'white',
                                                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                                              }),
                                              '&:hover': {
                                                background: tab === item.key ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)' : alpha('#667eea', 0.1),
                                              },
                                            }}
                                          >
                                            {item.label}
                                            {item.badge !== null && (
                                              <Badge
                                                badgeContent={item.badge}
                                                color="primary"
                                                sx={{ ml: 'auto', mr: 1 }}
                                              />
                                            )}
                                          </Button>
                                        </motion.div>
                                      </motion.div>
                                    ))}
                                  </Stack>
                                </Collapse>
                              </Box>
                            </motion.div>
                          ))}
                        </Stack>
                      </>
                    )}
                    {sidebarCollapsed && (
                      <Stack spacing={1}>
                        {filteredMenuItems.map((category) => (
                          <motion.div
                            key={category.id}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              size="small"
                              onClick={() =>
                                setExpandedCategories((prev) => ({
                                  ...prev,
                                  [category.id]: !prev[category.id],
                                }))
                              }
                              sx={{
                                minWidth: 0,
                                width: '100%',
                                aspectRatio: 1,
                                borderRadius: 2,
                                background: expandedCategories[category.id] ? alpha('#667eea', 0.2) : 'transparent',
                                color: 'text.secondary',
                                '&:hover': {
                                  background: alpha('#667eea', 0.15),
                                },
                              }}
                            >
                              {category.icon}
                            </Button>
                          </motion.div>
                        ))}
                      </Stack>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={sidebarCollapsed ? 11 : 9}>
            <Stack spacing={3}>
              {tab === 'overview' && (
                <Box>
                  {/* Hoş geldiniz Admin - Büyük Ortada */}
                  <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Box sx={{ textAlign: 'center', mb: 6, py: 4 }}>
                      <TypewriterText
                        text="Hoş Geldiniz Admin"
                        variant="h1"
                        speed={80}
                        sx={{
                          fontSize: { xs: '3rem', md: '5rem', lg: '6rem' },
                          fontWeight: 900,
                          mb: 2,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          lineHeight: 1.1,
                        }}
                      />
                      <AnimatedText
                        variant="h5"
                        delay={1.2}
                        sx={{
                          color: alpha('#fff', 0.8),
                          fontWeight: 400,
                        }}
                      >
                        Yönetim Paneline Hoş Geldiniz
                      </AnimatedText>
                      <AnimatedText
                        variant="body2"
                        delay={1.5}
                        sx={{
                          color: alpha('#fff', 0.6),
                          fontWeight: 300,
                          mt: 2,
                        }}
                      >
                        Tüm işlemlerinizi buradan yönetebilirsiniz
                      </AnimatedText>
                    </Box>
                  </motion.div>

                  {/* Animasyonlu Sayaçlar */}
                  {analytics && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <Grid container spacing={3} sx={{ mb: 6 }}>
                        {[
                          { label: 'Toplam Kullanıcı', value: analytics.overview?.total_users || 0, color: '#667eea', icon: <PeopleIcon /> },
                          { label: 'Yeni Kullanıcı (7 Gün)', value: analytics.overview?.register_count_7_days || 0, color: '#10B981', icon: <PeopleIcon /> },
                          { label: 'Aktif Kullanıcılar', value: analytics.overview?.active_users || 0, color: '#F59E0B', icon: <PeopleIcon /> },
                          { label: 'Premium Kullanıcılar', value: analytics.overview?.premium_users || 0, color: '#EC4899', icon: <StarIcon /> },
                        ].map((stat, idx) => (
                          <Grid item xs={12} sm={6} md={3} key={stat.label}>
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                              whileHover={{ scale: 1.05, y: -5 }}
                            >
                              <Card
                                sx={{
                                  p: 3,
                                  borderRadius: 4,
                                  background: `linear-gradient(135deg, ${alpha(stat.color, 0.2)} 0%, ${alpha(stat.color, 0.05)} 100%)`,
                                  border: `2px solid ${alpha(stat.color, 0.3)}`,
                                  backdropFilter: 'blur(20px)',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    borderColor: stat.color,
                                    boxShadow: `0 20px 40px ${alpha(stat.color, 0.4)}`,
                                  },
                                }}
                              >
                                <Stack spacing={2}>
                                  <Box
                                    sx={{
                                      width: 60,
                                      height: 60,
                                      borderRadius: 2,
                                      background: `linear-gradient(135deg, ${stat.color} 0%, ${alpha(stat.color, 0.7)} 100%)`,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: 'white',
                                      boxShadow: `0 10px 25px ${alpha(stat.color, 0.5)}`,
                                    }}
                                  >
                                    {stat.icon}
                                  </Box>
                                  <AnimatedCounter
                                    value={stat.value}
                                    variant="h3"
                                    delay={0.5 + idx * 0.1}
                                    sx={{
                                      fontWeight: 900,
                                      background: `linear-gradient(135deg, ${stat.color} 0%, ${alpha(stat.color, 0.8)} 100%)`,
                                      WebkitBackgroundClip: 'text',
                                      WebkitTextFillColor: 'transparent',
                                    }}
                                  />
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 + idx * 0.1 }}
                                  >
                                    <AnimatedText
                                      variant="body2"
                                      delay={0.6 + idx * 0.1}
                                      sx={{
                                        color: alpha('#fff', 0.7),
                                        fontWeight: 500,
                                      }}
                                    >
                                      {stat.label}
                                    </AnimatedText>
                                  </motion.div>
                                </Stack>
                              </Card>
                            </motion.div>
                          </Grid>
                        ))}
                      </Grid>
                    </motion.div>
                  )}

                  {/* Son Yapılan Belgeler */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <Card
                      sx={{
                        p: 4,
                        borderRadius: 4,
                        background: alpha('#fff', 0.03),
                        border: `1px solid ${alpha('#667eea', 0.2)}`,
                        backdropFilter: 'blur(20px)',
                      }}
                    >
                      <TypewriterText
                        text="Son Yapılan Belgeler"
                        variant="h5"
                        speed={60}
                        sx={{
                          fontWeight: 700,
                          mb: 3,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      />
                      <Stack spacing={2}>
                        {logs.slice(0, 10).map((log, idx) => (
                          <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 1 + idx * 0.1 }}
                          >
                            <Paper
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                background: alpha('#fff', 0.05),
                                border: `1px solid ${alpha('#667eea', 0.2)}`,
                                '&:hover': {
                                  background: alpha('#667eea', 0.1),
                                  borderColor: '#667eea',
                                },
                              }}
                            >
                              <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'white', mb: 0.5 }}>
                                    {log.action || 'İşlem'}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: alpha('#fff', 0.6) }}>
                                    {log.user?.username || 'Kullanıcı'} • {new Date(log.created_at).toLocaleString('tr-TR')}
                                  </Typography>
                                </Box>
                                <Chip
                                  label={log.action}
                                  size="small"
                                  sx={{
                                    background: alpha('#667eea', 0.2),
                                    color: '#667eea',
                                    fontWeight: 600,
                                  }}
                                />
                              </Stack>
                            </Paper>
                          </motion.div>
                        ))}
                        {logs.length === 0 && (
                          <Typography variant="body2" sx={{ color: alpha('#fff', 0.5), textAlign: 'center', py: 4 }}>
                            Henüz belge yok
                          </Typography>
                        )}
                      </Stack>
                    </Card>
                  </motion.div>
                </Box>
              )}

              {tab === 'analytics' && (
                <Stack spacing={3}>
                  <TypewriterText
                    text="Analytics & İstatistikler"
                    variant="h3"
                    speed={70}
                    sx={{
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  />
                  {analytics ? (
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Card>
                          <CardContent>
                              <AnimatedText
                                variant="h6"
                                delay={0.2}
                                sx={{
                                  fontWeight: 700,
                                  mb: 2,
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                }}
                              >
                                Genel İstatistikler
                              </AnimatedText>
                            <Grid container spacing={3} sx={{ mt: 1 }}>
                              <Grid item xs={12} md={3}>
                                <Typography variant="caption" color="text.secondary">
                                  Toplam Kullanıcı
                                </Typography>
                                <Typography variant="h5">{analytics.overview?.total_users || 0}</Typography>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Typography variant="caption" color="text.secondary">
                                  Toplam Belge
                                </Typography>
                                <Typography variant="h5">{analytics.overview?.total_documents || 0}</Typography>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Typography variant="caption" color="text.secondary">
                                  Toplam Şablon
                                </Typography>
                                <Typography variant="h5">{analytics.overview?.total_templates || 0}</Typography>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Typography variant="caption" color="text.secondary">
                                  Toplam Key
                                </Typography>
                                <Typography variant="h5">{analytics.overview?.total_keys || 0}</Typography>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                      {analytics.action_stats && analytics.action_stats.length > 0 && (
                        <Grid item xs={12}>
                          <Card>
                            <CardContent>
                              <AnimatedText
                                variant="h6"
                                delay={0.3}
                                sx={{
                                  fontWeight: 700,
                                  mb: 2,
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                }}
                              >
                                En Çok Kullanılan İşlemler (30 gün)
                              </AnimatedText>
                              <Stack spacing={2} sx={{ mt: 2 }}>
                                {analytics.action_stats.map((stat, idx) => (
                                  <Stack key={idx} direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography>{stat.action}</Typography>
                                    <Badge badgeContent={stat.count} color="primary" />
                                  </Stack>
                                ))}
                              </Stack>
                            </CardContent>
                          </Card>
                        </Grid>
                      )}
                    </Grid>
                  ) : (
                    <Card>
                      <CardContent>
                        <Typography>Analytics yükleniyor...</Typography>
                      </CardContent>
                    </Card>
                  )}
                </Stack>
              )}

              {tab === 'users' && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardContent>
                    <Stack spacing={2}>
                      <TypewriterText
                        text="Yeni Kullanıcı"
                        variant="h6"
                        speed={60}
                        sx={{
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      />
                    <TextField
                      label="Kullanıcı adı"
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    />
                    <TextField
                      label="İsim"
                      value={newUser.first_name}
                      onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                    />
                    <TextField
                      label="Soyisim"
                      value={newUser.last_name}
                      onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
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
                  <AnimatedText
                    variant="h6"
                    delay={0.1}
                    sx={{
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Kullanıcılar
                  </AnimatedText>
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
                <TypewriterText
                  text="Yeni Şablon"
                  variant="h6"
                  speed={60}
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                />
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
                <TypewriterText
                  text="Şablon Alanı Ekle"
                  variant="h6"
                  speed={60}
                  sx={{
                    fontWeight: 700,
                    mt: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                />
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
                <TypewriterText
                  text="Premium Key"
                  variant="h6"
                  speed={60}
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                />
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

              {tab === 'requests' && (
                <Card>
                  <CardContent>
                    <Stack spacing={3}>
                      <Box>
                        <AnimatedText
                          variant="h6"
                          delay={0.1}
                          sx={{
                            mb: 2,
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          Premium Key Başvuruları
                        </AnimatedText>
                        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                          <Chip
                            label="Tümü"
                            onClick={() => setRequestStatusFilter(null)}
                            color={requestStatusFilter === null ? 'primary' : 'default'}
                            clickable
                          />
                          <Chip
                            label="Bekleyen"
                            onClick={() => setRequestStatusFilter('pending')}
                            color={requestStatusFilter === 'pending' ? 'primary' : 'default'}
                            clickable
                          />
                          <Chip
                            label="Onaylandı"
                            onClick={() => setRequestStatusFilter('approved')}
                            color={requestStatusFilter === 'approved' ? 'primary' : 'default'}
                            clickable
                          />
                          <Chip
                            label="Reddedildi"
                            onClick={() => setRequestStatusFilter('rejected')}
                            color={requestStatusFilter === 'rejected' ? 'primary' : 'default'}
                            clickable
                          />
                        </Stack>
                      </Box>
                      <Divider />
                      <Stack spacing={2}>
                        {premiumRequests
                          .filter((req) => !requestStatusFilter || req.status === requestStatusFilter)
                          .map((req) => (
                            <Card key={req.id} variant="outlined" sx={{ p: 3 }}>
                              <Stack spacing={2}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                      {req.user?.username || 'Unknown'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                      {req.user?.email || ''}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                                      {new Date(req.created_at).toLocaleString('tr-TR')}
                                    </Typography>
                                  </Box>
                                  <Chip
                                    icon={
                                      req.status === 'approved' ? (
                                        <CheckCircleIcon />
                                      ) : req.status === 'rejected' ? (
                                        <CancelIcon />
                                      ) : (
                                        <RequestQuoteIcon />
                                      )
                                    }
                                    label={
                                      req.status === 'approved'
                                        ? 'Onaylandı'
                                        : req.status === 'rejected'
                                        ? 'Reddedildi'
                                        : 'Beklemede'
                                    }
                                    color={
                                      req.status === 'approved'
                                        ? 'success'
                                        : req.status === 'rejected'
                                        ? 'error'
                                        : 'warning'
                                    }
                                  />
                                </Box>
                                <Divider />
                                <Box>
                                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                    Başvuru Nedeni:
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap' }}>
                                    {req.reason || 'Neden belirtilmemiş'}
                                  </Typography>
                                </Box>
                                {req.admin_note && (
                                  <Box
                                    sx={{
                                      p: 2,
                                      background: 'rgba(102, 126, 234, 0.1)',
                                      borderRadius: 1,
                                      borderLeft: '3px solid #667eea',
                                    }}
                                  >
                                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                      Admin Notu:
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                      {req.admin_note}
                                    </Typography>
                                  </Box>
                                )}
                                {req.status === 'pending' && (
                                  <Stack direction="row" spacing={2}>
                                    <Button
                                      variant="contained"
                                      color="success"
                                      startIcon={<CheckCircleIcon />}
                                      onClick={() => setApproveDialog({ open: true, request: req })}
                                    >
                                      Onayla
                                    </Button>
                                    <Button
                                      variant="contained"
                                      color="error"
                                      startIcon={<CancelIcon />}
                                      onClick={() => setRejectDialog({ open: true, request: req })}
                                    >
                                      Reddet
                                    </Button>
                                  </Stack>
                                )}
                              </Stack>
                            </Card>
                          ))}
                        {premiumRequests.filter((req) => !requestStatusFilter || req.status === requestStatusFilter).length === 0 && (
                          <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                              Başvuru bulunamadı
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              )}

              {tab === 'logs' && (
                <Card>
                  <CardContent>
                    <Stack spacing={3}>
                      <Box>
                        <TypewriterText
                          text="Kullanım Logları"
                          variant="h6"
                          speed={60}
                          sx={{
                            mb: 2,
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        />
                        <Divider sx={{ my: 2 }} />
                        <Stack spacing={1}>
                          {logs.map((log) => (
                            <Paper key={log.id} sx={{ p: 2, background: 'rgba(102, 126, 234, 0.05)' }}>
                              <Typography variant="body2">
                                <strong>{log.user}</strong> · {log.action} · {new Date(log.created_at).toLocaleString('tr-TR')}
                              </Typography>
                            </Paper>
                          ))}
                        </Stack>
                      </Box>
                      <Divider />
                      <Box>
                        <TypewriterText
                          text="Kullanıcı Aktivite Logları (Giriş/Çıkış/IP)"
                          variant="h6"
                          speed={60}
                          sx={{
                            mb: 2,
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        />
                        <Divider sx={{ my: 2 }} />
                        <Stack spacing={1}>
                          {activityLogs.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">Henüz aktivite logu yok</Typography>
                          ) : (
                            activityLogs.map((log) => (
                              <Paper key={log.id} sx={{ p: 2, background: 'rgba(102, 126, 234, 0.05)' }}>
                                <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                      {log.username || log.user?.username || 'Unknown'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {log.action.toUpperCase()} · {log.ip_address || 'N/A'} · {new Date(log.created_at).toLocaleString('tr-TR')}
                                    </Typography>
                                  </Box>
                                  <Chip
                                    label={log.action}
                                    size="small"
                                    color={
                                      log.action === 'login'
                                        ? 'success'
                                        : log.action === 'logout'
                                        ? 'warning'
                                        : log.action === 'register'
                                        ? 'primary'
                                        : 'default'
                                    }
                                  />
                                </Stack>
                              </Paper>
                            ))
                          )}
                        </Stack>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              )}

              {tab === 'settings' && (
                <Box>
                  {/* Başlık */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                      <TypewriterText
                        text="Site Ayarları"
                        variant="h3"
                        speed={60}
                        sx={{
                          fontSize: { xs: '2.5rem', md: '3.5rem' },
                          fontWeight: 900,
                          mb: 2,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      />
                      <AnimatedText
                        variant="body1"
                        delay={0.5}
                        sx={{
                          color: alpha('#fff', 0.7),
                        }}
                      >
                        Site görünümü ve ayarlarını buradan yönetebilirsiniz
                      </AnimatedText>
                    </Box>
                  </motion.div>

                  <Grid container spacing={3}>
                    {/* Genel Ayarlar */}
                    <Grid item xs={12} md={6}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        <Card
                          sx={{
                            p: 3,
                            borderRadius: 4,
                            background: `linear-gradient(135deg, ${alpha('#667eea', 0.2)} 0%, ${alpha('#667eea', 0.05)} 100%)`,
                            border: `2px solid ${alpha('#667eea', 0.3)}`,
                            backdropFilter: 'blur(20px)',
                            height: '100%',
                          }}
                        >
                          <CardContent>
                            <Stack spacing={3}>
                              <AnimatedText
                                variant="h5"
                                delay={0.3}
                                sx={{
                                  fontWeight: 700,
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                }}
                              >
                                Genel Ayarlar
                              </AnimatedText>
                              <TextField
                                label="Site adı"
                                value={siteSettings.site_name}
                                onChange={(e) => setSiteSettings({ ...siteSettings, site_name: e.target.value })}
                                fullWidth
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: alpha('#fff', 0.05),
                                    color: 'white',
                                    '& fieldset': {
                                      borderColor: alpha('#667eea', 0.3),
                                    },
                                    '&:hover fieldset': {
                                      borderColor: '#667eea',
                                    },
                                  },
                                }}
                              />
                              <TextField
                                label="Hero başlık"
                                value={siteSettings.hero_title}
                                onChange={(e) => setSiteSettings({ ...siteSettings, hero_title: e.target.value })}
                                fullWidth
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: alpha('#fff', 0.05),
                                    color: 'white',
                                    '& fieldset': { borderColor: alpha('#667eea', 0.3) },
                                    '&:hover fieldset': { borderColor: '#667eea' },
                                  },
                                }}
                              />
                              <TextField
                                label="Hero alt başlık"
                                value={siteSettings.hero_subtitle}
                                onChange={(e) => setSiteSettings({ ...siteSettings, hero_subtitle: e.target.value })}
                                multiline
                                rows={2}
                                fullWidth
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: alpha('#fff', 0.05),
                                    color: 'white',
                                    '& fieldset': { borderColor: alpha('#667eea', 0.3) },
                                    '&:hover fieldset': { borderColor: '#667eea' },
                                  },
                                }}
                              />
                              <TextField
                                label="Copyright Metni"
                                value={siteSettings.copyright_text}
                                onChange={(e) => setSiteSettings({ ...siteSettings, copyright_text: e.target.value })}
                                placeholder="© 2026 EroxAI Studio. Tüm hakları saklıdır."
                                helperText="Footer'da gösterilecek copyright metni"
                                fullWidth
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: alpha('#fff', 0.05),
                                    color: 'white',
                                    '& fieldset': { borderColor: alpha('#667eea', 0.3) },
                                    '&:hover fieldset': { borderColor: '#667eea' },
                                  },
                                }}
                              />
                            </Stack>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>

                    {/* İletişim Bilgileri */}
                    <Grid item xs={12} md={6}>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                      >
                        <Card
                          sx={{
                            p: 3,
                            borderRadius: 4,
                            background: `linear-gradient(135deg, ${alpha('#10B981', 0.2)} 0%, ${alpha('#10B981', 0.05)} 100%)`,
                            border: `2px solid ${alpha('#10B981', 0.3)}`,
                            backdropFilter: 'blur(20px)',
                            height: '100%',
                          }}
                        >
                          <CardContent>
                            <Stack spacing={3}>
                              <AnimatedText
                                variant="h5"
                                delay={0.4}
                                sx={{
                                  fontWeight: 700,
                                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                }}
                              >
                                İletişim Bilgileri
                              </AnimatedText>
                              <TextField
                                label="İletişim mail"
                                value={siteSettings.contact_email}
                                onChange={(e) => setSiteSettings({ ...siteSettings, contact_email: e.target.value })}
                                fullWidth
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: alpha('#fff', 0.05),
                                    color: 'white',
                                    '& fieldset': { borderColor: alpha('#10B981', 0.3) },
                                    '&:hover fieldset': { borderColor: '#10B981' },
                                  },
                                }}
                              />
                              <TextField
                                label="Telefon"
                                value={siteSettings.contact_phone}
                                onChange={(e) => setSiteSettings({ ...siteSettings, contact_phone: e.target.value })}
                                fullWidth
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: alpha('#fff', 0.05),
                                    color: 'white',
                                    '& fieldset': { borderColor: alpha('#10B981', 0.3) },
                                    '&:hover fieldset': { borderColor: '#10B981' },
                                  },
                                }}
                              />
                              <TextField
                                label="WhatsApp"
                                value={siteSettings.contact_whatsapp}
                                onChange={(e) => setSiteSettings({ ...siteSettings, contact_whatsapp: e.target.value })}
                                fullWidth
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: alpha('#fff', 0.05),
                                    color: 'white',
                                    '& fieldset': { borderColor: alpha('#10B981', 0.3) },
                                    '&:hover fieldset': { borderColor: '#10B981' },
                                  },
                                }}
                              />
                              <TextField
                                label="Adres"
                                value={siteSettings.address}
                                onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                                multiline
                                rows={2}
                                fullWidth
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: alpha('#fff', 0.05),
                                    color: 'white',
                                    '& fieldset': { borderColor: alpha('#10B981', 0.3) },
                                    '&:hover fieldset': { borderColor: '#10B981' },
                                  },
                                }}
                              />
                            </Stack>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>

                    {/* Sosyal Medya Hesapları */}
                    <Grid item xs={12} md={6}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                      >
                        <Card
                          sx={{
                            p: 3,
                            borderRadius: 4,
                            background: `linear-gradient(135deg, ${alpha('#EC4899', 0.2)} 0%, ${alpha('#EC4899', 0.05)} 100%)`,
                            border: `2px solid ${alpha('#EC4899', 0.3)}`,
                            backdropFilter: 'blur(20px)',
                            height: '100%',
                          }}
                        >
                          <CardContent>
                            <Stack spacing={3}>
                              <AnimatedText
                                variant="h5"
                                delay={0.5}
                                sx={{
                                  fontWeight: 700,
                                  background: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                }}
                              >
                                Sosyal Medya Hesapları
                              </AnimatedText>
                              <TextField
                                label="Facebook URL"
                                value={siteSettings.social_facebook}
                                onChange={(e) => setSiteSettings({ ...siteSettings, social_facebook: e.target.value })}
                                placeholder="https://facebook.com/..."
                                fullWidth
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: alpha('#fff', 0.05),
                                    color: 'white',
                                    '& fieldset': { borderColor: alpha('#EC4899', 0.3) },
                                    '&:hover fieldset': { borderColor: '#EC4899' },
                                  },
                                }}
                              />
                              <TextField
                                label="Instagram URL"
                                value={siteSettings.social_instagram}
                                onChange={(e) => setSiteSettings({ ...siteSettings, social_instagram: e.target.value })}
                                placeholder="https://instagram.com/..."
                                fullWidth
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: alpha('#fff', 0.05),
                                    color: 'white',
                                    '& fieldset': { borderColor: alpha('#EC4899', 0.3) },
                                    '&:hover fieldset': { borderColor: '#EC4899' },
                                  },
                                }}
                              />
                              <TextField
                                label="Twitter/X URL"
                                value={siteSettings.social_twitter}
                                onChange={(e) => setSiteSettings({ ...siteSettings, social_twitter: e.target.value })}
                                placeholder="https://twitter.com/..."
                                fullWidth
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: alpha('#fff', 0.05),
                                    color: 'white',
                                    '& fieldset': { borderColor: alpha('#EC4899', 0.3) },
                                    '&:hover fieldset': { borderColor: '#EC4899' },
                                  },
                                }}
                              />
                              <TextField
                                label="LinkedIn URL"
                                value={siteSettings.social_linkedin}
                                onChange={(e) => setSiteSettings({ ...siteSettings, social_linkedin: e.target.value })}
                                placeholder="https://linkedin.com/..."
                                fullWidth
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: alpha('#fff', 0.05),
                                    color: 'white',
                                    '& fieldset': { borderColor: alpha('#EC4899', 0.3) },
                                    '&:hover fieldset': { borderColor: '#EC4899' },
                                  },
                                }}
                              />
                              <TextField
                                label="YouTube URL"
                                value={siteSettings.social_youtube}
                                onChange={(e) => setSiteSettings({ ...siteSettings, social_youtube: e.target.value })}
                                placeholder="https://youtube.com/..."
                                fullWidth
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: alpha('#fff', 0.05),
                                    color: 'white',
                                    '& fieldset': { borderColor: alpha('#EC4899', 0.3) },
                                    '&:hover fieldset': { borderColor: '#EC4899' },
                                  },
                                }}
                              />
                              <TextField
                                label="GitHub URL"
                                value={siteSettings.social_github}
                                onChange={(e) => setSiteSettings({ ...siteSettings, social_github: e.target.value })}
                                placeholder="https://github.com/..."
                                fullWidth
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: alpha('#fff', 0.05),
                                    color: 'white',
                                    '& fieldset': { borderColor: alpha('#EC4899', 0.3) },
                                    '&:hover fieldset': { borderColor: '#EC4899' },
                                  },
                                }}
                              />
                              <TextField
                                label="Telegram URL"
                                value={siteSettings.social_telegram}
                                onChange={(e) => setSiteSettings({ ...siteSettings, social_telegram: e.target.value })}
                                placeholder="https://t.me/..."
                                fullWidth
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: alpha('#fff', 0.05),
                                    color: 'white',
                                    '& fieldset': { borderColor: alpha('#EC4899', 0.3) },
                                    '&:hover fieldset': { borderColor: '#EC4899' },
                                  },
                                }}
                              />
                            </Stack>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>

                    {/* AI API Endpoints */}
                    <Grid item xs={12} md={6}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                      >
                        <Card
                          sx={{
                            p: 3,
                            borderRadius: 4,
                            background: `linear-gradient(135deg, ${alpha('#F59E0B', 0.2)} 0%, ${alpha('#F59E0B', 0.05)} 100%)`,
                            border: `2px solid ${alpha('#F59E0B', 0.3)}`,
                            backdropFilter: 'blur(20px)',
                            height: '100%',
                          }}
                        >
                          <CardContent>
                            <Stack spacing={3}>
                              <AnimatedText
                                variant="h5"
                                delay={0.6}
                                sx={{
                                  fontWeight: 700,
                                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                }}
                              >
                                AI API Endpoints
                              </AnimatedText>
                              <TextField
                                label="Google AI Endpoint"
                                value={siteSettings.google_ai_endpoint}
                                onChange={(e) => setSiteSettings({ ...siteSettings, google_ai_endpoint: e.target.value })}
                                placeholder="https://vision.googleapis.com/v1/images:annotate"
                                fullWidth
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: alpha('#fff', 0.05),
                                    color: 'white',
                                    '& fieldset': { borderColor: alpha('#F59E0B', 0.3) },
                                    '&:hover fieldset': { borderColor: '#F59E0B' },
                                  },
                                }}
                              />
                              <TextField
                                label="OpenAI Endpoint"
                                value={siteSettings.openai_endpoint}
                                onChange={(e) => setSiteSettings({ ...siteSettings, openai_endpoint: e.target.value })}
                                placeholder="https://api.openai.com/v1/chat/completions"
                                fullWidth
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: alpha('#fff', 0.05),
                                    color: 'white',
                                    '& fieldset': { borderColor: alpha('#F59E0B', 0.3) },
                                    '&:hover fieldset': { borderColor: '#F59E0B' },
                                  },
                                }}
                              />
                              <TextField
                                label="DeepSeek Endpoint"
                                value={siteSettings.deepseek_endpoint}
                                onChange={(e) => setSiteSettings({ ...siteSettings, deepseek_endpoint: e.target.value })}
                                placeholder="https://api.deepseek.com/v1/chat/completions"
                                fullWidth
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: alpha('#fff', 0.05),
                                    color: 'white',
                                    '& fieldset': { borderColor: alpha('#F59E0B', 0.3) },
                                    '&:hover fieldset': { borderColor: '#F59E0B' },
                                  },
                                }}
                              />
                              <TextField
                                label="Blackbox Endpoint"
                                value={siteSettings.blackbox_endpoint}
                                onChange={(e) => setSiteSettings({ ...siteSettings, blackbox_endpoint: e.target.value })}
                                placeholder="https://www.blackbox.ai/api/chat"
                                fullWidth
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: alpha('#fff', 0.05),
                                    color: 'white',
                                    '& fieldset': { borderColor: alpha('#F59E0B', 0.3) },
                                    '&:hover fieldset': { borderColor: '#F59E0B' },
                                  },
                                }}
                              />
                              <TextField
                                select
                                label="Chat Provider"
                                value={siteSettings.chat_provider}
                                onChange={(e) => setSiteSettings({ ...siteSettings, chat_provider: e.target.value })}
                                fullWidth
                                SelectProps={{ native: true }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: alpha('#fff', 0.05),
                                    color: 'white',
                                    '& fieldset': { borderColor: alpha('#F59E0B', 0.3) },
                                    '&:hover fieldset': { borderColor: '#F59E0B' },
                                  },
                                }}
                              >
                                <option value="openai">OpenAI</option>
                                <option value="deepseek">DeepSeek</option>
                                <option value="blackbox">Blackbox</option>
                              </TextField>
                            </Stack>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>

                    {/* Tema Ayarları */}
                    <Grid item xs={12} md={6}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                      >
                        <Card
                          sx={{
                            p: 3,
                            borderRadius: 4,
                            background: `linear-gradient(135deg, ${alpha('#667eea', 0.2)} 0%, ${alpha('#764ba2', 0.05)} 100%)`,
                            border: `2px solid ${alpha('#667eea', 0.3)}`,
                            backdropFilter: 'blur(20px)',
                            height: '100%',
                          }}
                        >
                          <CardContent>
                            <Stack spacing={3}>
                              <AnimatedText
                                variant="h5"
                                delay={0.7}
                                sx={{
                                  fontWeight: 700,
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                }}
                              >
                                Tema Ayarları
                              </AnimatedText>
                              <TextField
                                label="Primary Color (Hex)"
                                value={siteSettings.theme_primary_color}
                                onChange={(e) => setSiteSettings({ ...siteSettings, theme_primary_color: e.target.value })}
                                placeholder="#667eea"
                                fullWidth
                                InputProps={{
                                  startAdornment: (
                                    <Box
                                      sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 1,
                                        background: siteSettings.theme_primary_color || '#667eea',
                                        mr: 1,
                                        border: '1px solid rgba(255,255,255,0.2)',
                                      }}
                                    />
                                  ),
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: alpha('#fff', 0.05),
                                    color: 'white',
                                    '& fieldset': { borderColor: alpha('#667eea', 0.3) },
                                    '&:hover fieldset': { borderColor: '#667eea' },
                                  },
                                }}
                              />
                              <TextField
                                label="Secondary Color (Hex)"
                                value={siteSettings.theme_secondary_color}
                                onChange={(e) => setSiteSettings({ ...siteSettings, theme_secondary_color: e.target.value })}
                                placeholder="#764ba2"
                                fullWidth
                                InputProps={{
                                  startAdornment: (
                                    <Box
                                      sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 1,
                                        background: siteSettings.theme_secondary_color || '#764ba2',
                                        mr: 1,
                                        border: '1px solid rgba(255,255,255,0.2)',
                                      }}
                                    />
                                  ),
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: alpha('#fff', 0.05),
                                    color: 'white',
                                    '& fieldset': { borderColor: alpha('#764ba2', 0.3) },
                                    '&:hover fieldset': { borderColor: '#764ba2' },
                                  },
                                }}
                              />
                              <TextField
                                select
                                label="Theme Preset"
                                value={siteSettings.theme_preset}
                                onChange={(e) => setSiteSettings({ ...siteSettings, theme_preset: e.target.value })}
                                fullWidth
                                SelectProps={{ native: true }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    background: alpha('#fff', 0.05),
                                    color: 'white',
                                    '& fieldset': { borderColor: alpha('#667eea', 0.3) },
                                    '&:hover fieldset': { borderColor: '#667eea' },
                                  },
                                }}
                              >
                                <option value="ocean">Ocean</option>
                                <option value="sunset">Sunset</option>
                                <option value="violet">Violet</option>
                                <option value="emerald">Emerald</option>
                              </TextField>
                              <Box sx={{ pt: 2 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, color: alpha('#fff', 0.8), fontWeight: 600 }}>
                                  Logo Yükle
                                </Typography>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => setSiteSettings({ ...siteSettings, logo: e.target.files?.[0] })}
                                  style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    background: alpha('#fff', 0.05),
                                    border: `1px solid ${alpha('#667eea', 0.3)}`,
                                    color: 'white',
                                    cursor: 'pointer',
                                  }}
                                />
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  </Grid>

                  {/* Kaydet Butonu */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleSaveSettings}
                        size="large"
                        sx={{
                          px: 6,
                          py: 1.5,
                          borderRadius: 3,
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          boxShadow: `0 10px 30px ${alpha('#667eea', 0.4)}`,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                            boxShadow: `0 15px 40px ${alpha('#667eea', 0.6)}`,
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        ✨ Ayarları Kaydet
                      </Button>
                    </Box>
                  </motion.div>
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Approve Dialog */}
      <Dialog open={approveDialog.open} onClose={() => setApproveDialog({ open: false, request: null })} maxWidth="sm" fullWidth>
        <DialogTitle>Başvuruyu Onayla</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Key Kodu (boş bırak otomatik oluştur)"
              value={approveForm.key_code}
              onChange={(e) => setApproveForm({ ...approveForm, key_code: e.target.value })}
              fullWidth
            />
            <TextField
              label="Maks Kullanım"
              type="number"
              value={approveForm.max_uses}
              onChange={(e) => setApproveForm({ ...approveForm, max_uses: parseInt(e.target.value) || 1 })}
              fullWidth
            />
            <TextField
              label="Admin Notu (opsiyonel)"
              multiline
              rows={3}
              value={approveForm.admin_note}
              onChange={(e) => setApproveForm({ ...approveForm, admin_note: e.target.value })}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialog({ open: false, request: null })}>İptal</Button>
          <Button variant="contained" color="success" onClick={handleApproveRequest}>
            Onayla
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onClose={() => setRejectDialog({ open: false, request: null })} maxWidth="sm" fullWidth>
        <DialogTitle>Başvuruyu Reddet</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Red Nedeni (opsiyonel)"
              multiline
              rows={4}
              value={rejectForm.admin_note}
              onChange={(e) => setRejectForm({ ...rejectForm, admin_note: e.target.value })}
              fullWidth
              placeholder="Kullanıcıya gösterilecek red nedeni..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialog({ open: false, request: null })}>İptal</Button>
          <Button variant="contained" color="error" onClick={handleRejectRequest}>
            Reddet
          </Button>
        </DialogActions>
      </Dialog>

      <ChatBot />
      <Footer />
    </Box>
  )
}

export default AdminDashboard
