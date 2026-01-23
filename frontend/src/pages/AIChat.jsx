import { useState, useRef, useEffect } from 'react'
import {
  Box,
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
  Avatar,
  Tooltip,
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import SendIcon from '@mui/icons-material/Send'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import PersonIcon from '@mui/icons-material/Person'
import StopIcon from '@mui/icons-material/Stop'
import RefreshIcon from '@mui/icons-material/Refresh'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useTranslation } from 'react-i18next'
import { sendChatMessage } from '../services/chatService'
import { useSnackbar } from 'notistack'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import TypewriterText from '../components/common/TypewriterText'
import { useAuthStore } from '../store/useAuthStore'
import { useSiteStore } from '../store/useSiteStore'

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
  const inputRef = useRef(null)

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

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus()
  }, [])

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
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleClear = () => {
    setMessages([
      {
        role: 'assistant',
        content: i18n.language === 'tr'
          ? 'Merhaba! Ben EroxAI Studio AI asistanınız. Size nasıl yardımcı olabilirim?'
          : i18n.language === 'ja'
          ? 'こんにちは！私はEroxAI StudioのAIアシスタントです。どのようにお手伝いできますか？'
          : 'Hello! I am your EroxAI Studio AI assistant. How can I help you?',
      },
    ])
  }

  const providerOptions = [
    { value: 'openai', label: 'OpenAI', icon: '🤖' },
    { value: 'deepseek', label: 'DeepSeek', icon: '🧠' },
    { value: 'blackbox', label: 'Blackbox', icon: '⚡' },
  ]

  const isPremium = user?.profile?.is_premium || false

  if (!isPremium) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%)' }}>
        <Navbar />
        <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SmartToyIcon sx={{ fontSize: 80, color: '#667eea', mb: 3 }} />
            <TypewriterText
              text={i18n.language === 'tr' ? 'Premium Üyelik Gerekli' : i18n.language === 'ja' ? 'プレミアムメンバーシップが必要' : 'Premium Membership Required'}
              variant="h3"
              speed={60}
              sx={{
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            />
            <Typography variant="h6" sx={{ color: alpha('#fff', 0.7), mb: 4, maxWidth: 600, mx: 'auto' }}>
              {i18n.language === 'tr'
                ? 'AI Chat özelliğini kullanmak için premium üyelik gereklidir.'
                : i18n.language === 'ja'
                ? 'AIチャット機能を使用するにはプレミアム会員が必要です。'
                : 'Premium membership is required to use AI Chat.'}
            </Typography>
          </motion.div>
        </Container>
        <Footer />
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '100%', mx: 'auto', width: '100%' }}>

        {/* Messages Area - ChatGPT Style */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            px: { xs: 2, md: 0 },
            py: { xs: 3, md: 4 },
            background: '#0f0f0f',
          }}
        >
          <Container maxWidth="md">
            <Stack spacing={4}>
              <AnimatePresence mode="popLayout">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <Stack
                      direction="row"
                      spacing={3}
                      sx={{
                        alignItems: 'flex-start',
                        '&:hover .message-actions': {
                          opacity: 1,
                        },
                      }}
                    >
                      {/* Avatar */}
                      <Avatar
                        sx={{
                          width: { xs: 32, md: 40 },
                          height: { xs: 32, md: 40 },
                          background:
                            msg.role === 'user'
                              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                              : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                          flexShrink: 0,
                        }}
                      >
                        {msg.role === 'user' ? <PersonIcon /> : <SmartToyIcon />}
                      </Avatar>

                      {/* Message Content */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{ mb: 0.5, position: 'relative' }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                              color: msg.role === 'user' ? '#667eea' : '#10B981',
                              fontSize: { xs: '0.7rem', md: '0.75rem' },
                            }}
                          >
                            {msg.role === 'user' ? (user?.username || 'You') : 'EroxAI Studio'}
                          </Typography>
                          <Box
                            className="message-actions"
                            sx={{
                              opacity: { xs: 1, md: 0 },
                              transition: 'opacity 0.2s',
                              ml: 'auto',
                            }}
                          >
                            <IconButton size="small" sx={{ color: alpha('#fff', 0.5), p: 0.5 }}>
                              <MoreVertIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                        </Stack>
                        <Paper
                          elevation={0}
                          sx={{
                            p: { xs: 2, md: 2.5 },
                            background: msg.role === 'user' ? alpha('#667eea', 0.1) : alpha('#fff', 0.03),
                            border: `1px solid ${alpha(msg.role === 'user' ? '#667eea' : '#10B981', 0.2)}`,
                            borderRadius: 2,
                            color: 'white',
                            wordBreak: 'break-word',
                            '& pre': {
                              background: alpha('#000', 0.3),
                              padding: 2,
                              borderRadius: 1,
                              overflow: 'auto',
                              fontSize: '0.875rem',
                            },
                            '& code': {
                              background: alpha('#000', 0.3),
                              padding: '0.2em 0.4em',
                              borderRadius: 0.5,
                              fontSize: '0.875rem',
                            },
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              lineHeight: 1.8,
                              fontSize: { xs: '0.9rem', md: '1rem' },
                              whiteSpace: 'pre-wrap',
                              '& p': {
                                margin: '0.5em 0',
                                '&:first-of-type': { marginTop: 0 },
                                '&:last-of-type': { marginBottom: 0 },
                              },
                            }}
                          >
                            {msg.content}
                          </Typography>
                        </Paper>
                      </Box>
                    </Stack>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Loading Indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Stack direction="row" spacing={3}>
                    <Avatar
                      sx={{
                        width: { xs: 32, md: 40 },
                        height: { xs: 32, md: 40 },
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        flexShrink: 0,
                      }}
                    >
                      <SmartToyIcon />
                    </Avatar>
                    <Box sx={{ flex: 1, pt: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CircularProgress size={16} sx={{ color: '#10B981' }} />
                        <Typography variant="caption" sx={{ color: alpha('#fff', 0.6) }}>
                          {i18n.language === 'tr' ? 'Yazıyor...' : i18n.language === 'ja' ? '入力中...' : 'Typing...'}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </Stack>
          </Container>
        </Box>

        {/* Input Area - ChatGPT Style */}
        <Box
          sx={{
            borderTop: `1px solid ${alpha('#fff', 0.1)}`,
            background: alpha('#1a1a1a', 0.8),
            backdropFilter: 'blur(20px)',
            py: 3,
            px: { xs: 2, md: 0 },
          }}
        >
          <Container maxWidth="md">
            <Paper
              elevation={0}
              sx={{
                p: { xs: 1.5, md: 2 },
                background: alpha('#fff', 0.05),
                border: `1px solid ${alpha('#667eea', 0.2)}`,
                borderRadius: 3,
                display: 'flex',
                alignItems: 'flex-end',
                gap: 1,
                transition: 'all 0.3s ease',
                '&:focus-within': {
                  borderColor: '#667eea',
                  boxShadow: `0 0 0 2px ${alpha('#667eea', 0.2)}`,
                },
              }}
            >
              <TextField
                inputRef={inputRef}
                fullWidth
                multiline
                maxRows={6}
                placeholder={
                  i18n.language === 'tr'
                    ? 'Mesajınızı yazın...'
                    : i18n.language === 'ja'
                    ? 'メッセージを入力...'
                    : 'Type your message...'
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !loading) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'transparent',
                    color: 'white',
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    '& fieldset': {
                      border: 'none',
                    },
                    '&:hover fieldset': {
                      border: 'none',
                    },
                    '&.Mui-focused fieldset': {
                      border: 'none',
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: alpha('#fff', 0.4),
                    opacity: 1,
                  },
                }}
              />
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  sx={{
                    background: input.trim() ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : alpha('#667eea', 0.2),
                    color: 'white',
                    width: { xs: 36, md: 40 },
                    height: { xs: 36, md: 40 },
                    flexShrink: 0,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: input.trim() ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)' : alpha('#667eea', 0.3),
                      transform: 'scale(1.1)',
                    },
                    '&:disabled': {
                      background: alpha('#667eea', 0.1),
                      color: alpha('#fff', 0.3),
                    },
                  }}
                >
                  {loading ? <StopIcon sx={{ fontSize: { xs: 18, md: 20 } }} /> : <SendIcon sx={{ fontSize: { xs: 18, md: 20 } }} />}
                </IconButton>
              </motion.div>
            </Paper>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'center',
                mt: 2,
                color: alpha('#fff', 0.4),
                fontSize: { xs: '0.7rem', md: '0.75rem' },
              }}
            >
              {i18n.language === 'tr'
                ? 'EroxAI Studio yanıtları hata içerebilir. Önemli bilgileri doğrulayın.'
                : i18n.language === 'ja'
                ? 'EroxAI Studioの回答には誤りが含まれる可能性があります。重要な情報を確認してください。'
                : 'EroxAI Studio may produce inaccurate information. Verify important information.'}
            </Typography>
          </Container>
        </Box>
      </Box>
      <Footer />
    </Box>
  )
}

export default AIChat
