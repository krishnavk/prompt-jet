import { PromptExecutor } from '@/components/prompt-executor'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <PromptExecutor />
      </div>
    </main>
  )
}