import { Box, Card, CardContent, Chip, Container, Grid, Stack, Typography, alpha, Button, MenuItem, TextField } from '@mui/material'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import TypewriterText from '../components/common/TypewriterText'
import AnimatedText from '../components/common/AnimatedText'
import { Link as RouterLink } from 'react-router-dom'
import { listTemplates } from '../services/templateService'
import { useSiteStore } from '../store/useSiteStore'

const FloatingCard = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
)

const Templates = () => {
  const { i18n } = useTranslation()
  const [templates, setTemplates] = useState([])
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterTag, setFilterTag] = useState('all')
  const [sort, setSort] = useState('newest')
  const siteSettings = useSiteStore((state) => state.settings)
  const loadSettings = useSiteStore((state) => state.loadSettings)

  useEffect(() => {
    loadSettings()
    listTemplates().then(setTemplates).catch(() => {})
  }, [loadSettings])

  const categories = useMemo(() => {
    const set = new Set()
    templates.forEach((t) => {
      if (t.fields_schema?.category) set.add(t.fields_schema.category)
    })
    return Array.from(set)
  }, [templates])

  const tags = useMemo(() => {
    const set = new Set()
    templates.forEach((t) => {
      (t.fields_schema?.tags || []).forEach((tag) => set.add(tag))
    })
    return Array.from(set)
  }, [templates])

  const filteredTemplates = useMemo(() => {
    let items = [...templates]
    if (filterType !== 'all') {
      items = items.filter((t) => t.template_type === filterType)
    }
    if (filterCategory !== 'all') {
      items = items.filter((t) => t.fields_schema?.category === filterCategory)
    }
    if (filterTag !== 'all') {
      items = items.filter((t) => (t.fields_schema?.tags || []).includes(filterTag))
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      items = items.filter((t) => `${t.name} ${t.description || ''}`.toLowerCase().includes(q))
    }
    if (sort === 'name') {
      items.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    } else if (sort === 'oldest') {
      items.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0))
    } else {
      items.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    }
    return items
  }, [templates, search, filterType, filterCategory, filterTag, sort])

  const inputSx = useMemo(
    () => ({
      '& .MuiOutlinedInput-root': {
        background: alpha('#fff', 0.05),
        color: 'white',
        '& fieldset': { borderColor: alpha('#667eea', 0.3) },
        '&:hover fieldset': { borderColor: alpha('#667eea', 0.5) },
        '&.Mui-focused fieldset': { borderColor: '#667eea' },
      },
      '& .MuiInputLabel-root': { color: alpha('#fff', 0.7) },
    }),
    [],
  )

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%)' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <TypewriterText
            text={
              siteSettings?.site_texts?.templates_title ||
              (i18n.language === 'tr' ? 'XLSX Şablon Kütüphanesi' : i18n.language === 'ja' ? 'XLSXテンプレートライブラリ' : 'XLSX Template Library')
            }
            variant="h3"
            speed={50}
            sx={{
              fontWeight: 800,
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          />
          <AnimatedText
            variant="body1"
            delay={0.3}
            sx={{ color: alpha('#fff', 0.75), maxWidth: 800, mx: 'auto', lineHeight: 1.9 }}
          >
            {siteSettings?.site_texts?.templates_subtitle ||
              (i18n.language === 'tr'
                ? 'Japonya yıkım ve inşaat süreçleri için özel hazırlanmış şablonları inceleyin. Yönetici panelinden yüklenen XLSX dosyaları burada listelenecek.'
                : i18n.language === 'ja'
                ? '日本の解体・建設手続き向けに設計されたテンプレートを確認します。管理パネルでアップロードされたXLSXがここに表示されます。'
                : 'Review templates tailored for Japan demolition and construction paperwork. XLSX files uploaded from the admin panel will appear here.')}
          </AnimatedText>
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3, flexWrap: 'wrap' }}>
            <Chip
              label={`${filteredTemplates.length} ${i18n.language === 'tr' ? 'Şablon' : i18n.language === 'ja' ? 'テンプレート' : 'Templates'}`}
              sx={{ background: alpha('#667eea', 0.25), color: '#fff', fontWeight: 600 }}
            />
            {filterType !== 'all' && (
              <Chip
                label={filterType.toUpperCase()}
                sx={{ background: alpha('#10B981', 0.2), color: '#10B981', fontWeight: 600 }}
              />
            )}
          </Stack>
        </Box>

        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            background: alpha('#fff', 0.03),
            border: `1px solid ${alpha('#667eea', 0.2)}`,
            mb: 4,
            backdropFilter: 'blur(20px)',
          }}
        >
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={i18n.language === 'tr' ? 'Şablon Ara' : i18n.language === 'ja' ? 'テンプレート検索' : 'Search templates'}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={inputSx}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  select
                  fullWidth
                  label={i18n.language === 'tr' ? 'Tür' : i18n.language === 'ja' ? '種類' : 'Type'}
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  sx={inputSx}
                >
                  <MenuItem value="all">{i18n.language === 'tr' ? 'Tümü' : i18n.language === 'ja' ? 'すべて' : 'All'}</MenuItem>
                  <MenuItem value="xlsx">XLSX</MenuItem>
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="blank">Blank</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  select
                  fullWidth
                  label={i18n.language === 'tr' ? 'Kategori' : i18n.language === 'ja' ? 'カテゴリ' : 'Category'}
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  sx={inputSx}
                >
                  <MenuItem value="all">{i18n.language === 'tr' ? 'Tümü' : i18n.language === 'ja' ? 'すべて' : 'All'}</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  select
                  fullWidth
                  label={i18n.language === 'tr' ? 'Etiket' : i18n.language === 'ja' ? 'タグ' : 'Tag'}
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  sx={inputSx}
                >
                  <MenuItem value="all">{i18n.language === 'tr' ? 'Tümü' : i18n.language === 'ja' ? 'すべて' : 'All'}</MenuItem>
                  {tags.map((tag) => (
                    <MenuItem key={tag} value={tag}>
                      {tag}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  select
                  fullWidth
                  label={i18n.language === 'tr' ? 'Sıralama' : i18n.language === 'ja' ? '並び替え' : 'Sort'}
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  sx={inputSx}
                >
                  <MenuItem value="newest">{i18n.language === 'tr' ? 'Yeni → Eski' : i18n.language === 'ja' ? '新しい順' : 'Newest'}</MenuItem>
                  <MenuItem value="oldest">{i18n.language === 'tr' ? 'Eski → Yeni' : i18n.language === 'ja' ? '古い順' : 'Oldest'}</MenuItem>
                  <MenuItem value="name">{i18n.language === 'tr' ? 'İsme Göre' : i18n.language === 'ja' ? '名前順' : 'Name'}</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={4}>
          {templates.length === 0 && (
            <Grid item xs={12}>
              <Card
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: alpha('#fff', 0.03),
                  border: `1px solid ${alpha('#667eea', 0.2)}`,
                  textAlign: 'center',
                    backdropFilter: 'blur(20px)',
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ color: alpha('#fff', 0.7) }}>
                    {siteSettings?.site_texts?.templates_empty ||
                      (i18n.language === 'tr' ? 'Henüz şablon yüklenmedi' : i18n.language === 'ja' ? 'テンプレートがまだありません' : 'No templates yet')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
          {filteredTemplates.map((item, idx) => (
            <Grid item xs={12} md={6} key={item.id}>
              <FloatingCard delay={idx * 0.15}>
                <Card
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: alpha('#fff', 0.03),
                    border: `1px solid ${alpha('#667eea', 0.2)}`,
                    backdropFilter: 'blur(20px)',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#667eea',
                      background: alpha('#667eea', 0.08),
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                        <Chip label={item.template_type?.toUpperCase()} sx={{ background: alpha('#667eea', 0.2), color: '#fff' }} />
                        {item.fields_schema?.category && (
                          <Chip label={item.fields_schema.category} sx={{ background: alpha('#10B981', 0.2), color: '#10B981' }} />
                        )}
                        {item.fields_schema?.tags?.map((tag) => (
                          <Chip key={tag} label={tag} sx={{ background: alpha('#fff', 0.08), color: 'white' }} />
                        ))}
                      </Stack>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body1" sx={{ color: alpha('#fff', 0.7), lineHeight: 1.8 }}>
                        {item.description || (i18n.language === 'tr' ? 'Şablon' : i18n.language === 'ja' ? 'テンプレート' : 'Template')}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </FloatingCard>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Button
            component={RouterLink}
            to="/dashboard"
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 700,
              px: 4,
              py: 1.5,
            }}
          >
            {i18n.language === 'tr' ? 'Şablonları Doldurmaya Başla' : i18n.language === 'ja' ? '入力を開始する' : 'Start Filling'}
          </Button>
        </Box>
      </Container>
      <Footer />
    </Box>
  )
}

export default Templates
