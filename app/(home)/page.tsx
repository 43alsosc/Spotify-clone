"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronRight, Play } from "lucide-react";
import { getRecentlyPlayedTracks } from "../actions/getRecentlyPlaced";
import { getFeaturedPlaylists } from "../actions/getFeaturedPlaylists";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CategoryObject } from "@/types/types";
import { z } from "zod";

export default function Home() {
  const scrollableRef = useRef<HTMLDivElement>(null);
  const [recentTracks, setRecentTracks] = useState<any[]>([]);
  const [featuredItems, setFeaturedItems] = useState<any[]>([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState(true);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);

  // Fetch recent tracks
  useEffect(() => {
    const fetchRecentTracks = async () => {
      try {
        const tracks = await getRecentlyPlayedTracks(20);

        // Remove duplicates
        const uniqueTracks = tracks?.filter(
          (track, index, self) =>
            index === self.findIndex((t) => t.track.id === track.track.id),
        );

        setRecentTracks(uniqueTracks || []);
      } catch (error) {
        console.error("Error fetching recent tracks:", error);
      } finally {
        setIsLoadingTracks(false);
      }
    };

    const fetchFeaturedItems = async () => {
      try {
        const items = await getFeaturedPlaylists();

        // Sjekk om det er desember
        const isDecember = new Date().getMonth() === 11;

        // Sjekk om det er natt (mellom 22:00 og 06:00)
        const currentHour = new Date().getHours();
        const isNightTime = currentHour >= 22 || currentHour < 6;

        // Filtrer først basert på tid
        const filteredItems = (items || []).filter((item) => {
          // Behold "God Jul" spillelisten kun i desember
          if (item.id === "0JQ5DAqbMKFDKyRxRDLIbk") {
            return isDecember;
          }

          // Behold "Sove" spillelisten kun om natten
          if (item.id === "0JQ5DAqbMKFCuoRTxhYWow") {
            return isNightTime;
          }

          return true;
        });

        // Finn "Spesielt for deg" spillelisten
        const spesieltForDeg = filteredItems.find(
          (item) => item.id === "0JQ5DAt0tbjZptfcdMSKl3",
        );

        // Fjern "Spesielt for deg" fra listen som skal blandes
        const otherItems = filteredItems.filter(
          (item) => item.id !== "0JQ5DAt0tbjZptfcdMSKl3",
        );

        // Bland de andre spillelistene
        const shuffledItems = otherItems.sort(() => Math.random() - 0.5);

        // Ta de første 7 blandede spillelistene
        const selectedItems = shuffledItems.slice(0, 7);

        // Kombiner "Spesielt for deg" med de 7 tilfeldige spillelistene
        const finalItems = spesieltForDeg
          ? [spesieltForDeg, ...selectedItems]
          : selectedItems;

        setFeaturedItems(finalItems);
      } catch (error) {
        console.error("Error fetching featured items:", error);
      } finally {
        setIsLoadingFeatured(false);
      }
    };

    fetchRecentTracks();
    fetchFeaturedItems();
  }, []);

  // Check if tracks can be scrolled and update fade effect
  useEffect(() => {
    const checkScroll = () => {
      if (scrollableRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollableRef.current;
        const element = scrollableRef.current;
        if (scrollLeft <= 0) {
          // At the start - only fade right
          element.style.maskImage =
            "linear-gradient(to right, black 95%, transparent)";
        } else if (scrollLeft >= scrollWidth - clientWidth - 10) {
          // At the end - only fade left
          element.style.maskImage =
            "linear-gradient(to right, transparent, black 5%)";
        } else {
          // In the middle - fade both sides
          element.style.maskImage =
            "linear-gradient(to right, transparent, black 5%, black 95%, transparent)";
        }
      }
    };

    checkScroll();

    const scrollableElement = scrollableRef.current;
    if (scrollableElement) {
      scrollableElement.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }

    return () => {
      if (scrollableElement) {
        scrollableElement.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      }
    };
  }, []);

  // return (
  //   <div className="flex flex-col gap-8">
  //     {/* Featured Grid */}
  //     <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
  //       {isLoadingFeatured
  //         ? // Skeleton loading state for featured items
  //           Array.from({ length: 8 }).map((_, index) => (
  //             <div key={index} className="h-20 overflow-hidden rounded-lg">
  //               <div className="flex overflow-hidden rounded-[0.5rem]">
  //                 <Skeleton className="h-20 w-20 rounded-l-[0.5rem]" />
  //                 <div className="flex w-full items-center bg-[#302F2F] p-4">
  //                   <Skeleton className="h-4 w-32" />
  //                 </div>
  //               </div>
  //             </div>
  //           ))
  //         : // Actual featured items
  //           featuredItems.map((item) => (
  //             <div
  //               key={item.id}
  //               className="group relative h-20 cursor-pointer overflow-hidden rounded-lg"
  //             >
  //               <div className="flex overflow-hidden rounded-[0.5rem]">
  //                 <div className="relative aspect-square h-20">
  //                   <Image
  //                     src={item.icons[0].url || "/placeholder.svg"}
  //                     alt={item.name}
  //                     fill
  //                     sizes="100px"
  //                     className="aspect-square rounded-l-[0.5rem]"
  //                   />
  //                 </div>
  //                 <div className="flex w-full items-center bg-[#302F2F] p-4">
  //                   <h3 className="font-bold text-white">{item.name}</h3>
  //                 </div>
  //               </div>
  //               <div className="absolute inset-0 flex items-center justify-end bg-black/20 pr-4 opacity-0 transition-opacity group-hover:opacity-100">
  //                 <Button
  //                   variant="default"
  //                   className="aspect-square h-2/3 cursor-pointer rounded-full bg-[#1ED760] transition-all duration-300 hover:scale-105 hover:bg-[#1ED760]"
  //                 >
  //                   <Play fill="black" className="size-6 text-black" />
  //                 </Button>
  //               </div>
  //             </div>
  //           ))}
  //     </div>

  //     {/* Recent Tracks */}
  //     <section className="mt-6">
  //       <div className="mb-4 flex items-center justify-between">
  //         <h2 className="text-xl font-bold text-white">Recently Played</h2>
  //         <button className="flex items-center text-sm text-zinc-400 transition-colors hover:text-white">
  //           View all
  //           <ChevronRight className="ml-1 h-4 w-4" />
  //         </button>
  //       </div>

  //       <div className="relative">
  //         <div
  //           ref={scrollableRef}
  //           className="scrollbar-hide flex gap-4 overflow-x-auto pb-4"
  //         >
  //           {/* Skeleton loading state for tracks */}
  //           {isLoadingTracks ? (
  //             Array.from({ length: 10 }).map((_, index) => (
  //               <div key={index} className="group w-[150px] flex-shrink-0">
  //                 <Skeleton className="mb-2 aspect-square w-full rounded-md" />
  //                 <Skeleton className="mb-1 h-4 w-full" />
  //                 <Skeleton className="h-3 w-3/4" />
  //               </div>
  //             ))
  //           ) : recentTracks.length > 0 ? (
  //             // Actual tracks
  //             recentTracks.map((track, index) => (
  //               <div key={index} className="group w-[150px] flex-shrink-0">
  //                 <div className="relative mb-2 aspect-square overflow-hidden rounded-[0.5rem] p-2 hover:bg-zinc-800/50">
  //                   <Image
  //                     src={track.album.images[0].url || "/placeholder.svg"}
  //                     alt={track.name}
  //                     fill
  //                     sizes="150px"
  //                     className="rounded-[0.5rem] object-cover"
  //                   />
  //                   <div className="absolute inset-0 flex items-end justify-end rounded-md bg-zinc-800/50 p-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
  //                     <Button
  //                       variant="ghost"
  //                       className="aspect-square h-12 translate-y-full transform rounded-full bg-[#1ED760] transition-all duration-200 group-hover:translate-y-0 hover:scale-105 hover:bg-[#1ED760]"
  //                     >
  //                       <Play fill="black" className="size-6 text-black" />
  //                     </Button>
  //                   </div>
  //                 </div>
  //                 <h3 className="truncate text-sm font-medium text-white">
  //                   {track.name}
  //                 </h3>
  //                 <p className="truncate text-xs text-zinc-400">
  //                   {track.artists.map((artist: any, i: number) => (
  //                     <span key={artist.id}>
  //                       {i > 0 && ", "}
  //                       {artist.name}
  //                     </span>
  //                   ))}
  //                 </p>
  //               </div>
  //             ))
  //           ) : (
  //             // Fallback for no tracks
  //             <div className="w-full py-8 text-center text-zinc-400">
  //               No recently played tracks found.
  //             </div>
  //           )}
  //         </div>
  //       </div>
  //     </section>
  //   </div>
  // );
}
