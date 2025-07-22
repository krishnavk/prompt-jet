'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Loader2, Play, Clock, Zap, DollarSign } from 'lucide-react'

interface Provider {
  provider: string
  model: string
  name: string
}

interface ExecutionResult {
  id: string
  provider: string
  model: string
  response: string
  tokensUsed: number
  executionTimeMs: number
  cost?: number
}

const AVAILABLE_PROVIDERS: Provider[] = [
  { provider: 'openrouter', model: 'gpt-4', name: 'GPT-4 (OpenRouter)' },
  { provider: 'openrouter', model: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  { provider: 'lmstudio', model: 'llama-2-7b-chat', name: 'Llama 2 7B (Local)' },
]

export function PromptExecutor() {
  const [prompt, setPrompt] = useState('')
  const [selectedProviders, setSelectedProviders] = useState<Provider[]>([])
  const [results, setResults] = useState<ExecutionResult[]>([])
  const [isExecuting, setIsExecuting] = useState(false)

  const executePrompt = async () => {
    if (!prompt.trim() || selectedProviders.length === 0) return

    setIsExecuting(true)
    setResults([])

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prompt/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          providers: selectedProviders.map(p => ({ provider: p.provider, model: p.model }))
        })
      })

      const data = await response.json()
      setResults(data.results)
    } catch (error) {
      console.error('Execution failed:', error)
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="w-full h-32 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2"
        />
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Select LLM Providers:</label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_PROVIDERS.map((provider) => (
              <label key={`${provider.provider}-${provider.model}`} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedProviders.some(p => p.provider === provider.provider && p.model === provider.model)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedProviders([...selectedProviders, provider])
                    } else {
                      setSelectedProviders(selectedProviders.filter(p => !(p.provider === provider.provider && p.model === provider.model)))
                    }
                  }}
                />
                <span className="text-sm">{provider.name}</span>
              </label>
            ))}
          </div>
        </div>

        <Button 
          onClick={executePrompt} 
          disabled={!prompt.trim() || selectedProviders.length === 0 || isExecuting}
          className="w-full"
        >
          {isExecuting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Executing...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Run Prompt
            </>
          )}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.map((result) => (
            <Card key={result.id}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{result.model}</h3>
                    <span className="text-xs text-muted-foreground">{result.provider}</span>
                  </div>
                  
                  <div className="text-sm bg-muted p-3 rounded max-h-40 overflow-y-auto">
                    {result.response}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {result.executionTimeMs}ms
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      {result.tokensUsed} tokens
                    </div>
                    {result.cost && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        ${result.cost.toFixed(4)}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}