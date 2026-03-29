import { motion } from 'framer-motion'

const s = {
  page: { minHeight:'100vh', paddingTop:'64px' },
  wrap: { maxWidth:'720px', margin:'0 auto', padding:'5rem 2rem 4rem' },
  eyebrow: {
    fontFamily:'var(--mono)', fontSize:'0.65rem', letterSpacing:'0.2em',
    textTransform:'uppercase', color:'var(--accent)', marginBottom:'1.25rem',
  },
  h1: {
    fontFamily:'var(--display)', fontSize:'clamp(2rem,4vw,3rem)',
    fontWeight:800, letterSpacing:'-0.03em', marginBottom:'1.5rem', color:'#f1f5f9',
  },
  body: { color:'var(--dim)', lineHeight:1.8, marginBottom:'1.25rem', fontSize:'0.95rem' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem', margin:'2.5rem 0' },
  statCard: {
    background:'var(--bg2)', border:'1px solid var(--border)',
    borderRadius:'var(--radius)', padding:'1.5rem',
  },
  statNum: {
    fontFamily:'var(--display)', fontSize:'2.25rem', fontWeight:800,
    color:'var(--accent)', letterSpacing:'-0.03em', lineHeight:1,
  },
  statLabel: {
    fontFamily:'var(--mono)', fontSize:'0.65rem', letterSpacing:'0.12em',
    textTransform:'uppercase', color:'var(--dim)', marginTop:'0.4rem',
  },
  h2: {
    fontFamily:'var(--display)', fontSize:'1.4rem', fontWeight:700,
    letterSpacing:'-0.02em', marginBottom:'1rem', marginTop:'2.5rem', color:'#f1f5f9',
  },
  classRow: {
    display:'flex', alignItems:'center', gap:'1rem', padding:'0.85rem 0',
    borderBottom:'1px solid var(--border)',
  },
  dot: (color) => ({
    width:10, height:10, borderRadius:'50%', background:color, flexShrink:0,
  }),
  classLabel: { fontFamily:'var(--mono)', fontSize:'0.8rem', color:'var(--text)', flex:1 },
  classDesc: { fontSize:'0.85rem', color:'var(--dim)' },
  pill: {
    display:'inline-flex', fontFamily:'var(--mono)', fontSize:'0.65rem',
    letterSpacing:'0.1em', padding:'0.3rem 0.75rem',
    background:'rgba(56,189,248,0.08)', border:'1px solid rgba(56,189,248,0.2)',
    borderRadius:'999px', color:'var(--accent)', margin:'0.25rem',
  },
}

const CLASSES = [
  ['#f87171', 'COVID-19',      'Viral pneumonia caused by SARS-CoV-2, showing bilateral ground-glass opacities.'],
  ['#34d399', 'Normal',        'Healthy chest X-ray with clear lung fields and no visible pathology.'],
  ['#fbbf24', 'Pneumonia',     'Bacterial or viral infection causing consolidation, typically unilateral.'],
  ['#a78bfa', 'Tuberculosis',  'Mycobacterial infection often presenting with upper-lobe infiltrates or cavitation.'],
]

const STACK = ['TensorFlow 2.16','Keras','FastAPI','React 18','Framer Motion','Vite','Render','Vercel']

const fade = (i) => ({
  initial:{ opacity:0, y:16 },
  animate:{ opacity:1, y:0 },
  transition:{ delay: i * 0.08, duration:0.45 },
})

export default function About() {
  return (
    <main style={s.page}>
      <div style={s.wrap}>
        <motion.div {...fade(0)}>
          <p style={s.eyebrow}>About the project</p>
          <h1 style={s.h1}>AI-Powered Pulmonary<br />Disease Classification</h1>
          <p style={s.body}>
            PulmoScan uses a convolutional neural network trained on chest X-ray images
            to distinguish between four pulmonary conditions. The model was built as a
            recovery and reconstruction project, demonstrating an end-to-end ML pipeline
            from data acquisition to web deployment.
          </p>
          <p style={s.body}>
            This tool is intended for research and educational purposes only and should
            not be used for clinical decision-making without supervision of a licensed physician.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div style={s.grid} {...fade(1)}>
          {[['6,324','Training images'],['96.5%','Test accuracy'],['4','Disease classes'],['20','Training epochs']].map(
            ([n, l]) => (
              <div key={l} style={s.statCard}>
                <div style={s.statNum}>{n}</div>
                <div style={s.statLabel}>{l}</div>
              </div>
            )
          )}
        </motion.div>

        {/* Model architecture */}
        <motion.div {...fade(2)}>
          <h2 style={s.h2}>Model Architecture</h2>
          <p style={s.body}>
            Sequential CNN with three convolutional blocks (16 → 32 → 64 filters, 3×3 kernels,
            ReLU), each followed by MaxPooling. A dense head of 256 units with 0.3 dropout
            feeds a 4-class softmax output. Images are normalised to 256×256 and Z-score
            standardised before inference.
          </p>
        </motion.div>

        {/* Classes */}
        <motion.div {...fade(3)}>
          <h2 style={s.h2}>Classified Conditions</h2>
          {CLASSES.map(([color, label, desc]) => (
            <div key={label} style={s.classRow}>
              <div style={s.dot(color)} />
              <span style={s.classLabel}>{label}</span>
              <span style={s.classDesc}>{desc}</span>
            </div>
          ))}
        </motion.div>

        {/* Data */}
        <motion.div {...fade(4)}>
          <h2 style={s.h2}>Dataset</h2>
          <p style={s.body}>
            Images sourced from two Kaggle repositories: the chest X-ray
            pneumonia/COVID-19/tuberculosis dataset and Paul Mooney's chest X-ray pneumonia
            dataset. Data was split 70/20/10 for training, validation, and testing.
          </p>
        </motion.div>

        {/* Stack */}
        <motion.div {...fade(5)}>
          <h2 style={s.h2}>Tech Stack</h2>
          <div style={{ marginTop:'0.5rem' }}>
            {STACK.map(t => <span key={t} style={s.pill}>{t}</span>)}
          </div>
        </motion.div>
      </div>
    </main>
  )
}