// What Chrome says about its built-in model on this device.
// 'unsupported' means the browser has no Prompt API at all (phones, other browsers).
export type DeviceStatus = 'available' | 'downloadable' | 'downloading' | 'unavailable' | 'unsupported'

interface LanguageModelGlobal {
  availability(options?: unknown): Promise<string>
}

export async function getDeviceStatus(): Promise<DeviceStatus> {
  const lm = (globalThis as unknown as { LanguageModel?: LanguageModelGlobal }).LanguageModel
  if (!lm) return 'unsupported'
  try {
    const s = await lm.availability({
      expectedInputs: [{ type: 'text', languages: ['en'] }],
      expectedOutputs: [{ type: 'text', languages: ['en'] }],
    })
    const known: readonly string[] = ['available', 'downloadable', 'downloading', 'unavailable']
    return known.includes(s) ? (s as DeviceStatus) : 'unavailable'
  } catch {
    return 'unavailable'
  }
}
