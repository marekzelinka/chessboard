import type { Coord, HoveredState, PieceRecord, PieceType } from "./types";

export const pieceTypes: PieceType[] = ["king", "pawn"];

export function isEqualCoord(c1: Coord, c2: Coord): boolean {
  return c1[0] === c2[0] && c1[1] === c2[1];
}

export function isCoord(token: unknown): token is Coord {
  return (
    Array.isArray(token) &&
    token.length === 2 &&
    token.every((val) => typeof val === "number")
  );
}

export function isPieceType(value: unknown): value is PieceType {
  return typeof value === "string" && pieceTypes.includes(value as PieceType);
}

export function canMove({
  start,
  destination,
  pieceType,
  pieces,
}: {
  start: Coord;
  destination: Coord;
  pieceType: PieceType;
  pieces: PieceRecord[];
}) {
  const rowDist = Math.abs(start[0] - destination[0]);
  const colDist = Math.abs(start[1] - destination[1]);

  if (pieces.find((piece) => isEqualCoord(piece.location, destination))) {
    return false;
  }

  switch (pieceType) {
    case "king":
      return [0, 1].includes(rowDist) && [0, 1].includes(colDist);
    case "pawn":
      return colDist === 0 && start[0] - destination[0] === -1;
    default:
      return false;
  }
}

export function getSquareBackgroundColor(
  state: HoveredState,
  isDark: boolean,
): string {
  if (state === "validMove") {
    return "bg-green-300";
  } else if (state === "invalidMove") {
    return "bg-red-300";
  }

  return isDark ? "bg-gray-300" : "white";
}
