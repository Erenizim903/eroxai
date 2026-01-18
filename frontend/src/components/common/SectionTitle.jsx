import { Stack, Typography } from '@mui/material'

const SectionTitle = ({ kicker, title, subtitle }) => (
  <Stack spacing={1} sx={{ mb: 4 }}>
    {kicker && (
      <Typography variant="overline" color="primary">
        {kicker}
      </Typography>
    )}
    <Typography variant="h3">{title}</Typography>
    {subtitle && (
      <Typography variant="body1" color="text.secondary">
        {subtitle}
      </Typography>
    )}
  </Stack>
)

export default SectionTitle
