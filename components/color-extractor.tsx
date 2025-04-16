"use client";

import { useEffect } from "react";
import ColorThief from "colorthief";

interface ColorExtractorProps {
  imageUrl: string;
  onColorExtracted: (color: string) => void;
}

export default function ColorExtractor({
  imageUrl,
  onColorExtracted,
}: ColorExtractorProps) {
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const colorThief = new ColorThief();
      const color = colorThief.getColor(img);
      const hexColor = rgbToHex(color[0], color[1], color[2]);
      onColorExtracted(hexColor);
    };
  }, [imageUrl, onColorExtracted]);

  return null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}
