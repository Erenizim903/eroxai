import { useState, useRef, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography,
  Stack,
  Paper,
  alpha,
  Fab,
  Slide,
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import SendIcon from '@mui/icons-material/Send'
import CloseIcon from '@mui/icons-material/Close'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import { useTranslation } from 'react-i18next'
import { sendChatMessage } from '../../services/chatService'
import { useSnackbar } from 'notistack'

const ChatBot = () => {
  const { t, i18n } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: i18n.language === 'tr' 
        ? 'Merhaba! EroxAI Document Studio hakkında size nasıl yardımcı olabilirim?'
        : i18n.language === 'ja'
        ? 'こんにちは！EroxAI Document Studioについて、どのようにお手伝いできますか？'
        : 'Hello! How can I help you with EroxAI Document Studio?',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
      enqueueSnackbar('Chat bot hatası', { variant: 'error' })
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: i18n.language === 'tr'
            ? 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.'
            : 'Sorry, an error occurred. Please try again.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease',
        }}
        onClick={() => setOpen(!open)}
      >
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {open ? <CloseIcon /> : <SmartToyIcon />}
        </motion.div>
      </Fab>

      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Card
          sx={{
            position: 'fixed',
            bottom: 90,
            right: 24,
            width: { xs: 'calc(100% - 48px)', sm: 400 },
            height: 600,
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            background: alpha('#1a1a2e', 0.95),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha('#667eea', 0.3)}`,
            borderRadius: 4,
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box
              sx={{
                p: 2,
                borderBottom: `1px solid ${alpha('#667eea', 0.2)}`,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '4px 4px 0 0',
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <SmartToyIcon sx={{ color: 'white' }} />
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  AI Asistan
                </Typography>
              </Stack>
            </Box>

            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Paper
                      sx={{
                        p: 2,
                        maxWidth: '80%',
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        background:
                          msg.role === 'user'
                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            : alpha('#fff', 0.1),
                        color: msg.role === 'user' ? 'white' : 'white',
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                        {msg.content}
                      </Typography>
                    </Paper>
                  </motion.div>
                ))}
              </AnimatePresence>
              {loading && (
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: '80%',
                    alignSelf: 'flex-start',
                    background: alpha('#fff', 0.1),
                    color: 'white',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2">...</Typography>
                </Paper>
              )}
              <div ref={messagesEndRef} />
            </Box>

            <Box
              sx={{
                p: 2,
                borderTop: `1px solid ${alpha('#667eea', 0.2)}`,
              }}
            >
              <Stack direction="row" spacing={1}>
                <TextField
                  fullWidth
                  size="small"
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
                    },
                  }}
                />
                <IconButton
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
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
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Slide>
    </>
  )
}

export default ChatBot
