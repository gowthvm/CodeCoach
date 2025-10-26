"use client"

import { useState, useEffect } from "react"

export interface UserPreferences {
  defaultLanguage: string
  defaultComplexity: string
  defaultTargetLanguage: string
  editorFontSize: number
  editorLineNumbers: boolean
  editorWordWrap: boolean
  editorMinimap: boolean
}

const DEFAULT_PREFERENCES: UserPreferences = {
  defaultLanguage: "javascript",
  defaultComplexity: "intermediate",
  defaultTargetLanguage: "python",
  editorFontSize: 14,
  editorLineNumbers: true,
  editorWordWrap: true,
  editorMinimap: true,
}

export function usePreferences() {
  const [preferences, setPreferencesState] = useState<UserPreferences>(DEFAULT_PREFERENCES)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load preferences from localStorage
    const stored = localStorage.getItem("user_preferences")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setPreferencesState({ ...DEFAULT_PREFERENCES, ...parsed })
      } catch (error) {
        console.error("Failed to parse preferences:", error)
      }
    }
    setIsLoaded(true)
  }, [])

  const setPreferences = (newPreferences: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPreferences }
    setPreferencesState(updated)
    localStorage.setItem("user_preferences", JSON.stringify(updated))
  }

  const resetPreferences = () => {
    setPreferencesState(DEFAULT_PREFERENCES)
    localStorage.setItem("user_preferences", JSON.stringify(DEFAULT_PREFERENCES))
  }

  return {
    preferences,
    setPreferences,
    resetPreferences,
    isLoaded,
  }
}
