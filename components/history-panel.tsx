"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { History, Trash2, Sparkles, RefreshCw, Search, Star, StarOff, X, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EmptyState } from "@/components/empty-state"

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
      <motion.div
        initial={false}
        animate={{ left: isOpen ? 320 : 16 }} // 320px is w-80
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-[88px] z-40"
      >
        <Button
          variant="default"
          size="icon"
          className="shadow-lg rounded-full h-10 w-10 bg-primary text-primary-foreground hover:scale-110 transition-transform"
          onClick={handleToggle}
        >
          {isOpen ? <ChevronRight className="h-5 w-5 rotate-180" /> : <History className="h-5 w-5" />}
        </Button>
      </motion.div>

      {/* Side Panel */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full w-80 border-r z-30 glass shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header spacer to align with top bar */}
        <div className="h-[73px] flex-shrink-0"></div>

        <div className="p-4 border-b bg-white/5 dark:bg-black/5 backdrop-blur-sm space-y-3">
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
                className="text-xs hover:text-destructive"
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
              className="pl-8 pr-8 h-9 bg-background/50 border-none focus:ring-1 focus:ring-primary/50"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-9 w-9 hover:bg-transparent"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-1 flex-wrap">
            <Button
              variant={filterMode === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterMode("all")}
              className="text-xs h-7 rounded-full"
            >
              All
            </Button>
            <Button
              variant={filterMode === "analyze" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterMode("analyze")}
              className="text-xs h-7 rounded-full"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Analyze
            </Button>
            <Button
              variant={filterMode === "convert" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterMode("convert")}
              className="text-xs h-7 rounded-full"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Convert
            </Button>
            <Button
              variant={filterMode === "favorites" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterMode("favorites")}
              className="text-xs h-7 rounded-full"
            >
              <Star className="h-3 w-3 mr-1" />
              Favorites
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            {filteredHistory.length} {filteredHistory.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3 pb-20">
            {filteredHistory.length === 0 ? (
              <EmptyState
                icon={History}
                title={history.length === 0 ? "No history yet" : "No matching items"}
                description={history.length === 0
                  ? "Your code analysis will appear here"
                  : "Try adjusting your search or filters"}
              />
            ) : (
              <AnimatePresence>
                {filteredHistory.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className="cursor-pointer hover:shadow-md transition-all duration-200 border-border/50 bg-card/50 hover:bg-card/80 group"
                      onClick={() => onSelectHistory(item)}
                    >
                      <CardHeader className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-sm flex items-center gap-2">
                              {item.mode === "analyze" ? (
                                <span className="flex items-center text-blue-500 dark:text-blue-400">
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  Analysis
                                </span>
                              ) : (
                                <span className="flex items-center text-purple-500 dark:text-purple-400">
                                  <RefreshCw className="h-3 w-3 mr-1" />
                                  Conversion
                                </span>
                              )}
                            </CardTitle>
                            <CardDescription className="text-xs mt-1 font-mono">
                              {item.timestamp.toLocaleDateString()} • {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </CardDescription>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 hover:bg-background/80"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleFavorite(item.id)
                              }}
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
                              className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteHistoryItem(item.id)
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <div className="text-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-medium text-[10px] uppercase tracking-wider">
                              {item.language}
                            </span>
                            {item.mode === "convert" && item.targetLanguage && (
                              <span className="text-muted-foreground flex items-center gap-1">
                                <ChevronRight className="h-3 w-3" />
                                <span className="px-1.5 py-0.5 rounded-md bg-secondary text-secondary-foreground font-medium text-[10px] uppercase tracking-wider">
                                  {item.targetLanguage}
                                </span>
                              </span>
                            )}
                          </div>
                          <div className="p-2 bg-muted/50 rounded-md text-xs font-mono truncate border border-border/50">
                            {item.inputCode.split('\n')[0] || "// Empty code"}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </ScrollArea>
      </motion.div>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-20"
            onClick={handleToggle}
          />
        )}
      </AnimatePresence>
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
