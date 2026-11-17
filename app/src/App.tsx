// Setup check (18 Nov): proves on-device and cloud answers both work, with the
// source label read from the SDK, before any product features are built.
import { useEffect, useState } from 'react'
import { InferenceSource } from 'firebase/ai'
import { isConfigured, CLOUD_MODEL } from './firebase'
import { getDeviceStatus, type DeviceStatus } from './ai/deviceStatus'
import { getSenseModel, pickSense, type Mode, type SenseResult } from './ai/pickSense'
import { CASES } from './feasibility/cases'

interface Row {
  result?: SenseResult
  error?: string
}

const STATUS_TEXT: Record<DeviceStatus, string> = {
  available: 'Ready: this device can run Gemini Nano.',
  downloadable: 'This device can run Gemini Nano, but it needs downloading first.',
  downloading: 'Gemini Nano is downloading.',
  unavailable: 'This device cannot run Gemini Nano. Answers will come from the cloud.',
  unsupported: 'This browser has no built-in AI (normal on phones). Answers will come from the cloud.',
}

// A badge alone doesn't prove Gemini Nano ran: stub or non-Gemini browser models also
// report on-device. The setup check therefore also requires correct known answers.
function Badge({ source }: { source: SenseResult['source'] }) {
  if (source === InferenceSource.ON_DEVICE) return <span className="badge device">On this device</span>
  if (source === InferenceSource.IN_CLOUD) return <span className="badge cloud">Google cloud</span>
  return <span className="badge unknown">Source not reported</span>
}

export default function App() {
  const [status, setStatus] = useState<DeviceStatus | null>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [setupError, setSetupError] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>('prefer_on_device')
  const [rows, setRows] = useState<Row[]>([])
  const [running, setRunning] = useState(false)

  useEffect(() => {
    getDeviceStatus().then(setStatus)
  }, [])

  async function setUpDevice() {
    // Must run from a click: Chrome only allows the model download after a user action.
    setSetupError(null)
    try {
      const model = getSenseModel('prefer_on_device')
      if (typeof model.initializeDeviceModel !== 'function') throw new Error('This Firebase SDK has no initializeDeviceModel().')
      setProgress(0)
      await model.initializeDeviceModel((p) => setProgress(p))
      setProgress(1)
      setStatus(await getDeviceStatus())
    } catch (e) {
      setSetupError(e instanceof Error ? e.message : String(e))
    }
  }

  async function runAll() {
    setRunning(true)
    setRows([])
    const out: Row[] = []
    for (const c of CASES) {
      try {
        out.push({ result: await pickSense(mode, c.sentence, c.word, c.senses) })
      } catch (e) {
        out.push({ error: e instanceof Error ? e.message : String(e) })
      }
      setRows([...out])
    }
    setRunning(false)
  }

  const correct = rows.filter((r, i) => r.result?.choice === CASES[i].answer).length

  return (
    <main>
      <h1>Ladder: setup check</h1>
      <p className="lede">Checks that Ladder can get word meanings from Gemini on this device and from Google's cloud.</p>

      {!isConfigured && (
        <p className="warn">Firebase isn't connected yet. Add the project settings to <code>app/.env.local</code> (see <code>app/.env.example</code>).</p>
      )}

      <section>
        <h2>1. This device</h2>
        <p>{status ? STATUS_TEXT[status] : 'Checking…'}</p>
        {(status === 'downloadable' || status === 'downloading') && (
          <button onClick={setUpDevice} disabled={!isConfigured || progress !== null}>
            Set up on-device AI
          </button>
        )}
        {progress !== null && progress < 1 && <p>Downloading: {Math.round(progress * 100)}%</p>}
        {setupError && <p className="error">{setupError}</p>}
      </section>

      <section>
        <h2>2. Test five sentences</h2>
        <label>
          Where to run:{' '}
          <select value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
            <option value="prefer_on_device">On device if possible, otherwise cloud</option>
            <option value="only_on_device">On device only</option>
            <option value="only_in_cloud">Cloud only ({CLOUD_MODEL})</option>
          </select>
        </label>{' '}
        <button onClick={runAll} disabled={!isConfigured || running}>
          {running ? 'Running…' : 'Run test'}
        </button>

        <ol className="cases">
          {CASES.map((c, i) => {
            const row = rows[i]
            const ok = row?.result && row.result.choice === c.answer
            return (
              <li key={i}>
                <p>
                  “{c.sentence}” <strong>{c.word}</strong>
                </p>
                {row?.result && (
                  <p>
                    {ok ? '✅' : '❌'} Answer {row.result.choice} (expected {c.answer}) · {row.result.ms} ms ·{' '}
                    <Badge source={row.result.source} />
                  </p>
                )}
                {row?.error && <p className="error">{row.error}</p>}
              </li>
            )
          })}
        </ol>
        {rows.length === CASES.length && (
          <p>
            <strong>
              {correct} of {CASES.length} correct.
            </strong>
          </p>
        )}
      </section>
    </main>
  )
}
