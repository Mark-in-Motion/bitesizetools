"use client"

import { RgbHexConverter } from "@/components/tools/RgbHexConverter"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function RgbHexPage() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4 sm:px-6 lg:px-8 w-full">
      <div className="w-full">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            ← Back to Tools
          </Button>
        </Link>
        <h1 className="text-4xl font-bold mb-8">RGB-HEX Converter</h1>
        <RgbHexConverter />
      </div>
    </main>
  )
}
