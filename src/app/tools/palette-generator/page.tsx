// src/app/tools/palette-generator/page.tsx
"use client";

import { PaletteGenerator } from "@/components/tools/PaletteGenerator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PaletteGeneratorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4 sm:px-6 lg:px-8 w-full">
      <div className="w-full">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            ← Back to Tools
          </Button>
        </Link>
        <h1 className="text-4xl font-bold mb-8">Color Palette Generator</h1>
        <PaletteGenerator />
      </div>
    </main>
  );
}