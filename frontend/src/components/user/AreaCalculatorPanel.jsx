import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  Typography,
  Paper,
  alpha,
  IconButton,
  Tooltip,
} from '@mui/material'
import { motion } from 'framer-motion'
import CalculateIcon from '@mui/icons-material/Calculate'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { useTranslation } from 'react-i18next'
import { useSnackbar } from 'notistack'

const AreaCalculatorPanel = () => {
  const { t, i18n } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()
  
  // 1 tatami = 1.65 m² = 0.5 subo (坪)
  // 1 subo = 3.30579 m² = 2 tatami
  const TATAMI_TO_M2 = 1.65
  const SUBO_TO_M2 = 3.30579
  const TATAMI_TO_SUBO = 0.5
  
  const [inputValue, setInputValue] = useState('')
  const [fromUnit, setFromUnit] = useState('m2')
  const [results, setResults] = useState(null)

  const handleCalculate = () => {
    const value = parseFloat(inputValue)
    if (isNaN(value) || value <= 0) {
      enqueueSnackbar(
        i18n.language === 'tr' 
          ? 'Lütfen geçerli bir sayı girin' 
          : i18n.language === 'ja' 
          ? '有効な数値を入力してください' 
          : 'Please enter a valid number',
        { variant: 'warning' }
      )
      return
    }

    let m2, subo, tatami

    switch (fromUnit) {
      case 'm2':
        m2 = value
        subo = value / SUBO_TO_M2
        tatami = value / TATAMI_TO_M2
        break
      case 'subo':
        subo = value
        m2 = value * SUBO_TO_M2
        tatami = (m2 / TATAMI_TO_M2)
        break
      case 'tatami':
        tatami = value
        m2 = value * TATAMI_TO_M2
        subo = m2 / SUBO_TO_M2
        break
      default:
        return
    }

    setResults({
      m2: m2.toFixed(4),
      subo: subo.toFixed(4),
      tatami: tatami.toFixed(2),
    })
  }

  const handleCopy = (value, unit) => {
    navigator.clipboard.writeText(`${value} ${unit}`)
    enqueueSnackbar(
      i18n.language === 'tr' 
        ? 'Kopyalandı!' 
        : i18n.language === 'ja' 
        ? 'コピーされました！' 
        : 'Copied!',
      { variant: 'success' }
    )
  }

  const handleSwap = () => {
    if (fromUnit === 'm2') {
      setFromUnit('subo')
    } else if (fromUnit === 'subo') {
      setFromUnit('tatami')
    } else {
      setFromUnit('m2')
    }
    setResults(null)
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
        <Stack spacing={4}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <CalculateIcon sx={{ fontSize: 40, color: '#667eea' }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                {i18n.language === 'tr' 
                  ? 'Subo / Metre / Tatami Hesaplama' 
                  : i18n.language === 'ja' 
                  ? '坪 / メートル / 畳 計算' 
                  : 'Subo / Square Meter / Tatami Calculator'}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: alpha('#fff', 0.7), mb: 4 }}>
              {i18n.language === 'tr' 
                ? 'Japon inşaat ölçü birimleri arasında dönüşüm yapın: Metrekare (m²), Subo (坪), Tatami (畳)' 
                : i18n.language === 'ja' 
                ? '日本の建設測定単位間で変換：平方メートル（m²）、坪（つぼ）、畳（たたみ）' 
                : 'Convert between Japanese construction area units: Square Meters (m²), Subo (坪), Tatami (畳)'}
            </Typography>
          </Box>

          <Paper
            sx={{
              p: 4,
              background: alpha('#667eea', 0.1),
              border: `1px solid ${alpha('#667eea', 0.3)}`,
              borderRadius: 3,
            }}
          >
            <Stack spacing={3}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    type="number"
                    label={i18n.language === 'tr' 
                      ? 'Değer Girin' 
                      : i18n.language === 'ja' 
                      ? '値を入力' 
                      : 'Enter Value'}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value)
                      setResults(null)
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleCalculate()
                      }
                    }}
                    InputProps={{
                      sx: {
                        background: alpha('#fff', 0.05),
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha('#667eea', 0.3),
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha('#667eea', 0.5),
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea',
                        },
                      },
                    }}
                    InputLabelProps={{
                      sx: { color: alpha('#fff', 0.7) },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    fullWidth
                    label={i18n.language === 'tr' 
                      ? 'Birim' 
                      : i18n.language === 'ja' 
                      ? '単位' 
                      : 'Unit'}
                    value={fromUnit}
                    onChange={(e) => {
                      setFromUnit(e.target.value)
                      setResults(null)
                    }}
                    SelectProps={{
                      native: true,
                    }}
                    InputProps={{
                      sx: {
                        background: alpha('#fff', 0.05),
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha('#667eea', 0.3),
                        },
                      },
                    }}
                    InputLabelProps={{
                      sx: { color: alpha('#fff', 0.7) },
                    }}
                  >
                    <option value="m2">m² (Metrekare)</option>
                    <option value="subo">坪 (Subo)</option>
                    <option value="tatami">畳 (Tatami)</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Stack direction="row" spacing={1}>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={handleCalculate}
                        sx={{
                          py: 1.5,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          fontWeight: 700,
                        }}
                      >
                        {i18n.language === 'tr' ? 'Hesapla' : i18n.language === 'ja' ? '計算' : 'Calculate'}
                      </Button>
                    </motion.div>
                    <Tooltip title={i18n.language === 'tr' ? 'Birim Değiştir' : i18n.language === 'ja' ? '単位を変更' : 'Swap Unit'}>
                      <IconButton
                        onClick={handleSwap}
                        sx={{
                          background: alpha('#667eea', 0.2),
                          color: '#667eea',
                          border: `1px solid ${alpha('#667eea', 0.3)}`,
                          '&:hover': {
                            background: alpha('#667eea', 0.3),
                          },
                        }}
                      >
                        <SwapHorizIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Grid>
              </Grid>

              {results && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Paper
                    sx={{
                      p: 3,
                      background: alpha('#10B981', 0.1),
                      border: `1px solid ${alpha('#10B981', 0.3)}`,
                      borderRadius: 3,
                    }}
                  >
                    <Typography variant="h6" sx={{ color: '#10B981', mb: 3, fontWeight: 700 }}>
                      {i18n.language === 'tr' 
                        ? 'Hesaplama Sonuçları' 
                        : i18n.language === 'ja' 
                        ? '計算結果' 
                        : 'Calculation Results'}
                    </Typography>
                    <Grid container spacing={2}>
                      {[
                        { label: 'm²', value: results.m2, unit: 'm² (Metrekare)' },
                        { label: '坪', value: results.subo, unit: '坪 (Subo)' },
                        { label: '畳', value: results.tatami, unit: '畳 (Tatami)' },
                      ].map((item, idx) => (
                        <Grid item xs={12} sm={4} key={idx}>
                          <Paper
                            sx={{
                              p: 2.5,
                              background: alpha('#fff', 0.05),
                              border: `1px solid ${alpha('#667eea', 0.2)}`,
                              borderRadius: 2,
                              position: 'relative',
                            }}
                          >
                            <Stack spacing={1}>
                              <Typography variant="body2" sx={{ color: alpha('#fff', 0.7), fontWeight: 600 }}>
                                {item.unit}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                                  {item.value}
                                </Typography>
                                <IconButton
                                  size="small"
                                  onClick={() => handleCopy(item.value, item.label)}
                                  sx={{
                                    color: alpha('#fff', 0.7),
                                    '&:hover': {
                                      color: '#667eea',
                                      background: alpha('#667eea', 0.1),
                                    },
                                  }}
                                >
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Stack>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </motion.div>
              )}

              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  background: alpha('#667eea', 0.05),
                  borderRadius: 2,
                  border: `1px solid ${alpha('#667eea', 0.2)}`,
                }}
              >
                <Typography variant="caption" sx={{ color: alpha('#fff', 0.6), lineHeight: 1.8 }}>
                  <strong>{i18n.language === 'tr' ? 'Birim Dönüşüm Formülleri:' : i18n.language === 'ja' ? '単位変換式：' : 'Unit Conversion Formulas:'}</strong><br />
                  • 1 坪 (Subo) = 3.30579 m² = 2 畳 (Tatami)<br />
                  • 1 畳 (Tatami) = 1.65 m² = 0.5 坪 (Subo)<br />
                  • 1 m² = 0.3025 坪 (Subo) = 0.606 畳 (Tatami)
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default AreaCalculatorPanel
