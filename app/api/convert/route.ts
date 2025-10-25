import { NextResponse } from "next/server"

// Helper function to validate code syntax and structure
interface ValidationResult {
  isValid: boolean;
  issues: string[];
}

const validateCode = async (code: string, language: string): Promise<ValidationResult> => {
  const issues: string[] = [];
  
  // Basic validations
  if (!code.trim()) {
    issues.push('Code is empty');
    return { isValid: false, issues };
  }

  // Language-specific validations
  if (['javascript', 'typescript'].includes(language.toLowerCase())) {
    // Check for common JS/TS issues
    const jsIssues = [
      { pattern: /undefined/g, message: 'Potential undefined variable' },
      { pattern: /null\./g, message: 'Potential null reference' },
      { pattern: /eval\(/g, message: 'Avoid using eval()' },
      { pattern: /new Function\(/g, message: 'Avoid using Function constructor' },
      { pattern: /require\(['"]\.\.?\//g, message: 'Potential path traversal in require()' },
    ];

    jsIssues.forEach(({ pattern, message }) => {
      if (pattern.test(code)) {
        issues.push(message);
      }
    });
  }

  // Check for common issues across languages
  const commonIssues = [
    { pattern: /syntax error/i, message: 'Syntax error detected' },
    { pattern: /ReferenceError/i, message: 'Reference error detected' },
    { pattern: /TypeError/i, message: 'Type error detected' },
    { pattern: /is not defined/i, message: 'Undefined variable or function' },
    { pattern: /Unexpected token/i, message: 'Syntax error: Unexpected token' },
    { pattern: /Missing \(/g, message: 'Missing parenthesis' },
    { pattern: /Missing \)/g, message: 'Missing closing parenthesis' },
    { pattern: /Missing \{/g, message: 'Missing opening brace' },
    { pattern: /Missing \}/g, message: 'Missing closing brace' },
  ];

  commonIssues.forEach(({ pattern, message }) => {
    if (pattern.test(code)) {
      if (!issues.includes(message)) {
        issues.push(message);
      }
    }
  });

  return {
    isValid: issues.length === 0,
    issues
  };
};

// Helper function to fix common code issues
const fixCodeIssues = async (code: string, targetLanguage: string, sourceLanguage: string): Promise<string> => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3.1:free',
        temperature: 0.1, // Very low temperature for minimal changes
        max_tokens: 2000,
        messages: [
          {
            role: 'system',
            content: `You are a senior ${targetLanguage} developer. Fix any issues in the code while preserving its functionality.
            
IMPORTANT RULES:
1. Only fix errors and improve the code, don't change the core functionality
2. Ensure the code is syntactically correct ${targetLanguage}
3. Add proper error handling if missing
4. Fix any undefined variables or functions
5. Add necessary imports or requires
6. Ensure all variables are properly scoped
7. Add type annotations if ${targetLanguage} is statically typed
8. Don't add any explanatory text, only output the fixed code`
          },
          {
            role: 'user',
            content: `Fix all issues in this ${targetLanguage} code that was converted from ${sourceLanguage}.
            The code must be production-ready and error-free.
            
            Code to fix:
            ${code}
            
            Output only the fixed code with no additional text or explanations.`
          },
        ],
      }),
    });

    const data = await response.json();
    let fixedCode = data.choices[0]?.message?.content || code;
    
    // Clean up the response
    fixedCode = fixedCode.replace(/^```[\w]*\n?/g, '').replace(/\n```$/g, '').trim();
    
    return fixedCode;
  } catch (error: unknown) {
    console.error("Error fixing code:", error);
    return code; // Return original code if fixing fails
  }
};

