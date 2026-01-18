import { useState, useEffect } from 'react'
import { Typography } from '@mui/material'
import { motion } from 'framer-motion'

const TypewriterText = ({ 
  text, 
  speed = 50,
  variant = 'body1',
  component = 'p',
  sx = {},
  ...props 
}) => {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, speed])

  return (
    <Typography variant={variant} component={component} sx={sx} {...props}>
      {displayedText}
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
        >
          |
        </motion.span>
      )}
    </Typography>
  )
}

export default TypewriterText
