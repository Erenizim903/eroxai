import { useState, useRef, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Container,
  IconButton,
  TextField,
  Typography,
  Stack,
  Paper,
  alpha,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import SendIcon from '@mui/icons-material/Send'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import { useTranslation } from 'react-i18next'
import { sendChatMessage } from '../services/chatService'
import { useSnackbar } from 'notistack'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import AnimatedText from '../components/common/AnimatedText'
import TypewriterText from '../components/common/TypewriterText'
import { useAuthStore } from '../store/useAuthStore'
import { useSiteStore } from '../store/useSiteStore'

const FloatingCard = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
)

const AIChat = () => {
  const { t, i18n } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()
  const user = useAuthStore((state) => state.user)
  const siteSettings = useSiteStore((state) => state.settings)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: i18n.language === 'tr'
        ? 'Merhaba! Ben EroxAI Studio AI asistanınız. Size nasıl yardımcı olabilirim?'
        : i18n.language === 'ja'
        ? 'こんにちは！私はEroxAI StudioのAIアシスタントです。どのようにお手伝いできますか？'
        : 'Hello! I am your EroxAI Studio AI assistant. How can I help you?',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [provider, setProvider] = useState(siteSettings?.chat_provider || 'openai')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (siteSettings?.chat_provider) {
      setProvider(siteSettings.chat_provider)
    }
  }, [siteSettings])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await sendChatMessage(userMessage, i18n.language)
      setMessages((prev) => [...prev, { role: 'assistant', content: response.response }])
    } catch (error) {
      enqueueSnackbar(
        i18n.language === 'tr' ? 'Chat bot hatası' : i18n.language === 'ja' ? 'チャットボットエラー' : 'Chat bot error',
        { variant: 'error' }
      )
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            i18n.language === 'tr'
              ? 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.'
              : i18n.language === 'ja'
              ? '申し訳ありませんが、エラーが発生しました。もう一度お試しください。'
              : 'Sorry, an error occurred. Please try again.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const providerOptions = [
    { value: 'openai', label: 'OpenAI' },
    { value: 'deepseek', label: 'DeepSeek' },
    { value: 'blackbox', label: 'Blackbox' },
  ]

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%)' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <FloatingCard delay={0}>
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <SmartToyIcon sx={{ fontSize: 48, color: '#667eea' }} />
              <Box>
                <AnimatedText
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    mb: 1,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {i18n.language === 'tr' ? 'EroxAI Studio AI Sohbet' : i18n.language === 'ja' ? 'EroxAI Studio AIチャット' : 'EroxAI Studio AI Chat'}
                </AnimatedText>
                <AnimatedText
                  variant="body1"
                  sx={{ color: alpha('#fff', 0.7), delay: 0.2 }}
                >
                  {i18n.language === 'tr'
                    ? 'EroxAI Studio yapay zeka asistanı ile sohbet edin'
                    : i18n.language === 'ja'
                    ? 'EroxAI StudioのAIアシスタントとチャットする'
                    : 'Chat with EroxAI Studio AI assistant'}
                </AnimatedText>
              </Box>
            </Stack>
            <FormControl sx={{ minWidth: 200, mb: 2 }}>
              <InputLabel sx={{ color: alpha('#fff', 0.7) }}>
                {i18n.language === 'tr' ? 'AI Provider' : i18n.language === 'ja' ? 'AIプロバイダー' : 'AI Provider'}
              </InputLabel>
              <Select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                label={i18n.language === 'tr' ? 'AI Provider' : i18n.language === 'ja' ? 'AIプロバイダー' : 'AI Provider'}
                sx={{
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
                }}
              >
                {providerOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </FloatingCard>

        <FloatingCard delay={0.1}>
          <Card
            sx={{
              borderRadius: 4,
              background: alpha('#fff', 0.03),
              border: `1px solid ${alpha('#667eea', 0.2)}`,
              backdropFilter: 'blur(20px)',
              height: 'calc(100vh - 300px)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box
                sx={{
                  p: 3,
                  borderBottom: `1px solid ${alpha('#667eea', 0.2)}`,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '16px 16px 0 0',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={2} alignItems="center">
                    <SmartToyIcon sx={{ color: 'white' }} />
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                      {i18n.language === 'tr' ? 'EroxAI Studio AI Asistan' : i18n.language === 'ja' ? 'EroxAI Studio AIアシスタント' : 'EroxAI Studio AI Assistant'}
                    </Typography>
                  </Stack>
                  <Chip
                    label={providerOptions.find((p) => p.value === provider)?.label || 'OpenAI'}
                    sx={{
                      background: alpha('#fff', 0.2),
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </Stack>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <AnimatePresence>
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                    >
                      <Paper
                        sx={{
                          p: 2.5,
                          maxWidth: '80%',
                          alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                          background:
                            msg.role === 'user'
                              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                              : alpha('#fff', 0.1),
                          color: 'white',
                          borderRadius: 3,
                          border:
                            msg.role === 'assistant'
                              ? `1px solid ${alpha('#667eea', 0.3)}`
                              : 'none',
                        }}
                      >
                        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                          {msg.content}
                        </Typography>
                      </Paper>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Paper
                      sx={{
                        p: 2.5,
                        maxWidth: '80%',
                        alignSelf: 'flex-start',
                        background: alpha('#fff', 0.1),
                        color: 'white',
                        borderRadius: 3,
                        border: `1px solid ${alpha('#667eea', 0.3)}`,
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CircularProgress size={16} sx={{ color: '#667eea' }} />
                        <Typography variant="body2">
                          {i18n.language === 'tr' ? 'Yanıt bekleniyor...' : i18n.language === 'ja' ? '応答を待っています...' : 'Waiting for response...'}
                        </Typography>
                      </Stack>
                    </Paper>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </Box>

              <Box
                sx={{
                  p: 3,
                  borderTop: `1px solid ${alpha('#667eea', 0.2)}`,
                }}
              >
                <Stack direction="row" spacing={2}>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder={
                      i18n.language === 'tr'
                        ? 'Mesajınızı yazın...'
                        : i18n.language === 'ja'
                        ? 'メッセージを入力...'
                        : 'Type your message...'
                    }
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: alpha('#fff', 0.05),
                        color: 'white',
                        '& fieldset': {
                          borderColor: alpha('#667eea', 0.3),
                        },
                        '&:hover fieldset': {
                          borderColor: alpha('#667eea', 0.5),
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea',
                        },
                      },
                    }}
                  />
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <IconButton
                      onClick={handleSend}
                      disabled={loading || !input.trim()}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        width: 56,
                        height: 56,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                        },
                        '&:disabled': {
                          background: alpha('#667eea', 0.3),
                        },
                      }}
                    >
                      <SendIcon />
                    </IconButton>
                  </motion.div>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </FloatingCard>
      </Container>
      <Footer />
    </Box>
  )
}

export default AIChat