// Helper function to clean up the converted code
const cleanConvertedCode = (code: string, targetLanguage: string): string => {
  if (!code) return '';

  // Remove markdown code blocks if present
  let cleaned = code
    .replace(/^```[\w]*\n?/g, '')
    .replace(/\n```$/g, '')
    .trim();

  // Remove any remaining markdown or language indicators
  cleaned = cleaned
    .replace(/^```[\w]*\n?/g, '')  // Remove starting code block
    .replace(/\n```$/g, '')        // Remove ending code block
    .replace(/^`{3,}.*\n?/gm, '')  // Remove any remaining code block markers
    .replace(/^#+\s*.*\n?/gm, '')  // Remove markdown headers
    .replace(/^\\?```.*\n?/gm, '') // Remove any other code block variants
    .trim();

  // Language-specific comment patterns
  const commentPatterns: Record<string, { single: string; multiStart: string; multiEnd: string }> = {
    javascript: { single: '//', multiStart: '/*', multiEnd: '*/' },
    typescript: { single: '//', multiStart: '/*', multiEnd: '*/' },
    python: { single: '#', multiStart: '"""', multiEnd: '"""' },
    java: { single: '//', multiStart: '/*', multiEnd: '*/' },
    cpp: { single: '//', multiStart: '/*', multiEnd: '*/' },
    csharp: { single: '//', multiStart: '/*', multiEnd: '*/' },
    go: { single: '//', multiStart: '/*', multiEnd: '*/' },
    ruby: { single: '#', multiStart: '=begin', multiEnd: '=end' },
    php: { single: '//', multiStart: '/*', multiEnd: '*/' },
  };

  const lang = targetLanguage.toLowerCase();
  const { multiStart, multiEnd } = commentPatterns[lang] || commentPatterns.javascript;

  // If the entire response is wrapped in a multi-line comment, uncomment it
  if (cleaned.startsWith(multiStart) && cleaned.endsWith(multiEnd)) {
    cleaned = cleaned
      .slice(multiStart.length, -multiEnd.length)
      .trim();
  }

  // Remove any remaining non-code blocks
  const lines = cleaned.split('\n');
  const codeLines = lines.filter(line => {
    const trimmed = line.trim();
    return (
      trimmed.length > 0 &&
      !trimmed.startsWith('Here is') &&
      !trimmed.startsWith('Converted') &&
      !trimmed.startsWith('The equivalent') &&
      !/^```/.test(trimmed)
    );
  });

  return codeLines.join('\n');
};

async function generateCodeDescription(code: string, sourceLanguage: string): Promise<string> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
          content: 'You are an expert at analyzing and describing code functionality. Provide a detailed, technical description of what the code does.'
        },
        {
          role: 'user',
          content: `Analyze the following ${sourceLanguage} code and provide a detailed description of its functionality, including:
1. The main purpose of the code
2. Key functions/methods and their roles
3. Input/output behavior
4. Any important algorithms or logic flows
5. Edge cases it handles
6. Dependencies or external requirements

${sourceLanguage} code:
${code}

Provide only the description, no code.`
        }
      ]
    })
  });

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

async function generateCodeFromDescription(description: string, targetLanguage: string, sourceLanguage: string): Promise<string> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-chat-v3.1:free',
      temperature: 0.1, // Very low temperature for consistency
      max_tokens: 3000,
      messages: [
        {
          role: 'system',
          content: `You are an expert ${targetLanguage} developer. Generate complete, production-ready code that includes all necessary imports, proper variable declarations, and follows best practices.`
        },
        {
          role: 'user',
          content: `Create a complete, runnable ${targetLanguage} implementation based on these requirements.

REQUIREMENTS:
${description}

STRICT RULES:
1. Include ALL required imports, modules, and dependencies at the top
2. Use proper import/require statements for the target language
3. Declare all variables with appropriate scope (const/let/var)
4. Include type annotations if ${targetLanguage} is statically typed
5. Add proper error handling and input validation
6. Include all necessary function and class declarations
7. Add comments for any non-obvious logic
8. Follow ${targetLanguage} naming conventions
9. Ensure all referenced variables and functions are defined
10. The code must be immediately runnable

OUTPUT:
Only output the complete, runnable code with no additional text or explanations.`
        }
      ]
    })
  });

  const data = await response.json();
  let code = data.choices[0]?.message?.content || '';
  
  // Clean and verify the generated code
  code = cleanAndVerifyCode(code, targetLanguage, sourceLanguage);
  
  return code;
}

function cleanAndVerifyCode(code: string, targetLanguage: string, sourceLanguage: string): string {
  if (!code) return '';

  // Remove markdown code blocks if present
  let cleaned = code
    .replace(/^```[\w]*\n?/g, '')
    .replace(/\n```$/g, '')
    .trim();

  // Language-specific cleaning and verification
  switch (targetLanguage.toLowerCase()) {
    case 'python':
      return verifyPythonCode(cleaned);
    case 'javascript':
    case 'typescript':
      return verifyJSCode(cleaned, targetLanguage);
    case 'java':
      return verifyJavaCode(cleaned);
    case 'c++':
    case 'cpp':
      return verifyCppCode(cleaned);
    default:
      return cleaned;
  }
}

function verifyPythonCode(code: string): string {
  const imports = new Set<string>();
  
  // Check for common Python patterns that need imports
  if (/(?:^|\n)\s*(?:import |from \w+ import )/m.test(code)) {
    // Code already has imports, analyze which ones are used
    if (code.includes('requests.')) imports.add('import requests\n');
    if (code.includes('numpy.')) imports.add('import numpy as np\n');
    if (code.includes('pandas.')) imports.add('import pandas as pd\n');
    if (code.includes('matplotlib.')) imports.add('import matplotlib.pyplot as plt\n');
    if (code.includes('os.path')) imports.add('import os\n');
  } else {
    // No imports found, add common ones based on usage
    if (code.match(/\b(?:open|with\s+open)\s*\(/)) imports.add('import os\n');
    if (code.match(/\b(?:json\.|import\s+json\b)/)) imports.add('import json\n');
    if (code.match(/\b(re\.|import\s+re\b)/)) imports.add('import re\n');
  }

  // Add type hints if not present in Python code
  if (!code.includes('def ') || !code.includes('->')) {
    code = code.replace(
      /def\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*:/g,
      (match, funcName, args) => {
        // Add return type hint
        return `def ${funcName}(${args}) -> None:  # TODO: Specify return type`;
      }
    );
  }

  const importSection = Array.from(imports).join('');
  return importSection ? `${importSection}\n${code}` : code;
}

