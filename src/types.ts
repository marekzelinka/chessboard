export type HoveredState = "idle" | "validMove" | "invalidMove";

export interface PieceRecord {
  type: PieceType;
  location: Coord;
}

export type PieceType = "king" | "pawn";

export type Coord = [number, number];
