import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Clock, Users, Monitor } from 'lucide-react'
import queueStorage from './utils/queueStorage.js'

function PublicDisplay() {
  const [queueState, setQueueState] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Subscribe to queue state changes
  useEffect(() => {
    const unsubscribe = queueStorage.subscribe((newState) => {
      setQueueState(newState)
    })

    return unsubscribe
  }, [])

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!queueState) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const { queue, windows } = queueState
  const servingWindows = windows.filter(w => w.current_customer)
  const totalWaiting = queue.length
  const avgWaitTime = totalWaiting > 0 ? Math.max(1, Math.floor(totalWaiting * 2.5)) : 0
  const windowsServing = servingWindows.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Queue Status</h1>
          <p className="text-xl text-gray-600">
            {currentTime.toLocaleTimeString('en-US', { 
              hour12: true,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </p>
        </div>

        {/* Currently Serving Section */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl font-bold text-blue-600 flex items-center justify-center gap-3">
              <Monitor className="w-8 h-8" />
              Now Serving
            </CardTitle>
          </CardHeader>
          <CardContent>
            {servingWindows.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {servingWindows.map((window) => (
                  <div key={window.id} className="text-center p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                    <div className="text-6xl font-bold text-blue-600 mb-2">
                      {window.current_customer}
                    </div>
                    <p className="text-lg text-gray-700 font-medium">
                      at {window.window_name}
                    </p>
                    <Badge className="mt-2 bg-green-500 hover:bg-green-600">
                      Currently Serving
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-2xl text-gray-500 mb-4">No customers currently being served</p>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  All Windows Available
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <Users className="w-6 h-6" />
                Queue Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">{totalWaiting}</div>
                <p className="text-lg text-gray-600">People Waiting</p>
              </div>
              
              <div className="text-center">
                <div className="text-5xl font-bold text-orange-500 mb-2">{avgWaitTime}</div>
                <p className="text-lg text-gray-600">Avg Wait (min)</p>
              </div>
              
              <div className="text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">{windowsServing}</div>
                <p className="text-lg text-gray-600">Windows Serving</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <Monitor className="w-6 h-6" />
                Window Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Service Hours</h3>
                  <p className="text-gray-600">Monday - Friday</p>
                  <p className="text-gray-600">9:00 AM - 5:00 PM</p>
                  <Badge className="mt-2 bg-green-500 hover:bg-green-600">
                    Currently Open
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next in Queue */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-800 text-center">
              Next in Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            {queue.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {queue.slice(0, 10).map((customer, index) => (
                  <div key={customer.id} className="text-center p-4 bg-gray-50 rounded-lg border">
                    <div className="text-2xl font-bold text-gray-800 mb-2">
                      {customer.queue_number}
                    </div>
                    <Badge 
                      variant={index === 0 ? "default" : "secondary"}
                      className={index === 0 ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                    >
                      {index === 0 ? "Next Up" : `Position ${index + 1}`}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-2">
                      Wait: {Math.floor((Date.now() - new Date(customer.timestamp).getTime()) / 60000)} min
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-2xl text-gray-500">No customers in queue</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-lg">Please wait for your number to be called and proceed to the indicated window</p>
          <div className="flex justify-center items-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>Next Up</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Currently Serving</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
              <span>Closed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublicDisplay

