import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import AuthPage from './AuthPage'
import WorkspacePages from './WorkspacePages'
import './workspace.css'
import {
  Activity, ArrowDown, ArrowRight, ArrowUpRight, Bell, ChartNoAxesCombined,
  ChevronDown, CirclePlay, Crosshair, Menu, MoveUpRight, Play, Shield,
  Sparkles, Target, Video, X,
} from 'lucide-react'

const sports = [
  { name: 'Badminton', image: '/images/badminton.jpg', category: '01 / COURT', detail: 'Read every rally.' },
  { name: 'Tennis', image: '/images/tennis.jpg', category: '02 / COURT', detail: 'Own every baseline.' },
  { name: 'Table tennis', image: '/images/tabletennis.jpg', category: '03 / TABLE', detail: 'Find your next angle.' },
  { name: 'Squash', image: '/images/squash.jpg', category: '04 / COURT', detail: 'See the whole court.' },
  { name: 'Padel', image: '/images/padel.jpg', category: '05 / COURT', detail: 'Make every wall count.' },
  { name: 'Pickleball', image: '/images/pickleball.jpg', category: '06 / COURT', detail: 'Play the smarter game.' },
]

const telemetry = ['SINGLE-CAMERA SETUP', 'SUB-MILLISECOND SHUTTLE TRACKING', '3D TRAJECTORY MAPPING', 'ZERO WEARABLES REQUIRED']

const bentoFeatures = [
  { tag: 'SMASH', tag2: 'DROP', tag3: 'CLEAR', tag4: 'NET LIFT', tag5: 'DRIVE', title: 'Automated rally & shot classification', copy: 'Every touch is labeled in context�so you can spot patterns in real time, not after the fact.' },
  { title: 'Court heatmap & dead-zone detection', copy: 'High-pressure zones surface as intensity maps, exposing where your opponents force errors and where you lose control.' },
  { title: 'Biomechanics & footwork recovery', copy: 'Split-step timing and recovery paths show how quickly you reset between rallies.' },
  { title: 'Instant AI highlight reels', copy: 'Auto-generated match moments pull the longest rallies, winning sequences, and decisive tactical exchanges.' },
]

const sportProfiles = {
  Badminton: { apex: '342 KM/H', label: 'SMASH SPEED', heat: '92%', recover: '18 ms' },
  Tennis: { apex: '164 KM/H', label: 'SERVE SPEED', heat: '88%', recover: '22 ms' },
  Pickleball: { apex: '92 KM/H', label: 'PADDLE Q', heat: '86%', recover: '16 ms' },
  Squash: { apex: '210 KM/H', label: 'WALL-TO-WALL SPEED', heat: '90%', recover: '14 ms' },
} as const

const pipeline = ['Mount one camera', 'AI calibrates the court', 'Unlock match intelligence']
const personas = [
  { name: 'Players', copy: 'Track personal progression with detailed rally context and self-serve breakdowns.' },
  { name: 'Coaches', copy: 'Frame-by-frame tactical reviews turn clips into teaching moments in minutes.' },
  { name: 'Academies & Clubs', copy: 'Upgrade court operations with standardised session capture and performance tracking.' },
]

function Logo({ light = false }: { light?: boolean }) {
  return <Link className={`brand ${light ? 'brand-light' : ''}`} to="/">
    <span className="brand-mark"><Activity size={17} strokeWidth={2.8} /></span>
    <span>RALLY<span className="brand-iq">IQ</span></span>
  </Link>
}

