"use client"

import React from "react"
import Editor from "@monaco-editor/react"
import { useTheme } from "next-themes"

interface CodeEditorProps {
  value: string
  onChange?: (value: string | undefined) => void
  language?: string
  readOnly?: boolean
  height?: string
}

export function CodeEditor({
  value,
  onChange,
  language = "javascript",
  readOnly = false,
  height = "500px",
}: CodeEditorProps) {
  const { theme } = useTheme()

  return (
    <Editor
      height={height}
      language={language}
      value={value}
      onChange={onChange}
      theme={theme === "dark" ? "vs-dark" : "light"}
      options={{
        readOnly,
        minimap: { enabled: value.split("\n").length > 50 },
        fontSize: 14,
        lineHeight: 1.6,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: "on",
        quickSuggestions: false,
        suggestOnTriggerCharacters: false,
        acceptSuggestionOnCommitCharacter: false,
        acceptSuggestionOnEnter: "off",
        parameterHints: { enabled: false },
      }}
    />
  )
}
