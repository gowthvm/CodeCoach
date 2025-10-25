"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, AlertCircle, Lightbulb, TrendingUp, Award } from "lucide-react"

interface FeedbackDisplayProps {
  feedback: string
}

export function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
  // Parse the feedback text into sections
  const parseScore = (text: string): number | null => {
    const match = text.match(/Code Quality Score:\s*(\d+)/)
    return match ? parseInt(match[1]) : null
  }

  const parseSection = (text: string, sectionName: string): string[] => {
    try {
      const regex = new RegExp(`${sectionName}:([\\s\\S]*?)(?=\\n\\n|$)`, 'i')
      const match = text.match(regex)
      if (!match || !match[1]) return []
      
      const content = match[1].trim()
      if (!content) return []
      
      return content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-') || line.startsWith('•') || /^\d+\./.test(line))
        .map(line => line.replace(/^[-•]\s*|^\d+\.\s*/, '').trim())
    } catch (error) {
      console.error('Error parsing section:', error)
      return []
    }
  }

  const parseLearningTip = (text: string): string => {
    try {
      // Try multiple possible formats
      const regexes = [
        /Learning Tip:[\s\n]*([\s\S]*?)(?=\n\n|$)/i,
        /💡[\s\n]*([\s\S]*?)(?=\n\n|$)/i,
        /Tip:[\s\n]*([\s\S]*?)(?=\n\n|$)/i
      ]

      for (const regex of regexes) {
        const match = text.match(regex)
        if (match && match[1]?.trim()) {
          return match[1].trim()
        }
      }
      
      // If no specific tip found, try to extract the last paragraph
      const paragraphs = text.split('\n\n').filter(p => p.trim())
      return paragraphs.length > 0 ? paragraphs[paragraphs.length - 1].trim() : ''
    } catch (error) {
      console.error('Error parsing learning tip:', error)
      return ''
    }
  }

  const score = parseScore(feedback)
  
  // Try multiple possible section headers
  const lineByLine = [
    ...parseSection(feedback, 'Line-by-Line Feedback'),
    ...parseSection(feedback, 'Feedback'),
    ...parseSection(feedback, 'Issues')
  ].filter((v, i, a) => a.indexOf(v) === i) // Remove duplicates

  const suggestions = [
    ...parseSection(feedback, 'Suggestions for Improvement'),
    ...parseSection(feedback, 'Suggestions'),
    ...parseSection(feedback, 'Recommendations')
  ].filter((v, i, a) => a.indexOf(v) === i) // Remove duplicates
  
  const learningTip = parseLearningTip(feedback)

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-muted-foreground'
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-orange-600 dark:text-orange-400'
  }

  const getScoreGradient = (score: number | null) => {
    if (!score) return 'from-gray-500 to-gray-600'
    if (score >= 80) return 'from-green-500 to-emerald-600'
    if (score >= 60) return 'from-yellow-500 to-orange-500'
    return 'from-orange-500 to-red-500'
  }

  return (
    <div className="space-y-6">
      {/* Score Card */}
      {score !== null && (
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${getScoreGradient(score)} p-1`}>
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
                        {score}
                      </div>
                      <div className="text-xs text-muted-foreground">/ 100</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold">Code Quality Score</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {score >= 80 && "Excellent! Your code follows best practices."}
                    {score >= 60 && score < 80 && "Good work! Some improvements possible."}
                    {score < 60 && "Room for improvement. Check the feedback below."}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Line-by-Line Feedback */}
      {lineByLine.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold">Line-by-Line Feedback</h3>
            </div>
            <div className="space-y-3">
              {lineByLine.map((item, index) => {
                // Extract line number if present (supports multiple formats)
                const lineMatch = item.match(/^(?:Line |#)?(\d+)[:.)\s-]+/i)
                const lineNumber = lineMatch ? lineMatch[1] : null
                const content = lineNumber ? 
                  item.replace(/^(?:Line |#)?\d+[:.)\s-]+/i, '').trim() : 
                  item
                return (
                  <div 
                    key={index} 
                    className="flex gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800"
                  >
                    {lineNumber && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                          {lineNumber}
                        </div>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{content}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suggestions for Improvement */}
      {suggestions.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h3 className="text-lg font-semibold">Suggestions for Improvement</h3>
            </div>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className="flex gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{suggestion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Tip */}
      {learningTip && (
        <Card className="border-2 border-yellow-200 dark:border-yellow-800 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 text-yellow-900 dark:text-yellow-100">
                  💡 Learning Tip
                </h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  {learningTip}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