function IntroOverlay({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setStage(1), 520),
      window.setTimeout(() => setStage(2), 1180),
      window.setTimeout(() => setStage(3), 1880),
      window.setTimeout(() => setStage(4), 2550),
      window.setTimeout(() => onDone(), 3300),
    ]
    return () => timers.forEach(clearTimeout)
  }, [onDone])

  const sphereDots = Array.from({ length: 24 })

  return <motion.div className="intro-overlay" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.45 } }}>
    <button className="intro-skip" type="button" onClick={onDone}>Skip Intro</button>
    <div className="intro-stage">
      <div className="intro-trail" />
      <motion.div
        className="intro-bouncer"
        animate={stage === 0 ? { y: [0, 120, 180, 90, 0], scale: [0.7, 1.25, 0.9, 1.1, 1.35], rotate: [0, 8, -10, 4, 0] } : stage === 1 ? { y: [0, 80, 140, 70, 0], scale: [0.9, 1.2, 1, 1.05, 1.08], rotate: [-12, 18, 0, 12, 0] } : stage === 2 ? { y: [0, 100, 170, 60, 0], scale: [0.9, 1.3, 0.92, 1.2, 1.36], rotate: [0, 12, -9, 7, 0] } : stage >= 3 ? { y: [0, 70, 105, 32, 0], scale: [0.8, 1.5, 2.2, 2.7, 2.8], opacity: [1, 1, 1, 1, 0.92] } : { y: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 1.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {stage === 0 && <div className="intro-ball" />}
        {stage === 1 && <div className="intro-shuttle"><span className="shuttle-shell" /><span className="shuttle-feather feather-1" /><span className="shuttle-feather feather-2" /><span className="shuttle-feather feather-3" /><span className="shuttle-feather feather-4" /><span className="shuttle-feather feather-5" /></div>}
        {stage === 2 && <div className="intro-tennis"><span className="tennis-core" /></div>}
        {stage >= 3 && <div className="intro-dot-logo">{sphereDots.map((_, index) => <span key={index} style={{ ['--i' as any]: index }} />)}</div>}
      </motion.div>
    </div>
  </motion.div>
}

function Landing() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSport, setActiveSport] = useState<keyof typeof sportProfiles>('Badminton')
  const [playing, setPlaying] = useState(false)
  const [visionMode, setVisionMode] = useState<'Raw camera feed' | 'RALLYIQ AI Vision'>('RALLYIQ AI Vision')
  const [showIntro, setShowIntro] = useState(true)
  const reduceMotion = useReducedMotion()

  const closeMenu = () => setMenuOpen(false)
  const sportDetails = sportProfiles[activeSport]
  const revealProps = (delay = 0) => reduceMotion ? {} : {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.16 },
    transition: { duration: 0.65, delay, ease: 'easeOut' as const },
  }

  return <main className="landing">
    <AnimatePresence>{showIntro && <IntroOverlay onDone={() => setShowIntro(false)} />}</AnimatePresence>

    <header className="nav-wrap">
      <nav className="nav">
        <Logo />
        <div className={`nav-links ${menuOpen ? 'nav-links-open' : ''}`}>
          <a href="#platform" onClick={closeMenu}>Platform</a>
          <a href="#sports" onClick={closeMenu}>Sports</a>
          <a href="#intelligence" onClick={closeMenu}>Intelligence</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <div className="mobile-nav-cta"><Link to="/dashboard" onClick={closeMenu}>Open dashboard <ArrowUpRight size={15} /></Link></div>
        </div>
        <div className="nav-actions">
          <Link className="nav-login" to="/dashboard">Log in</Link>
          <Link className="button button-lime button-nav" to="/auth?mode=register">Get started <ArrowUpRight size={15} /></Link>
        </div>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X /> : <Menu />}</button>
      </nav>
    </header>

    <section className="hero" id="home">
      <div className="hero-image" />
      <div className="hero-shade" />
      <div className="hero-grid" />
      <div className="hero-content">
        <div className="eyebrow"><span className="live-dot" /> THE INTELLIGENCE BEHIND EVERY RALLY</div>
        <h1>SEE THE GAME.<br /><span>BEYOND THE GAME.</span></h1>
        <p className="hero-copy">One camera. Every court. AI-powered intelligence that transforms how racket sports are played, analysed, and experienced.</p>
        <div className="hero-actions">
          <a className="button button-lime" href="#platform">Explore the platform <ArrowRight size={17} /></a>
          <button className="button button-quiet" onClick={() => setPlaying(true)}><span className="play-icon"><Play size={13} fill="currentColor" /></span> Watch the experience</button>
        </div>
      </div>
      <div className="hero-note"><span className="note-line" /> BUILT FOR THE NEXT POINT</div>
      <div className="hero-index"><span>01</span> / 06</div>
      <motion.div
        className="hero-stat"
        animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
        transition={reduceMotion ? undefined : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="stat-label"><span className="live-dot" /> MATCH SNAPSHOT <span className="demo-tag">DEMO</span></span>
        <div className="stat-main"><strong>84<span>%</span></strong><div>RALLY<br />CONSISTENCY</div></div>
        <div className="stat-bottom"><span>PLAYER 01</span><span className="stat-spark">? +12.4%</span></div>
        <div className="stat-rule"><i /></div>
      </motion.div>
      <a className="scroll-cue" href="#platform"><span>SCROLL TO EXPLORE</span><ArrowDown size={14} /></a>
      <div className="hero-coordinates">21�08' N &nbsp; 79�05' E</div>
      {playing && <div className="modal-backdrop" onClick={() => setPlaying(false)}>
        <div className="experience-modal" onClick={event => event.stopPropagation()}>
          <button className="modal-close" onClick={() => setPlaying(false)} aria-label="Close"><X /></button>
          <div className="modal-image" />
          <div className="modal-caption"><span className="eyebrow"><span className="live-dot" /> THE RALLYIQ EXPERIENCE</span><p>Every rally has a story. We help you see it.</p><span className="muted small">Product film coming soon � Preview experience</span></div>
        </div>
      </div>}
    </section>

    <section className="ticker" aria-label="Performance telemetry">
      <div className="ticker-label">ONE CAMERA. SIX SPORTS.</div>
      <div className="ticker-list">{telemetry.map(item => <span key={item}>{item}<i> � </i></span>)}</div>
    </section>

    <motion.section className="section platform-section" id="platform" {...revealProps()}>
      <div className="section-head">
        <div><div className="eyebrow"><span className="section-no">01</span> THE PLATFORM</div><h2>YOUR GAME, <span>IN FOCUS.</span></h2></div>
        <p className="section-intro">Turn ordinary match footage into a clearer picture of your game. Every movement, decision, and point�made meaningful.</p>
      </div>
      <div className="platform-showcase">
        <div className="showcase-visual">
          <div className="showcase-topline"><span><span className="live-dot" /> MATCH ANALYSIS / DEMO</span><span>RALLY 08:42</span></div>
          <div className="court">
            <span className="court-net" />
            <span className="court-line court-mid" />
            <span className="court-line court-short court-short-a" />
            <span className="court-line court-short court-short-b" />
            <span className="court-line court-vert court-v1" />
            <span className="court-line court-vert court-v2" />
            <svg className="court-tracking" viewBox="0 0 500 260" preserveAspectRatio="none" aria-label="Illustrative rally tracking path">
              <motion.path
                d="M75 199 C100 176 122 210 166 171 S214 160 249 128 S310 135 335 92 S394 102 421 54"
                initial={reduceMotion ? false : { pathLength: 0, opacity: 0.4 }}
                whileInView={reduceMotion ? undefined : { pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.8, ease: 'easeInOut' }}
              />
              <motion.circle cx="75" cy="199" r="5" animate={reduceMotion ? undefined : { scale: [1, 1.45, 1] }} transition={reduceMotion ? undefined : { duration: 1.8, repeat: Infinity }} />
              <motion.circle cx="421" cy="54" r="5" animate={reduceMotion ? undefined : { scale: [1, 1.45, 1] }} transition={reduceMotion ? undefined : { duration: 1.8, repeat: Infinity, delay: 0.9 }} />
            </svg>
            <span className="player-dot player-a"><i /></span><span className="player-dot player-b"><i /></span>
            <span className="court-label label-a">PLAYER 01 <b>YOU</b></span><span className="court-label label-b">PLAYER 02</span>
            <span className="shuttle-dot"><Crosshair size={15} /></span>
          </div>
          <div className="showcase-bottom"><span>PLAYER TRACKING <b>ACTIVE</b></span><span>COURT DETECTION <b>98.2%</b></span><span>DEMO VISUALIZATION</span></div>
        </div>
        <div className="showcase-copy">
          <div className="showcase-icon"><Crosshair size={20} /></div>
          <span className="eyebrow">01 � SEE EVERY MOVE</span>
          <h3>From footage<br />to <em>feel for the game.</em></h3>
          <p>RALLYIQ turns a camera angle into a new perspective. Explore movement, shot patterns, and the moments that make a match.</p>
          <Link className="text-link" to="/dashboard">Explore the intelligence dashboard <ArrowUpRight size={16} /></Link>
          <div className="mini-metrics"><div><strong>06</strong><span>SPORTS</span></div><i /><div><strong>01</strong><span>CAMERA</span></div><i /><div><strong>8</strong><span>POSSIBILITIES</span></div></div>
        </div>
      </div>
    </motion.section>

    <motion.section className="section vision-section" id="intelligence" {...revealProps()}>
      <div className="section-head">
        <div><div className="eyebrow"><span className="section-no">02</span> SEE BEYOND</div><h2>RAW FEED.<br /><span>SMART VISION.</span></h2></div>
        <div className="vision-toggle" role="tablist" aria-label="Vision modes">
          {(['Raw camera feed', 'RALLYIQ AI Vision'] as const).map(mode => <button key={mode} type="button" className={visionMode === mode ? 'active' : ''} onClick={() => setVisionMode(mode)}>{mode}</button>)}
        </div>
      </div>
      <div className="vision-demo">
        <div className="vision-court">
          <div className="vision-badges">
            <span><span className="live-dot" /> MATCH FEED</span>
            <span>{visionMode === 'RALLYIQ AI Vision' ? 'AI VISION ACTIVE' : 'RAW CAPTURE'}</span>
          </div>
          <div className="vision-court-surface">
            <span className="vision-net" />
            <span className="vision-line vision-line-1" />
            <span className="vision-line vision-line-2" />
            <span className="vision-line vision-line-3" />
            <AnimatePresence mode="wait">
            {visionMode === 'RALLYIQ AI Vision' && <motion.div
              key="ai-vision-overlay"
              className="vision-ai-overlay"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.99 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <span className="vision-player player-one" />
              <span className="vision-player player-two" />
              <span className="vision-halo halo-one" />
              <span className="vision-halo halo-two" />
              <svg className="vision-arc" viewBox="0 0 520 260">
                <motion.path d="M60 200 C160 130, 240 92, 300 120 S420 190, 470 80" initial={reduceMotion ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: 'easeOut' }} />
                <motion.path d="M120 190 C220 150, 310 138, 370 175" initial={reduceMotion ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }} />
              </svg>
              <div className="vision-stat speed"><strong>342</strong><span>KM/H</span></div>
              <div className="vision-stat tally"><strong>08</strong><span>RALLIES</span></div>
            </motion.div>}
            </AnimatePresence>
          </div>
        </div>
        <div className="vision-side-panel">
          <div className="pulse-card"><span className="pulse-title">RALLY STATUS</span><strong>08:42</strong><small>Court tracking stable</small></div>
          <div className="pulse-card"><span className="pulse-title">TRAJECTORY</span><strong>98.4%</strong><small>Shuttle path confidence</small></div>
          <div className="pulse-card"><span className="pulse-title">RECOVERY</span><strong>0.18s</strong><small>Split-step response</small></div>
        </div>
      </div>
    </motion.section>

    <motion.section className="section intelligence-section" id="sports" {...revealProps()}>
      <div className="section-head">
        <div><div className="eyebrow"><span className="section-no">03</span> INTELLIGENCE</div><h2>CORE SYSTEMS.<br /><span>FULL CONTEXT.</span></h2></div>
        <p className="section-intro">High-clarity patterns for every point, every player, and every moment that matters.</p>
      </div>
      <div className="bento-grid">
        {bentoFeatures.map((feature, index) => <motion.article
          {...revealProps(index * 0.08)}
          whileHover={reduceMotion ? undefined : { y: -6, scale: 1.01 }}
          whileTap={reduceMotion ? undefined : { scale: 0.99 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          key={feature.title}
          className={`bento-card card-${index + 1}`}
        >
          {index === 0 && <div className="tag-row"><span>{feature.tag}</span><span>{feature.tag2}</span><span>{feature.tag3}</span><span>{feature.tag4}</span><span>{feature.tag5}</span></div>}
          {index === 1 && <div className="heatmap"><span className="heat heat-a" /><span className="heat heat-b" /><span className="heat heat-c" /><span className="heat heat-d" /><span className="heat heat-e" /></div>}
          {index === 2 && <div className="biomech"><span className="bio-line" /><span className="bio-line bio-2" /><div className="bio-metric"><strong>18ms</strong><span>Recovery</span></div></div>}
          {index === 3 && <div className="reel-timeline"><span /><span /><span /><span /></div>}
          <h3>{feature.title}</h3>
          <p>{feature.copy}</p>
        </motion.article>)}
      </div>
    </motion.section>

    <motion.section className="section sport-section" {...revealProps()}>
      <div className="section-head">
        <div><div className="eyebrow"><span className="section-no">04</span> ONE CAMERA. EVERY COURT.</div><h2>SWITCH SPORT.<br /><span>KEEP THE EDGE.</span></h2></div>
      </div>
      <div className="sport-switcher">
        <div className="sport-tabs" role="tablist" aria-label="Sports">
          {(Object.keys(sportProfiles) as Array<keyof typeof sportProfiles>).map(sport => <button key={sport} type="button" className={activeSport === sport ? 'active' : ''} onClick={() => setActiveSport(sport)}>{sport}</button>)}
        </div>
        <motion.div
          key={activeSport}
          className="sport-preview"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <div className="sport-court"><div className="sport-court-inner"><span className="court-mark court-net-mark" /><span className="court-mark court-center" /><span className="court-mark court-serve" /></div></div>
          <div className="sport-telemetry">
            <div className="telemetry-card"><span>{sportDetails.label}</span><strong>{sportDetails.apex}</strong><small>Peak potential</small></div>
            <div className="telemetry-card"><span>HEATMAP HIT RATE</span><strong>{sportDetails.heat}</strong><small>Pressure zones</small></div>
            <div className="telemetry-card"><span>RECOVERY</span><strong>{sportDetails.recover}</strong><small>Response time</small></div>
          </div>
        </motion.div>
      </div>
    </motion.section>

    <motion.section className="section pipeline-section" {...revealProps()}>
      <div className="section-head">
        <div><div className="eyebrow"><span className="section-no">05</span> HOW IT WORKS</div><h2>FROM CAMERA TO<br /><span>CLARITY.</span></h2></div>
      </div>
      <div className="pipeline-grid">
        {pipeline.map((step, index) => <motion.article
          {...revealProps(index * 0.1)}
          key={step}
          className="pipeline-card"
          whileHover={reduceMotion ? undefined : { y: -5 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <span className="step-no">0{index + 1}</span>
          <h3>{step}</h3>
          <p>{index === 0 && 'Standard tripod or wall mount behind the baseline keeps the play area in one clean frame.'}{index === 1 && 'AI calibrates court lines, player silhouettes, and shuttle path in seconds without wearables.'}{index === 2 && 'Instant post-match breakdowns, leaderboards, and shareable clips unlock faster learning.'}</p>
        </motion.article>)}
      </div>
    </motion.section>

    <motion.section className="section personas-section" id="about" {...revealProps()}>
      <div className="section-head">
        <div><div className="eyebrow"><span className="section-no">06</span> BUILT FOR EVERY LEVEL</div><h2>PLAY BETTER,<br /><span>WITH MORE CONTEXT.</span></h2></div>
      </div>
      <div className="persona-grid">
        {personas.map((persona, index) => <motion.article
          {...revealProps(index * 0.1)}
          key={persona.name}
          className="persona-card"
          whileHover={reduceMotion ? undefined : { y: -5 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <span className="persona-label">{persona.name}</span>
          <h3>{persona.name === 'Players' ? 'Track personal progression' : persona.name === 'Coaches' ? 'Frame-by-frame tactical review' : 'Smart court upgrades'}</h3>
          <p>{persona.copy}</p>
          <Link to="/auth?mode=register">Get started <ArrowUpRight size={15} /></Link>
        </motion.article>)}
      </div>
      <div className="closing-cta">
        <div className="closing-bg" />
        <div className="closing-content">
          <div className="eyebrow"><span className="live-dot" /> YOUR NEXT MATCH, REIMAGINED</div>
          <h2>READY TO SEE<br /><span>BEYOND THE GAME?</span></h2>
          <Link className="button button-lime" to="/auth?mode=register">Get started <ArrowRight size={17} /></Link>
        </div>
        <div className="closing-coord">PLAY SMARTER. PLAY FORWARD.</div>
      </div>
    </motion.section>

    <footer className="footer"><div className="footer-main"><Logo /><span>One camera. Every court. Infinite insights.</span><Link to="/dashboard">Open dashboard <ArrowUpRight size={15} /></Link></div><div className="footer-bottom"><span>� 2026 RALLYIQ. BUILT FOR THE LOVE OF THE GAME.</span><span>FRONTEND PREVIEW � SAMPLE DATA</span></div></footer>
  </main>
}

function SimpleLanding() {
  return <main className="landing">
    <header className="nav-wrap">
      <nav className="nav">
        <Logo />
        <div className="nav-actions">
          <Link className="nav-login" to="/login">Log in</Link>
          <Link className="button button-lime button-nav" to="/auth?mode=register">Get started <ArrowUpRight size={15} /></Link>
        </div>
      </nav>
    </header>
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-image" aria-hidden="true" />
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-content">
        <div className="eyebrow"><span className="live-dot" /> THE INTELLIGENCE BEHIND EVERY RALLY</div>
        <h1 id="hero-title">SEE THE GAME.<br /><span>BEYOND THE GAME.</span></h1>
        <p className="hero-copy">One camera. Every court. A clearer view of your game.</p>
        <div className="hero-actions">
          <Link className="button button-lime" to="/auth?mode=register">Get started <ArrowUpRight size={17} /></Link>
        </div>
      </div>
    </section>
  </main>
}

const navItems = [
  { name: 'Overview', icon: ChartNoAxesCombined },
  { name: 'My matches', icon: Activity },
  { name: 'Match analysis', icon: Crosshair },
  { name: 'Video upload', icon: Video },
]

function Dashboard() {
  const [current, setCurrent] = useState('Overview')
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileSidebar, setMobileSidebar] = useState(false)
  const [toast, setToast] = useState('')

  const toastMessage = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  const stats = [{ label: 'MATCHES PLAYED', value: '24', change: '+3 this month', icon: Activity }, { label: 'WIN RATE', value: '68%', change: '+4.2% this month', icon: ChartNoAxesCombined }, { label: 'TOTAL RALLIES', value: '1,284', change: '+186 this month', icon: Crosshair }, { label: 'PLAYER RATING', value: '8.4', change: 'Top 12% in your club', icon: Shield }]

  return <div className="app-shell">
    <aside className={`sidebar ${mobileSidebar ? 'sidebar-open' : ''}`}>
      <div className="sidebar-brand"><Logo /><button className="sidebar-close" onClick={() => setMobileSidebar(false)}><X size={18} /></button></div>
      <div className="workspace-label">PLAYER WORKSPACE</div>
      <div className="sidebar-group">
        {navItems.map(item => <button key={item.name} className={`sidebar-link ${current === item.name ? 'sidebar-active' : ''}`} onClick={() => { setCurrent(item.name); setMobileSidebar(false) }}><item.icon size={17} />{item.name}{item.name === 'Video upload' && <span className="sidebar-new">NEW</span>}</button>)}
      </div>
      <div className="sidebar-label">YOUR WORLD</div>
      {['AI Coach', 'Tournaments', 'Courts & clubs', 'Community'].map((name, i) => <button key={name} className={`sidebar-link ${current === name ? 'sidebar-active' : ''}`} onClick={() => { setCurrent(name); setMobileSidebar(false) }}><span className="sidebar-glyph">{['?', '?', '?', '?'][i]}</span>{name}</button>)}
      <div className="sidebar-spacer" />
      <button className="sidebar-link settings-link" onClick={() => { setCurrent('Settings'); setMobileSidebar(false) }}><span className="sidebar-glyph">?</span>Settings</button>
      <button className="sidebar-user" onClick={() => setProfileOpen(!profileOpen)}><span className="avatar">AM</span><span className="user-text"><strong>Alex Morgan</strong><small>Player account</small></span><ChevronDown size={15} /></button>
      {profileOpen && <div className="profile-popover"><strong>Alex Morgan</strong><span>alex.morgan@email.com</span><button onClick={() => { setCurrent('Settings'); setProfileOpen(false) }}>Account settings <ArrowUpRight size={13} /></button></div>}
    </aside>
    {mobileSidebar && <button className="sidebar-scrim" onClick={() => setMobileSidebar(false)} aria-label="Close navigation" />}
    <div className="dashboard-main">
      <header className="dash-topbar"><button className="mobile-sidebar-toggle" onClick={() => setMobileSidebar(true)} aria-label="Open navigation"><Menu /></button><div className="breadcrumb"><span>Workspace</span><i>/</i><strong>{current}</strong></div><div className="dash-top-actions"><button className="sport-select" onClick={() => toastMessage('Sport selector � Badminton selected')}>?? <span>Badminton</span><ChevronDown size={14} /></button><button className="icon-button" onClick={() => toastMessage('You�re all caught up!')} aria-label="Notifications"><Bell size={18} /><i /></button><button className="top-avatar" onClick={() => setProfileOpen(!profileOpen)}>AM</button></div></header>
      {current === 'Overview' ? <div className="dashboard-content">
        <div className="dash-greeting"><div><div className="eyebrow"><span className="live-dot" /> YOUR PERFORMANCE SPACE</div><h1>Good evening, Alex<span>.</span></h1><p>Your game is moving in the right direction. Here�s your latest.</p></div><button className="button button-lime dash-upload" onClick={() => { setCurrent('Video upload'); toastMessage('Video upload is a demo. Backend processing is not connected yet.') }}><Video size={16} /> Upload a match</button></div>
        <div className="demo-banner"><Sparkles size={15} /><span><strong>DEMO WORKSPACE</strong> &nbsp;Sample player stats and match insights. No real AI analysis is connected.</span><button onClick={() => toastMessage('This is a frontend-only product preview.')}>What's this?</button></div>
        <div className="metric-grid">{stats.map(s => <article className="metric-card" key={s.label}><div className="metric-head">{s.label}<s.icon size={16} /></div><strong>{s.value}</strong><span className="metric-change"><MoveUpRight size={13} /> {s.change}</span></article>)}</div>
        <div className="dashboard-grid">
          <section className="dash-panel performance-panel"><div className="panel-heading"><div><span className="panel-kicker">YOUR JOURNEY</span><h2>Performance trend</h2></div><button className="period-select" onClick={() => toastMessage('Showing your last 7 matches')}>Last 7 matches <ChevronDown size={14} /></button></div>
            <div className="chart-area"><div className="chart-ylabels"><span>100</span><span>75</span><span>50</span><span>25</span></div><div className="chart-plot"><div className="chart-gridlines"><i /><i /><i /><i /></div><svg viewBox="0 0 600 180" preserveAspectRatio="none" className="performance-chart"><defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#c6ff3d" stopOpacity=".23" /><stop offset="100%" stopColor="#c6ff3d" stopOpacity="0" /></linearGradient></defs><path className="chart-fill" d="M0 130 C32 118 46 132 82 110 S130 118 164 93 S210 106 246 81 S300 98 334 70 S375 89 410 62 S462 68 494 48 S550 66 600 26 L600 180 L0 180Z" /><path className="chart-stroke" d="M0 130 C32 118 46 132 82 110 S130 118 164 93 S210 106 246 81 S300 98 334 70 S375 89 410 62 S462 68 494 48 S550 66 600 26" /><circle cx="600" cy="26" r="4" /></svg><div className="chart-xlabels"><span>SEP 12</span><span>SEP 19</span><span>SEP 26</span><span>OCT 03</span><span>OCT 10</span></div></div></div>
            <div className="chart-summary"><span><i className="legend-dot" /> Performance score</span><span>Avg. <strong>76.4</strong></span><span className="positive">? 12.8% <small>vs. last month</small></span></div>
          </section>
          <section className="dash-panel insight-panel"><div className="panel-heading"><div><span className="panel-kicker">A CLOSER LOOK <span className="sample-pill">SAMPLE</span></span><h2>Coach�s note</h2></div><Sparkles className="insight-spark" size={19} /></div><div className="insight-feature"><div className="insight-indicator"><Target size={17} /></div><div><span className="insight-type">RALLY CONSISTENCY</span><strong>Patience pays off.</strong></div></div><p className="insight-copy">In this sample, your longer rallies show steadier court coverage. Look for chances to reset before going for the winner.</p><div className="insight-footer"><span>DEMO INSIGHT � NOT PERSONALIZED</span><button onClick={() => { setCurrent('AI Coach'); toastMessage('Opening your AI Coach demo') }}>Explore insight <ArrowUpRight size={14} /></button></div></section>
          <section className="dash-panel matches-panel"><div className="panel-heading"><div><span className="panel-kicker">RECENT ACTIVITY</span><h2>Latest matches</h2></div><button className="plain-link" onClick={() => setCurrent('My matches')}>All matches <ArrowRight size={14} /></button></div>
            <div className="match-row"><div className="match-date"><strong>08</strong><span>OCT</span></div><div className="match-info"><strong>vs. Jordan Lee</strong><span>Club practice � 42 min</span></div><div className="match-score"><strong>21 � 18</strong><span>WON</span></div><ArrowUpRight className="row-arrow" size={15} /></div>
            <div className="match-row"><div className="match-date"><strong>05</strong><span>OCT</span></div><div className="match-info"><strong>vs. Sam Rivera</strong><span>Saturday league � 38 min</span></div><div className="match-score match-loss"><strong>17 � 21</strong><span>LOST</span></div><ArrowUpRight className="row-arrow" size={15} /></div>
            <div className="match-row"><div className="match-date"><strong>02</strong><span>OCT</span></div><div className="match-info"><strong>vs. Casey Park</strong><span>Club practice � 51 min</span></div><div className="match-score"><strong>21 � 16</strong><span>WON</span></div><ArrowUpRight className="row-arrow" size={15} /></div>
          </section>
          <section className="dash-panel activity-panel"><div className="panel-heading"><div><span className="panel-kicker">WEEK OF OCT 07</span><h2>On the court</h2></div><button className="icon-button subtle-button" aria-label="Activity details" onClick={() => toastMessage('Activity is sample data.')}>���</button></div><div className="activity-figure"><strong>4.5<span> hrs</span></strong><span>TRAINING TIME</span></div><div className="activity-bars">{[38, 63, 26, 78, 45, 93, 52].map((n, i) => <div key={i} className={`activity-bar-wrap ${i === 5 ? 'bar-active' : ''}`}><i style={{ height: `${n}%` }} /><span>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span></div>)}</div><div className="activity-bottom"><span><i className="legend-dot" /> COURT TIME</span><span>3 SESSIONS</span></div></section>
        </div>
        <div className="dash-footnote"><span><CirclePlay size={14} /> RALLYIQ PRODUCT PREVIEW</span><span>All data shown is illustrative sample data.</span></div>
      </div> : <WorkspacePages page={current} onToast={toastMessage} />}
    </div>
    {toast && <div className="toast"><Sparkles size={15} />{toast}</div>}
  </div>
}

export default function App() {
  return <Routes><Route path="/" element={<Landing />} /><Route path="/auth" element={<AuthPage />} /><Route path="/login" element={<AuthPage />} /><Route path="/dashboard" element={<Dashboard />} /><Route path="*" element={<Landing />} /></Routes>
}
