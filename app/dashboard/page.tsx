"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { CodeEditor } from "@/components/code-editor"
import { Copy, Loader2, Sparkles, RefreshCw, FileCode, AlertTriangle, Keyboard, Zap } from "lucide-react"
import { HistoryPanel, saveHistoryItem } from "@/components/history-panel"
import { FeedbackDisplay } from "@/components/feedback-display"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { codeTemplates } from "@/lib/code-templates"
import { usePreferences } from "@/hooks/use-preferences"
import { DashboardDialogs } from "@/components/dashboard-dialogs"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "cpp",
  "csharp",
  "go",
  "rust",
  "php",
  "ruby",
]

const COMPLEXITY_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [inputCode, setInputCode] = useState("")
  const [outputCode, setOutputCode] = useState("")
  const [feedback, setFeedback] = useState("")
  const [complexity, setComplexity] = useState("intermediate")
  const [sourceLanguage, setSourceLanguage] = useState("javascript")
  const [targetLanguage, setTargetLanguage] = useState("python")
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [mode, setMode] = useState<"analyze" | "convert">("analyze")
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const feedbackRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { preferences, isLoaded } = usePreferences()

  useEffect(() => {
    checkUser()
  }, [])

  // Load preferences when available
  useEffect(() => {
    if (isLoaded) {
      setComplexity(preferences.defaultComplexity)
      setSourceLanguage(preferences.defaultLanguage)
      setTargetLanguage(preferences.defaultTargetLanguage)
    }
  }, [isLoaded, preferences])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter: Analyze/Convert
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        if (!processing && inputCode.trim()) {
          mode === 'analyze' ? handleAnalyze() : handleConvert()
        }
      }
      // Ctrl/Cmd + K: Clear
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        if (inputCode || outputCode) {
          setShowClearConfirm(true)
        }
      }
      // Ctrl/Cmd + /: Show keyboard shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault()
        setShowKeyboardShortcuts(true)
      }
      // Ctrl/Cmd + T: Show templates
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault()
        setShowTemplates(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [inputCode, outputCode, processing, mode])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    setLoading(false)
  }

  // Sign-out is handled globally in the shared header

  const handleAnalyze = async () => {
    if (!inputCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter some code to analyze",
        variant: "destructive",
      })
      return
    }

    setProcessing(true)
    setProgress(0)

    // Simulate smooth progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return 90
        const increment = Math.random() * 10
        return Math.min(prev + increment, 90)
      })
    }, 300)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inputCode, complexity }),
      })

      if (!response.ok) throw new Error("Failed to analyze code")

      const data = await response.json()
      setProgress(100)

      // Small delay to show 100% completion
      await new Promise(resolve => setTimeout(resolve, 300))

      setOutputCode(data.analyzedCode)
      setFeedback(data.feedback || "")

      // Save to history if user is signed in
      if (user) {
        saveHistoryItem(user.id, {
          mode: "analyze",
          inputCode,
          outputCode: data.analyzedCode,
          language: sourceLanguage,
          complexity
        })
      }

      toast({
        title: "Success!",
        description: "Code analyzed successfully",
      })

      // Auto-scroll to feedback section
      setTimeout(() => {
        if (feedbackRef.current) {
          feedbackRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest"
          })
        }
      }, 400)
    } catch (error: any) {
      setError("analyze")
      toast({
        title: "Error",
        description: error.message || "Failed to analyze code. Please try again.",
        variant: "destructive",
      })
    } finally {
      clearInterval(progressInterval)
      setProcessing(false)
      setTimeout(() => setProgress(0), 500)
    }
  }

  const handleConvert = async () => {
    if (!inputCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter some code to convert",
        variant: "destructive",
      })
      return
    }

    setProcessing(true)
    setProgress(0)

    // Simulate smooth progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return 90
        const increment = Math.random() * 10
        return Math.min(prev + increment, 90)
      })
    }, 300)

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: inputCode,
          sourceLanguage,
          targetLanguage,
        }),
      })

      if (!response.ok) throw new Error("Failed to convert code")

      const data = await response.json()
      setProgress(100)

      // Small delay to show 100% completion
      await new Promise(resolve => setTimeout(resolve, 300))

      setOutputCode(data.convertedCode)

      // Save to history if user is signed in
      if (user) {
        saveHistoryItem(user.id, {
          mode: "convert",
          inputCode,
          outputCode: data.convertedCode,
          language: sourceLanguage,
          targetLanguage
        })
      }

      toast({
        title: "Success!",
        description: `Code converted to ${targetLanguage} successfully`,
      })
    } catch (error: any) {
      setError("convert")
      toast({
        title: "Error",
        description: error.message || "Failed to convert code. Please try again.",
        variant: "destructive",
      })
    } finally {
      clearInterval(progressInterval)
      setProcessing(false)
      setTimeout(() => setProgress(0), 500)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputCode)
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy code",
        variant: "destructive",
      })
    }
  }

  const handleClear = () => {
    setInputCode("")
    setOutputCode("")
    setFeedback("")
    setError(null)
    setShowClearConfirm(false)
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = codeTemplates.find(t => t.id === templateId)
    if (template) {
      setInputCode(template.code)
      setSourceLanguage(template.language)
      setShowTemplates(false)
      toast({
        title: "Template Loaded",
        description: `${template.name} loaded successfully`,
      })
    }
  }

  const handleSelectHistory = (item: any) => {
    setInputCode(item.inputCode)
    setOutputCode(item.outputCode)
    setFeedback("")
    setMode(item.mode)
    setSourceLanguage(item.language)
    if (item.complexity) setComplexity(item.complexity)
    if (item.targetLanguage) setTargetLanguage(item.targetLanguage)
    toast({
      title: "History Loaded",
      description: "Previous code loaded successfully",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />

      {/* History Panel */}
      <HistoryPanel userId={user?.id || null} onSelectHistory={handleSelectHistory} onOpenChange={setIsPanelOpen} />

      {/* Main Content Wrapper */}
      <div className={`transition-all duration-300 ease-in-out ${isPanelOpen ? 'ml-80' : 'ml-0'}`}>
        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
                  {user ? (
                    <>
                      Welcome back, <span className="bg-clip-text text-transparent gradient-primary animate-gradient">{user.email?.split('@')[0]}</span>
                    </>
                  ) : (
                    <>
                      Welcome to <span className="bg-clip-text text-transparent gradient-primary animate-gradient">CodeCoach</span>
                    </>
                  )}
                </h2>
                <p className="text-muted-foreground text-lg">
                  Your intelligent pair programmer for analysis and translation.
                </p>
              </div>
              {!user && (
                <div className="flex items-center gap-2 text-sm bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20">
                  <Sparkles className="h-4 w-4" />
                  <span>Sign in to save history</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Mode Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex p-1 bg-muted/50 backdrop-blur-sm rounded-xl mb-8 border border-border/50 w-full max-w-md mx-auto md:mx-0"
          >
            <button
              onClick={() => setMode("analyze")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${mode === "analyze"
                  ? "bg-background text-primary shadow-sm ring-1 ring-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
            >
              <Sparkles className="h-4 w-4" />
              Analyze Code
            </button>
            <button
              onClick={() => setMode("convert")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${mode === "convert"
                  ? "bg-background text-primary shadow-sm ring-1 ring-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
            >
              <RefreshCw className="h-4 w-4" />
              Convert Code
            </button>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="mb-8 glass-card hover-lift border-primary/10">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${mode === 'analyze' ? 'bg-primary/10 text-primary' : 'bg-purple-500/10 text-purple-500'}`}>
                    {mode === 'analyze' ? <Zap className="h-5 w-5" /> : <RefreshCw className="h-5 w-5" />}
                  </div>
                  <div>
                    <CardTitle>{mode === "analyze" ? "Analysis Settings" : "Conversion Settings"}</CardTitle>
                    <CardDescription>
                      {mode === "analyze"
                        ? "Configure how you want your code analyzed"
                        : "Select source and target languages for translation"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {mode === "analyze" ? (
                    <>
                      <div className="md:col-span-4 space-y-2">
                        <Label>Complexity Level</Label>
                        <Select value={complexity} onValueChange={setComplexity}>
                          <SelectTrigger className="bg-background/50 border-primary/20 focus:ring-primary/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {COMPLEXITY_LEVELS.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-4 space-y-2">
                        <Label>Language</Label>
                        <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                          <SelectTrigger className="bg-background/50 border-primary/20 focus:ring-primary/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGES.map((lang) => (
                              <SelectItem key={lang} value={lang}>
                                {lang.charAt(0).toUpperCase() + lang.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="md:col-span-4 space-y-2">
                        <Label>Source Language</Label>
                        <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                          <SelectTrigger className="bg-background/50 border-primary/20 focus:ring-primary/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGES.map((lang) => (
                              <SelectItem key={lang} value={lang}>
                                {lang.charAt(0).toUpperCase() + lang.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-4 space-y-2">
                        <Label>Target Language</Label>
                        <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                          <SelectTrigger className="bg-background/50 border-primary/20 focus:ring-primary/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGES.map((lang) => (
                              <SelectItem key={lang} value={lang}>
                                {lang.charAt(0).toUpperCase() + lang.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  <div className="md:col-span-4 flex items-end gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={mode === "analyze" ? handleAnalyze : handleConvert}
                            disabled={processing || !inputCode.trim()}
                            className="flex-1 h-10 shadow-lg hover:shadow-primary/25 transition-all bg-gradient-to-r from-primary to-teal-500 hover:from-primary/90 hover:to-teal-500/90 text-white border-0"
                          >
                            {processing ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              mode === "analyze" ? <Sparkles className="mr-2 h-4 w-4" /> : <RefreshCw className="mr-2 h-4 w-4" />
                            )}
                            {mode === "analyze" ? "Analyze Code" : "Convert Code"}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Ctrl/Cmd + Enter</TooltipContent>
                      </Tooltip>

                      <div className="flex gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => inputCode || outputCode ? setShowClearConfirm(true) : null}
                              disabled={!inputCode && !outputCode}
                              className="bg-background/50 border-primary/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                            >
                              <span className="sr-only">Clear</span>
                              <span aria-hidden="true">×</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Clear (Ctrl/Cmd + K)</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => setShowTemplates(true)} className="bg-background/50 border-primary/20 hover:bg-primary/10 hover:text-primary">
                              <FileCode className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Templates (Ctrl/Cmd + T)</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => setShowKeyboardShortcuts(true)} className="bg-background/50 border-primary/20 hover:bg-primary/10 hover:text-primary">
                              <Keyboard className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Shortcuts (Ctrl/Cmd + /)</TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Progress Bar */}
          <AnimatePresence>
            {processing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <Card className="glass-card border-primary/20">
                  <CardContent className="pt-6 pb-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-primary font-medium">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {mode === "analyze" ? "Analyzing code structure..." : "Translating syntax..."}
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5 bg-primary/10" indicatorClassName="bg-gradient-to-r from-primary to-teal-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Code Editors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="h-full"
            >
              <div className="code-block h-full flex flex-col border-primary/10 shadow-xl">
                <div className="code-header justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="code-dot bg-red-500/80" />
                      <div className="code-dot bg-yellow-500/80" />
                      <div className="code-dot bg-green-500/80" />
                    </div>
                    <span className="text-xs text-muted-foreground font-mono ml-2">input.{sourceLanguage === 'csharp' ? 'cs' : sourceLanguage === 'cpp' ? 'cpp' : sourceLanguage === 'javascript' ? 'js' : sourceLanguage === 'typescript' ? 'ts' : sourceLanguage === 'python' ? 'py' : sourceLanguage}</span>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">Input</div>
                </div>
                <div className="flex-grow bg-[#1e1e1e] relative">
                  <CodeEditor
                    value={inputCode}
                    onChange={(value) => setInputCode(value || "")}
                    language={sourceLanguage}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="h-full"
            >
              <div className="code-block h-full flex flex-col border-primary/10 shadow-xl">
                <div className="code-header justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="code-dot bg-red-500/80" />
                      <div className="code-dot bg-yellow-500/80" />
                      <div className="code-dot bg-green-500/80" />
                    </div>
                    <span className="text-xs text-muted-foreground font-mono ml-2">output.{mode === 'analyze' ? (sourceLanguage === 'csharp' ? 'cs' : sourceLanguage === 'cpp' ? 'cpp' : sourceLanguage === 'javascript' ? 'js' : sourceLanguage === 'typescript' ? 'ts' : sourceLanguage === 'python' ? 'py' : sourceLanguage) : (targetLanguage === 'csharp' ? 'cs' : targetLanguage === 'cpp' ? 'cpp' : targetLanguage === 'javascript' ? 'js' : targetLanguage === 'typescript' ? 'ts' : targetLanguage === 'python' ? 'py' : targetLanguage)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-medium text-muted-foreground">
                      {mode === "analyze" ? "Analysis" : "Output"}
                    </div>
                    {outputCode && (
                      <Button variant="ghost" size="icon" onClick={handleCopy} className="h-6 w-6 text-muted-foreground hover:text-primary">
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex-grow bg-[#1e1e1e] relative">
                  <CodeEditor
                    value={outputCode}
                    language={mode === "analyze" ? sourceLanguage : targetLanguage}
                    readOnly
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Feedback Section - Only show for analyze mode */}
          <AnimatePresence>
            {mode === "analyze" && feedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                ref={feedbackRef}
                className="mt-8"
              >
                <FeedbackDisplay feedback={feedback} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error State with Retry */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8"
            >
              <Card className="border-destructive/50 bg-destructive/5 glass-card">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-destructive/10 text-destructive">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-destructive">Something went wrong</h3>
                      <p className="text-sm text-muted-foreground">
                        Failed to {error} code. Please try again.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => {
                        setError(null)
                        error === "analyze" ? handleAnalyze() : handleConvert()
                      }}
                    >
                      Retry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </main>

        {/* Dialogs */}
        <DashboardDialogs
          showTemplates={showTemplates}
          setShowTemplates={setShowTemplates}
          showKeyboardShortcuts={showKeyboardShortcuts}
          setShowKeyboardShortcuts={setShowKeyboardShortcuts}
          showClearConfirm={showClearConfirm}
          setShowClearConfirm={setShowClearConfirm}
          onTemplateSelect={handleTemplateSelect}
          onClear={handleClear}
        />
      </div>
    </div>
  )
}

