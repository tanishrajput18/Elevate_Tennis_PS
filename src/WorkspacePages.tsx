import { ChangeEvent, DragEvent, FormEvent, useEffect, useState } from 'react'
import { ArrowRight, ArrowUpRight, Check, FileVideo2, MessageCircle, Search, Send, Sparkles, Upload, X } from 'lucide-react'

type Props = { page: string; onToast: (message: string) => void }

const demoMatches = [
  { date: '08 OCT', opponent: 'Jordan Lee', event: 'Club practice', score: '21 — 18', result: 'WON', sport: 'Badminton' },
  { date: '05 OCT', opponent: 'Sam Rivera', event: 'Saturday league', score: '17 — 21', result: 'LOST', sport: 'Badminton' },
  { date: '02 OCT', opponent: 'Casey Park', event: 'Club practice', score: '21 — 16', result: 'WON', sport: 'Badminton' },
  { date: '28 SEP', opponent: 'Taylor Kim', event: 'Open court', score: '21 — 19', result: 'WON', sport: 'Badminton' },
]

function PageIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <div className="workspace-intro"><span className="panel-kicker">{eyebrow}</span><h1>{title}</h1><p>{copy}</p></div>
}

function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [processed, setProcessed] = useState(false)
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string>()

  useEffect(() => {
    if (!file || !file.type.startsWith('video/')) {
      setPreviewUrl(undefined)
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  useEffect(() => {
    if (!uploading) return
    const timer = window.setTimeout(() => {
      if (progress >= 100) {
        setUploading(false)
        setProcessed(true)
      } else {
        setProgress(Math.min(progress + 12, 100))
      }
    }, 90)
    return () => window.clearTimeout(timer)
  }, [uploading, progress])

  const acceptFile = (selected: File | undefined) => {
    setError('')
    setProcessed(false)
    if (!selected) return
    if (!selected.type.startsWith('video/')) {
      setFile(null)
      setError('Choose a video file to continue.')
      return
    }
    if (selected.size > 500 * 1024 * 1024) {
      setFile(null)
      setError('This demo supports files up to 500 MB.')
      return
    }
    setFile(selected)
  }

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setDragging(false)
    acceptFile(event.dataTransfer.files[0])
  }

  const startUpload = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!file) {
      setError('Add a match video before starting the demo upload.')
      return
    }
    setError('')
    setProgress(0)
    setProcessed(false)
    setUploading(true)
  }

  const onSelectFile = (event: ChangeEvent<HTMLInputElement>) => acceptFile(event.target.files?.[0])

  return <div className="dashboard-content workspace-page">
    <PageIntro eyebrow="MATCH LIBRARY / ADD FOOTAGE" title="Bring your match into focus." copy="Add a recording to explore the upload experience. Video analysis is a frontend demo; no files are sent to a server." />
    <div className="workspace-demo-note"><Sparkles size={14} /><span><b>DEMO MODE</b> &nbsp;This page does not upload files or run AI processing.</span></div>
    <form className="upload-layout" onSubmit={startUpload}>
      <div>
        <label className={`upload-dropzone ${dragging ? 'upload-dropzone-active' : ''}`} onDragOver={event => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={onDrop}>
          <input type="file" accept="video/*" onChange={onSelectFile} />
          {file ? <><FileVideo2 size={26} /><strong>{file.name}</strong><span>{(file.size / (1024 * 1024)).toFixed(1)} MB · Ready to preview</span><span className="upload-change">Choose a different file</span></> : <><span className="upload-icon"><Upload size={19} /></span><strong>Drop your match video here</strong><span>or <u>browse files</u> from your device</span><small>MP4, MOV, WEBM · Up to 500 MB</small></>}
        </label>
        {error && <p className="workspace-error" role="alert">{error}</p>}
        {previewUrl && <video className="upload-video-preview" controls src={previewUrl}>Video preview</video>}
        {uploading && <div className="upload-progress"><div><span>DEMO UPLOAD</span><b>{progress}%</b></div><i><b style={{ width: `${progress}%` }} /></i></div>}
        {processed && <div className="upload-success"><Check size={16} /><span><strong>Demo upload complete.</strong> Real processing is not connected.</span></div>}
      </div>
      <div className="upload-details dash-panel">
        <div className="panel-heading"><div><span className="panel-kicker">MATCH DETAILS</span><h2>Set the scene</h2></div></div>
        <label>Sport<select defaultValue="Badminton"><option>Badminton</option><option>Tennis</option><option>Table tennis</option><option>Squash</option><option>Padel</option><option>Pickleball</option></select></label>
        <label>Match name<input type="text" placeholder="Saturday practice" /></label>
        <label>Opponent<input type="text" placeholder="Player name (optional)" /></label>
        <button className="button button-lime upload-start" type="submit" disabled={uploading}>{uploading ? 'Uploading demo…' : 'Continue with demo'} <ArrowRight size={15} /></button>
      </div>
    </form>
  </div>
}

type CoachMessage = { author: 'coach' | 'player'; text: string }

