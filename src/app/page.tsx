import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { Palette, Code, Droplet } from "lucide-react"

const tools = [
  {
    title: "RGB & HEX Converter",
    description: "Easily switch between RGB and HEX color codes",
    href: "/tools/rgb-hex",
    icon: Palette,
  },
  {
    title: "HTML Minifier",
    description: "Minify HTML code with various optimization options",
    href: "/tools/html-minifier",
    icon: Code,
  },
  {
    title: "Color Palette Generator",
    description: "Generate color palettes from images",
    href: "/tools/palette-generator",
    icon: Droplet,
  },
  // Add more tools here as we build them
]

export default function Home() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Dev Tools</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <Link href={tool.href} key={tool.href} className="block">
                <Card className="h-full hover:bg-accent transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      <CardTitle>{tool.title}</CardTitle>
                    </div>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}