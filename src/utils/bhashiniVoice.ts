import { LanguageCode } from '../types';

class VoiceEngine {
  private synth: SpeechSynthesis | null = null;
  private audioCtx: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  private getAudioContext(): AudioContext {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    return this.audioCtx!;
  }

  // Play a gentle, soothing chime using Web Audio API
  playGentleTone(type: 'chime' | 'success' | 'soft' = 'chime') {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      if (type === 'chime') {
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.7);
      } else if (type === 'success') {
        // Calm warm chord
        [523.25, 659.25, 783.99].forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(freq, now + i * 0.1);
          g.gain.setValueAtTime(0.08, now + i * 0.1);
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.8);
          o.connect(g);
          g.connect(ctx.destination);
          o.start(now + i * 0.1);
          o.stop(now + i * 0.1 + 0.8);
        });
      } else {
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch {
      // Audio context might be restricted
    }
  }

  getLanguageTag(lang: LanguageCode = 'as'): string {
    const langMap: Record<LanguageCode, string> = {
      as: 'as-IN',
      brx: 'brx-IN',
      mni: 'mni-IN',
      lus: 'lus-IN',
      kha: 'kha-IN',
      grt: 'grt-IN',
      trp: 'trp-IN',
      nag: 'en-IN',
      ne: 'ne-NP',
      hi: 'hi-IN',
      en: 'en-IN',
    };
    return langMap[lang] || 'en-IN';
  }

  // Speak text in appropriate Indian or English voice
  speak(text: string, lang: LanguageCode = 'as', onEnd?: () => void) {
    if (!this.synth) {
      if (onEnd) onEnd();
      return;
    }

    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.88; // Gentle, slightly slower for elderly clarity
    utterance.pitch = 1.0;

    // Map language code to BCF47 tag
    const langMap: Record<LanguageCode, string> = {
      as: 'as-IN',
      brx: 'brx-IN',
      mni: 'mni-IN',
      lus: 'lus-IN',
      kha: 'kha-IN',
      grt: 'grt-IN',
      trp: 'trp-IN',
      nag: 'en-IN',
      ne: 'ne-NP',
      hi: 'hi-IN',
      en: 'en-IN',
    };

    utterance.lang = langMap[lang] || 'en-IN';

    // Try finding matching voice
    const voices = this.synth.getVoices();
    const matchedVoice = voices.find(v => v.lang.startsWith(langMap[lang]) || v.lang.startsWith(lang));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    } else {
      // fallback to any Indian English or default voice
      const indianVoice = voices.find(v => v.lang.includes('IN') || v.lang.includes('en'));
      if (indianVoice) utterance.voice = indianVoice;
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  isSpeaking(): boolean {
    return !!this.synth?.speaking;
  }
}

export const bhashiniVoice = new VoiceEngine();
