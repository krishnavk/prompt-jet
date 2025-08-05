"use client"

import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { SettingsButton } from '@/components/settings-button'

// Get basePath from environment or set manually for GitHub Pages
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (typeof window !== 'undefined' && window.location.pathname.startsWith('/prompt-jet') ? '/prompt-jet' : '');

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-6">
  <Link href={`${basePath}/`} title="Home" className="text-3xl font-bold tracking-tight focus:outline-none">Prompt Jet 🚀</Link>
</div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`${basePath}/techniques`}
              title="Prompting Techniques"
              className="inline-flex items-center px-3 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                <path d="M10 2a6 6 0 00-3.47 10.96c.1.08.17.2.17.33v.71c0 .28.22.5.5.5h5.6c.28 0 .5-.22.5-.5v-.71c0-.13.07-.25.17-.33A6 6 0 0010 2zm-2 14a2 2 0 104 0h-4z" />
              </svg>
              Techniques
            </Link>
            <SettingsButton />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}