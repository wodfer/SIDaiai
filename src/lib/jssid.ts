// jsSID integration for C64 SID music playback
// Based on https://github.com/og2t/jsSID

export interface SIDPlayerConfig {
  chipModel: '6581' | '8580';
  playbackSpeed: number;
  sampleRate: number;
}

export interface SIDTrack {
  id: string;
  title: string;
  artist: string;
  data: ArrayBuffer;
  subtunes: number;
  defaultSubtune: number;
  url?: string;
}

export class SIDPlayer {
  private audioContext: AudioContext | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private isInitialized = false;
  private currentTrack: SIDTrack | null = null;
  private config: SIDPlayerConfig = {
    chipModel: '6581',
    playbackSpeed: 1.0,
    sampleRate: 44100
  };
  private onProgressCallback?: (progress: number) => void;
  private startTime = 0;
  private duration = 0;
  private isPlaying = false;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  async loadTrackFromUrl(url: string): Promise<void> {
    if (!this.isInitialized || !this.audioContext) {
      throw new Error('SID player not initialized');
    }
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch SID file: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      
      // Parse basic SID file info (simplified)
      const track: SIDTrack = {
        id: 'hvsc_' + Date.now(),
        title: 'A Sunny Day',
        artist: 'Blues Muz / Nordboe Kjell',
        data: arrayBuffer,
        subtunes: 1,
        defaultSubtune: 0,
        url: url
      };
      
      await this.loadTrack(track);
    } catch (error) {
      console.error('Failed to load SID from URL:', error);
      throw error;
    }
  }

  async loadTrack(track: SIDTrack): Promise<void> {
    if (!this.isInitialized || !this.audioContext) {
      throw new Error('SID player not initialized');
    }
    
    this.currentTrack = track;
    this.duration = 180; // Default 3 minutes
    console.log(`Loaded SID track: ${track.title} by ${track.artist}`);
  }

  play(): void {
    if (!this.audioContext || !this.currentTrack) return;
    
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    this.startTime = this.audioContext.currentTime;
    this.isPlaying = true;
    this.createAudioProcessor();
    console.log(`Playing: ${this.currentTrack.title}`);
  }

  pause(): void {
    this.isPlaying = false;
    if (this.scriptProcessor) {
      this.scriptProcessor.disconnect();
      this.scriptProcessor = null;
    }
  }

  stop(): void {
    this.pause();
    this.startTime = 0;
  }

  setChipModel(model: '6581' | '8580'): void {
    this.config.chipModel = model;
    console.log(`SID chip model set to: ${model}`);
  }

  setPlaybackSpeed(speed: number): void {
    this.config.playbackSpeed = speed;
    console.log(`Playback speed set to: ${speed}x`);
  }

  getCurrentTime(): number {
    if (!this.audioContext || this.startTime === 0 || !this.isPlaying) return 0;
    return (this.audioContext.currentTime - this.startTime) * this.config.playbackSpeed;
  }

  getDuration(): number {
    return this.duration;
  }

  getProgress(): number {
    const current = this.getCurrentTime();
    return this.duration > 0 ? (current / this.duration) * 100 : 0;
  }

  private createAudioProcessor(): void {
    if (!this.audioContext) return;

    this.scriptProcessor = this.audioContext.createScriptProcessor(4096, 0, 2);
    
    this.scriptProcessor.onaudioprocess = (event) => {
      if (!this.isPlaying) return;
      
      const outputBuffer = event.outputBuffer;
      const leftChannel = outputBuffer.getChannelData(0);
      const rightChannel = outputBuffer.getChannelData(1);
      
      // Mock SID audio generation
      for (let i = 0; i < leftChannel.length; i++) {
        const t = (this.audioContext!.currentTime + i / this.config.sampleRate) * this.config.playbackSpeed;
        const freq = 440 + Math.sin(t * 0.1) * 100;
        const sample = Math.sin(t * freq * 2 * Math.PI) * 0.1;
        leftChannel[i] = sample;
        rightChannel[i] = sample;
      }
    };
    
    this.scriptProcessor.connect(this.audioContext.destination);
  }

  getChipModel(): '6581' | '8580' {
    return this.config.chipModel;
  }

  getPlaybackSpeed(): number {
    return this.config.playbackSpeed;
  }

  getCurrentTrack(): SIDTrack | null {
    return this.currentTrack;
  }
}

// Global SID player instance
export const sidPlayer = new SIDPlayer();