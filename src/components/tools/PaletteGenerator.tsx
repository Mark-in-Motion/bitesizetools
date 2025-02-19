"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Link as LinkIcon, Clipboard, Check, Download, RefreshCcw } from "lucide-react";
import namer from "color-namer";
import html2canvas from "html2canvas";
import { kmeans } from "ml-kmeans";

interface Color {
  hex: string;
  name: string;
}

// Allowed file extensions
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"];

// Default image on page load
const DEFAULT_IMAGE = "/images/palette-1.jpg";

export function PaletteGenerator() {
  const [selectedImage, setSelectedImage] = useState<string>(DEFAULT_IMAGE);
  const [colors, setColors] = useState<Color[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Additional states
  // Start the text input *empty* so we don't display the link at first.
  const [imageUrlField, setImageUrlField] = useState<string>("");
  const [fileName, setFileName] = useState<string>("(Default Image)");
  const [isUrlValid, setIsUrlValid] = useState<boolean>(false);

  // Validate the URL by extension
  function validateImageUrl(url: string): boolean {
    if (!url.trim()) return false;
    let urlObj: URL;
    try {
      urlObj = new URL(url);
    } catch {
      return false; // Not a valid URL
    }
    const pathname = urlObj.pathname.toLowerCase();
    return ALLOWED_EXTENSIONS.some((ext) => pathname.endsWith(ext));
  }

  // ----------- Color utilities -----------
  function rgbToHex(r: number, g: number, b: number) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  }

  function hexToRgb(hex: string) {
    return {
      r: parseInt(hex.substring(1, 3), 16),
      g: parseInt(hex.substring(3, 5), 16),
      b: parseInt(hex.substring(5, 7), 16),
    };
  }

  function getColorName(hex: string): string {
    const { ntc } = namer(hex);
    return ntc[0]?.name || "Unknown";
  }

  function colorDifference(hex1: string, hex2: string): number {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    return Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) +
        Math.pow(rgb1.g - rgb2.g, 2) +
        Math.pow(rgb1.b - rgb2.b, 2)
    );
  }

  function enforceColorDiversity(colors: string[], threshold = 20) {
    const filtered: string[] = [];
    for (const color of colors) {
      if (!filtered.some((f) => colorDifference(color, f) < threshold)) {
        filtered.push(color);
      }
    }
    return filtered;
  }

  // K-means clustering to get unique colors
  function getUniqueColors(allHexColors: string[], numColors: number): string[] {
    const rgbColors = allHexColors.map((hex) => {
      const { r, g, b } = hexToRgb(hex);
      return [r, g, b];
    });

    const result = kmeans(rgbColors, numColors);
    const centroids = result.centroids.map(([r, g, b]) => {
      return rgbToHex(Math.round(r), Math.round(g), Math.round(b));
    });

    // Filter out near-black/near-white
    const noNearBW = centroids.filter((hex) => {
      const { r, g, b } = hexToRgb(hex);
      const nearBlack = r < 25 && g < 25 && b < 25;
      const nearWhite = r > 230 && g > 230 && b > 230;
      return !nearBlack && !nearWhite;
    });

    return enforceColorDiversity(noNearBW, 20).slice(0, numColors);
  }

  useEffect(() => {
    if (selectedImage) {
      extractColors(selectedImage);
    }
  }, [selectedImage]);

  async function extractColors(imageUrl: string) {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const gridSize = 30;
      const sampledColors: string[] = [];

      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          const pixelX = Math.floor((x / gridSize) * canvas.width);
          const pixelY = Math.floor((y / gridSize) * canvas.height);
          const pixelData = ctx.getImageData(pixelX, pixelY, 1, 1).data;
          if (pixelData[3] === 0) continue; // Skip transparent
          const hex = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
          sampledColors.push(hex);
        }
      }

      const uniqueColors = getUniqueColors(sampledColors, 8);
      const namedColors = uniqueColors.slice(0, 6).map((hex) => ({
        hex,
        name: getColorName(hex),
      }));

      setColors(namedColors);
    };

    img.onerror = () => {
      console.error("Failed to load image from:", imageUrl);
      alert("Invalid image URL or inaccessible image.");
    };
  }

  // -------------- Handlers --------------
  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          // Could set the text field to something like file.name, or leave it empty
          setImageUrlField("");
          setIsUrlValid(false); 
        }
      };
      reader.readAsDataURL(file);
    }
  }

  function handleUseLink() {
    if (!imageUrlField.trim()) return;

    const testImg = new Image();
    testImg.crossOrigin = "Anonymous";
    testImg.onload = () => {
      setSelectedImage(imageUrlField.trim());
      setFileName("(Using URL)");
    };
    testImg.onerror = () => {
      alert("Invalid or inaccessible image URL!");
    };
    testImg.src = imageUrlField.trim();
  }

  function copyToClipboard(hex: string, index: number) {
    navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  }

  async function exportImage() {
    const element = document.getElementById("palette-container");
    if (!element) return;

    const clipboardIcons = document.querySelectorAll(".clipboard-icon");
    clipboardIcons.forEach((icon) => (icon.style.display = "none"));

    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: 2,
    });

    clipboardIcons.forEach((icon) => (icon.style.display = "block"));

    const link = document.createElement("a");
    link.download = "color-palette.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function regeneratePalette() {
    if (selectedImage) {
      extractColors(selectedImage);
    }
  }

  function handleImageUrlFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setImageUrlField(val);
    setIsUrlValid(validateImageUrl(val));
  }

  // -------------- Render --------------
  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Upload Image Button + Filename */}
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => document.getElementById("image-upload")?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Image
          </Button>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <span className="text-sm text-muted-foreground">{fileName}</span>
        </div>

        {/* Export Palette Button */}
        {colors.length > 0 && (
          <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={exportImage}>
            <Download className="mr-2 h-4 w-4" />
            Export Palette
          </Button>
        )}
      </div>

      {/* URL field and Use Link button in one row */}
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Paste link here"
          value={imageUrlField}
          onChange={handleImageUrlFieldChange}
        />
        <Button
          onClick={handleUseLink}
          disabled={!isUrlValid || imageUrlField.trim().length === 0}
          className="whitespace-nowrap"
        >
          <LinkIcon className="mr-2 h-4 w-4" />
          Use Link
        </Button>
      </div>
      {/* If invalid URL but user typed something */}
      {!isUrlValid && imageUrlField.length > 0 && (
        <p className="text-sm text-red-500">
          Must be a valid image URL (e.g. ends with .jpg, .png, etc.).
        </p>
      )}

      {/* Main container */}
      <div
        id="palette-container"
        className="bg-card border border-gray-200 dark:border-gray-700 p-6 rounded-md shadow-md 
                   grid items-start gap-6 
                   mx-auto
                   grid-cols-1 md:grid-cols-[350px_auto]"
      >
        {/* Image display */}
        <div className="flex justify-center items-center">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full h-auto max-h-[600px] object-contain"
            />
          )}
        </div>

        {/* Color palette */}
        <div className="w-full">
          {colors.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {colors.map((color, index) => (
                <div
                  key={color.hex}
                  onClick={() => copyToClipboard(color.hex, index)}
                  className="p-2 cursor-pointer border rounded-md 
                             bg-card border-gray-200 dark:border-gray-700 
                             flex flex-col justify-between 
                             hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  style={{ minHeight: "100px" }}
                >
                  <div
                    className="w-full h-16 rounded mb-2"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="text-base font-medium leading-tight">{color.name}</div>
                  <div className="text-xs flex items-center gap-1 text-muted-foreground">
                    {copiedIndex === index ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Clipboard className="w-3 h-3 clipboard-icon" />
                    )}
                    {color.hex}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Regenerate Button */}
      {selectedImage && (
        <div className="flex justify-end">
          <Button
            className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
            onClick={regeneratePalette}
          >
            <RefreshCcw className="w-4 h-4" />
            Regenerate Palette
          </Button>
        </div>
      )}
    </div>
  );
}
