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
} from '@mui/material'
import { useSnackbar } from 'notistack'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { useAuthStore } from '../store/useAuthStore'
import { redeemPremiumKey } from '../services/authService'
import { listTemplates, fillTemplate } from '../services/templateService'
import DocumentTranslatePanel from '../components/user/DocumentTranslatePanel'
import BlankPagePanel from '../components/user/BlankPagePanel'

const Dashboard = () => {
  const { enqueueSnackbar } = useSnackbar()
  const user = useAuthStore((state) => state.user)
  const loadMe = useAuthStore((state) => state.loadMe)
  const [premiumKey, setPremiumKey] = useState('')
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [inputData, setInputData] = useState({})

  useEffect(() => {
    loadMe()
    listTemplates().then(setTemplates)
  }, [loadMe])

  const handleRedeem = async () => {
    try {
      await redeemPremiumKey(premiumKey)
      enqueueSnackbar('Premium aktif edildi', { variant: 'success' })
      setPremiumKey('')
      loadMe()
    } catch (error) {
      enqueueSnackbar('Premium key geçersiz', { variant: 'error' })
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
      enqueueSnackbar('Çıktı hazır', { variant: 'success' })
      if (result.output_file) {
        const url = result.output_file.startsWith('http')
          ? result.output_file
          : `${window.location.origin}${result.output_file}`
        window.open(url, '_blank')
      }
    } catch (error) {
      enqueueSnackbar('Şablon doldurma hatası', { variant: 'error' })
    }
  }

  return (
    <Box>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Kullanıcı Paneli
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {user
            ? `${user.username} · ${user.email} · ${
                user.profile?.is_premium
                  ? 'Premium'
                  : `Ücretsiz kullanım: ${user.profile?.usage_count || 0}/5`
              }`
            : 'Yükleniyor...'}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6">Premium Key</Typography>
                  <TextField
                    label="Key"
                    value={premiumKey}
                    onChange={(event) => setPremiumKey(event.target.value)}
                  />
                  <Button variant="contained" onClick={handleRedeem}>
                    Key Kullan
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6">Şablonlar</Typography>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={2}>
                  <Grid container spacing={2}>
                    {templates.map((template) => (
                      <Grid item xs={12} md={6} key={template.id}>
                        <Card variant="outlined" sx={{ p: 2 }}>
                          <Stack spacing={1}>
                            <Typography fontWeight={600}>{template.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {template.description || 'Şablon'}
                            </Typography>
                            <Button variant="outlined" onClick={() => handleSelect(template)}>
                              Seç
                            </Button>
                          </Stack>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  {selectedTemplate && (
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6">
                          {selectedTemplate.name} · Doldur
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Stack spacing={2}>
                          {selectedTemplate.fields?.map((field) => (
                            <TextField
                              key={field.id}
                              label={field.label}
                              required={field.required}
                              value={inputData[field.key] || ''}
                              onChange={(event) =>
                                setInputData((prev) => ({
                                  ...prev,
                                  [field.key]: event.target.value,
                                }))
                              }
                            />
                          ))}
                          <Button variant="contained" onClick={handleFill}>
                            Doldur ve İndir
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <DocumentTranslatePanel />
          </Grid>
          <Grid item xs={12} md={6}>
            <BlankPagePanel />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  )
}

export default Dashboard
