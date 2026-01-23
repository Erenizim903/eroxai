import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Card, CardContent, Chip, Divider, Paper, Stack, TextField, Typography, alpha } from '@mui/material'
import KeyIcon from '@mui/icons-material/VpnKey'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import { motion } from 'framer-motion'
import { useSnackbar } from 'notistack'
import { redeemPremiumKey } from '../../services/authService'
import { createPremiumRequest, getMyPremiumRequests } from '../../services/premiumRequestService'
import { useAuthStore } from '../../store/useAuthStore'

const PremiumKeyPanel = () => {
  const { enqueueSnackbar } = useSnackbar()
  const user = useAuthStore((state) => state.user)
  const loadMe = useAuthStore((state) => state.loadMe)
  const [activationCode, setActivationCode] = useState('')
  const [requestReason, setRequestReason] = useState('')
  const [isActivating, setIsActivating] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)
  const [requests, setRequests] = useState([])
  const isPremium = user?.profile?.is_premium || false

  const inputSx = useMemo(
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

  const latestRequest = useMemo(() => {
    if (!requests.length) return null
    return [...requests].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))[0]
  }, [requests])

  const getRedeemedKey = () => {
    if (!user) return null
    return `eroxai-key-redeemed-${user.id || user.username}`
  }
  const redeemedKey = getRedeemedKey()
  const isRedeemed = redeemedKey ? localStorage.getItem(redeemedKey) === '1' : false

  useEffect(() => {
    if (!user) return
    getMyPremiumRequests()
      .then(setRequests)
      .catch(() => {})
  }, [user])

  const handleActivate = async () => {
    if (!activationCode.trim()) {
      enqueueSnackbar('Aktivasyon kodu boş olamaz', { variant: 'warning' })
      return
    }
    setIsActivating(true)
    try {
      await redeemPremiumKey(activationCode.trim())
      enqueueSnackbar('Premium aktivasyon başarılı', { variant: 'success' })
      const redeemedKey = getRedeemedKey()
      if (redeemedKey) {
        localStorage.setItem(redeemedKey, '1')
      }
      await loadMe()
    } catch (error) {
      enqueueSnackbar('Aktivasyon kodu geçersiz', { variant: 'error' })
    } finally {
      setIsActivating(false)
    }
  }

  const handleRequest = async () => {
    if (!requestReason.trim()) {
      enqueueSnackbar('Başvuru nedeni boş olamaz', { variant: 'warning' })
      return
    }
    setIsRequesting(true)
    try {
      await createPremiumRequest(requestReason.trim())
      enqueueSnackbar('Başvuru gönderildi', { variant: 'success' })
      setRequestReason('')
      const updated = await getMyPremiumRequests()
      setRequests(updated)
    } catch (error) {
      enqueueSnackbar('Başvuru gönderilemedi', { variant: 'error' })
    } finally {
      setIsRequesting(false)
    }
  }

  return (
    <Card
      sx={{
        borderRadius: 4,
        background: alpha('#fff', 0.03),
        border: `1px solid ${alpha('#667eea', 0.2)}`,
        backdropFilter: 'blur(20px)',
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <WorkspacePremiumIcon sx={{ fontSize: 38, color: '#667eea' }} />
            </motion.div>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                Premium Key Yönetimi
              </Typography>
              <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                Premium anahtarını aktive et veya başvuru oluştur.
              </Typography>
            </Box>
          </Stack>

          <Paper
            sx={{
              p: 3,
              background: alpha('#667eea', 0.1),
              border: `1px solid ${alpha('#667eea', 0.3)}`,
              borderRadius: 3,
            }}
          >
            <Stack spacing={2}>
              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                Premium Key Aktivasyonu
              </Typography>
              {isPremium || isRedeemed ? (
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    background: alpha('#10B981', 0.12),
                    border: `1px solid ${alpha('#10B981', 0.3)}`,
                  }}
                >
                  <Stack spacing={1}>
                    <Typography variant="body1" sx={{ color: '#10B981', fontWeight: 700 }}>
                      Üyeliğiniz aktiftir ✅
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                      Premium özelliklere erişiminiz bulunmaktadır.
                    </Typography>
                  </Stack>
                </Box>
              ) : (
                <>
                  <TextField
                    fullWidth
                    label="Aktivasyon Kodu"
                    placeholder="XXXX-XXXX-XXXX"
                    value={activationCode}
                    onChange={(event) => setActivationCode(event.target.value)}
                    sx={inputSx}
                  />
                  <Button
                    variant="contained"
                    startIcon={<KeyIcon />}
                    onClick={handleActivate}
                    disabled={isActivating}
                    sx={{
                      alignSelf: 'flex-start',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      fontWeight: 700,
                    }}
                  >
                    Key’i Aktif Et
                  </Button>
                </>
              )}
            </Stack>
          </Paper>

          <Divider sx={{ borderColor: alpha('#667eea', 0.2) }} />

          <Paper
            sx={{
              p: 3,
              background: alpha('#0f172a', 0.6),
              border: `1px solid ${alpha('#667eea', 0.2)}`,
              borderRadius: 3,
            }}
          >
            <Stack spacing={2}>
              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                Premium Key Başvurusu
              </Typography>
              <TextField
                fullWidth
                label="Başvuru Nedeni"
                value={requestReason}
                onChange={(event) => setRequestReason(event.target.value)}
                multiline
                minRows={3}
                sx={inputSx}
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                <Button
                  variant="outlined"
                  onClick={handleRequest}
                  disabled={isRequesting}
                  sx={{
                    borderColor: alpha('#667eea', 0.5),
                    color: 'white',
                    '&:hover': { borderColor: '#667eea', background: alpha('#667eea', 0.1) },
                  }}
                >
                  Başvuru Gönder
                </Button>
                {latestRequest && (
                  <Chip
                    label={`Durum: ${latestRequest.status || 'pending'}`}
                    sx={{
                      background: alpha('#10B981', 0.2),
                      color: '#10B981',
                      fontWeight: 600,
                    }}
                  />
                )}
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default PremiumKeyPanel
