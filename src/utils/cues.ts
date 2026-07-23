let ctx: AudioContext | null = null

function audioContext(): AudioContext | null {
  const Ctor = window.AudioContext
  if (!Ctor) return null
  ctx ??= new Ctor()
  return ctx
}

export function unlockAudio(): void {
  const c = audioContext()
  if (c && c.state === 'suspended') void c.resume()
}

export function playRestDoneCue(): void {
  if (navigator.vibrate) navigator.vibrate([200, 100, 200])
  const c = audioContext()
  if (!c) return
  const now = c.currentTime
  for (const [offset, freq] of [
    [0, 880],
    [0.25, 880],
    [0.5, 1320],
  ] as const) {
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.001, now + offset)
    gain.gain.exponentialRampToValueAtTime(0.4, now + offset + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.2)
    osc.connect(gain)
    gain.connect(c.destination)
    osc.start(now + offset)
    osc.stop(now + offset + 0.22)
  }
}
