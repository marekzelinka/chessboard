import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import clsx from "clsx";
import { useEffect, useRef, useState, type ReactElement } from "react";
import invariant from "tiny-invariant";
import king from "./assets/king.svg";
import pawn from "./assets/pawn.svg";
import { GRID_SIZE } from "./constants";
import type { Coord, PieceRecord, PieceType } from "./types";
import { isEqualCoord } from "./utils";

const pieceLookup: {
  [Key in PieceType]: () => ReactElement;
} = {
  king: () => <King />,
  pawn: () => <Pawn />,
};

export default function ChessBoard() {
  const pieces: PieceRecord[] = [
    { type: "king", location: [3, 2] },
    { type: "pawn", location: [1, 6] },
  ];

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 py-12 lg:px-8">
      <div className="mx-auto grid w-full max-w-[31.25rem] grid-cols-8 grid-rows-8 border-[3px] border-neutral-300">
        {renderSquares(pieces)}
      </div>
    </div>
  );
}

function renderSquares(pieces: PieceRecord[]) {
  const squares = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const squareCoord: Coord = [row, col];

      const piece = pieces.find((piece) =>
        isEqualCoord(piece.location, squareCoord),
      );

      const isDark = (row + col) % 2 === 1;

      squares.push(
        <div
          key={squareCoord.join(",")}
          className={clsx(
            "flex h-14 items-center justify-center",
            isDark ? "bg-neutral-300" : "bg-white",
          )}
        >
          {piece ? pieceLookup[piece.type]() : null}
        </div>,
      );
    }
  }

  return squares;
}

function King() {
  return <Piece image={king} alt="King" />;
}

function Pawn() {
  return <Piece image={pawn} alt="Pawn" />;
}

function Piece({ image, alt }: { image: string; alt: string }) {
  const ref = useRef<HTMLImageElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const element = ref.current;
    invariant(element);

    return draggable({
      element,
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });
  }, []);

  return (
    <img
      ref={ref}
      src={image}
      alt={alt}
      className={clsx(
        "size-[2.8125rem] rounded-md p-1 shadow-lg shadow-sky-950/25 ring-inset ring-sky-950/25 hover:bg-neutral-400/25",
        isDragging ? "opacity-25" : "",
      )}
    />
  );
}