function verifyJSCode(code: string, targetLanguage: string): string {
  const imports = new Set<string>();
  const isTypeScript = targetLanguage.toLowerCase() === 'typescript';

  // Check for common JS/TS patterns that need imports
  if (code.match(/\bfetch\(|new\s+XMLHttpRequest\(|axios\./)) {
    imports.add('// @ts-ignore\n');
  }
  if (code.match(/\brequire\s*\(\s*['"]express/)) {
    imports.add('const express = require(\'express\');\n');
  }
  if (code.match(/\bimport\s+.*\s+from\s+['"]react/)) {
    imports.add('import React from \'react\';\n');
  }

  // Ensure proper variable declarations
  code = code.replace(/(?<!\b(?:const|let|var|for|async|await|,)\s*)(?<!\w)([a-zA-Z_$][\w$]*)\s*=/g, 'const $1 =');

  // Add TypeScript type annotations if needed
  if (isTypeScript) {
    // Add type annotations to function parameters
    code = code.replace(
      /function\s+(\w+)\s*\(([^)]*)\)/g,
      (match, funcName, params) => {
        const typedParams = params.split(',').map((p: string) => {
          const [name, type] = p.trim().split(':');
          if (!type && name) {
            return `${name}: any`; // Default to 'any' if type not specified
          }
          return p;
        }).join(', ');
        return `function ${funcName}(${typedParams})`;
      }
    );
  }

  const importSection = Array.from(imports).join('');
  return importSection ? `${importSection}\n${code}` : code;
}

// Placeholder functions for other languages
function verifyJavaCode(code: string): string {
  // Add Java-specific verification logic
  return code;
}

function verifyCppCode(code: string): string {
  // Add C++-specific verification logic
  return code;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { code, sourceLanguage, targetLanguage } = await request.json();

    if (!code || !targetLanguage) {
      return NextResponse.json(
        { error: 'Code and target language are required' },
        { status: 400 }
      );
    }

    // First, generate a detailed description of the source code
    const codeDescription = await generateCodeDescription(code, sourceLanguage);
    
    // Then, generate the target code from the description
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
            content: `You are an expert code translator that converts code between programming languages with 100% accuracy.

WHEN CONVERTING CODE, YOU MUST FOLLOW THESE RULES:
1. First, analyze the provided code description to understand its functionality
2. Then, implement the same functionality in ${targetLanguage}
3. Use idiomatic ${targetLanguage} patterns and best practices
4. Handle all edge cases and error conditions properly
5. If certain features don't exist in ${targetLanguage}, find the most appropriate alternative
6. Add type annotations if ${targetLanguage} is statically typed
7. Include all necessary imports/requires
8. Ensure the code is secure and follows security best practices for ${targetLanguage}

CODE DESCRIPTION:
${codeDescription}

VALIDATION REQUIREMENTS:
1. The code must be syntactically correct ${targetLanguage}
2. All variables and functions must be properly defined and used
3. Handle all potential errors and edge cases
4. Include proper input validation
5. Follow the principle of least privilege

OUTPUT FORMAT:
- Only output the converted code with no additional text
- Use proper ${targetLanguage} documentation format
- Include all necessary imports and dependencies
- Add type annotations if applicable to ${targetLanguage}
- Format the code according to ${targetLanguage} style guidelines`,
          },
          {
            role: 'user',
            content: `Implement the described functionality in ${targetLanguage}.
The original code was in ${sourceLanguage}, but focus on creating idiomatic ${targetLanguage} code.

Functional Requirements:
${codeDescription}

OUTPUT:
Only output the final ${targetLanguage} code with no additional text or explanations.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenRouter API error:', error);
      return NextResponse.json(
        { error: 'Failed to convert code' },
        { status: response.status }
      );
    }

    const data = await response.json();
    let convertedCode = data.choices[0]?.message?.content || '';
    
        // Clean up and verify the converted code
    convertedCode = cleanConvertedCode(convertedCode, targetLanguage);
    convertedCode = cleanAndVerifyCode(convertedCode, targetLanguage, sourceLanguage);

    // Verify the converted code is valid
    const validationResult = await validateCode(convertedCode, targetLanguage);
    if (!validationResult.isValid) {
      console.warn('Initial validation issues found:', validationResult.issues);
      
      // Try to fix the code
      convertedCode = await fixCodeIssues(convertedCode, targetLanguage, sourceLanguage);
      
      // Clean and verify again after fixing
      convertedCode = cleanAndVerifyCode(convertedCode, targetLanguage, sourceLanguage);
      
      // Verify again after fixing
      const revalidation = await validateCode(convertedCode, targetLanguage);
      if (!revalidation.isValid) {
        console.warn('Remaining issues after fixing:', revalidation.issues);
      } else {
        console.log('Successfully fixed all validation issues');
      }
    }

    return NextResponse.json({ convertedCode });
  } catch (error: unknown) {
    console.error("Error converting code:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
