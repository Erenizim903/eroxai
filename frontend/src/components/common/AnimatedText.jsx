import { useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import { motion } from 'framer-motion'

const AnimatedText = ({ 
  children, 
  variant = 'body1', 
  component = 'p',
  delay = 0,
  duration = 0.8,
  once = true,
  className = '',
  sx = {},
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(!once)

  useEffect(() => {
    if (once) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        },
        { threshold: 0.1 }
      )
      const element = document.getElementById(`animated-text-${delay}`)
      if (element) {
        observer.observe(element)
        return () => observer.unobserve(element)
      }
    }
  }, [once, delay])

  return (
    <motion.div
      id={`animated-text-${delay}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible || !once ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration, delay }}
      className={className}
    >
      <Typography variant={variant} component={component} sx={sx} {...props}>
        {children}
      </Typography>
    </motion.div>
  )
}

export default AnimatedText
