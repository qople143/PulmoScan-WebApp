import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const CLASS_COLORS = {
  'COVID-19':    '#f87171',
  'Normal':      '#34d399',
  'Pneumonia':   '#fbbf24',
  'Tuberculosis':'#a78bfa',
}

const s = {
  page: {
    minHeight: '100vh', paddingTop: '64px',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  hero: {
    textAlign: 'center', padding: '5rem 2rem 3rem',
    maxWidth: '680px',
  },
  eyebrow: {
    fontFamily: 'var(--mono)', fontSize: '0.7rem', letterSpacing: '0.2em',
    textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1.25rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
  },
  dot: {
    width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)',
    display: 'inline-block', animation: 'pulse 2s infinite',
  },
  h1: {
    fontFamily: 'var(--display)', fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
    fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em',
    marginBottom: '1.25rem', color: '#f1f5f9',
  },
  sub: {
    fontFamily: 'var(--sans)', fontSize: '1rem', color: 'var(--dim)',
    lineHeight: 1.7, maxWidth: '480px', margin: '0 auto',
  },
  uploadZone: {
    width: '100%', maxWidth: '600px', margin: '0 auto 3rem',
    padding: '0 1.5rem',
  },
  dropzone: (dragging) => ({
    border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border)'}`,
    borderRadius: 'var(--radius)',
    background: dragging ? 'rgba(56,189,248,0.04)' : 'var(--bg2)',
    padding: '3rem 2rem',
    textAlign: 'center', cursor: 'pointer',
    transition: 'all 0.2s',
    position: 'relative', overflow: 'hidden',
  }),
  preview: {
    width: '100%', maxWidth: '600px', margin: '0 auto 2rem',
    padding: '0 1.5rem',
  },
  previewImg: {
    width: '100%', borderRadius: 'var(--radius)',
    border: '1px solid var(--border)', display: 'block',
    maxHeight: '320px', objectFit: 'contain',
    background: '#000',
  },
  btn: {
    fontFamily: 'var(--mono)', fontSize: '0.8rem', letterSpacing: '0.1em',
    textTransform: 'uppercase', padding: '0.85rem 2.5rem',
    background: 'var(--accent)', color: '#080c10',
    border: 'none', borderRadius: '6px', cursor: 'pointer',
    fontWeight: 600, transition: 'opacity 0.2s', display: 'block',
    margin: '0 auto',
  },
  results: {
    width: '100%', maxWidth: '600px', margin: '0 auto 4rem',
    padding: '0 1.5rem',
  },
  card: {
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '2rem',
  },
  resultLabel: {
    fontFamily: 'var(--mono)', fontSize: '0.65rem', letterSpacing: '0.15em',
    textTransform: 'uppercase', color: 'var(--dim)', marginBottom: '0.5rem',
  },
  resultClass: (color) => ({
    fontFamily: 'var(--display)', fontSize: '2rem', fontWeight: 800,
    color, marginBottom: '0.25rem', letterSpacing: '-0.02em',
  }),
  confidence: {
    fontFamily: 'var(--mono)', fontSize: '0.85rem', color: 'var(--dim)',
    marginBottom: '2rem',
  },
  barRow: {
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    marginBottom: '0.75rem',
  },
  barLabel: {
    fontFamily: 'var(--mono)', fontSize: '0.7rem', width: '110px',
    flexShrink: 0, color: 'var(--text-dim)',
  },
  barTrack: {
    flex: 1, height: '6px', background: 'rgba(255,255,255,0.06)',
    borderRadius: '3px', overflow: 'hidden',
  },
  barPct: {
    fontFamily: 'var(--mono)', fontSize: '0.7rem',
    color: 'var(--dim)', width: '42px', textAlign: 'right', flexShrink: 0,
  },
  disclaimer: {
    fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-dim)',
    lineHeight: 1.6, marginTop: '1.5rem', padding: '1rem',
    background: 'rgba(248,113,113,0.05)', borderRadius: '6px',
    border: '1px solid rgba(248,113,113,0.12)',
  },
  error: {
    fontFamily: 'var(--mono)', fontSize: '0.8rem', color: '#f87171',
    textAlign: 'center', padding: '1rem', marginBottom: '1rem',
  },
}

