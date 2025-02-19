"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Settings2, Check, Clipboard } from "lucide-react";
import { cn } from "@/lib/utils";

interface MinifierOptions {
  collapseWhitespace: boolean;
  removeComments: boolean;
  removeAttributeQuotes: boolean;
  removeEmptyAttributes: boolean;
  removeOptionalTags: boolean;
  removeRedundantAttributes: boolean;
  removeScriptTypeAttributes: boolean;
  removeStyleLinkTypeAttributes: boolean;
  minifyCSS: boolean;
  minifyJS: boolean;
  collapseInlineTagWhitespace: boolean;
  processConditionalComments: boolean;
  sortAttributes: boolean;
  sortClassName: boolean;
  useShortDoctype: boolean;
  decodeEntities: boolean;
}

const defaultOptions: MinifierOptions = {
  collapseWhitespace: true,
  removeComments: true,
  removeAttributeQuotes: true,
  removeEmptyAttributes: true,
  removeOptionalTags: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  minifyCSS: true,
  minifyJS: true,
  collapseInlineTagWhitespace: true,
  processConditionalComments: true,
  sortAttributes: true,
  sortClassName: true,
  useShortDoctype: true,
  decodeEntities: true,
};

export function HtmlMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [options, setOptions] = useState<MinifierOptions>(defaultOptions);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false); // Track if copied

  const handleMinify = () => {
    let minified = input;

    if (options.removeComments) {
      minified = minified.replace(/<!--[\s\S]*?-->/g, ""); // Remove HTML comments
    }

    if (options.collapseWhitespace) {
      minified = minified.replace(/\s+/g, " ").trim(); // Collapse whitespace
    }

    if (options.removeAttributeQuotes) {
      minified = minified.replace(/"\s*([\w-]+)\s*"/g, "$1"); // Remove attribute quotes
    }

    if (options.minifyCSS) {
      minified = minified.replace(/\s*{\s*/g, "{").replace(/\s*;\s*/g, ";"); // Simple CSS minification
    }

    if (options.minifyJS) {
      minified = minified.replace(/\s*;\s*/g, ";"); // Simple JS minification
    }

    setOutput(minified);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true); // Show "Copied!" feedback

    setTimeout(() => {
      setCopied(false); // Reset after 2 seconds
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {/* Dropdown Menu */}
      <div className="flex justify-between items-center">
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Settings2 className="h-4 w-4" />
              Minifier Options
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            onPointerDownOutside={() => setIsDropdownOpen(false)} // Close only when clicking outside
          >
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.entries(options).map(([key, value]) => (
              <DropdownMenuCheckboxItem
                key={key}
                checked={value}
                onCheckedChange={(checked) =>
                  setOptions((prev) => ({ ...prev, [key]: checked }))
                }
                onSelect={(e) => e.preventDefault()} // Prevent closing on selection
              >
                {key.replace(/([A-Z])/g, " $1").toLowerCase()}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Input & Output Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Window */}
        <div className="space-y-2">
          <Card>
            <CardContent className="p-4">
              <Textarea
                placeholder="Paste your HTML here..."
                className="min-h-[400px] font-mono"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </CardContent>
          </Card>
          <Button onClick={handleMinify} className="w-full">
            Minify HTML
          </Button>
        </div>

        {/* Output Window */}
        <div className="space-y-2">
          <Card>
            <CardContent className="p-4">
              <Textarea
                placeholder="Minified output will appear here..."
                className="min-h-[400px] font-mono"
                value={output}
                readOnly
              />
            </CardContent>
          </Card>
          {output && (
            <Button
              variant="outline"
              onClick={handleCopy}
              className={cn(
                "w-full flex items-center gap-2",
                copied && "bg-green-500 text-white hover:bg-green-600"
              )}
            >
              {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy Output"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
