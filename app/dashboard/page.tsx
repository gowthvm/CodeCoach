"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import { CodeEditor } from "@/components/code-editor"
import { Code2, LogOut, Copy, Loader2, Sparkles, RefreshCw, LogIn } from "lucide-react"
import { HistoryPanel, saveHistoryItem } from "@/components/history-panel"
import { FeedbackDisplay } from "@/components/feedback-display"
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
  const [mode, setMode] = useState<"analyze" | "convert">("analyze")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkUser()
  }, [])

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
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inputCode, complexity }),
      })

      if (!response.ok) throw new Error("Failed to analyze code")

      const data = await response.json()
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
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
      setProcessing(false)
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
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">CodeCoach</h1>
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

      {/* History Panel */}
      <HistoryPanel userId={user?.id || null} onSelectHistory={handleSelectHistory} />

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
        <Card className="mb-6">
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
                <Button
                  onClick={mode === "analyze" ? handleAnalyze : handleConvert}
                  disabled={processing}
                  className="flex-1"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : mode === "analyze" ? (
                    "Analyze"
                  ) : (
                    "Convert"
                  )}
                </Button>
                <Button variant="outline" onClick={handleClear}>
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Editors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
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

          <Card>
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
          <div className="mt-6">
            <FeedbackDisplay feedback={feedback} />
          </div>
        )}
      </main>
    </div>
  )
}
