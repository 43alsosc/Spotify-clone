"use client";

import { useEffect } from "react";
import ColorThief from "colorthief";

interface ColorExtractorProps {
  imageUrl: string;
  onColorExtracted: (color: string) => void;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

const convertToHex = ({ r, g, b }: RGB): string => {
  const toHex = (value: number): string => {
    const hex = value.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  return `#${[r, g, b].map(toHex).join("")}`;
};

export default function ColorExtractor({
  imageUrl,
  onColorExtracted,
}: ColorExtractorProps) {
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const [r, g, b] = colorThief.getColor(img);
        const dominantColor = convertToHex({ r, g, b });
        onColorExtracted(dominantColor);
      } catch (error) {
        console.error("Feil ved henting av dominerende farge:", error);
        onColorExtracted("#121212"); // Fallback til standard bakgrunnsfarge
      }
    };

    img.onerror = () => {
      console.error("Feil ved lasting av bilde for fargeekstraksjon");
      onColorExtracted("#121212");
    };
  }, [imageUrl, onColorExtracted]);

  return null;
}
