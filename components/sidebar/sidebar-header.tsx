import { Plus, ArrowRight, ArrowLeft, Library } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SidebarHeaderProps {
  isLeftPanelMaximized: boolean;
  expandPanel: () => void;
  collapsePanel: () => void;
  minimizePanel: () => void;
}

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
      // Juster terskelen basert på din behov
      setShowFullText(containerWidth > 200);
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="mb-3 flex items-center justify-between" ref={containerRef}>
      <div className="flex items-center gap-2 text-[#B3B3B3] hover:text-white">
        <button
          className="flex flex-shrink-0 cursor-pointer items-center gap-2 p-1.5 whitespace-nowrap transition-colors hover:bg-transparent"
          onClick={collapsePanel}
          aria-label="Collapse panel"
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
          aria-label="Add new"
        >
          <span className="flex items-center gap-2 p-2 px-3 font-bold text-white">
            <Plus className="size-6 text-[#B3B3B3]" />
            {showFullText ? "Lag" : ""}
          </span>
        </button>
        <button
          className="rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
          onClick={isLeftPanelMaximized ? minimizePanel : expandPanel}
          aria-label={isLeftPanelMaximized ? "Minimize panel" : "Expand panel"}
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
