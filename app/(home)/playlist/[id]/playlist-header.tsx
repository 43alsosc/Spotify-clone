"use client";

import { GetPlaylistSchema, UserSchema } from "@/types/types";
import { z } from "zod";
import Image from "next/image";
import { Dot } from "lucide-react";
import { getRequestWrapper } from "@/lib/get-request-wrapper";
import { formatDuration } from "./page";
import { useState, useEffect } from "react";
import ColorExtractor from "@/components/color-extractor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

async function getImage(url: string) {
  const image = await getRequestWrapper<z.infer<typeof UserSchema>>(url);

  if (!image?.images[0].url) {
    return undefined;
  }

  return image.images[0].url;
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

  const titleSize = getTitleSize(data.name.length);

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
        className="size-72 rounded-[0.5rem] p-8"
      />
      <div className="flex flex-col justify-center">
        <h1 className={`pb-4 ${titleSize} font-extrabold text-white`}>
          {data.name}
        </h1>
        <div className="flex items-center">
          <Avatar className="size-8">
            <AvatarImage src={ownerImage} />
            <AvatarFallback className="rounded-full">
              {data.owner.display_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
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

function getTitleSize(length: number) {
  if (length <= 10) {
    return "text-9xl";
  } else if (length <= 20) {
    return "text-7xl";
  } else if (length <= 30) {
    return "text-6xl";
  } else if (length <= 40) {
    return "text-5xl";
  } else if (length <= 50) {
    return "text-4xl";
  } else if (length <= 60) {
    return "text-3xl";
  } else if (length <= 70) {
    return "text-2xl";
  } else if (length <= 80) {
    return "text-xl";
  } else if (length <= 90) {
    return "text-lg";
  } else if (length <= 100) {
    return "text-base";
  } else {
    return "text-sm";
  }
}
