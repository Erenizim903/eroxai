import { useEffect, useState, useRef } from 'react'
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
  Box,
  Chip,
  alpha,
  Divider,
  LinearProgress,
} from '@mui/material'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useSnackbar } from 'notistack'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { useAuthStore } from '../store/useAuthStore'
import { updateProfile } from '../services/profileService'
import { useTranslation } from 'react-i18next'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import BusinessIcon from '@mui/icons-material/Business'
import BadgeIcon from '@mui/icons-material/Badge'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import LanguageIcon from '@mui/icons-material/Language'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import StarIcon from '@mui/icons-material/Star'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

const AnimatedText = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
)

const Profile = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { t, i18n } = useTranslation()
  const user = useAuthStore((state) => state.user)
  const loadMe = useAuthStore((state) => state.loadMe)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const cardRef = useRef(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg'])

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    address: '',
    locale: 'tr',
    avatar: null,
  })

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        company: user.profile?.company || '',
        title: user.profile?.title || '',
        address: user.profile?.address || '',
        locale: user.profile?.locale || i18n.language || 'tr',
        avatar: null,
      })
    }
  }, [user, i18n.language])

  const handleSave = async () => {
    setSaving(true)
    const payload = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        payload.append(key, value)
      }
    })
    try {
      await updateProfile(payload)
      enqueueSnackbar(
        i18n.language === 'tr'
          ? 'Profil başarıyla güncellendi! ✨'
          : i18n.language === 'ja'
          ? 'プロフィールが正常に更新されました！ ✨'
          : 'Profile updated successfully! ✨',
        { variant: 'success' }
      )
      setEditing(false)
      loadMe()
    } catch (error) {
      enqueueSnackbar(
        i18n.language === 'tr'
          ? 'Profil güncellenirken bir hata oluştu'
          : i18n.language === 'ja'
          ? 'プロフィールの更新中にエラーが発生しました'
          : 'Error updating profile',
        { variant: 'error' }
      )
    } finally {
      setSaving(false)
    }
  }

  const usageCount = user?.profile?.usage_count || 0
  const isPremium = user?.profile?.is_premium || false
  const usageLimit = 5

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%)' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Grid container spacing={4}>
          {/* Left Side - Profile Card */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  border: `1px solid ${alpha('#667eea', 0.3)}`,
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                  transformStyle: 'preserve-3d',
                }}
                style={{ rotateX, rotateY }}
              >
                <CardContent>
                  <Stack spacing={3} alignItems="center">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Avatar
                        src={
                          user?.profile?.avatar
                            ? user.profile.avatar.startsWith('/media/')
                              ? user.profile.avatar
                              : user.profile.avatar.startsWith('http')
                              ? user.profile.avatar
                              : `/media/${user.profile.avatar}`
                            : undefined
                        }
                        sx={{
                          width: 120,
                          height: 120,
                          border: `4px solid ${alpha('#667eea', 0.5)}`,
                          boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                          fontSize: '3rem',
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                      >
                        {user?.first_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'U'}
                      </Avatar>
                    </motion.div>
                    <Box sx={{ textAlign: 'center' }}>
                      <motion.div
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 800,
                            mb: 1,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          {user?.first_name && user?.last_name
                            ? `${user.first_name} ${user.last_name}`
                            : user?.username || 'User'}
                        </Typography>
                      </motion.div>
                      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                        {isPremium ? (
                          <Chip
                            icon={<VerifiedUserIcon />}
                            label={i18n.language === 'tr' ? 'Premium Üye' : i18n.language === 'ja' ? 'プレミアムメンバー' : 'Premium Member'}
                            sx={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              fontWeight: 700,
                            }}
                          />
                        ) : (
                          <Chip
                            icon={<StarIcon />}
                            label={i18n.language === 'tr' ? 'Ücretsiz Üye' : i18n.language === 'ja' ? '無料メンバー' : 'Free Member'}
                            sx={{
                              background: alpha('#667eea', 0.2),
                              color: '#667eea',
                              border: `1px solid ${alpha('#667eea', 0.3)}`,
                            }}
                          />
                        )}
                      </Stack>
                    </Box>
                    <Divider sx={{ width: '100%', borderColor: alpha('#667eea', 0.2) }} />
                    <Box sx={{ width: '100%' }}>
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" sx={{ color: alpha('#fff', 0.7), fontWeight: 600 }}>
                            {i18n.language === 'tr'
                              ? 'Kullanım Durumu'
                              : i18n.language === 'ja'
                              ? '使用状況'
                              : 'Usage Status'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#667eea', fontWeight: 700 }}>
                            {usageCount} / {isPremium ? '∞' : usageLimit}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={isPremium ? 100 : Math.min((usageCount / usageLimit) * 100, 100)}
                          sx={{
                            height: 10,
                            borderRadius: 5,
                            background: alpha('#667eea', 0.1),
                            '& .MuiLinearProgress-bar': {
                              background: isPremium
                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                : 'linear-gradient(90deg, #667eea 0%, #10B981 100%)',
                              borderRadius: 5,
                            },
                          }}
                        />
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Right Side - Form */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
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
                <CardContent>
                  <Stack spacing={4}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 800,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {i18n.language === 'tr' ? 'Profil Ayarları' : i18n.language === 'ja' ? 'プロフィール設定' : 'Profile Settings'}
                      </Typography>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        {editing ? (
                          <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                            disabled={saving}
                            sx={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              fontWeight: 700,
                            }}
                          >
                            {saving
                              ? i18n.language === 'tr'
                                ? 'Kaydediliyor...'
                                : i18n.language === 'ja'
                                ? '保存中...'
                                : 'Saving...'
                              : i18n.language === 'tr'
                              ? 'Kaydet'
                              : i18n.language === 'ja'
                              ? '保存'
                              : 'Save'}
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => setEditing(true)}
                            sx={{
                              borderColor: alpha('#667eea', 0.5),
                              color: '#667eea',
                              '&:hover': {
                                borderColor: '#667eea',
                                background: alpha('#667eea', 0.1),
                              },
                            }}
                          >
                            {i18n.language === 'tr' ? 'Düzenle' : i18n.language === 'ja' ? '編集' : 'Edit'}
                          </Button>
                        )}
                      </motion.div>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <AnimatedText delay={0.1}>
                          <TextField
                            fullWidth
                            label={i18n.language === 'tr' ? 'İsim' : i18n.language === 'ja' ? '名' : 'First Name'}
                            value={form.first_name}
                            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                            disabled={!editing}
                            InputProps={{
                              startAdornment: <PersonIcon sx={{ mr: 1, color: '#667eea' }} />,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                background: alpha('#fff', 0.05),
                                '& fieldset': {
                                  borderColor: alpha('#667eea', 0.3),
                                },
                              },
                            }}
                          />
                        </AnimatedText>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <AnimatedText delay={0.15}>
                          <TextField
                            fullWidth
                            label={i18n.language === 'tr' ? 'Soyisim' : i18n.language === 'ja' ? '姓' : 'Last Name'}
                            value={form.last_name}
                            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                            disabled={!editing}
                            InputProps={{
                              startAdornment: <PersonIcon sx={{ mr: 1, color: '#667eea' }} />,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                background: alpha('#fff', 0.05),
                                '& fieldset': {
                                  borderColor: alpha('#667eea', 0.3),
                                },
                              },
                            }}
                          />
                        </AnimatedText>
                      </Grid>
                      <Grid item xs={12}>
                        <AnimatedText delay={0.2}>
                          <TextField
                            fullWidth
                            label={i18n.language === 'tr' ? 'E-posta' : i18n.language === 'ja' ? 'メール' : 'Email'}
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            disabled={!editing}
                            InputProps={{
                              startAdornment: <EmailIcon sx={{ mr: 1, color: '#667eea' }} />,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                background: alpha('#fff', 0.05),
                                '& fieldset': {
                                  borderColor: alpha('#667eea', 0.3),
                                },
                              },
                            }}
                          />
                        </AnimatedText>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <AnimatedText delay={0.25}>
                          <TextField
                            fullWidth
                            label={i18n.language === 'tr' ? 'Telefon' : i18n.language === 'ja' ? '電話' : 'Phone'}
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            disabled={!editing}
                            InputProps={{
                              startAdornment: <PhoneIcon sx={{ mr: 1, color: '#667eea' }} />,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                background: alpha('#fff', 0.05),
                                '& fieldset': {
                                  borderColor: alpha('#667eea', 0.3),
                                },
                              },
                            }}
                          />
                        </AnimatedText>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <AnimatedText delay={0.3}>
                          <TextField
                            fullWidth
                            label={i18n.language === 'tr' ? 'Şirket' : i18n.language === 'ja' ? '会社' : 'Company'}
                            value={form.company}
                            onChange={(e) => setForm({ ...form, company: e.target.value })}
                            disabled={!editing}
                            InputProps={{
                              startAdornment: <BusinessIcon sx={{ mr: 1, color: '#667eea' }} />,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                background: alpha('#fff', 0.05),
                                '& fieldset': {
                                  borderColor: alpha('#667eea', 0.3),
                                },
                              },
                            }}
                          />
                        </AnimatedText>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <AnimatedText delay={0.35}>
                          <TextField
                            fullWidth
                            label={i18n.language === 'tr' ? 'Ünvan' : i18n.language === 'ja' ? '役職' : 'Title'}
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            disabled={!editing}
                            InputProps={{
                              startAdornment: <BadgeIcon sx={{ mr: 1, color: '#667eea' }} />,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                background: alpha('#fff', 0.05),
                                '& fieldset': {
                                  borderColor: alpha('#667eea', 0.3),
                                },
                              },
                            }}
                          />
                        </AnimatedText>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <AnimatedText delay={0.4}>
                          <TextField
                            fullWidth
                            select
                            label={i18n.language === 'tr' ? 'Dil' : i18n.language === 'ja' ? '言語' : 'Language'}
                            value={form.locale}
                            onChange={(e) => setForm({ ...form, locale: e.target.value })}
                            disabled={!editing}
                            SelectProps={{ native: true }}
                            InputProps={{
                              startAdornment: <LanguageIcon sx={{ mr: 1, color: '#667eea' }} />,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                background: alpha('#fff', 0.05),
                                '& fieldset': {
                                  borderColor: alpha('#667eea', 0.3),
                                },
                              },
                            }}
                          >
                            <option value="tr">Türkçe</option>
                            <option value="en">English</option>
                            <option value="ja">日本語</option>
                          </TextField>
                        </AnimatedText>
                      </Grid>
                      <Grid item xs={12}>
                        <AnimatedText delay={0.45}>
                          <TextField
                            fullWidth
                            label={i18n.language === 'tr' ? 'Adres' : i18n.language === 'ja' ? '住所' : 'Address'}
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                            multiline
                            minRows={3}
                            disabled={!editing}
                            InputProps={{
                              startAdornment: <LocationOnIcon sx={{ mr: 1, color: '#667eea', alignSelf: 'flex-start', mt: 1 }} />,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                background: alpha('#fff', 0.05),
                                '& fieldset': {
                                  borderColor: alpha('#667eea', 0.3),
                                },
                              },
                            }}
                          />
                        </AnimatedText>
                      </Grid>
                      <Grid item xs={12}>
                        <AnimatedText delay={0.5}>
                          <Box
                            sx={{
                              p: 3,
                              borderRadius: 2,
                              border: `2px dashed ${alpha('#667eea', 0.3)}`,
                              background: alpha('#667eea', 0.05),
                              textAlign: 'center',
                              cursor: editing ? 'pointer' : 'default',
                              transition: 'all 0.3s ease',
                              '&:hover': editing
                                ? {
                                    borderColor: '#667eea',
                                    background: alpha('#667eea', 0.1),
                                  }
                                : {},
                            }}
                          >
                            <CloudUploadIcon sx={{ fontSize: 48, color: '#667eea', mb: 1 }} />
                            <Typography variant="body1" sx={{ color: alpha('#fff', 0.7), mb: 2 }}>
                              {i18n.language === 'tr'
                                ? 'Profil Fotoğrafı Yükle'
                                : i18n.language === 'ja'
                                ? 'プロフィール写真をアップロード'
                                : 'Upload Profile Picture'}
                            </Typography>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={!editing}
                              onChange={(e) => setForm({ ...form, avatar: e.target.files?.[0] || null })}
                              style={{ display: 'none' }}
                              id="avatar-upload"
                            />
                            <label htmlFor="avatar-upload">
                              <Button
                                component="span"
                                variant="outlined"
                                disabled={!editing}
                                sx={{
                                  borderColor: alpha('#667eea', 0.5),
                                  color: '#667eea',
                                }}
                              >
                                {i18n.language === 'tr' ? 'Dosya Seç' : i18n.language === 'ja' ? 'ファイルを選択' : 'Choose File'}
                              </Button>
                            </label>
                            {form.avatar && (
                              <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#10B981' }}>
                                {form.avatar.name}
                              </Typography>
                            )}
                          </Box>
                        </AnimatedText>
                      </Grid>
                    </Grid>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  )
}

export default Profile