function coachReply(question: string) {
  const normalized = question.toLowerCase()
  if (normalized.includes('weakness') || normalized.includes('improve')) return 'Sample focus: try recovering to a balanced base position after each deep clear. This is a general demo suggestion, not feedback from your match footage.'
  if (normalized.includes('coverage') || normalized.includes('movement')) return 'Sample focus: compare your starting position with where the rally ends, then notice whether you recover toward the open side. No tracking data has been analyzed.'
  if (normalized.includes('shot') || normalized.includes('effective')) return 'Sample focus: vary your placement before increasing power. A mix of straight and cross-court shots can make the next opening easier to read.'
  return 'A useful sample training focus is to practice a controlled clear followed by a quick recovery step. Connect match footage and an AI service to get personalized coaching.'
}

function CoachPage() {
  const suggestions = ['How can I improve my badminton performance?', 'How was my court coverage?', 'Which shots were most effective?', 'What should I practice next?']
  const [messages, setMessages] = useState<CoachMessage[]>([{ author: 'coach', text: 'Welcome to your sample coaching space. Ask a question to explore the demo—your match data has not been analyzed.' }])
  const [draft, setDraft] = useState('')

  const send = (question = draft) => {
    const clean = question.trim()
    if (!clean) return
    setMessages(current => [...current, { author: 'player', text: clean }, { author: 'coach', text: coachReply(clean) }])
    setDraft('')
  }

  return <div className="dashboard-content workspace-page">
    <PageIntro eyebrow="RALLYIQ COACH / SAMPLE INTERACTIONS" title="A better question starts a better practice." copy="Explore example coaching responses. Personal analysis requires a connected match-analysis and AI service." />
    <div className="workspace-demo-note"><Sparkles size={14} /><span><b>SAMPLE COACH</b> &nbsp;Responses are prewritten examples, not AI-generated or based on your performance.</span></div>
    <section className="coach-workspace dash-panel">
      <div className="coach-head"><div className="coach-avatar"><Sparkles size={17} /></div><div><strong>RALLYIQ Coach</strong><span>Sample conversation · not connected to AI</span></div><span className="sample-pill">DEMO</span></div>
      <div className="coach-suggestions">{suggestions.map(question => <button key={question} onClick={() => send(question)}>{question}<ArrowUpRight size={13} /></button>)}</div>
      <div className="coach-messages" aria-live="polite">{messages.map((message, index) => <div key={`${message.author}-${index}`} className={`coach-message coach-message-${message.author}`}><span>{message.author === 'coach' ? 'RALLYIQ COACH / SAMPLE' : 'YOU'}</span><p>{message.text}</p></div>)}</div>
      <form className="coach-compose" onSubmit={event => { event.preventDefault(); send() }}><input value={draft} onChange={event => setDraft(event.target.value)} placeholder="Ask a question about your game…" aria-label="Message the sample coach" /><button type="submit" aria-label="Send message" disabled={!draft.trim()}><Send size={16} /></button></form>
    </section>
  </div>
}

function AnalysisPage() {
  const [rally, setRally] = useState(2)
  const rallyData = [
    { score: '04 — 03', label: 'Short serve · net return', insight: 'A controlled net return starts the point.' },
    { score: '05 — 03', label: 'Lift · cross-court clear', insight: 'The sample trajectory opens the far back corner.' },
    { score: '05 — 04', label: 'Drive · defensive lift', insight: 'A longer exchange creates time to reset.' },
    { score: '06 — 04', label: 'Drop shot · point won', insight: 'The final placement leaves the front court exposed.' },
  ]
  const current = rallyData[rally]
  return <div className="dashboard-content workspace-page">
    <PageIntro eyebrow="MATCH ROOM / SAMPLE RALLY" title="The point, from every angle." copy="Explore an illustrative rally timeline, shot path, and court positions. No match video has been analyzed." />
    <div className="workspace-demo-note"><Sparkles size={14} /><span><b>SAMPLE MATCH</b> &nbsp;Score, players, and shot analysis below are illustrative.</span></div>
    <div className="analysis-grid">
      <section className="dash-panel analysis-court-panel"><div className="panel-heading"><div><span className="panel-kicker">COURT VIEW / RALLY {String(rally + 1).padStart(2, '0')}</span><h2>{current.label}</h2></div><span className="sample-pill">DEMO</span></div>
        <div className="analysis-court"><svg viewBox="0 0 640 330" role="img" aria-label="Illustrative badminton court showing a sample shot trajectory">
          <rect x="76" y="34" width="488" height="262" /><path d="M76 165h488M178 34v262M462 34v262M178 105h284M178 225h284M320 34v262" />
          <path className="analysis-path" d={rally % 2 === 0 ? 'M180 248 Q260 214 320 88 T485 103' : 'M482 81 Q390 106 328 243 T166 216'} />
          <circle className="analysis-player" cx={rally % 2 === 0 ? 180 : 482} cy={rally % 2 === 0 ? 248 : 81} r="9" />
          <circle className="analysis-opponent" cx={rally % 2 === 0 ? 485 : 166} cy={rally % 2 === 0 ? 103 : 216} r="9" />
          <circle className="analysis-landing" cx={rally % 2 === 0 ? 485 : 166} cy={rally % 2 === 0 ? 103 : 216} r="16" />
        </svg><div className="analysis-court-legend"><span><i className="legend-dot" /> PLAYER 01</span><span><i /> PLAYER 02</span><span>SHOT PATH / SAMPLE</span></div></div>
      </section>
      <section className="dash-panel analysis-summary"><span className="panel-kicker">MATCH SNAPSHOT / SAMPLE</span><div className="analysis-score"><div><span>PLAYER 01</span><strong>06</strong></div><i>—</i><div><span>PLAYER 02</span><strong>04</strong></div></div><div className="analysis-stat"><span>Rally duration</span><strong>12.8 sec</strong></div><div className="analysis-stat"><span>Shot sequence</span><strong>04 contacts</strong></div><div className="analysis-stat"><span>Rally result</span><strong>Point won</strong></div><p className="analysis-sample-copy">{current.insight}</p></section>
    </div>
    <section className="dash-panel timeline-panel"><div className="panel-heading"><div><span className="panel-kicker">MATCH REPLAY / DEMO</span><h2>Rally timeline</h2></div><span className="panel-kicker">SELECT A POINT</span></div><div className="timeline-events">{rallyData.map((item, index) => <button key={item.score} className={rally === index ? 'timeline-event timeline-event-active' : 'timeline-event'} onClick={() => setRally(index)}><span>RALLY 0{index + 1}</span><strong>{item.score}</strong><small>{item.label}</small></button>)}</div></section>
  </div>
}

