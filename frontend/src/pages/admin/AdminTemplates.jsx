import { Box, Button, Card, CardContent, Divider, Grid, MenuItem, Stack, TextField, Typography, alpha, Chip } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { listTemplates, createTemplate } from '../../services/templateService'
import { addTemplateField, deleteTemplateField, deleteTemplate, updateTemplateField } from '../../services/adminService'
import TypewriterText from '../../components/common/TypewriterText'

const AdminTemplates = () => {
  const [templates, setTemplates] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fieldDraft, setFieldDraft] = useState({ key: '', label: '', field_type: 'text', required: false, options: '', order: 0 })
  const [fieldOptionsDrafts, setFieldOptionsDrafts] = useState({})
  const [templateDraft, setTemplateDraft] = useState({
    name: '',
    description: '',
    template_type: 'xlsx',
    output_language: 'ja',
    file: null,
    category: '',
    tags: '',
  })
  const [fieldI18nDrafts, setFieldI18nDrafts] = useState({})

  const selectedTemplate = useMemo(() => templates.find((t) => t.id === selectedId), [templates, selectedId])
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

  const loadTemplates = async () => {
    const data = await listTemplates()
    setTemplates(data)
    if (!selectedId && data.length > 0) {
      setSelectedId(data[0].id)
    }
  }

  useEffect(() => {
    loadTemplates().catch(() => {})
  }, [])

  const handleCreateTemplate = async () => {
    if (!templateDraft.name.trim()) return
    const payload = new FormData()
    payload.append('name', templateDraft.name)
    payload.append('description', templateDraft.description)
    payload.append('template_type', templateDraft.template_type)
    payload.append('output_language', templateDraft.output_language)
    payload.append(
      'fields_schema',
      JSON.stringify({
        category: templateDraft.category || '',
        tags: templateDraft.tags.split(',').map((t) => t.trim()).filter(Boolean),
      })
    )
    if (templateDraft.file) {
      payload.append('file', templateDraft.file)
    }
    setLoading(true)
    try {
      await createTemplate(payload)
      setTemplateDraft({
        name: '',
        description: '',
        template_type: 'xlsx',
        output_language: 'ja',
        file: null,
        category: '',
        tags: '',
      })
      await loadTemplates()
    } finally {
      setLoading(false)
    }
  }

  const handleAddField = async () => {
    if (!selectedTemplate || !fieldDraft.key.trim() || !fieldDraft.label.trim()) return
    const payload = {
      key: fieldDraft.key,
      label: fieldDraft.label,
      field_type: fieldDraft.field_type,
      required: fieldDraft.required,
      order: Number(fieldDraft.order) || 0,
      mapping: fieldDraft.field_type === 'select'
        ? { options: fieldDraft.options.split(',').map((o) => o.trim()).filter(Boolean) }
        : {},
    }
    await addTemplateField(selectedTemplate.id, payload)
    setFieldDraft({ key: '', label: '', field_type: 'text', required: false, options: '', order: 0 })
    await loadTemplates()
  }

  const handleDeleteTemplate = async (templateId) => {
    await deleteTemplate(templateId)
    await loadTemplates()
  }

  return (
    <Box>
      <TypewriterText
        text="Şablon Yönetimi"
        variant="h4"
        speed={40}
        sx={{
          fontWeight: 800,
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      />
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, borderRadius: 3, background: alpha('#fff', 0.03), border: `1px solid ${alpha('#667eea', 0.2)}`, backdropFilter: 'blur(18px)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                Yeni Şablon Yükle
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Şablon Adı"
                  value={templateDraft.name}
                  onChange={(e) => setTemplateDraft((prev) => ({ ...prev, name: e.target.value }))}
                  fullWidth
                  sx={inputSx}
                />
                <TextField
                  label="Açıklama"
                  value={templateDraft.description}
                  onChange={(e) => setTemplateDraft((prev) => ({ ...prev, description: e.target.value }))}
                  fullWidth
                  sx={inputSx}
                />
                <TextField
                  label="Tür"
                  select
                  value={templateDraft.template_type}
                  onChange={(e) => setTemplateDraft((prev) => ({ ...prev, template_type: e.target.value }))}
                  fullWidth
                  helperText="XLSX, PDF, PNG, JPG formatları desteklenir."
                  sx={inputSx}
                >
                  <MenuItem value="xlsx">XLSX</MenuItem>
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="png">PNG</MenuItem>
                  <MenuItem value="jpg">JPG</MenuItem>
                </TextField>
                <TextField
                  label="Çıktı Dili"
                  value={templateDraft.output_language}
                  onChange={(e) => setTemplateDraft((prev) => ({ ...prev, output_language: e.target.value }))}
                  fullWidth
                  sx={inputSx}
                />
                <TextField
                  label="Kategori"
                  value={templateDraft.category}
                  onChange={(e) => setTemplateDraft((prev) => ({ ...prev, category: e.target.value }))}
                  fullWidth
                  sx={inputSx}
                />
                <TextField
                  label="Etiketler (virgülle)"
                  value={templateDraft.tags}
                  onChange={(e) => setTemplateDraft((prev) => ({ ...prev, tags: e.target.value }))}
                  fullWidth
                  sx={inputSx}
                />
                <Button variant="outlined" component="label">
                  Dosya Seç (XLSX/PDF/PNG/JPG)
                  <input
                    type="file"
                    accept=".xlsx,.pdf,.png,.jpg,.jpeg"
                    hidden
                    onChange={(e) => setTemplateDraft((prev) => ({ ...prev, file: e.target.files?.[0] || null }))}
                  />
                </Button>
                {templateDraft.file && (
                  <Typography variant="caption" sx={{ color: alpha('#fff', 0.7) }}>
                    Seçilen dosya: {templateDraft.file.name}
                  </Typography>
                )}
                <Button variant="contained" onClick={handleCreateTemplate} disabled={loading}>
                  Şablonu Kaydet
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, borderRadius: 3, background: alpha('#fff', 0.03), border: `1px solid ${alpha('#667eea', 0.2)}`, backdropFilter: 'blur(18px)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                Şablonlar
              </Typography>
              <Grid container spacing={2}>
                {templates.map((template) => (
                  <Grid item xs={12} md={6} key={template.id}>
                    <Card
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: alpha('#fff', 0.04),
                        border: selectedId === template.id ? `2px solid #667eea` : `1px solid ${alpha('#667eea', 0.15)}`,
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedId(template.id)}
                    >
                      <Stack spacing={1.5}>
                        <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700 }}>
                          {template.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                          {template.description || 'Şablon'}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip label={template.template_type.toUpperCase()} size="small" />
                          <Button size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(template.id) }}>
                            Sil
                          </Button>
                        </Stack>
                      </Stack>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              {selectedTemplate && (
                <>
                  <Divider sx={{ my: 3, borderColor: alpha('#667eea', 0.2) }} />
                  <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                    Alanlar: {selectedTemplate.name}
                  </Typography>
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '60px 1.4fr 1fr 120px' },
                        gap: 1,
                        px: 2,
                        py: 1.5,
                        borderRadius: 2,
                        background: alpha('#667eea', 0.15),
                        border: `1px solid ${alpha('#667eea', 0.2)}`,
                      }}
                    >
                      <Typography variant="caption" sx={{ color: alpha('#fff', 0.8), fontWeight: 700 }}>
                        #
                      </Typography>
                      <Typography variant="caption" sx={{ color: alpha('#fff', 0.8), fontWeight: 700 }}>
                        Alan
                      </Typography>
                      <Typography variant="caption" sx={{ color: alpha('#fff', 0.8), fontWeight: 700 }}>
                        Tip
                      </Typography>
                      <Typography variant="caption" sx={{ color: alpha('#fff', 0.8), fontWeight: 700 }}>
                        Sıra
                      </Typography>
                    </Box>
                      {selectedTemplate.fields
                        ?.slice()
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((field, index) => (
                          <Card key={field.id} sx={{ p: 2, borderRadius: 2, background: alpha('#fff', 0.04), border: `1px solid ${alpha('#667eea', 0.15)}` }}>
                            <Stack spacing={2}>
                              <Box
                                sx={{
                                  display: 'grid',
                                  gridTemplateColumns: { xs: '1fr', md: '60px 1.4fr 1fr 120px' },
                                  gap: 1,
                                  alignItems: 'center',
                                }}
                              >
                                <Typography variant="body2" sx={{ color: alpha('#fff', 0.6) }}>
                                  {index + 1}
                                </Typography>
                                <Stack spacing={0.5}>
                                  <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                                    {field.label}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: alpha('#fff', 0.6) }}>
                                    {field.key}
                                  </Typography>
                                </Stack>
                                <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
                                  {field.field_type}
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                                  <TextField
                                    size="small"
                                    label="Sıra"
                                    value={fieldI18nDrafts[field.id]?.order ?? field.order ?? 0}
                                    onChange={(e) =>
                                      setFieldI18nDrafts((prev) => ({
                                        ...prev,
                                        [field.id]: { ...prev[field.id], order: e.target.value },
                                      }))
                                    }
                                    sx={inputSx}
                                  />
                                  <Button size="small" color="error" onClick={() => deleteTemplateField(selectedTemplate.id, field.id).then(loadTemplates)}>
                                    Sil
                                  </Button>
                                </Stack>
                              </Box>
                              {(field.field_type === 'select' || field.mapping?.labels || field.mapping?.descriptions) && (
                                <Stack spacing={2}>
                                  <TextField
                                    size="small"
                                    label="Seçenekler (virgülle)"
                                    value={fieldOptionsDrafts[field.id] ?? (field.mapping?.options || []).join(', ')}
                                    onChange={(e) =>
                                      setFieldOptionsDrafts((prev) => ({ ...prev, [field.id]: e.target.value }))
                                    }
                                    sx={inputSx}
                                  />
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                      <TextField
                                        size="small"
                                        label="Etiket (TR)"
                                        value={fieldI18nDrafts[field.id]?.label_tr ?? field.mapping?.labels?.tr ?? ''}
                                        onChange={(e) =>
                                          setFieldI18nDrafts((prev) => ({
                                            ...prev,
                                            [field.id]: { ...prev[field.id], label_tr: e.target.value },
                                          }))
                                        }
                                        sx={inputSx}
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                      <TextField
                                        size="small"
                                        label="Etiket (EN)"
                                        value={fieldI18nDrafts[field.id]?.label_en ?? field.mapping?.labels?.en ?? ''}
                                        onChange={(e) =>
                                          setFieldI18nDrafts((prev) => ({
                                            ...prev,
                                            [field.id]: { ...prev[field.id], label_en: e.target.value },
                                          }))
                                        }
                                        sx={inputSx}
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                      <TextField
                                        size="small"
                                        label="Etiket (JA)"
                                        value={fieldI18nDrafts[field.id]?.label_ja ?? field.mapping?.labels?.ja ?? ''}
                                        onChange={(e) =>
                                          setFieldI18nDrafts((prev) => ({
                                            ...prev,
                                            [field.id]: { ...prev[field.id], label_ja: e.target.value },
                                          }))
                                        }
                                        sx={inputSx}
                                      />
                                    </Grid>
                                  </Grid>
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                      <TextField
                                        size="small"
                                        label="Açıklama (TR)"
                                        value={fieldI18nDrafts[field.id]?.desc_tr ?? field.mapping?.descriptions?.tr ?? ''}
                                        onChange={(e) =>
                                          setFieldI18nDrafts((prev) => ({
                                            ...prev,
                                            [field.id]: { ...prev[field.id], desc_tr: e.target.value },
                                          }))
                                        }
                                        sx={inputSx}
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                      <TextField
                                        size="small"
                                        label="Açıklama (EN)"
                                        value={fieldI18nDrafts[field.id]?.desc_en ?? field.mapping?.descriptions?.en ?? ''}
                                        onChange={(e) =>
                                          setFieldI18nDrafts((prev) => ({
                                            ...prev,
                                            [field.id]: { ...prev[field.id], desc_en: e.target.value },
                                          }))
                                        }
                                        sx={inputSx}
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                      <TextField
                                        size="small"
                                        label="Açıklama (JA)"
                                        value={fieldI18nDrafts[field.id]?.desc_ja ?? field.mapping?.descriptions?.ja ?? ''}
                                        onChange={(e) =>
                                          setFieldI18nDrafts((prev) => ({
                                            ...prev,
                                            [field.id]: { ...prev[field.id], desc_ja: e.target.value },
                                          }))
                                        }
                                        sx={inputSx}
                                      />
                                    </Grid>
                                  </Grid>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() =>
                                      updateTemplateField(selectedTemplate.id, field.id, {
                                        order: Number(fieldI18nDrafts[field.id]?.order ?? field.order ?? 0),
                                        mapping: {
                                          ...(field.mapping || {}),
                                          options: (fieldOptionsDrafts[field.id] || '')
                                            .split(',')
                                            .map((o) => o.trim())
                                            .filter(Boolean),
                                          labels: {
                                            tr: fieldI18nDrafts[field.id]?.label_tr ?? field.mapping?.labels?.tr ?? '',
                                            en: fieldI18nDrafts[field.id]?.label_en ?? field.mapping?.labels?.en ?? '',
                                            ja: fieldI18nDrafts[field.id]?.label_ja ?? field.mapping?.labels?.ja ?? '',
                                          },
                                          descriptions: {
                                            tr: fieldI18nDrafts[field.id]?.desc_tr ?? field.mapping?.descriptions?.tr ?? '',
                                            en: fieldI18nDrafts[field.id]?.desc_en ?? field.mapping?.descriptions?.en ?? '',
                                            ja: fieldI18nDrafts[field.id]?.desc_ja ?? field.mapping?.descriptions?.ja ?? '',
                                          },
                                        },
                                      }).then(loadTemplates)
                                    }
                                    sx={{
                                      borderColor: alpha('#667eea', 0.5),
                                      color: 'white',
                                      '&:hover': { borderColor: '#667eea', background: alpha('#667eea', 0.1) },
                                    }}
                                  >
                                    Alan Ayarlarını Kaydet
                                  </Button>
                                </Stack>
                              )}
                            </Stack>
                          </Card>
                        ))}
                  </Stack>
                  <Divider sx={{ my: 3, borderColor: alpha('#667eea', 0.2) }} />
                  <Stack spacing={2}>
                    <TextField
                      label="Alan Anahtarı"
                      value={fieldDraft.key}
                      onChange={(e) => setFieldDraft((prev) => ({ ...prev, key: e.target.value }))}
                      sx={inputSx}
                    />
                    <TextField
                      label="Alan Etiketi"
                      value={fieldDraft.label}
                      onChange={(e) => setFieldDraft((prev) => ({ ...prev, label: e.target.value }))}
                      sx={inputSx}
                    />
                    <TextField
                      select
                      label="Alan Tipi"
                      value={fieldDraft.field_type}
                      onChange={(e) => setFieldDraft((prev) => ({ ...prev, field_type: e.target.value }))}
                      sx={inputSx}
                    >
                      <MenuItem value="text">Text</MenuItem>
                      <MenuItem value="date">Date</MenuItem>
                      <MenuItem value="number">Number</MenuItem>
                      <MenuItem value="select">Select</MenuItem>
                    </TextField>
                    {fieldDraft.field_type === 'select' && (
                      <TextField
                        label="Seçenekler (virgülle)"
                        value={fieldDraft.options}
                        onChange={(e) => setFieldDraft((prev) => ({ ...prev, options: e.target.value }))}
                        sx={inputSx}
                      />
                    )}
                    <TextField
                      label="Sıra"
                      value={fieldDraft.order}
                      onChange={(e) => setFieldDraft((prev) => ({ ...prev, order: e.target.value }))}
                      sx={inputSx}
                    />
                    <TextField
                      select
                      label="Zorunlu"
                      value={fieldDraft.required ? 'true' : 'false'}
                      onChange={(e) => setFieldDraft((prev) => ({ ...prev, required: e.target.value === 'true' }))}
                      sx={inputSx}
                    >
                      <MenuItem value="false">Hayır</MenuItem>
                      <MenuItem value="true">Evet</MenuItem>
                    </TextField>
                    <Button
                      variant="contained"
                      onClick={handleAddField}
                      sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontWeight: 700 }}
                    >
                      Alan Ekle
                    </Button>
                  </Stack>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminTemplates
