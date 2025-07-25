import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Users, Clock, CheckCircle, AlertCircle, RotateCcw, Monitor } from 'lucide-react'
import queueStorage from './utils/queueStorage.js'
import './App.css'

function App() {
  const [queueState, setQueueState] = useState(null)
  const [selectedWindow, setSelectedWindow] = useState('')
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)

  // Subscribe to queue state changes
  useEffect(() => {
    const unsubscribe = queueStorage.subscribe((newState) => {
      setQueueState(newState)
    })

    return unsubscribe
  }, [])

  const handleAddCustomer = useCallback(() => {
    const newCustomer = queueStorage.addCustomer()
    if (newCustomer) {
      console.log('Added customer:', newCustomer.queue_number)
    }
  }, [])

  const handleCallNext = useCallback(async () => {
    if (!selectedWindow) {
      alert('Please select a window first')
      return
    }
    
    const windowId = parseInt(selectedWindow)
    const customer = await queueStorage.callNextCustomer(windowId)
    if (customer) {
      console.log('Called customer:', customer.queue_number, 'to window', windowId)
    } else {
      alert('No customers in queue')
    }
  }, [selectedWindow])

  const handleCompleteService = useCallback(() => {
    if (!selectedWindow) {
      alert('Please select a window first')
      return
    }
    
    const windowId = parseInt(selectedWindow)
    const success = queueStorage.completeService(windowId)
    if (success) {
      console.log('Completed service at window', windowId)
    }
  }, [selectedWindow])

  const handleResetQueue = useCallback(() => {
    const success = queueStorage.resetQueue()
    if (success) {
      console.log('Queue reset successfully')
      setIsResetDialogOpen(false)
    }
  }, [])

  if (!queueState) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const { queue, windows, nextNumber } = queueState
  const selectedWindowData = windows.find(w => w.id === parseInt(selectedWindow))
  const currentlyServing = selectedWindowData?.current_customer || 'None'
  const avgWaitTime = queue.length > 0 ? Math.max(1, Math.floor(queue.length * 2.5)) : 0

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Queue Management System</h1>
            <p className="text-gray-900 font-bold">{selectedWindowData?.window_name || 'None'}</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedWindow} onValueChange={setSelectedWindow}>
              <SelectTrigger className="w-40">
                <Monitor className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Select Window" />
              </SelectTrigger>
              <SelectContent>
                {windows.map((window) => (
                  <SelectItem key={window.id} value={window.id.toString()}>
                    {window.window_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Queue
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset Queue</DialogTitle>
                  <DialogDescription>
                    This will clear all customers from the queue and reset the numbering to A001. 
                    This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleResetQueue}>
                    Reset Queue
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Warning if no window selected */}
        {!selectedWindow && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-yellow-800">Please select your window to start serving customers</span>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total in Queue</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{queue.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Currently Serving</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentlyServing}</div>
              {selectedWindowData && (
                <p className="text-xs text-muted-foreground">
                  at {selectedWindowData.window_name}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgWaitTime} min</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Number</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">A{String(nextNumber).padStart(3, '0')}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Currently Serving */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Currently Serving
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedWindowData?.current_customer ? (
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {selectedWindowData.current_customer}
                  </div>
                  <p className="text-gray-600">at {selectedWindowData.window_name}</p>
                  <Button 
                    onClick={handleCompleteService}
                    className="mt-4"
                    variant="outline"
                  >
                    Complete Service
                  </Button>
                </div>
              ) : (
                <div className="text-center p-6">
                  <p className="text-gray-500 mb-4">No customer being served</p>
                  <Button 
                    onClick={handleCallNext}
                    disabled={!selectedWindow || queue.length === 0}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Call Next Customer
                  </Button>
                  {!selectedWindow && (
                    <p className="text-sm text-gray-500 mt-2">Select a window first</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Queue Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Queue Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleAddCustomer}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Add New Customer
              </Button>
              
              <Button 
                onClick={handleCallNext}
                disabled={!selectedWindow || queue.length === 0}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                Call Next Customer
              </Button>
              
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-gray-700 mb-2">Queue Management</p>
                <Button 
                  onClick={() => setIsResetDialogOpen(true)}
                  variant="outline" 
                  className="w-full text-pink-600 border-pink-200 hover:bg-pink-50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Waiting Queue */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Waiting Queue ({queue.length} customers)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {queue.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No customers in queue</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {queue.map((customer, index) => (
                  <div key={customer.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-semibold">{customer.queue_number}</span>
                      <Badge variant={index === 0 ? "default" : "secondary"}>
                        {index === 0 ? "Next" : `Position ${index + 1}`}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Wait: {Math.floor((Date.now() - new Date(customer.timestamp).getTime()) / 60000)} min
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App

