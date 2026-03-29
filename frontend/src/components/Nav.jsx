import React from "react"
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const styles = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 2.5rem', height: '64px',
    background: 'rgba(8,12,16,0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border)',
  },
  logo: {
    fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.2rem',
    color: 'var(--accent)', letterSpacing: '-0.02em', textDecoration: 'none',
  },
  tag: {
    fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--dim)',
    letterSpacing: '0.15em', textTransform: 'uppercase',
    marginLeft: '0.75rem', marginTop: '2px',
  },
  links: { display: 'flex', gap: '2rem', listStyle: 'none' },
  link: {
    fontFamily: 'var(--mono)', fontSize: '0.75rem', letterSpacing: '0.1em',
    textTransform: 'uppercase', textDecoration: 'none',
    transition: 'color 0.2s',
  },
}

export default function Nav() {
  const { pathname } = useLocation()
  return (
    <nav style={styles.nav}>
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <Link to="/" style={styles.logo}>PulmoScan</Link>
        <span style={styles.tag}>AI · v1.0</span>
      </div>
      <ul style={styles.links}>
        {[['/', 'Diagnose'], ['/about', 'About']].map(([path, label]) => (
          <li key={path}>
            <Link
              to={path}
              style={{
                ...styles.link,
                color: pathname === path ? 'var(--accent)' : 'var(--dim)',
              }}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}