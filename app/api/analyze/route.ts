import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { code, complexity } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      )
    }

    const commentedCodePrompt = `Add inline comments to the following code. 
IMPORTANT: Return ONLY the code with inline comments. Do not add any explanatory text before or after the code.
Use proper comment syntax for the language (// for JS/Java/C++, # for Python, etc.).
Every comment must be syntactically valid for the language.

Complexity level: ${complexity}

Code:
${code}`

    const feedbackPrompt = `Analyze the following code and provide detailed feedback in this EXACT format:

Code Quality Score: [0-100]/100

Line-by-Line Feedback:
- Line X: [specific issue or observation]
- Line Y: [specific issue or observation]

Suggestions for Improvement:
- [suggestion 1]
- [suggestion 2]
- [suggestion 3]

Learning Tip:
[One helpful, beginner-friendly tip related to the code]

Code to analyze:
${code}`

    // First API call - Get commented code
    const codeResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3.1:free',
        messages: [
          {
            role: 'system',
            content: 'You are a code commenting expert. Return ONLY the code with inline comments added. Do not include any markdown formatting, explanations, or text outside the code. Maintain the original code formatting and indentation. Use appropriate comment syntax for the detected language.',
          },
          {
            role: 'user',
            content: commentedCodePrompt,
          },
        ],
      }),
    })

    if (!codeResponse.ok) {
      const error = await codeResponse.text()
      console.error('OpenRouter API error:', error)
      return NextResponse.json(
        { error: 'Failed to analyze code' },
        { status: codeResponse.status }
      )
    }

    // Second API call - Get feedback
    const feedbackResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3.1:free',
        messages: [
          {
            role: 'system',
            content: 'You are a code review expert. Provide constructive, educational feedback following the exact format requested. Be helpful and focus on teaching.',
          },
          {
            role: 'user',
            content: feedbackPrompt,
          },
        ],
      }),
    })

    if (!feedbackResponse.ok) {
      const error = await feedbackResponse.text()
      console.error('OpenRouter API error:', error)
      return NextResponse.json(
        { error: 'Failed to generate feedback' },
        { status: feedbackResponse.status }
      )
    }

    const codeData = await codeResponse.json()
    const feedbackData = await feedbackResponse.json()
    
    let analyzedCode = codeData.choices[0]?.message?.content || ''
    const feedback = feedbackData.choices[0]?.message?.content || ''

    // Clean up the analyzed code - remove markdown code blocks if present
    analyzedCode = analyzedCode.replace(/```[\w]*\n?/g, '').trim()

    return NextResponse.json({ analyzedCode, feedback })
  } catch (error) {
    console.error('Error analyzing code:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
