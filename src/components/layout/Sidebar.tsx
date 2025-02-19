"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MenuIcon, XIcon, Palette, Code, Droplet } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"

const tools = [
  {
    title: "RGB-HEX Converter",
    href: "/tools/rgb-hex",
    icon: Palette,
  },
  {
    title: "HTML Minifier",
    href: "/tools/html-minifier",
    icon: Code,
  },
  {
    title: "Color Palette Generator",
    description: "Generate color palettes from images",
    href: "/tools/palette-generator",
    icon: Droplet, // Import Droplet from lucide-react
  },
  // Add more tools here as we build them
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-background border-r transition-all duration-300 z-40",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 pt-10 border-b">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="fixed left-4 top-3 z-50"
            >
              {isCollapsed ? <MenuIcon /> : <XIcon />}
            </Button>
          </div>
          <nav className="flex-1 pt-16 p-4">
            {tools.map((tool) => {
              const Icon = tool.icon
              const isActive = pathname === tool.href
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={cn(
                    "flex items-center gap-2 px-2 py-2 rounded-md transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground",
                    isCollapsed && "justify-center"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && <span>{tool.title}</span>}
                </Link>
              )}
            )}
          </nav>
        </div>
      </aside>
      <div
        className={cn(
          "min-h-screen transition-all duration-300",
          isCollapsed ? "ml-16" : "ml-64"
        )}
      >
        <main className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Your page content will be rendered here */}
          </div>
        </main>
      </div>
    </>
  )
} 