export default function Home() {
  const [file, setFile]         = useState(null)
  const [preview, setPreview]   = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState(null)
  const [error, setError]       = useState(null)
  const inputRef = useRef()

  const handleFile = (f) => {
    if (!f) return
    setFile(f)
    setResult(null)
    setError(null)
    setPreview(URL.createObjectURL(f))
  }

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }, [])

  const onDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)

  const analyse = async () => {
    if (!file) return
    setLoading(true); setError(null); setResult(null)
    const form = new FormData()
    form.append('file', file)
    try {
      const res  = await fetch(`${API}/predict`, { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Prediction failed')
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => { setFile(null); setPreview(null); setResult(null); setError(null) }

  const color = result ? CLASS_COLORS[result.predicted_class] || 'var(--accent)' : 'var(--accent)'

  return (
    <main style={s.page}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>

      {/* Hero */}
      <section style={s.hero}>
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
          <div style={s.eyebrow}>
            <span style={s.dot} />
            Deep Learning · Chest X-Ray Analysis
          </div>
          <h1 style={s.h1}>Pulmonary Disease<br />Detection</h1>
          <p style={s.sub}>
            Upload a chest X-ray to classify COVID-19, Pneumonia, Tuberculosis, or Normal
            using a convolutional neural network trained on 6,300+ clinical images.
          </p>
        </motion.div>
      </section>

      {/* Upload */}
      {!preview && (
        <motion.div style={s.uploadZone} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}>
          <div
            style={s.dropzone(dragging)}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => inputRef.current.click()}
          >
            <div style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>⬡</div>
            <p style={{ fontFamily:'var(--display)', fontSize:'1.1rem', fontWeight:700, marginBottom:'0.4rem' }}>
              Drop chest X-ray here
            </p>
            <p style={{ fontFamily:'var(--mono)', fontSize:'0.7rem', color:'var(--dim)', letterSpacing:'0.05em' }}>
              or click to browse · JPEG, PNG, BMP
            </p>
            <input ref={inputRef} type="file" accept="image/*" style={{ display:'none' }}
              onChange={e => handleFile(e.target.files[0])} />
          </div>
        </motion.div>
      )}

      {/* Preview + Analyse */}
      <AnimatePresence>
        {preview && !result && (
          <motion.div style={s.preview} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
            <img src={preview} alt="X-ray preview" style={s.previewImg} />
            <div style={{ height:'1.25rem' }} />
            {error && <p style={s.error}>{error}</p>}
            <button style={s.btn} onClick={analyse} disabled={loading}>
              {loading
                ? <span style={{ display:'inline-block', animation:'spin 1s linear infinite' }}>◌</span>
                : '→ Analyse Image'
              }
            </button>
            <div style={{ height:'0.75rem' }} />
            <button onClick={reset} style={{ ...s.btn, background:'transparent', color:'var(--dim)', border:'1px solid var(--border)' }}>
              Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div style={s.results} initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
            {preview && (
              <img src={preview} alt="X-ray" style={{ ...s.previewImg, marginBottom:'1.5rem' }} />
            )}
            <div style={{ ...s.card, borderColor: `${color}33` }}>
              <p style={s.resultLabel}>Diagnosis</p>
              <p style={s.resultClass(color)}>{result.predicted_class}</p>
              <p style={s.confidence}>
                Confidence: <span style={{ color: 'var(--text)' }}>{(result.confidence * 100).toFixed(1)}%</span>
              </p>

              <p style={{ ...s.resultLabel, marginBottom:'1rem' }}>All Class Probabilities</p>
              {Object.entries(result.probabilities)
                .sort((a, b) => b[1] - a[1])
                .map(([cls, prob]) => (
                  <div key={cls} style={s.barRow}>
                    <span style={{ ...s.barLabel, color: cls === result.predicted_class ? CLASS_COLORS[cls] : 'var(--dim)' }}>
                      {cls}
                    </span>
                    <div style={s.barTrack}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${prob * 100}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        style={{ height:'100%', background: CLASS_COLORS[cls] || 'var(--accent)', borderRadius:'3px' }}
                      />
                    </div>
                    <span style={s.barPct}>{(prob * 100).toFixed(1)}%</span>
                  </div>
                ))}

              <p style={s.disclaimer}>
                ⚠ For research purposes only. Not a substitute for professional medical diagnosis.
                Always consult a qualified radiologist or physician.
              </p>
            </div>
            <div style={{ height:'1.25rem' }} />
            <button style={s.btn} onClick={reset}>Analyse Another</button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}