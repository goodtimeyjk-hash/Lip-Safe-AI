/**
 * Lip-Safe AI - Web Audio API 사운드 신디사이저 헬퍼
 * AI 스캔 삐- 소리, 스캔 완료 챠임, SOS 비상 사이렌 소리를 생성합니다.
 */

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
  * 1초 AI 스캔 진행음 (Beep)
  */
export function playScanBeep() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    console.warn('Audio play error:', e);
  }
}

/**
 * 판독 완료 챠임음 (Success Chime)
 */
export function playSuccessChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.2); // G5

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(now + 0.4);
  } catch (e) {
    console.warn('Audio play error:', e);
  }
}

/**
 * 🚨 비상 긴급 SOS 경보 사이렌 음향 (Siren Effect)
 */
let sirenOsc = null;
let sirenInterval = null;

export function startEmergencySiren() {
  try {
    stopEmergencySiren();
    const ctx = getAudioContext();
    if (!ctx) return;

    sirenOsc = ctx.createOscillator();
    const gain = ctx.createGain();

    sirenOsc.type = 'sawtooth';
    sirenOsc.frequency.setValueAtTime(700, ctx.currentTime);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);

    sirenOsc.connect(gain);
    gain.connect(ctx.destination);
    sirenOsc.start();

    let high = false;
    sirenInterval = setInterval(() => {
      if (!ctx || !sirenOsc) return;
      high = !high;
      sirenOsc.frequency.setValueAtTime(high ? 950 : 650, ctx.currentTime);
    }, 400);
  } catch (e) {
    console.warn('Siren play error:', e);
  }
}

export function stopEmergencySiren() {
  if (sirenInterval) {
    clearInterval(sirenInterval);
    sirenInterval = null;
  }
  if (sirenOsc) {
    try {
      sirenOsc.stop();
      sirenOsc.disconnect();
    } catch (e) {}
    sirenOsc = null;
  }
}
