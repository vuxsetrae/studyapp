class SoundService {
  private context: AudioContext | null = null;
  private volume: number = 0.5;

  private getContext(): AudioContext {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.context;
  }

  setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
  }

  // Helper to create a satisfying beep/tone
  private playTone(freq: number, type: OscillatorType, duration: number, startTime: number = 0) {
    if (this.volume === 0) return; // Muted

    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

    // Master volume application
    const targetVolume = 0.3 * this.volume;

    // Smooth envelope for "satisfying" feel (no clicking)
    gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
    gain.gain.linearRampToValueAtTime(targetVolume, ctx.currentTime + startTime + 0.05); // Attack
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration); // Decay

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + startTime);
    osc.stop(ctx.currentTime + startTime + duration);
  }

  // Sound for "Iniciar" (Uplifting, rising)
  playStart() {
    if (this.volume === 0) return;
    const ctx = this.getContext();
    if (ctx.state === 'suspended') ctx.resume();

    // A chord or rising tone
    this.playTone(440, 'sine', 0.6); // A4
    this.playTone(554.37, 'sine', 0.6, 0.1); // C#5
  }

  // Sound for "Finalizar" (Solid, confirming)
  playStop() {
    if (this.volume === 0) return;
    const ctx = this.getContext();
    if (ctx.state === 'suspended') ctx.resume();

    // A lower, percussive sound
    this.playTone(300, 'triangle', 0.3);
    this.playTone(150, 'sine', 0.4);
  }

  // Sound for "Timer Expired" (Gentle Bell/Chime)
  playAlarm() {
    if (this.volume === 0) return;
    const ctx = this.getContext();
    if (ctx.state === 'suspended') ctx.resume();

    // Major triad arpeggio (C Major)
    const now = 0;
    this.playTone(523.25, 'sine', 1.5, now);       // C5
    this.playTone(659.25, 'sine', 1.5, now + 0.2); // E5
    this.playTone(783.99, 'sine', 2.0, now + 0.4); // G5
    this.playTone(1046.50, 'sine', 2.5, now + 0.8);// C6
  }
}

export const soundService = new SoundService();