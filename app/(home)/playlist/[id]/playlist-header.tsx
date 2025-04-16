"use client";

import { GetPlaylistSchema, UserSchema } from "@/types/types";
import { z } from "zod";
import Image from "next/image";
import { Dot } from "lucide-react";
import { getRequestWrapper } from "@/lib/get-request-wrapper";
import { formatDuration } from "./page";
import { useState, useEffect } from "react";
import ColorExtractor from "@/components/color-extractor";

async function getImage(url: string) {
  const image = await getRequestWrapper<z.infer<typeof UserSchema>>(url);
  return image?.images[0].url;
}

export default function PlaylistHeader({
  data,
}: {
  data: z.infer<typeof GetPlaylistSchema>;
}) {
  const [dominantColor, setDominantColor] = useState("#121212");
  const [ownerImage, setOwnerImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    getImage(data.owner.href).then(setOwnerImage);
  }, [data.owner.href]);

  return (
    <div
      className="mb-8 flex"
      style={{
        background: `linear-gradient(to bottom, ${dominantColor}, #121212)`,
      }}
    >
      <ColorExtractor
        imageUrl={data.images[0].url}
        onColorExtracted={setDominantColor}
      />
      <Image
        src={data.images[0].url}
        alt={data.name}
        width={400}
        height={400}
        className="mr-3 size-72 rounded-[0.5rem] p-8"
      />
      <div className="flex flex-col justify-center">
        <h1 className="mb-2 text-9xl font-extrabold text-white">{data.name}</h1>
        <div className="flex items-center">
          <Image
            src={ownerImage || "Placeholder-48x48.svg"}
            alt={data.owner.display_name}
            width={30}
            height={30}
            className="rounded-full"
          />
          <p className="pl-2 font-bold text-white">{data.owner.display_name}</p>
          <Dot size={20} className="text-gray-400" />
          <p className="text-gray-400">{data.tracks.items.length} låter</p>
          <Dot size={20} className="text-gray-400" />
          <p className="text-gray-400">
            {formatDuration(
              data.tracks.items.reduce((acc, item) => {
                return acc + item.track.duration_ms;
              }, 0),
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
