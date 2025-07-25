/**
 * Sound Notification Utility
 * Handles audio notifications for queue management system
 */

class SoundNotification {
  constructor() {
    this.audioContext = null
    this.isInitialized = false
  }

  /**
   * Initialize the audio system
   * Must be called after user interaction due to browser autoplay policies
   */
  async initialize() {
    if (this.isInitialized) return true

    try {
      // Try to use Web Audio API first
      if (window.AudioContext || window.webkitAudioContext) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext
        this.audioContext = new AudioContextClass()
        
        // Resume audio context if it's suspended (required by some browsers)
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume()
        }
      }

      this.isInitialized = true
      console.log('Sound notification system initialized')
      return true
    } catch (error) {
      console.warn('Failed to initialize Web Audio API:', error)
      this.isInitialized = true
      return true
    }
  }

  /**
   * Generate a notification beep sound using Web Audio API
   */
  generateBeep(frequency = 800, duration = 200, volume = 0.1) {
    if (!this.audioContext) return false

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.frequency.value = frequency
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration / 1000)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + duration / 1000)

      return true
    } catch (error) {
      console.warn('Failed to generate beep with Web Audio API:', error)
      return false
    }
  }

  /**
   * Play a notification sound for calling next customer
   */
  async playCallNotification() {
    // Ensure audio system is initialized
    if (!this.isInitialized) {
      await this.initialize()
    }

    try {
      // Play a pleasant two-tone chime
      if (this.audioContext) {
        // First tone (higher pitch)
        this.generateBeep(880, 300, 0.15)
        
        // Second tone (lower pitch) - delayed
        setTimeout(() => {
          this.generateBeep(660, 400, 0.15)
        }, 200)
        
        console.log('Call notification sound played')
        return true
      } else {
        // Fallback: try to play a system beep
        this.playFallbackSound()
        return true
      }
    } catch (error) {
      console.warn('Failed to play call notification:', error)
      this.playFallbackSound()
      return false
    }
  }

  /**
   * Fallback sound method for browsers that don't support Web Audio API
   */
  playFallbackSound() {
    try {
      // Try to use the system beep if available
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        // Use speech synthesis as a fallback
        const utterance = new SpeechSynthesisUtterance('')
        utterance.volume = 0.1
        utterance.rate = 10
        utterance.pitch = 2
        window.speechSynthesis.speak(utterance)
      }
      console.log('Fallback sound notification attempted')
    } catch (error) {
      console.warn('All sound notification methods failed:', error)
    }
  }
}

export default SoundNotification
