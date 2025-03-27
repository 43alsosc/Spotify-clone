import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function Home() {
  const recentlyPlayed = [
    {
      title: "Liked Songs",
      image: "/placeholder.svg?height=150&width=150",
      creator: "Your Library",
    },
    {
      title: "Daily Mix 1",
      image: "/placeholder.svg?height=150&width=150",
      creator: "Spotify",
    },
    {
      title: "Discover Weekly",
      image: "/placeholder.svg?height=150&width=150",
      creator: "Spotify",
    },
    {
      title: "Release Radar",
      image: "/placeholder.svg?height=150&width=150",
      creator: "Spotify",
    },
    {
      title: "Chill Mix",
      image: "/placeholder.svg?height=150&width=150",
      creator: "Spotify",
    },
    {
      title: "Rock Classics",
      image: "/placeholder.svg?height=150&width=150",
      creator: "Spotify",
    },
  ];

  const madeForYou = [
    {
      title: "Daily Mix 1",
      image: "/placeholder.svg?height=150&width=150",
      description: "Kendrick Lamar, J. Cole, Drake and more",
    },
    {
      title: "Daily Mix 2",
      image: "/placeholder.svg?height=150&width=150",
      description: "Taylor Swift, Billie Eilish, Olivia Rodrigo and more",
    },
    {
      title: "Daily Mix 3",
      image: "/placeholder.svg?height=150&width=150",
      description: "The Weeknd, Post Malone, Doja Cat and more",
    },
    {
      title: "Discover Weekly",
      image: "/placeholder.svg?height=150&width=150",
      description: "Your weekly mixtape of fresh music",
    },
    {
      title: "Release Radar",
      image: "/placeholder.svg?height=150&width=150",
      description: "Catch all the latest music from artists you follow",
    },
  ];

  return (
    <main className="flex-1 overflow-auto bg-gradient-to-b from-[#1F1F1F] to-[#121212] p-6">
      <div className="mb-8">
        <h1 className="mb-6 text-2xl font-bold text-white">Good afternoon</h1>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recentlyPlayed.map((item, i) => (
            <div
              key={i}
              className="group flex items-center gap-4 rounded-md bg-[#2A2A2A] p-1 pr-4 transition-all hover:bg-[#3E3E3E]"
            >
              <Image
                src={"/Placeholder-48x48.svg"}
                alt={item.title}
                width={80}
                height={80}
                className="rounded-md"
              />
              <span className="font-semibold text-white">{item.title}</span>
              <div className="ml-auto opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  size="icon"
                  className="h-12 w-12 rounded-full bg-[#1DB954] text-black shadow-lg hover:scale-105 hover:bg-[#1ED760]"
                >
                  <Play className="h-6 w-6 fill-current" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Made for You</h2>
          <button className="text-sm font-bold text-gray-400 hover:text-white">
            Show all
          </button>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {madeForYou.map((item, i) => (
            <Card
              key={i}
              className="group relative bg-[#181818] transition-all hover:bg-[#282828]"
            >
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    width={150}
                    height={150}
                    className="rounded-md shadow-lg"
                  />
                  <div className="absolute right-2 bottom-2 opacity-0 transition-all group-hover:bottom-4 group-hover:opacity-100">
                    <Button
                      size="icon"
                      className="h-12 w-12 rounded-full bg-[#1DB954] text-black shadow-lg hover:scale-105 hover:bg-[#1ED760]"
                    >
                      <Play className="h-6 w-6 fill-current" />
                    </Button>
                  </div>
                </div>
                <h3 className="mb-1 font-bold text-white">{item.title}</h3>
                <p className="line-clamp-2 text-sm text-gray-400">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Recently Played</h2>
          <button className="text-sm font-bold text-gray-400 hover:text-white">
            Show all
          </button>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {recentlyPlayed.map((item, i) => (
            <Card
              key={i}
              className="group relative bg-[#181818] transition-all hover:bg-[#282828]"
            >
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <Image
                    src={item.image || "/Placeholder-48x48.svg"}
                    alt={item.title}
                    width={150}
                    height={150}
                    className="rounded-md shadow-lg"
                  />
                  <div className="absolute right-2 bottom-2 opacity-0 transition-all group-hover:bottom-4 group-hover:opacity-100">
                    <Button
                      size="icon"
                      className="h-12 w-12 rounded-full bg-[#1DB954] text-black shadow-lg hover:scale-105 hover:bg-[#1ED760]"
                    >
                      <Play className="h-6 w-6 fill-current" />
                    </Button>
                  </div>
                </div>
                <h3 className="mb-1 font-bold text-white">{item.title}</h3>
                <p className="text-sm text-gray-400">By {item.creator}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
