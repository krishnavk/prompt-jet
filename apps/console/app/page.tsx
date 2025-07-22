import { PromptExecutor } from '@/components/prompt-executor'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Prompt Jet 🚀</h1>
          <p className="text-xl text-muted-foreground">
            Execute prompts across multiple LLM providers and compare results
          </p>
        </div>
        
        <PromptExecutor />
      </div>
    </main>
  )
}