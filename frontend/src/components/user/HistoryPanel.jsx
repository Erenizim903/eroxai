import {
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import DownloadIcon from '@mui/icons-material/Download'
import { useAppStore } from '../../store/useAppStore'
import { downloadText } from '../../utils/storage'

const HistoryPanel = () => {
  const history = useAppStore((state) => state.history)
  const clearHistory = useAppStore((state) => state.clearHistory)

  if (!history.length) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography>Henüz işlem geçmişi yok.</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">İşlem Geçmişi</Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteOutlineIcon />}
              onClick={clearHistory}
            >
              Temizle
            </Button>
          </Stack>
          {history.map((item, index) => (
            <Stack key={`${item.createdAt}-${index}`} spacing={1}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2">
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
                >
                  İndir
                </Button>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {item.input}
              </Typography>
              <Typography variant="body2">{item.output}</Typography>
              <Divider />
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default HistoryPanel
