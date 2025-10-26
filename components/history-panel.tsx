"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, History, Trash2, Sparkles, RefreshCw, Search, Star, StarOff, X } from "lucide-react"
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
  isFavorite?: boolean
}

interface HistoryPanelProps {
  userId: string | null
  onSelectHistory: (item: HistoryItem) => void
  onOpenChange?: (isOpen: boolean) => void
}

export function HistoryPanel({ userId, onSelectHistory, onOpenChange }: HistoryPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterMode, setFilterMode] = useState<"all" | "analyze" | "convert" | "favorites">("all")
  
  const handleToggle = () => {
    const newState = !isOpen
    setIsOpen(newState)
    onOpenChange?.(newState)
  }
  const [history, setHistory] = useState<HistoryItem[]>([])

  const loadHistory = useCallback(() => {
    // Load from localStorage for now (can be replaced with Supabase later)
    if (!userId) return;
    
    const stored = localStorage.getItem(`history_${userId}`)
    if (stored) {
      const parsed = JSON.parse(stored)
      setHistory(parsed.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      })))
    }
  }, [userId])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

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

  const toggleFavorite = (id: string) => {
    const updated = history.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    )
    setHistory(updated)
    if (userId) {
      localStorage.setItem(`history_${userId}`, JSON.stringify(updated))
    }
  }

  const filteredHistory = useMemo(() => {
    let filtered = history

    // Filter by mode
    if (filterMode === "analyze") {
      filtered = filtered.filter(item => item.mode === "analyze")
    } else if (filterMode === "convert") {
      filtered = filtered.filter(item => item.mode === "convert")
    } else if (filterMode === "favorites") {
      filtered = filtered.filter(item => item.isFavorite)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item => 
        item.language.toLowerCase().includes(query) ||
        item.inputCode.toLowerCase().includes(query) ||
        item.targetLanguage?.toLowerCase().includes(query) ||
        item.complexity?.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [history, filterMode, searchQuery])

  if (!userId) return null

  return (
    <>
      {/* Toggle Button */}
      <Button
        variant={isOpen ? "default" : "outline"}
        size="icon"
        className={cn(
          "fixed top-[88px] z-20 shadow-md transition-all duration-300",
          isOpen ? "left-[336px]" : "left-4"
        )}
        onClick={handleToggle}
      >
        <History className="h-5 w-5" />
      </Button>

      {/* Side Panel */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-80 border-r z-10 transition-transform duration-300 ease-in-out overflow-hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col bg-background/95 backdrop-blur-md">
          {/* Header spacer to align with top bar - exact height match */}
          <div className="h-[73px] border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-md flex-shrink-0"></div>
          
          <div className="p-4 border-b backdrop-blur-sm space-y-3">
            <div className="flex items-center justify-between">
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
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-8 h-9"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-9 w-9"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* Filter Buttons */}
            <div className="flex gap-1 flex-wrap">
              <Button
                variant={filterMode === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterMode("all")}
                className="text-xs h-7"
              >
                All
              </Button>
              <Button
                variant={filterMode === "analyze" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterMode("analyze")}
                className="text-xs h-7"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Analyze
              </Button>
              <Button
                variant={filterMode === "convert" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterMode("convert")}
                className="text-xs h-7"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Convert
              </Button>
              <Button
                variant={filterMode === "favorites" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterMode("favorites")}
                className="text-xs h-7"
              >
                <Star className="h-3 w-3 mr-1" />
                Favorites
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              {filteredHistory.length} {filteredHistory.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {history.length === 0 ? "No history yet" : "No matching items"}
                </p>
                <p className="text-xs">
                  {history.length === 0 
                    ? "Your code analysis will appear here" 
                    : "Try adjusting your search or filters"}
                </p>
              </div>
            ) : (
              filteredHistory.map((item) => (
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
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(item.id)
                          }}
                          aria-label={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                          {item.isFavorite ? (
                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          ) : (
                            <StarOff className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteHistoryItem(item.id)
                          }}
                          aria-label="Delete history item"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
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
          onClick={handleToggle}
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
