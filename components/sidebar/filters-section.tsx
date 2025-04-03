"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FiltersSection() {
  const filtersRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Sample data
  const filters = [
    "All",
    "Playlists",
    "Albums",
    "Artists",
    "Songs",
    "Podcasts",
    "Audiobooks",
    "Downloaded",
    "Local Files",
    "Favorites",
    "Recently Played",
  ];

  // Check if filters can be scrolled and update fade effect
  useEffect(() => {
    const checkScroll = () => {
      if (filtersRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = filtersRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

        // Update the mask image based on scroll position
        const element = filtersRef.current;
        if (scrollLeft <= 0) {
          // At the start - only fade right
          element.style.maskImage =
            "linear-gradient(to right, black 90%, transparent)";
        } else if (scrollLeft >= scrollWidth - clientWidth - 10) {
          // At the end - only fade left
          element.style.maskImage =
            "linear-gradient(to right, transparent, black 10%)";
        } else {
          // In the middle - fade both sides
          element.style.maskImage =
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)";
        }
      }
    };

    checkScroll();

    const filtersElement = filtersRef.current;
    if (filtersElement) {
      filtersElement.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }

    return () => {
      if (filtersElement) {
        filtersElement.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      }
    };
  }, []);

  // Scroll filters
  const scrollFilters = (direction: "left" | "right") => {
    if (filtersRef.current) {
      const scrollAmount = 200;
      const currentScroll = filtersRef.current.scrollLeft;
      filtersRef.current.scrollTo({
        left:
          direction === "left"
            ? currentScroll - scrollAmount
            : currentScroll + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          onClick={() => scrollFilters("left")}
          className="absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-full bg-zinc-800/90 p-1 shadow-md"
          aria-label="Scroll filters left"
        >
          <ChevronLeft className="h-4 w-4 text-white" />
        </button>
      )}

      <div
        ref={filtersRef}
        className="scrollbar-hide relative flex gap-2 overflow-x-auto pb-2"
      >
        {filters.map((filter) => (
          <button
            key={filter}
            className="rounded-full bg-zinc-700 px-3 py-1.5 text-sm whitespace-nowrap text-white transition-colors hover:bg-zinc-600"
          >
            {filter}
          </button>
        ))}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scrollFilters("right")}
          className="absolute top-1/2 right-0 z-10 -translate-y-1/2 rounded-full bg-zinc-800/90 p-1 shadow-md"
          aria-label="Scroll filters right"
        >
          <ChevronRight className="h-4 w-4 text-white" />
        </button>
      )}
    </div>
  );
}
