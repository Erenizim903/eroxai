import { useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import { motion } from 'framer-motion'

const AnimatedCounter = ({ value, duration = 2, delay = 0, variant = 'h3', sx = {}, ...props }) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      let startTime = null
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
        setDisplayValue(Math.round(value * progress))
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }, delay * 1000)
    return () => clearTimeout(timer)
  }, [value, duration, delay])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <Typography variant={variant} sx={sx} {...props}>
        {displayValue}
      </Typography>
    </motion.div>
  )
}

export default AnimatedCounter
