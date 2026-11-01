import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Activity, ArrowDown, ArrowRight, Menu, X } from 'lucide-react'
import './cinematic.css'

gsap.registerPlugin(ScrollTrigger)

const storyBeats = [
  { eyebrow: 'OPENING / THE COURT', title: <>EVERY GREAT GAME<br />STARTS WITH <em>ONE SHOT.</em></>, copy: 'A court. Two players. One moment that changes everything.', shot: '01 / THE OPENING' },
  { eyebrow: 'THE PLAYER / READY', title: <>SKILL.<br />PRECISION. <em>INSTINCT.</em></>, copy: 'Every step is a decision. Every movement leaves a trace.', shot: '01 / THE PLAYER' },
  { eyebrow: 'THE SERVE / IN MOTION', title: <>AND THEN,<br /><em>THE RALLY.</em></>, copy: 'Follow the flight. Read the rhythm. See what the eye alone can miss.', shot: '01 / THE SERVE' },
  { eyebrow: 'PLAYER TRACKING / DEMO', title: <>EVERY<br /><em>MOVEMENT</em> MATTERS.</>, copy: 'Explore player positioning and court coverage through sample visual tracking.', shot: '02 / TRACKING' },
  { eyebrow: 'SHOT ANALYSIS / DEMO', title: <>EVERY SHOT<br />TELLS A <em>STORY.</em></>, copy: 'Trace the trajectory. Find the landing. See the patterns inside a rally.', shot: '03 / SHOT ANALYSIS' },
  { eyebrow: 'PERFORMANCE / DEMO', title: <>TURN PERFORMANCE<br />INTO <em>PROGRESS.</em></>, copy: 'A clearer view of rally consistency, shot placement, and movement efficiency.', shot: '04 / PERFORMANCE' },
  { eyebrow: 'AI COACH / SAMPLE INSIGHT', title: <>YOUR GAME.<br /><em>UNDERSTOOD.</em></>, copy: 'Sample coaching ideas make match data easier to turn into a training focus.', shot: '05 / COACHING' },
  { eyebrow: 'FINAL RALLY / THE LAST POINT', title: <>THE FINAL SHOT<br />IS ONLY THE <em>BEGINNING.</em></>, copy: 'The rally ends. The questions worth asking are just getting started.', shot: '06 / FINAL RALLY' },
  { eyebrow: 'THE RESULTS / YOUR NEXT MOVE', title: <>YOUR GAME HAS A STORY.<br /><em>LET AI REVEAL IT.</em></>, copy: 'Turn your match footage into powerful performance insights.', shot: '07 / THE RESULTS' },
]

function Brand() {
  return <Link className="brand cinema-brand" to="/" aria-label="RALLYIQ home">
    <span className="brand-mark"><Activity size={17} strokeWidth={2.8} /></span>
    <span>RALLY<span className="brand-iq">IQ</span></span>
  </Link>
}

export default function CinematicExperience() {
  const storyRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const openingVeilRef = useRef<HTMLDivElement>(null)
  const shuttleRef = useRef<SVGGElement>(null)
  const trajectoryRef = useRef<SVGPathElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const scrollCueRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useLayoutEffect(() => {
    const story = storyRef.current
    const image = imageRef.current
    const openingVeil = openingVeilRef.current
    const shuttle = shuttleRef.current
    const trajectory = trajectoryRef.current
    if (!story || !image || !openingVeil || !shuttle || !trajectory) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      story.classList.add('cinema-reduced-motion')
      return () => story.classList.remove('cinema-reduced-motion')
    }

    const context = gsap.context(() => {
      const captions = gsap.utils.toArray<HTMLElement>('.story-beat')
      const tracking = gsap.utils.toArray<HTMLElement>('.court-tracking-layer')
      const analytics = gsap.utils.toArray<HTMLElement>('.cinema-analytics')
      const camera = image
      const proxy = { progress: 0 }
      const totalLength = trajectory.getTotalLength()

      gsap.set(captions, { autoAlpha: 0, y: 18 })
      gsap.set(captions[0], { autoAlpha: 1, y: 0 })
      gsap.set([...tracking, ...analytics], { autoAlpha: 0 })
      gsap.set(shuttle, { autoAlpha: 0 })
      gsap.set(camera, { scale: 1.08, xPercent: 0, yPercent: 0, transformOrigin: '50% 50%' })
      gsap.set(openingVeil, { autoAlpha: 0.9 })

      const placeShuttle = (progress: number) => {
        const distance = Math.max(0, Math.min(1, progress)) * totalLength
        const point = trajectory.getPointAtLength(distance)
        const next = trajectory.getPointAtLength(Math.min(totalLength, distance + 2))
        const angle = Math.atan2(next.y - point.y, next.x - point.x) * (180 / Math.PI)
        gsap.set(shuttle, { x: point.x, y: point.y, rotation: angle, transformOrigin: 'center center' })
      }

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: 'rallyiq-match-story',
          trigger: story,
          start: 'top top',
          end: () => window.matchMedia('(max-width: 640px)').matches ? '+=5600' : '+=7200',
          pin: stageRef.current,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: self => {
            if (progressRef.current) {
              const stage = Math.min(storyBeats.length, Math.max(1, Math.ceil(self.progress * (storyBeats.length - 1) + 1)))
              progressRef.current.textContent = `SHOT ${String(stage).padStart(2, '0')} / 09`
            }
            if (scrollCueRef.current) gsap.set(scrollCueRef.current, { autoAlpha: self.progress < 0.025 ? 1 : 0 })
          },
        },
      })

      timeline.to(camera, { scale: 1.16, xPercent: -1.5, yPercent: 1, duration: 1.1 }, 0)
      timeline.to(openingVeil, { autoAlpha: 0.08, duration: 1.1 }, 0)
      timeline.to(captions[0], { autoAlpha: 0, y: -16, duration: 0.16 }, 0.98)
      timeline.fromTo(captions[1], { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 1.08)
      timeline.to(camera, { scale: 1.21, xPercent: -3, yPercent: -1, duration: 1 }, 1.05)

      timeline.to(captions[1], { autoAlpha: 0, y: -16, duration: 0.16 }, 2.02)
      timeline.fromTo(captions[2], { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 2.12)
      timeline.to(camera, { scale: 1.27, xPercent: -5, yPercent: 0, duration: 1 }, 2.1)
      timeline.to(proxy, { progress: 0.2, duration: 0.88, ease: 'none', onStart: () => gsap.set(shuttle, { autoAlpha: 1 }), onUpdate: () => placeShuttle(proxy.progress) }, 2.25)

      timeline.to(captions[2], { autoAlpha: 0, y: -16, duration: 0.16 }, 3.08)
      timeline.fromTo(captions[3], { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 3.18)
      timeline.to(tracking[0], { autoAlpha: 1, duration: 0.25 }, 3.22)
      timeline.to(tracking[2], { autoAlpha: 1, duration: 0.25 }, 3.22)
      timeline.to(camera, { scale: 1.32, xPercent: -7, yPercent: -1, duration: 1 }, 3.15)
      timeline.to(proxy, { progress: 0.4, duration: 0.88, ease: 'none', onUpdate: () => placeShuttle(proxy.progress) }, 3.3)

      timeline.to(captions[3], { autoAlpha: 0, y: -16, duration: 0.16 }, 4.12)
      timeline.fromTo(captions[4], { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 4.22)
      timeline.to(tracking[0], { autoAlpha: 0, duration: 0.2 }, 4.16)
      timeline.to(tracking[2], { autoAlpha: 0, duration: 0.2 }, 4.16)
      timeline.to(tracking[1], { autoAlpha: 1, duration: 0.25 }, 4.26)
      timeline.to(camera, { scale: 1.38, xPercent: -4, yPercent: 1, duration: 1 }, 4.2)
      timeline.to(proxy, { progress: 0.6, duration: 0.88, ease: 'none', onUpdate: () => placeShuttle(proxy.progress) }, 4.35)

      timeline.to(captions[4], { autoAlpha: 0, y: -16, duration: 0.16 }, 5.16)
      timeline.fromTo(captions[5], { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 5.26)
      timeline.to(tracking[1], { autoAlpha: 0, duration: 0.2 }, 5.2)
      timeline.to(analytics[0], { autoAlpha: 1, y: 0, duration: 0.25 }, 5.3)
      timeline.to(camera, { scale: 1.3, xPercent: 1, yPercent: -2, duration: 1 }, 5.25)
      timeline.to(proxy, { progress: 0.77, duration: 0.88, ease: 'none', onUpdate: () => placeShuttle(proxy.progress) }, 5.42)

      timeline.to(captions[5], { autoAlpha: 0, y: -16, duration: 0.16 }, 6.18)
      timeline.fromTo(captions[6], { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 6.28)
      timeline.to(analytics[0], { autoAlpha: 0, duration: 0.2 }, 6.22)
      timeline.to(analytics[1], { autoAlpha: 1, y: 0, duration: 0.25 }, 6.32)
      timeline.to(camera, { scale: 1.24, xPercent: 3, yPercent: 0, duration: 1 }, 6.3)
      timeline.to(proxy, { progress: 0.9, duration: 0.88, ease: 'none', onUpdate: () => placeShuttle(proxy.progress) }, 6.45)

      timeline.to(captions[6], { autoAlpha: 0, y: -16, duration: 0.16 }, 7.22)
      timeline.fromTo(captions[7], { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 7.32)
      timeline.to(analytics[1], { autoAlpha: 0, duration: 0.2 }, 7.26)
      timeline.to(camera, { scale: 1.18, xPercent: 0, yPercent: -1, duration: 1 }, 7.34)
      timeline.to(proxy, { progress: 1, duration: 0.7, ease: 'none', onUpdate: () => placeShuttle(proxy.progress) }, 7.48)
      timeline.to(shuttle, { scale: 0.5, autoAlpha: 0.4, duration: 0.2 }, 8.1)

      timeline.to(captions[7], { autoAlpha: 0, y: -16, duration: 0.16 }, 8.12)
      timeline.fromTo(captions[8], { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.24 }, 8.24)
      timeline.to(camera, { scale: 1.05, xPercent: 0, yPercent: 0, duration: 1.1 }, 8.18)
      timeline.to('.stadium-hoarding', { autoAlpha: 1, scale: 1, duration: 0.32 }, 8.32)
      timeline.to('.court-ground', { autoAlpha: 0.24, duration: 0.6 }, 8.18)
      timeline.to('.cinema-grain', { opacity: 0.12, duration: 0.5 }, 8.2)
    }, story)

    return () => context.revert()
  }, [])

  const jumpTo = (progress: number) => {
    setMenuOpen(false)
    const trigger = ScrollTrigger.getById('rallyiq-match-story')
    if (trigger) window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * progress, behavior: 'smooth' })
    else storyRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return <main className="cinema-story" ref={storyRef}>
    <div className="cinematic-stage" ref={stageRef} id="story">
      <div className="cinema-camera">
        <img ref={imageRef} className="cinema-photo" src="/images/hero.jpg" alt="Badminton player reaching for a shot in a professional arena" fetchPriority="high" />
      </div>
      <div className="cinema-vignette" />
      <div className="cinema-opening-veil" ref={openingVeilRef} />
      <div className="arena-lights" />
      <div className="court-ground" />
      <svg className="court-blueprint" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
        <path d="M75 340 L925 340 M170 180 L830 180 M170 520 L830 520 M170 180 L170 520 M830 180 L830 520 M330 180 L330 520 M670 180 L670 520 M170 270 L830 270 M170 430 L830 430" />
        <path className="court-net-line" d="M75 350 L925 350" />
      </svg>
      <svg className="rally-flight" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
        <path ref={trajectoryRef} className="flight-path" d="M105 476 C215 416 254 192 381 191 S512 510 614 342 S727 188 811 239 S862 455 742 479 S542 192 429 258 S285 493 204 390 S479 127 692 226 S833 446 896 390" />
        <path className="tracking-path" d="M145 458 C233 408 280 319 340 296 S432 341 486 371 S582 338 645 305 S749 277 833 324" />
        <circle className="landing-marker" cx="896" cy="390" r="13" />
        <g ref={shuttleRef} className="tracked-shuttle">
          <ellipse cx="0" cy="0" rx="12" ry="5" fill="#c6ff3d" />
          <path d="M-7 0 L-29 -12 M-7 0 L-33 -5 M-7 0 L-33 5 M-7 0 L-29 12" fill="none" stroke="#f4f4e9" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="2" cy="0" r="3" fill="#fff" />
        </g>
      </svg>

      <header className="cinema-nav">
        <Brand />
        <nav className={`cinema-nav-links ${menuOpen ? 'cinema-nav-open' : ''}`} aria-label="Main navigation">
          <button onClick={() => jumpTo(0.38)}>The match</button>
          <button onClick={() => jumpTo(0.56)}>Intelligence</button>
          <button onClick={() => jumpTo(0.98)}>The results</button>
          <Link to="/auth">Log in</Link>
        </nav>
        <button className="cinema-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X size={18} /> : <Menu size={18} />}</button>
      </header>

      <div className="cinema-top-label"><span className="live-dot" /> THE MATCH / A RALLYIQ EXPERIENCE <span className="cinema-demo">DEMO VISUALIZATION</span></div>
      <div className="cinema-caption-stack">
        {storyBeats.map((beat, index) => <article className={`story-beat story-beat-${index}`} key={beat.shot} aria-live={index === 0 ? 'polite' : undefined}>
          <span className="beat-eyebrow"><span className="beat-index">0{index + 1}</span> {beat.eyebrow}</span>
          <h1>{beat.title}</h1>
          <p>{beat.copy}</p>
        </article>)}
      </div>

      <div className="court-tracking-layer tracking-player-one"><span className="tracking-ring" /><span className="tracking-tag">PLAYER 01 / YOU</span></div>
      <div className="court-tracking-layer tracking-player-two"><span className="tracking-ring" /><span className="tracking-tag">PLAYER 02</span></div>
      <div className="court-tracking-layer tracking-path-label">COURT COVERAGE <b>DEMO</b></div>
      <div className="cinema-analytics sample-performance"><span className="analytics-label">MATCH SIGNAL / SAMPLE</span><strong>84<small>%</small></strong><span>RALLY CONSISTENCY</span><i><b /></i></div>
      <div className="cinema-analytics sample-coach"><span className="analytics-label">COACH'S NOTE / SAMPLE</span><strong>Find the open court.</strong><p>Cross-court placements created space in this illustrative rally.</p><span className="analytics-disclaimer">DEMO INSIGHT · NOT PERSONALIZED</span></div>

      <div className="stadium-hoarding">
        <span className="hoarding-kicker"><span className="live-dot" /> RALLYIQ / MATCH INTELLIGENCE</span>
        <h2>YOUR GAME HAS A STORY.<br /><em>LET AI REVEAL IT.</em></h2>
        <p>Every rally, every movement, every shot has something to teach you.</p>
        <Link className="hoarding-cta" to="/auth?mode=register">Analyze your match <ArrowRight size={17} /></Link>
        <span className="hoarding-note">UPLOAD YOUR MATCH FOOTAGE. LET INTELLIGENCE REVEAL YOUR GAME.</span>
      </div>

      <div className="cinema-footer-hud"><span>RALLYIQ / COURT 01</span><span className="cinema-shot-progress" ref={progressRef}>SHOT 01 / 09</span><span>SCROLL TO MOVE THROUGH THE MATCH <ArrowDown size={12} /></span></div>
      <div className="cinema-scroll-cue" ref={scrollCueRef}><span>SCROLL TO ENTER THE GAME</span><ArrowDown size={14} /></div>
      <div className="cinema-grain" />
      <div className="cinema-static-copy">
        <span className="beat-eyebrow"><span className="live-dot" /> THE MATCH / RALLYIQ</span>
        <h1>EVERY GREAT GAME<br />STARTS WITH <em>ONE SHOT.</em></h1>
        <p>Scroll the story at your own pace. A sample shuttlecock trajectory and illustrative court overlays introduce what match analysis could reveal.</p>
        <Link className="hoarding-cta" to="/auth?mode=register">Analyze your match <ArrowRight size={17} /></Link>
        <span className="analytics-disclaimer">CINEMATIC FRONTEND DEMO · SAMPLE ANALYTICS · NO LIVE AI PROCESSING</span>
      </div>
    </div>
    <div className="cinema-scroll-runway" aria-hidden="true" />
  </main>
}
