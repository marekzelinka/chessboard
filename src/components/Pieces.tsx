import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import king from "../assets/king.svg";
import pawn from "../assets/pawn.svg";
import type { Coord, PieceType } from "../types";

export function King({ location }: { location: Coord }) {
  return <Piece location={location} pieceType="king" image={king} alt="King" />;
}

export function Pawn({ location }: { location: Coord }) {
  return <Piece location={location} pieceType="pawn" image={pawn} alt="Pawn" />;
}

function Piece({
  location,
  pieceType,
  image,
  alt,
}: {
  location: Coord;
  pieceType: PieceType;
  image: string;
  alt: string;
}) {
  const ref = useRef<HTMLImageElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const element = ref.current;
    invariant(element);

    return draggable({
      element,
      getInitialData: () => ({ location, pieceType }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });
  }, [location, pieceType]);

  return (
    <img
      ref={ref}
      src={image}
      alt={alt}
      className={clsx(
        "size-[2.8125rem] p-1",
        isDragging
          ? "opacity-40"
          : "rounded-md shadow-lg shadow-sky-950/25 ring-inset ring-sky-950/25 hover:bg-gray-400/25",
      )}
    />
  );
}
