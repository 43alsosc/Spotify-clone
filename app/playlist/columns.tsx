"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Clock } from "lucide-react";
import Image from "next/image";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Playlist = {
  title: string;
  artists: string;
  image: string;
  album: string;
  dateAdded: string;
  duration: string;
};

export const columns: ColumnDef<Playlist>[] = [
  {
    accessorKey: "number",
    header: "#",
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Image
            src={row.original.image}
            alt={row.original.title}
            width={50}
            height={50}
          />
          <div>
            {row.original.title}
            <div className="text-muted-foreground text-sm">
              {row.original.artists}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "album",
    header: "Album",
  },
  {
    accessorKey: "dateAdded",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Added
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "duration",
    header: () => {
      return <Clock className="size-5" />;
    },
  },
];
