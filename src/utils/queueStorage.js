// Queue Storage Utility - Frontend-only synchronization
// This module handles all queue state management using localStorage and browser events

import SoundNotification from './soundNotification.js'

// Initialize sound notification system
const soundNotification = new SoundNotification()

class QueueStorage {
  constructor() {
    this.storageKey = 'cashier_queue_state'
    this.listeners = new Set()
    this.broadcastChannel = null
    
    // Initialize BroadcastChannel if supported
    if (typeof BroadcastChannel !== 'undefined') {
      this.broadcastChannel = new BroadcastChannel('queue_updates')
      this.broadcastChannel.addEventListener('message', this.handleBroadcastMessage.bind(this))
    }
    
    // Listen for storage events from other tabs
    window.addEventListener('storage', this.handleStorageEvent.bind(this))
    
    // Initialize default state if not exists
    this.initializeState()
    
    // Initialize sound system on first user interaction
    this.initializeSoundOnInteraction()
  }

  /**
   * Initialize sound system after user interaction (required by browsers)
   */
  initializeSoundOnInteraction() {
    const initializeSound = async () => {
      await soundNotification.initialize()
      // Remove event listeners after initialization
      document.removeEventListener('click', initializeSound)
      document.removeEventListener('keydown', initializeSound)
      document.removeEventListener('touchstart', initializeSound)
    }

    // Add event listeners for user interaction
    document.addEventListener('click', initializeSound, { once: true })
    document.addEventListener('keydown', initializeSound, { once: true })
    document.addEventListener('touchstart', initializeSound, { once: true })
  }

  initializeState() {
    const existingState = this.getState()
    if (!existingState) {
      const defaultState = {
        queue: [],
        windows: [
          { id: 1, window_name: 'Window 1', status: 'available', current_customer: null },
          { id: 2, window_name: 'Window 2', status: 'available', current_customer: null },
          { id: 3, window_name: 'Window 3', status: 'available', current_customer: null },
          { id: 4, window_name: 'Window 4', status: 'available', current_customer: null },
          { id: 5, window_name: 'Window 5', status: 'available', current_customer: null }
        ],
        nextNumber: 1,
        lastUpdated: Date.now()
      }
      this.setState(defaultState)
    }
  }

  getState() {
    try {
      const state = localStorage.getItem(this.storageKey)
      return state ? JSON.parse(state) : null
    } catch (error) {
      console.error('Error reading queue state:', error)
      return null
    }
  }

  setState(newState) {
    try {
      const stateWithTimestamp = {
        ...newState,
        lastUpdated: Date.now()
      }
      localStorage.setItem(this.storageKey, JSON.stringify(stateWithTimestamp))
      
      // Broadcast to other tabs using BroadcastChannel
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({
          type: 'state_update',
          state: stateWithTimestamp
        })
      }
      
      // Notify local listeners
      this.notifyListeners(stateWithTimestamp)
    } catch (error) {
      console.error('Error saving queue state:', error)
    }
  }

  handleStorageEvent(event) {
    if (event.key === this.storageKey && event.newValue) {
      try {
        const newState = JSON.parse(event.newValue)
        this.notifyListeners(newState)
      } catch (error) {
        console.error('Error handling storage event:', error)
      }
    }
  }

  handleBroadcastMessage(event) {
    if (event.data.type === 'state_update') {
      this.notifyListeners(event.data.state)
    }
  }

  notifyListeners(state) {
    this.listeners.forEach(listener => {
      try {
        listener(state)
      } catch (error) {
        console.error('Error in state listener:', error)
      }
    })
  }

  subscribe(listener) {
    this.listeners.add(listener)
    
    // Immediately call with current state
    const currentState = this.getState()
    if (currentState) {
      listener(currentState)
    }
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener)
    }
  }

  // Queue management methods
  addCustomer() {
    const state = this.getState()
    if (!state) return null

    const customerNumber = `A${String(state.nextNumber).padStart(3, '0')}`
    const newCustomer = {
      id: Date.now(),
      queue_number: customerNumber,
      timestamp: new Date().toISOString(),
      status: 'waiting'
    }

    const newState = {
      ...state,
      queue: [...state.queue, newCustomer],
      nextNumber: state.nextNumber + 1
    }

    this.setState(newState)
    return newCustomer
  }

  async callNextCustomer(windowId) {
    const state = this.getState()
    if (!state || state.queue.length === 0) return null

    const nextCustomer = state.queue[0]
    const updatedQueue = state.queue.slice(1)
    
    const updatedWindows = state.windows.map(window => {
      if (window.id === windowId) {
        return {
          ...window,
          status: 'serving',
          current_customer: nextCustomer.queue_number
        }
      }
      return window
    })

    const newState = {
      ...state,
      queue: updatedQueue,
      windows: updatedWindows
    }

    this.setState(newState)
    
    // Play sound notification
    try {
      await soundNotification.playCallNotification()
    } catch (error) {
      console.warn('Failed to play sound notification:', error)
    }
    
    return nextCustomer
  }

  completeService(windowId) {
    const state = this.getState()
    if (!state) return false

    const updatedWindows = state.windows.map(window => {
      if (window.id === windowId) {
        return {
          ...window,
          status: 'available',
          current_customer: null
        }
      }
      return window
    })

    const newState = {
      ...state,
      windows: updatedWindows
    }

    this.setState(newState)
    return true
  }

  resetQueue() {
    const state = this.getState()
    if (!state) return false

    const resetWindows = state.windows.map(window => ({
      ...window,
      status: 'available',
      current_customer: null
    }))

    const newState = {
      ...state,
      queue: [],
      windows: resetWindows,
      nextNumber: 1
    }

    this.setState(newState)
    return true
  }

  getQueueStatus() {
    return this.getState()
  }

  // Cleanup method
  destroy() {
    window.removeEventListener('storage', this.handleStorageEvent.bind(this))
    if (this.broadcastChannel) {
      this.broadcastChannel.close()
    }
    this.listeners.clear()
  }
}

// Create singleton instance
const queueStorage = new QueueStorage()

export default queueStorage

