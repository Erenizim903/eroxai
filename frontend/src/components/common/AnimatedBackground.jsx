import { Box } from '@mui/material'
import { motion } from 'framer-motion'

const blobStyles = (size, color, top, left) => ({
  position: 'absolute',
  width: size,
  height: size,
  background: color,
  opacity: 0.35,
  filter: 'blur(40px)',
  borderRadius: '50%',
  top,
  left,
})

const AnimatedBackground = () => (
  <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
    <motion.div
      style={blobStyles('320px', '#5B8CFF', '10%', '5%')}
      animate={{ y: [0, 30, -10, 0], x: [0, -10, 20, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      style={blobStyles('260px', '#FF8F5B', '60%', '70%')}
      animate={{ y: [0, -20, 15, 0], x: [0, 20, -10, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      style={blobStyles('240px', '#30C48D', '40%', '45%')}
      animate={{ y: [0, 25, -15, 0], x: [0, -15, 10, 0] }}
      transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
    />
  </Box>
)

export default AnimatedBackground
