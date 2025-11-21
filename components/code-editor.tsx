"use client"

import { Editor, OnMount } from "@monaco-editor/react"
import { useTheme } from "next-themes"
import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, Maximize2, Minimize2, Type, ListOrdered } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CodeEditorProps {
  value: string
  onChange?: (value: string | undefined) => void
  language?: string
  readOnly?: boolean
  height?: string
  showControls?: boolean
  fileName?: string
}

export function CodeEditor({
  value,
  onChange,
  language = "javascript",
  readOnly = false,
  height = "500px",
  showControls = true,
  fileName,
}: CodeEditorProps) {
  const { theme } = useTheme()
  const editorRef = useRef<any>(null)
  const [fontSize, setFontSize] = useState(14)
  const [lineNumbers, setLineNumbers] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor

    // Add custom keybinding for save
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (fileName) handleDownload()
    })
  }

  const handleDownload = () => {
    const blob = new Blob([value], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName || `code.${language === "javascript" ? "js" : language === "python" ? "py" : "txt"}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  if (!mounted) return null

  const editorHeight = isFullscreen ? "100vh" : height

  return (
    <div className={`relative group transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'rounded-md overflow-hidden border border-border/50'}`}>
      {showControls && (
        <TooltipProvider>
          <div className={`flex items-center justify-between gap-2 p-2 border-b bg-muted/30 backdrop-blur-sm ${isFullscreen ? 'px-4' : ''}`}>
            <div className="flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Type className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {[12, 14, 16, 18, 20].map((size) => (
                    <DropdownMenuItem key={size} onClick={() => setFontSize(size)}>
                      {size}px
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 ${lineNumbers ? 'bg-accent' : ''}`}
                    onClick={() => setLineNumbers(!lineNumbers)}
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle Line Numbers</TooltipContent>
              </Tooltip>
            </div>

            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleDownload}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download Code</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={toggleFullscreen}>
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </TooltipProvider>
      )}
      <Editor
        height={isFullscreen ? "calc(100vh - 48px)" : height}
        language={language}
        value={value}
        onChange={onChange}
        theme={theme === "dark" ? "vs-dark" : "light"}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: fontSize,
          lineNumbers: lineNumbers ? "on" : "off",
          readOnly: readOnly,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          fontFamily: "var(--font-mono)",
          fontLigatures: true,
          padding: { top: 16, bottom: 16 },
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          renderLineHighlight: "all",
        }}
        className="min-h-[300px]"
      />
    </div>
  )
}
