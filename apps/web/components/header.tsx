"use client"

import { ThemeToggle } from '@/components/theme-toggle'
import { SettingsButton } from '@/components/settings-button'

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Prompt Jet 🚀</h1>
          </div>
          <div className="flex items-center gap-2">
            <SettingsButton />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}