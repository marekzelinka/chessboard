import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  useEffect,
  useState,
  type CSSProperties,
  type ReactElement,
} from "react";
import { King, Pawn } from "./components/Pieces";
import { Square } from "./components/Square";
import { GRID_SIZE } from "./constants";
import type { Coord, PieceRecord, PieceType } from "./types";
import { canMove, isCoord, isEqualCoord, isPieceType } from "./utils";

const pieceLookup: {
  [Key in PieceType]: (location: [number, number]) => ReactElement;
} = {
  king: (location) => <King location={location} />,
  pawn: (location) => <Pawn location={location} />,
};

export default function ChessBoard() {
  const [pieces, setPieces] = useState<PieceRecord[]>([
    { type: "king", location: [3, 2] },
    { type: "pawn", location: [1, 6] },
  ]);

  useEffect(() => {
    return monitorForElements({
      onDrop: ({ source, location }) => {
        const destination = location.current.dropTargets[0];
        if (!destination) {
          // if dropped outside of any drop targets (squares)
          return;
        }

        if (
          // type guarding
          !isCoord(destination.data.location) ||
          !isCoord(source.data.location) ||
          !isPieceType(source.data.pieceType)
        ) {
          return;
        }

        const destinationLocation = destination.data.location;
        const sourceLocation = source.data.location;
        const pieceType = source.data.pieceType;

        const piece = pieces.find((p) =>
          isEqualCoord(p.location, sourceLocation),
        );
        if (!piece) {
          return;
        }

        const restOfPieces = pieces.filter((p) => p !== piece);

        if (
          canMove({
            start: sourceLocation,
            destination: destinationLocation,
            pieceType,
            pieces,
          })
        ) {
          // moving the piece
          setPieces([
            { type: piece.type, location: destinationLocation },
            ...restOfPieces,
          ]);
        }
      },
    });
  }, [pieces]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 py-12 lg:px-8">
      <div
        style={{ "--grid-size": GRID_SIZE } as CSSProperties}
        className="mx-auto grid size-[31.25rem] grid-cols-[repeat(var(--grid-size),_1fr)] grid-rows-[repeat(var(--grid-size),_1fr)] border-[3px] border-gray-300"
      >
        {renderSquares(pieces)}
      </div>
    </div>
  );
}

function renderSquares(pieces: PieceRecord[]) {
  const squares: JSX.Element[] = [];

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const squareCoord: Coord = [row, col];

      const piece = pieces.find((piece) =>
        isEqualCoord(piece.location, squareCoord),
      );

      squares.push(
        <Square
          key={squareCoord.join(",")}
          pieces={pieces}
          location={squareCoord}
        >
          {piece ? pieceLookup[piece.type](squareCoord) : null}
        </Square>,
      );
    }
  }

  return squares;
}