function MatchesPage({ onToast }: { onToast: Props['onToast'] }) {
  const [search, setSearch] = useState('')
  const [sport, setSport] = useState('All sports')
  const filtered = demoMatches.filter(match => `${match.opponent} ${match.event}`.toLowerCase().includes(search.toLowerCase()) && (sport === 'All sports' || match.sport === sport))
  return <div className="dashboard-content workspace-page">
    <PageIntro eyebrow="MATCH LIBRARY / HISTORY" title="Every match moves you forward." copy="Review your recent match history. Current entries are sample data for this frontend preview." />
    <div className="match-filters"><label className="match-search"><Search size={16} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search opponents or matches" /></label><select value={sport} onChange={event => setSport(event.target.value)} aria-label="Filter by sport"><option>All sports</option><option>Badminton</option></select><button className="button button-lime" onClick={() => onToast('Create match is a demo action; match storage is not connected.')}>Create match <ArrowRight size={14} /></button></div>
    <section className="dash-panel match-history"><div className="panel-heading"><div><span className="panel-kicker">RECENT MATCHES / SAMPLE DATA</span><h2>{filtered.length} matches</h2></div><span className="sample-pill">DEMO</span></div>
      {filtered.length ? filtered.map(match => <div className="history-row" key={match.date}><span className="history-date">{match.date}</span><div className="history-opponent"><strong>vs. {match.opponent}</strong><span>{match.event} · {match.sport}</span></div><strong className="history-score">{match.score}</strong><span className={match.result === 'WON' ? 'history-result' : 'history-result history-result-loss'}>{match.result}</span><ArrowUpRight size={15} /></div>) : <p className="empty-search">No sample matches match this search.</p>}
    </section>
  </div>
}

function MorePage({ page, onToast }: Props) {
  const details: Record<string, { eyebrow: string; title: string; copy: string; action: string }> = {
    Tournaments: { eyebrow: 'COMPETE / DISCOVERY', title: 'Find your next court.', copy: 'Tournament discovery and registration will appear here when connected to your club or competition data.', action: 'Explore sample tournaments' },
    'Courts & clubs': { eyebrow: 'YOUR LOCAL GAME', title: 'The next match starts nearby.', copy: 'Find clubs, courts, and availability when location and venue services are connected.', action: 'Browse sample courts' },
    Community: { eyebrow: 'PLAY TOGETHER', title: 'Good games bring people together.', copy: 'Player discovery and match invitations are part of the product roadmap. No community profiles are connected in this preview.', action: 'Explore the community demo' },
    Settings: { eyebrow: 'YOUR ACCOUNT', title: 'Make RALLYIQ yours.', copy: 'Account preferences are shown as a frontend preview. Authentication and profile storage are not connected.', action: 'Save demo preferences' },
  }
  const content = details[page] ?? details.Settings
  return <div className="dashboard-content workspace-page">
    <PageIntro eyebrow={content.eyebrow} title={content.title} copy={content.copy} />
    <section className="dash-panel future-page"><span className="sample-pill">FRONTEND PREVIEW</span><h2>{page}</h2><p>{content.copy}</p><button className="button button-lime" onClick={() => onToast(`${page} is a frontend preview; connect its service to enable live data.`)}>{content.action} <ArrowRight size={15} /></button></section>
  </div>
}

export default function WorkspacePages({ page, onToast }: Props) {
  if (page === 'Video upload') return <UploadPage />
  if (page === 'AI Coach') return <CoachPage />
  if (page === 'Match analysis') return <AnalysisPage />
  if (page === 'My matches') return <MatchesPage onToast={onToast} />
  return <MorePage page={page} onToast={onToast} />
}
