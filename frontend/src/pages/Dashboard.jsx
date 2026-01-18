import { useEffect, useState } from 'react'
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
  Tabs,
  Tab,
  Chip,
  alpha,
  LinearProgress,
  Paper,
} from '@mui/material'
import { motion } from 'framer-motion'
import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { useAuthStore } from '../store/useAuthStore'
import { redeemPremiumKey } from '../services/authService'
import { createPremiumRequest, getMyPremiumRequests } from '../services/premiumRequestService'
import { listTemplates, fillTemplate } from '../services/templateService'
import DocumentTranslatePanel from '../components/user/DocumentTranslatePanel'
import BlankPagePanel from '../components/user/BlankPagePanel'
import AreaCalculatorPanel from '../components/user/AreaCalculatorPanel'
import KeyIcon from '@mui/icons-material/Key'
import DescriptionIcon from '@mui/icons-material/Description'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import CalculateIcon from '@mui/icons-material/Calculate'
import SendIcon from '@mui/icons-material/Send'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingIcon from '@mui/icons-material/Pending'
import CancelIcon from '@mui/icons-material/Cancel'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import StarIcon from '@mui/icons-material/Star'

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
  const { t, i18n } = useTranslation()
  const user = useAuthStore((state) => state.user)
  const loadMe = useAuthStore((state) => state.loadMe)
  const [activeTab, setActiveTab] = useState(0)
  const [premiumKey, setPremiumKey] = useState('')
  const [requestReason, setRequestReason] = useState('')
  const [myRequests, setMyRequests] = useState([])
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [inputData, setInputData] = useState({})
  const [loadingRequest, setLoadingRequest] = useState(false)

  useEffect(() => {
    loadMe()
    listTemplates().then(setTemplates)
    loadMyRequests()
  }, [loadMe])

  const loadMyRequests = async () => {
    try {
      const data = await getMyPremiumRequests()
      setMyRequests(data)
    } catch (error) {
      // Silent fail
    }
  }

  const handleRedeem = async () => {
    if (!premiumKey.trim()) {
      enqueueSnackbar(
        i18n.language === 'tr' ? 'Lütfen bir key girin' : i18n.language === 'ja' ? 'キーを入力してください' : 'Please enter a key',
        { variant: 'warning' }
      )
      return
    }
    try {
      await redeemPremiumKey(premiumKey)
      enqueueSnackbar(
        i18n.language === 'tr' ? '✨ Premium başarıyla aktif edildi!' : i18n.language === 'ja' ? '✨ プレミアムが正常に有効化されました！' : '✨ Premium activated successfully!',
        { variant: 'success' }
      )
      setPremiumKey('')
      loadMe()
    } catch (error) {
      enqueueSnackbar(
        i18n.language === 'tr' ? 'Premium key geçersiz veya kullanılmış' : i18n.language === 'ja' ? 'プレミアムキーが無効または使用済みです' : 'Premium key invalid or already used',
        { variant: 'error' }
      )
    }
  }

  const handleRequestSubmit = async () => {
    if (!requestReason.trim()) {
      enqueueSnackbar(
        i18n.language === 'tr' ? 'Lütfen başvuru nedeninizi yazın' : i18n.language === 'ja' ? '申請理由を入力してください' : 'Please write your request reason',
        { variant: 'warning' }
      )
      return
    }
    setLoadingRequest(true)
    try {
      await createPremiumRequest(requestReason)
      enqueueSnackbar(
        i18n.language === 'tr' ? '✅ Başvurunuz gönderildi! Admin onayı bekleniyor.' : i18n.language === 'ja' ? '✅ 申請が送信されました！管理者の承認を待っています。' : '✅ Request submitted! Waiting for admin approval.',
        { variant: 'success' }
      )
      setRequestReason('')
      loadMyRequests()
    } catch (error) {
      enqueueSnackbar(
        i18n.language === 'tr' ? 'Başvuru gönderilemedi' : i18n.language === 'ja' ? '申請を送信できませんでした' : 'Failed to submit request',
        { variant: 'error' }
      )
    } finally {
      setLoadingRequest(false)
    }
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
  const pendingRequest = myRequests.find((r) => r.status === 'pending')

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

        {/* Tabs Navigation */}
        <Card
          sx={{
            mb: 4,
            background: alpha('#fff', 0.03),
            border: `1px solid ${alpha('#667eea', 0.2)}`,
            backdropFilter: 'blur(20px)',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => {
              // Key girmeden çeviri ve düzenleme tab'larına geçişi engelle
              if ((newValue === 2 || newValue === 3) && !isPremium) {
                enqueueSnackbar(
                  i18n.language === 'tr' 
                    ? '🔒 Bu özellikleri kullanmak için premium key girmeniz gerekiyor!' 
                    : i18n.language === 'ja' 
                    ? '🔒 この機能を使用するにはプレミアムキーを入力する必要があります！' 
                    : '🔒 You need to enter a premium key to use these features!',
                  { variant: 'warning' }
                )
                return
              }
              setActiveTab(newValue)
            }}
            sx={{
              '& .MuiTab-root': {
                color: alpha('#fff', 0.7),
                fontWeight: 600,
                '&.Mui-selected': {
                  color: '#667eea',
                },
                '&.Mui-disabled': {
                  color: alpha('#fff', 0.3),
                },
              },
              '& .MuiTabs-indicator': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              },
            }}
          >
            <Tab
              icon={<KeyIcon />}
              iconPosition="start"
              label={i18n.language === 'tr' ? 'Premium Key' : i18n.language === 'ja' ? 'プレミアムキー' : 'Premium Key'}
            />
            <Tab
              icon={<DescriptionIcon />}
              iconPosition="start"
              label={i18n.language === 'tr' ? 'Şablonlar' : i18n.language === 'ja' ? 'テンプレート' : 'Templates'}
              disabled={!isPremium}
            />
            <Tab
              icon={<AutoAwesomeIcon />}
              iconPosition="start"
              label={i18n.language === 'tr' ? 'OCR & Çeviri' : i18n.language === 'ja' ? 'OCR & 翻訳' : 'OCR & Translate'}
              disabled={!isPremium}
            />
            <Tab
              icon={<NoteAddIcon />}
              iconPosition="start"
              label={i18n.language === 'tr' ? 'Boş Sayfa' : i18n.language === 'ja' ? '空白ページ' : 'Blank Page'}
              disabled={!isPremium}
            />
            <Tab
              icon={<CalculateIcon />}
              iconPosition="start"
              label={i18n.language === 'tr' ? 'Subo Hesaplama' : i18n.language === 'ja' ? '坪計算' : 'Area Calculator'}
            />
          </Tabs>
        </Card>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            {/* Premium Key Kullan */}
            <Grid item xs={12} md={6}>
              <FloatingCard delay={0}>
                <Card
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: alpha('#fff', 0.03),
                    border: `1px solid ${alpha('#667eea', 0.2)}`,
                    backdropFilter: 'blur(20px)',
                    height: '100%',
                  }}
                >
                  <CardContent>
                    <Stack spacing={3}>
                      <Box>
                        <KeyIcon sx={{ fontSize: 40, color: '#667eea', mb: 2 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                          {i18n.language === 'tr' ? 'Premium Key Kullan' : i18n.language === 'ja' ? 'プレミアムキーを使用' : 'Use Premium Key'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                          {i18n.language === 'tr'
                            ? 'Elinizde premium key varsa buraya girin ve aktif edin.'
                            : i18n.language === 'ja'
                            ? 'プレミアムキーをお持ちの場合は、ここに入力して有効化してください。'
                            : 'If you have a premium key, enter it here to activate.'}
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        label={i18n.language === 'tr' ? 'Premium Key' : i18n.language === 'ja' ? 'プレミアムキー' : 'Premium Key'}
                        value={premiumKey}
                        onChange={(e) => setPremiumKey(e.target.value)}
                        placeholder="xxxxxxxx-xxxx-xxxx"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            background: alpha('#fff', 0.05),
                            color: 'white',
                            '& fieldset': {
                              borderColor: alpha('#667eea', 0.3),
                            },
                          },
                        }}
                      />
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={handleRedeem}
                          sx={{
                            py: 1.5,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            fontWeight: 700,
                            fontSize: '1rem',
                          }}
                        >
                          {i18n.language === 'tr' ? 'Key\'i Aktif Et' : i18n.language === 'ja' ? 'キーを有効化' : 'Activate Key'}
                        </Button>
                      </motion.div>
                    </Stack>
                  </CardContent>
                </Card>
              </FloatingCard>
            </Grid>

            {/* Premium Key Başvuru */}
            <Grid item xs={12} md={6}>
              <FloatingCard delay={0.1}>
                <Card
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: alpha('#fff', 0.03),
                    border: `1px solid ${alpha('#667eea', 0.2)}`,
                    backdropFilter: 'blur(20px)',
                    height: '100%',
                  }}
                >
                  <CardContent>
                    <Stack spacing={3}>
                      <Box>
                        <SendIcon sx={{ fontSize: 40, color: '#10B981', mb: 2 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                          {i18n.language === 'tr' ? 'Premium Key Başvurusu' : i18n.language === 'ja' ? 'プレミアムキー申請' : 'Premium Key Request'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                          {i18n.language === 'tr'
                            ? 'Premium key almak için başvuru yapın. Admin onayından sonra key size gönderilecektir.'
                            : i18n.language === 'ja'
                            ? 'プレミアムキーを取得するには申請してください。管理者の承認後、キーが送信されます。'
                            : 'Apply for a premium key. After admin approval, the key will be sent to you.'}
                        </Typography>
                      </Box>
                      {pendingRequest ? (
                        <Paper
                          sx={{
                            p: 3,
                            background: alpha('#F59E0B', 0.1),
                            border: `1px solid ${alpha('#F59E0B', 0.3)}`,
                            borderRadius: 2,
                          }}
                        >
                          <Stack spacing={2}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PendingIcon sx={{ color: '#F59E0B' }} />
                              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                                {i18n.language === 'tr' ? 'Bekleyen Başvuru' : i18n.language === 'ja' ? '保留中の申請' : 'Pending Request'}
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
                              {pendingRequest.reason}
                            </Typography>
                            <Chip
                              label={i18n.language === 'tr' ? 'Onay Bekleniyor' : i18n.language === 'ja' ? '承認待ち' : 'Awaiting Approval'}
                              sx={{
                                background: alpha('#F59E0B', 0.2),
                                color: '#F59E0B',
                                fontWeight: 600,
                                alignSelf: 'flex-start',
                              }}
                            />
                          </Stack>
                        </Paper>
                      ) : (
                        <>
                          <TextField
                            fullWidth
                            multiline
                            minRows={4}
                            label={
                              i18n.language === 'tr'
                                ? 'Başvuru Nedeni'
                                : i18n.language === 'ja'
                                ? '申請理由'
                                : 'Request Reason'
                            }
                            value={requestReason}
                            onChange={(e) => setRequestReason(e.target.value)}
                            placeholder={
                              i18n.language === 'tr'
                                ? 'Premium key neden ihtiyacınız olduğunu açıklayın...'
                                : i18n.language === 'ja'
                                ? 'プレミアムキーが必要な理由を説明してください...'
                                : 'Explain why you need a premium key...'
                            }
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                background: alpha('#fff', 0.05),
                                color: 'white',
                                '& fieldset': {
                                  borderColor: alpha('#667eea', 0.3),
                                },
                              },
                            }}
                          />
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              variant="contained"
                              fullWidth
                              onClick={handleRequestSubmit}
                              disabled={loadingRequest}
                              startIcon={<SendIcon />}
                              sx={{
                                py: 1.5,
                                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                fontWeight: 700,
                                fontSize: '1rem',
                              }}
                            >
                              {loadingRequest
                                ? i18n.language === 'tr'
                                  ? 'Gönderiliyor...'
                                  : i18n.language === 'ja'
                                  ? '送信中...'
                                  : 'Sending...'
                                : i18n.language === 'tr'
                                ? 'Başvuru Gönder'
                                : i18n.language === 'ja'
                                ? '申請を送信'
                                : 'Submit Request'}
                            </Button>
                          </motion.div>
                        </>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </FloatingCard>
            </Grid>

            {/* Başvuru Geçmişi */}
            {myRequests.length > 0 && (
              <Grid item xs={12}>
                <FloatingCard delay={0.2}>
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
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 3 }}>
                        {i18n.language === 'tr' ? 'Başvuru Geçmişi' : i18n.language === 'ja' ? '申請履歴' : 'Request History'}
                      </Typography>
                      <Stack spacing={2}>
                        {myRequests.map((req) => (
                          <Paper
                            key={req.id}
                            sx={{
                              p: 3,
                              background: alpha('#fff', 0.05),
                              border: `1px solid ${alpha('#667eea', 0.2)}`,
                              borderRadius: 2,
                            }}
                          >
                            <Stack spacing={2}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                                  {new Date(req.created_at).toLocaleString(i18n.language === 'tr' ? 'tr-TR' : i18n.language === 'ja' ? 'ja-JP' : 'en-US')}
                                </Typography>
                                <Chip
                                  icon={
                                    req.status === 'approved' ? (
                                      <CheckCircleIcon />
                                    ) : req.status === 'rejected' ? (
                                      <CancelIcon />
                                    ) : (
                                      <PendingIcon />
                                    )
                                  }
                                  label={
                                    req.status === 'approved'
                                      ? i18n.language === 'tr'
                                        ? 'Onaylandı'
                                        : i18n.language === 'ja'
                                        ? '承認済み'
                                        : 'Approved'
                                      : req.status === 'rejected'
                                      ? i18n.language === 'tr'
                                        ? 'Reddedildi'
                                        : i18n.language === 'ja'
                                        ? '拒否'
                                        : 'Rejected'
                                      : i18n.language === 'tr'
                                      ? 'Beklemede'
                                      : i18n.language === 'ja'
                                      ? '保留中'
                                      : 'Pending'
                                  }
                                  sx={{
                                    background:
                                      req.status === 'approved'
                                        ? alpha('#10B981', 0.2)
                                        : req.status === 'rejected'
                                        ? alpha('#EF4444', 0.2)
                                        : alpha('#F59E0B', 0.2),
                                    color:
                                      req.status === 'approved'
                                        ? '#10B981'
                                        : req.status === 'rejected'
                                        ? '#EF4444'
                                        : '#F59E0B',
                                    fontWeight: 600,
                                  }}
                                />
                              </Box>
                              <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
                                {req.reason}
                              </Typography>
                              {req.admin_note && (
                                <Box
                                  sx={{
                                    p: 2,
                                    background: alpha('#667eea', 0.1),
                                    borderRadius: 1,
                                    borderLeft: `3px solid #667eea`,
                                  }}
                                >
                                  <Typography variant="caption" sx={{ color: alpha('#fff', 0.6), display: 'block', mb: 0.5 }}>
                                    {i18n.language === 'tr' ? 'Admin Notu:' : i18n.language === 'ja' ? '管理者メモ:' : 'Admin Note:'}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'white' }}>
                                    {req.admin_note}
                                  </Typography>
                                </Box>
                              )}
                            </Stack>
                          </Paper>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </FloatingCard>
              </Grid>
            )}
          </Grid>
        )}

        {activeTab === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
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
                                      {template.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                                      {template.description || i18n.language === 'tr' ? 'Şablon' : i18n.language === 'ja' ? 'テンプレート' : 'Template'}
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
                                {selectedTemplate.fields?.map((field) => (
                                  <TextField
                                    key={field.id}
                                    fullWidth
                                    label={field.label}
                                    required={field.required}
                                    value={inputData[field.key] || ''}
                                    onChange={(event) =>
                                      setInputData((prev) => ({
                                        ...prev,
                                        [field.key]: event.target.value,
                                      }))
                                    }
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        background: alpha('#fff', 0.05),
                                        color: 'white',
                                        '& fieldset': {
                                          borderColor: alpha('#667eea', 0.3),
                                        },
                                      },
                                    }}
                                  />
                                ))}
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
            </Grid>
          </Grid>
        )}

        {activeTab === 2 && isPremium && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FloatingCard delay={0}>
                <DocumentTranslatePanel />
              </FloatingCard>
            </Grid>
          </Grid>
        )}

        {activeTab === 2 && !isPremium && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FloatingCard delay={0}>
                <Card
                  sx={{
                    p: 6,
                    borderRadius: 4,
                    background: alpha('#fff', 0.03),
                    border: `2px solid ${alpha('#F59E0B', 0.3)}`,
                    backdropFilter: 'blur(20px)',
                    textAlign: 'center',
                  }}
                >
                  <KeyIcon sx={{ fontSize: 80, color: '#F59E0B', mb: 3 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 2 }}>
                    {i18n.language === 'tr' 
                      ? '🔒 Premium Key Gerekli' 
                      : i18n.language === 'ja' 
                      ? '🔒 プレミアムキーが必要です' 
                      : '🔒 Premium Key Required'}
                  </Typography>
                  <Typography variant="body1" sx={{ color: alpha('#fff', 0.7), mb: 4 }}>
                    {i18n.language === 'tr' 
                      ? 'Bu özellikleri kullanmak için premium key girmeniz gerekiyor. Lütfen "Premium Key" sekmesine gidin ve key\'inizi girin.' 
                      : i18n.language === 'ja' 
                      ? 'これらの機能を使用するには、プレミアムキーを入力する必要があります。「プレミアムキー」タブに移動してキーを入力してください。' 
                      : 'You need to enter a premium key to use these features. Please go to the "Premium Key" tab and enter your key.'}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => setActiveTab(0)}
                    sx={{
                      px: 4,
                      py: 1.5,
                      background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
                      fontWeight: 700,
                    }}
                  >
                    {i18n.language === 'tr' ? 'Premium Key Sekmesine Git' : i18n.language === 'ja' ? 'プレミアムキータブに移動' : 'Go to Premium Key Tab'}
                  </Button>
                </Card>
              </FloatingCard>
            </Grid>
          </Grid>
        )}

        {activeTab === 3 && isPremium && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FloatingCard delay={0}>
                <BlankPagePanel />
              </FloatingCard>
            </Grid>
          </Grid>
        )}

        {activeTab === 4 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FloatingCard delay={0}>
                <AreaCalculatorPanel />
              </FloatingCard>
            </Grid>
          </Grid>
        )}

        {activeTab === 3 && !isPremium && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FloatingCard delay={0}>
                <Card
                  sx={{
                    p: 6,
                    borderRadius: 4,
                    background: alpha('#fff', 0.03),
                    border: `2px solid ${alpha('#F59E0B', 0.3)}`,
                    backdropFilter: 'blur(20px)',
                    textAlign: 'center',
                  }}
                >
                  <KeyIcon sx={{ fontSize: 80, color: '#F59E0B', mb: 3 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 2 }}>
                    {i18n.language === 'tr' 
                      ? '🔒 Premium Key Gerekli' 
                      : i18n.language === 'ja' 
                      ? '🔒 プレミアムキーが必要です' 
                      : '🔒 Premium Key Required'}
                  </Typography>
                  <Typography variant="body1" sx={{ color: alpha('#fff', 0.7), mb: 4 }}>
                    {i18n.language === 'tr' 
                      ? 'Bu özellikleri kullanmak için premium key girmeniz gerekiyor. Lütfen "Premium Key" sekmesine gidin ve key\'inizi girin.' 
                      : i18n.language === 'ja' 
                      ? 'これらの機能を使用するには、プレミアムキーを入力する必要があります。「プレミアムキー」タブに移動してキーを入力してください。' 
                      : 'You need to enter a premium key to use these features. Please go to the "Premium Key" tab and enter your key.'}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => setActiveTab(0)}
                    sx={{
                      px: 4,
                      py: 1.5,
                      background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
                      fontWeight: 700,
                    }}
                  >
                    {i18n.language === 'tr' ? 'Premium Key Sekmesine Git' : i18n.language === 'ja' ? 'プレミアムキータブに移動' : 'Go to Premium Key Tab'}
                  </Button>
                </Card>
              </FloatingCard>
            </Grid>
          </Grid>
        )}
      </Container>
      <Footer />
    </Box>
  )
}

export default Dashboard
