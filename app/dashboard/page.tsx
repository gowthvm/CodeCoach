"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { ThemeToggle } from "@/components/theme-toggle"
import { CodeEditor } from "@/components/code-editor"
import { CodeEditorSkeleton } from "@/components/code-editor-skeleton"
import { Code2, LogOut, Copy, Loader2, Sparkles, RefreshCw, LogIn, Home, FileCode, AlertTriangle, Keyboard, HelpCircle } from "lucide-react"
import { HistoryPanel, saveHistoryItem } from "@/components/history-panel"
import { FeedbackDisplay } from "@/components/feedback-display"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { codeTemplates, getTemplatesByLanguage } from "@/lib/code-templates"
import { usePreferences } from "@/hooks/use-preferences"
import { DashboardDialogs } from "@/components/dashboard-dialogs"
import Link from "next/link"

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
  const { preferences, setPreferences, isLoaded } = usePreferences()

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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth/signin")
  }

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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert code. Please try again.",
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-950 dark:to-green-950">
      {/* History Panel */}
      <HistoryPanel userId={user?.id || null} onSelectHistory={handleSelectHistory} onOpenChange={setIsPanelOpen} />
      
      {/* Main Content Wrapper */}
      <div className={`transition-all duration-300 ease-in-out ${isPanelOpen ? 'ml-80' : 'ml-0'}`}>
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">CodeCoach</h1>
            <Link href="/">
              <Button variant="ghost" size="sm" className="ml-2">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {user.email}
                </span>
                <ThemeToggle />
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Link href="/auth/signup">
                  <Button variant="outline" size="sm">
                    Sign Up
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button variant="default" size="sm">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">
            {user ? `Welcome back, ${user.email?.split('@')[0]}!` : 'Welcome to CodeCoach'}
          </h2>
          <p className="text-muted-foreground">
            Analyze code with intelligent comments or convert between programming languages
            {!user && (
              <span className="block mt-1 text-sm">
                💡 Sign in to save your history and access it anytime
              </span>
            )}
          </p>
        </div>

        {/* Mode Selection */}
        <div className="flex gap-4 mb-6">
          <Button
            variant={mode === "analyze" ? "default" : "outline"}
            onClick={() => setMode("analyze")}
            className="flex-1"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Analyze Code
          </Button>
          <Button
            variant={mode === "convert" ? "default" : "outline"}
            onClick={() => setMode("convert")}
            className="flex-1"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Convert Code
          </Button>
        </div>

        {/* Controls */}
        <Card className="mb-6 backdrop-blur-sm bg-card/95">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              {mode === "analyze"
                ? "Configure analysis complexity level"
                : "Select source and target languages"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mode === "analyze" ? (
                <>
                  <div className="space-y-2">
                    <Label>Complexity Level</Label>
                    <Select value={complexity} onValueChange={setComplexity}>
                      <SelectTrigger>
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
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                      <SelectTrigger>
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
                  <div className="space-y-2">
                    <Label>Source Language</Label>
                    <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                      <SelectTrigger>
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
                  <div className="space-y-2">
                    <Label>Target Language</Label>
                    <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                      <SelectTrigger>
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
              <div className="flex items-end gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={mode === "analyze" ? handleAnalyze : handleConvert}
                        disabled={processing || !inputCode.trim()}
                        className="flex-1"
                      >
                        {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {mode === "analyze" ? "Analyze" : "Convert"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Ctrl/Cmd + Enter</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        onClick={() => inputCode || outputCode ? setShowClearConfirm(true) : null}
                        disabled={!inputCode && !outputCode}
                      >
                        Clear
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Ctrl/Cmd + K</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => setShowTemplates(true)}>
                        <FileCode className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Templates (Ctrl/Cmd + T)</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => setShowKeyboardShortcuts(true)}>
                        <Keyboard className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Shortcuts (Ctrl/Cmd + /)</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        {processing && (
          <Card className="mb-6 backdrop-blur-sm bg-card/95">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {mode === "analyze" ? "Analyzing code..." : "Converting code..."}
                  </span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Code Editors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="backdrop-blur-sm bg-card/95">
            <CardHeader>
              <CardTitle>Input Code</CardTitle>
              <CardDescription>Paste your code here</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeEditor
                value={inputCode}
                onChange={(value) => setInputCode(value || "")}
                language={sourceLanguage}
              />
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/95">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>
                  {mode === "analyze" ? "Analyzed Code" : "Converted Code"}
                </CardTitle>
                <CardDescription>
                  {mode === "analyze"
                    ? "Code with inline comments"
                    : `Code converted to ${targetLanguage}`}
                </CardDescription>
              </div>
              {outputCode && (
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <CodeEditor
                value={outputCode}
                language={mode === "analyze" ? sourceLanguage : targetLanguage}
                readOnly
              />
            </CardContent>
          </Card>
        </div>

        {/* Feedback Section - Only show for analyze mode */}
        {mode === "analyze" && feedback && (
          <div ref={feedbackRef} className="mt-6">
            <FeedbackDisplay feedback={feedback} />
          </div>
        )}

        {/* Error State with Retry */}
        {error && (
          <Card className="mt-6 border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <div className="flex-1">
                  <h3 className="font-semibold">Something went wrong</h3>
                  <p className="text-sm text-muted-foreground">
                    Failed to {error} code. Please try again.
                  </p>
                </div>
                <Button 
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
