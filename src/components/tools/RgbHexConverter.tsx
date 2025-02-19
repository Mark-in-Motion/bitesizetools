"use client";

import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clipboard, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function RgbHexConverter() {
  const [rgb, setRgb] = useState({ r: 0, g: 0, b: 0 });
  const [hex, setHex] = useState("#000000");
  const [copied, setCopied] = useState(false);
  const [hexInput, setHexInput] = useState("");
  const [convertedRgb, setConvertedRgb] = useState({ r: 0, g: 0, b: 0 });
  const [rgbCopied, setRgbCopied] = useState(false);

  // Convert RGB to HEX
  const rgbToHex = (r: number, g: number, b: number) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  useEffect(() => {
    setHex(rgbToHex(rgb.r, rgb.g, rgb.b));
  }, [rgb]);

  // Convert HEX to RGB (handles both "#ff0000" and "ff0000")
  const hexToRgb = (hex: string) => {
    // Fix: use 'const' instead of 'let'
    const cleanHex = hex.startsWith("#") ? hex : `#${hex}`;
    const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleanHex);
    return match
      ? {
          r: parseInt(match[1], 16),
          g: parseInt(match[2], 16),
          b: parseInt(match[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  useEffect(() => {
    if (hexInput.length >= 6) {
      setConvertedRgb(hexToRgb(hexInput));
    }
  }, [hexInput]);

  const handleSliderChange = (color: "r" | "g" | "b", value: number[]) => {
    setRgb((prev) => ({ ...prev, [color]: value[0] }));
  };

  const handleRgbInputChange = (color: "r" | "g" | "b", value: string) => {
    let val = parseInt(value, 10);
    if (isNaN(val)) val = 0;
    if (val < 0) val = 0;
    if (val > 255) val = 255;
    setRgb((prev) => ({ ...prev, [color]: val }));
  };

  const copyHexToClipboard = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const copyRgbToClipboard = () => {
    const rgbString = `${convertedRgb.r}, ${convertedRgb.g}, ${convertedRgb.b}`;
    navigator.clipboard.writeText(rgbString);
    setRgbCopied(true);
    setTimeout(() => setRgbCopied(false), 1500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-1xl mx-auto">
      {/* RGB to HEX Converter */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            RGB to HEX Converter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {(["r", "g", "b"] as const).map((color) => (
            <div key={color} className="space-y-1">
              <Label htmlFor={`${color}-slider`} className="text-lg font-semibold">
                {color.toUpperCase()}: {rgb[color]}
              </Label>
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-9">
                  <Slider
                    id={`${color}-slider`}
                    min={0}
                    max={255}
                    step={1}
                    value={[rgb[color]]}
                    onValueChange={(value) => handleSliderChange(color, value)}
                    className="w-full"
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    min={0}
                    max={255}
                    value={rgb[color]}
                    onChange={(e) => handleRgbInputChange(color, e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="space-y-1">
            <Label htmlFor="hex-output" className="text-lg font-semibold">
              HEX
            </Label>
            <Input id="hex-output" type="text" value={hex} readOnly className="w-full" />
            <Button
              variant="outline"
              onClick={copyHexToClipboard}
              className={cn(
                "w-full transition-colors",
                copied && "bg-green-500 text-white hover:bg-green-600"
              )}
            >
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Clipboard className="mr-2 h-4 w-4" />}
              Copy
            </Button>
          </div>
          <div
            onClick={copyHexToClipboard}
            className="w-full h-24 rounded-md border-2 border-gray-300 dark:border-gray-700 cursor-pointer"
            style={{ backgroundColor: hex }}
            title="Click to copy HEX"
          />
        </CardContent>
      </Card>

      {/* HEX to RGB Converter */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            HEX to RGB Converter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-1">
            <Label htmlFor="hex-input" className="text-lg font-semibold">
              HEX
            </Label>
            <Input
              id="hex-input"
              type="text"
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value.replace(/[^a-fA-F0-9#]/g, ""))}
              placeholder="#000000"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-lg font-semibold">RGB</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input type="number" value={convertedRgb.r} readOnly className="text-center" />
              <Input type="number" value={convertedRgb.g} readOnly className="text-center" />
              <Input type="number" value={convertedRgb.b} readOnly className="text-center" />
            </div>
            <Button
              variant="outline"
              onClick={copyRgbToClipboard}
              className={cn(
                "w-full transition-colors",
                rgbCopied && "bg-green-500 text-white hover:bg-green-600"
              )}
            >
              {rgbCopied ? <Check className="mr-2 h-4 w-4" /> : <Clipboard className="mr-2 h-4 w-4" />}
              Copy
            </Button>
          </div>
          <div
            className="w-full h-24 rounded-md border-2 border-gray-300 dark:border-gray-700 cursor-pointer"
            style={{ backgroundColor: `rgb(${convertedRgb.r}, ${convertedRgb.g}, ${convertedRgb.b})` }}
            title="Color Preview"
          />
        </CardContent>
      </Card>
    </div>
  );
}
