import {
  Button,
  Card,
  CardContent,
  Divider,
  Paper,
  Stack,
  Typography,
  alpha,
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import DownloadIcon from '@mui/icons-material/Download'
import HistoryIcon from '@mui/icons-material/History'
import { useAppStore } from '../../store/useAppStore'
import { downloadText } from '../../utils/storage'

const HistoryPanel = () => {
  const history = useAppStore((state) => state.history)
  const clearHistory = useAppStore((state) => state.clearHistory)

  if (!history.length) {
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
          <Stack spacing={2} alignItems="center">
            <HistoryIcon sx={{ fontSize: 42, color: '#667eea' }} />
            <Typography sx={{ color: alpha('#fff', 0.8) }}>Henüz işlem geçmişi yok.</Typography>
          </Stack>
        </CardContent>
      </Card>
    )
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
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" gap={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <HistoryIcon sx={{ fontSize: 36, color: '#667eea' }} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                İşlem Geçmişi
              </Typography>
            </Stack>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteOutlineIcon />}
              onClick={clearHistory}
              sx={{
                borderColor: alpha('#EF4444', 0.5),
                color: '#EF4444',
                '&:hover': { borderColor: '#EF4444', background: alpha('#EF4444', 0.1) },
              }}
            >
              Temizle
            </Button>
          </Stack>
          {history.map((item, index) => (
            <Paper
              key={`${item.createdAt}-${index}`}
              sx={{
                p: 3,
                background: alpha('#667eea', 0.08),
                border: `1px solid ${alpha('#667eea', 0.2)}`,
                borderRadius: 3,
              }}
            >
              <Stack spacing={1}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" gap={1}>
                  <Typography variant="subtitle2" sx={{ color: alpha('#fff', 0.8) }}>
                    {item.type} · {new Date(item.createdAt).toLocaleString()}
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={() =>
                      downloadText(
                        `${item.type.toLowerCase()}-${index + 1}.txt`,
                        `${item.input}\n\n${item.output}`,
                      )
                    }
                    sx={{
                      borderColor: alpha('#667eea', 0.5),
                      color: 'white',
                      '&:hover': { borderColor: '#667eea', background: alpha('#667eea', 0.1) },
                    }}
                  >
                    İndir
                  </Button>
                </Stack>
                <Typography variant="body2" sx={{ color: alpha('#fff', 0.6) }}>
                  {item.input}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  {item.output}
                </Typography>
              </Stack>
            </Paper>
          ))}
          <Divider sx={{ borderColor: alpha('#667eea', 0.2) }} />
        </Stack>
      </CardContent>
    </Card>
  )
}

export default HistoryPanel
