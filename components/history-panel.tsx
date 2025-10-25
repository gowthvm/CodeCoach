"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, History, Trash2, Sparkles, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface HistoryItem {
  id: string
  timestamp: Date
  mode: "analyze" | "convert"
  inputCode: string
  outputCode: string
  language: string
  complexity?: string
  targetLanguage?: string
}

interface HistoryPanelProps {
  userId: string | null
  onSelectHistory: (item: HistoryItem) => void
}

export function HistoryPanel({ userId, onSelectHistory }: HistoryPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    if (userId) {
      loadHistory()
    }
  }, [userId])

  const loadHistory = () => {
    // Load from localStorage for now (can be replaced with Supabase later)
    const stored = localStorage.getItem(`history_${userId}`)
    if (stored) {
      const parsed = JSON.parse(stored)
      setHistory(parsed.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      })))
    }
  }

  const saveToHistory = (item: Omit<HistoryItem, "id" | "timestamp">) => {
    if (!userId) return

    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: new Date()
    }

    const updated = [newItem, ...history].slice(0, 50) // Keep last 50 items
    setHistory(updated)
    localStorage.setItem(`history_${userId}`, JSON.stringify(updated))
  }

  const deleteHistoryItem = (id: string) => {
    const updated = history.filter(item => item.id !== id)
    setHistory(updated)
    if (userId) {
      localStorage.setItem(`history_${userId}`, JSON.stringify(updated))
    }
  }

  const clearHistory = () => {
    setHistory([])
    if (userId) {
      localStorage.removeItem(`history_${userId}`)
    }
  }

  if (!userId) return null

  return (
    <>
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "fixed top-20 z-20 transition-all duration-300",
          isOpen ? "right-80" : "right-4"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      {/* Side Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-80 bg-background border-l shadow-lg z-10 transition-transform duration-300 ease-in-out overflow-hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">History</h2>
              </div>
              {history.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="text-xs"
                >
                  Clear All
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Your recent code analysis and conversions
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No history yet</p>
                <p className="text-xs">Your code analysis will appear here</p>
              </div>
            ) : (
              history.map((item) => (
                <Card
                  key={item.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onSelectHistory(item)}
                >
                  <CardHeader className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-sm flex items-center gap-2">
                          {item.mode === "analyze" ? (
                            <Sparkles className="h-3 w-3" />
                          ) : (
                            <RefreshCw className="h-3 w-3" />
                          )}
                          {item.mode === "analyze" ? "Analysis" : "Conversion"}
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {item.timestamp.toLocaleDateString()} {item.timestamp.toLocaleTimeString()}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteHistoryItem(item.id)
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Language:</span>
                        <span className="text-muted-foreground">{item.language}</span>
                      </div>
                      {item.mode === "analyze" && item.complexity && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Level:</span>
                          <span className="text-muted-foreground capitalize">{item.complexity}</span>
                        </div>
                      )}
                      {item.mode === "convert" && item.targetLanguage && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">To:</span>
                          <span className="text-muted-foreground">{item.targetLanguage}</span>
                        </div>
                      )}
                      <div className="mt-2 p-2 bg-muted rounded text-xs font-mono truncate">
                        {item.inputCode.split('\n')[0]}...
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-[5] transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

// Export function to save history from parent component
export const saveHistoryItem = (
  userId: string | null,
  item: Omit<HistoryItem, "id" | "timestamp">
) => {
  if (!userId) return

  const stored = localStorage.getItem(`history_${userId}`)
  const history = stored ? JSON.parse(stored) : []

  const newItem: HistoryItem = {
    ...item,
    id: Date.now().toString(),
    timestamp: new Date()
  }

  const updated = [newItem, ...history].slice(0, 50)
  localStorage.setItem(`history_${userId}`, JSON.stringify(updated))
}
