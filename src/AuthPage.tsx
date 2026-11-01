import { FormEvent, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Activity, ArrowLeft, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react'

type AuthMode = 'login' | 'register' | 'forgot' | 'ready'

export default function AuthPage() {
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState<AuthMode>(searchParams.get('mode') === 'register' ? 'register' : 'login')
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('')
    const form = event.currentTarget
    if (!form.reportValidity()) return

    const values = new FormData(form)
    if (mode === 'register' && values.get('password') !== values.get('confirmPassword')) {
      setStatus('Your passwords don’t match. Please check and try again.')
      return
    }

    setIsSubmitting(true)
    window.setTimeout(() => {
      setIsSubmitting(false)
      if (mode === 'forgot') {
        setStatus('Password reset is not connected yet. An authentication provider is required to send a reset email.')
      } else {
        setMode('ready')
      }
    }, 550)
  }

  const changeMode = (nextMode: AuthMode) => {
    setStatus('')
    setMode(nextMode)
  }

  return <main className="auth-page">
    <section className="auth-art" aria-label="Badminton match">
      <div className="auth-art-image" />
      <div className="auth-art-overlay" />
      <Link to="/" className="auth-back"><ArrowLeft size={15} /> Back to the match</Link>
      <div className="auth-art-copy">
        <span className="auth-overline"><span className="live-dot" /> RALLYIQ / THE PLAYER'S EDGE</span>
        <h1>THE NEXT POINT<br />STARTS <em>HERE.</em></h1>
        <p>Make every match a chance to understand your game a little better.</p>
        <span className="auth-art-caption">ONE CAMERA. EVERY COURT. INFINITE INSIGHTS.</span>
      </div>
      <span className="auth-art-index">01 — 06 &nbsp; / &nbsp; BADMINTON</span>
    </section>
    <section className="auth-panel">
      <Link to="/" className="auth-brand"><span className="brand-mark"><Activity size={17} strokeWidth={2.8} /></span>RALLY<span>IQ</span></Link>
      <div className="auth-card">
        {mode === 'ready' ? <div className="auth-ready">
          <span className="auth-ready-icon"><ShieldCheck size={26} /></span>
          <span className="auth-overline">FRONTEND PREVIEW</span>
          <h2>You’re ready<br />for the <em>next rally.</em></h2>
          <p>Your details passed the local form checks. Sign-in and account creation aren’t connected to an authentication service yet.</p>
          <button className="auth-submit" onClick={() => navigate('/dashboard')}>Continue to dashboard preview <ArrowRight size={16} /></button>
          <button className="auth-secondary-action" onClick={() => changeMode('login')}>Return to sign in</button>
        </div> : <>
          <span className="auth-overline">{mode === 'register' ? 'START YOUR JOURNEY' : mode === 'forgot' ? 'ACCOUNT RECOVERY' : 'WELCOME BACK'}</span>
          <h2>{mode === 'register' ? <>Create your<br /><em>RALLYIQ account.</em></> : mode === 'forgot' ? <>Reset your<br /><em>password.</em></> : <>Good to see<br /><em>you again.</em></>}</h2>
          <p className="auth-subtitle">{mode === 'register' ? 'A clearer view of your game starts here.' : mode === 'forgot' ? 'Enter your email and we’ll help you get back on court.' : 'Pick up where your last match left off.'}</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'register' && <label>Full name<input name="fullName" type="text" autoComplete="name" placeholder="Alex Morgan" required minLength={2} /></label>}
            <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
            {mode !== 'forgot' && <label>Password<span className="password-field"><input name="password" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} placeholder="At least 8 characters" required minLength={8} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></span></label>}
            {mode === 'register' && <label>Confirm password<input name="confirmPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Re-enter your password" required minLength={8} /></label>}
            {mode === 'register' && <div className="auth-select-row">
              <label>Preferred sport<select name="sport" defaultValue="Badminton"><option>Badminton</option><option>Tennis</option><option>Table tennis</option><option>Squash</option><option>Padel</option><option>Pickleball</option></select></label>
              <label>Your role<select name="role" defaultValue="Player"><option>Player</option><option>Coach</option><option>Club</option></select></label>
            </div>}
            {mode === 'login' && <div className="auth-options"><label className="remember-option"><input type="checkbox" name="remember" /> Remember me</label><button type="button" onClick={() => changeMode('forgot')}>Forgot password?</button></div>}
            {status && <div className="auth-status" role="status">{status}</div>}
            <button className="auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Checking details…' : mode === 'register' ? 'Create account' : mode === 'forgot' ? 'Request reset' : 'Sign in'} <ArrowRight size={16} /></button>
          </form>
          <p className="auth-switch">{mode === 'forgot' ? <button onClick={() => changeMode('login')}>Back to sign in</button> : mode === 'register' ? <>Already on RALLYIQ? <button onClick={() => changeMode('login')}>Sign in</button></> : <>New to RALLYIQ? <button onClick={() => changeMode('register')}>Create an account</button></>}</p>
          <p className="auth-disclaimer">FRONTEND DEMO · AUTHENTICATION SERVICE NOT CONNECTED</p>
        </>}
      </div>
      <div className="auth-panel-foot"><span>© 2026 RALLYIQ</span><span>YOUR GAME, UNDERSTOOD.</span></div>
    </section>
  </main>
}
