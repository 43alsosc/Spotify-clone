import { useEffect, useRef, useState } from "react";
import { Plus, ArrowRight, ArrowLeft, Library } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SidebarHeaderProps {
  isLeftPanelMaximized: boolean;
  expandPanel: () => void;
  collapsePanel: () => void;
  minimizePanel: () => void;
}

const MIN_WIDTH_FOR_TEXT = 200;

export default function SidebarHeader({
  isLeftPanelMaximized,
  expandPanel,
  collapsePanel,
  minimizePanel,
}: SidebarHeaderProps) {
  const [showFullText, setShowFullText] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const containerWidth = entries[0].contentRect.width;
      setShowFullText(containerWidth > MIN_WIDTH_FOR_TEXT);
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="mb-3 flex items-center justify-between" ref={containerRef}>
      <div className="flex items-center gap-2 text-[#B3B3B3] hover:text-white">
        <button
          className={cn(
            "flex cursor-pointer items-center gap-2 p-1.5 whitespace-nowrap",
            "flex-shrink-0 transition-colors hover:bg-transparent",
          )}
          onClick={collapsePanel}
          aria-label="Skjul panel"
        >
          <Library className="size-6" />
          <span className="flex-shrink-0 font-bold whitespace-nowrap">
            Biblioteket ditt
          </span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="rounded-full bg-[#1F1F1F] text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
          aria-label="Legg til ny"
        >
          <span className="flex items-center gap-2 p-2 px-3 font-bold text-white">
            <Plus className="size-6 text-[#B3B3B3]" />
            {showFullText ? "Opprett" : ""}
          </span>
        </button>

        <button
          className="rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
          onClick={isLeftPanelMaximized ? minimizePanel : expandPanel}
          aria-label={isLeftPanelMaximized ? "Minimer panel" : "Utvid panel"}
        >
          {isLeftPanelMaximized ? (
            <ArrowLeft className="size-6" />
          ) : (
            <ArrowRight className="size-6" />
          )}
        </button>
      </div>
    </div>
  );
}
