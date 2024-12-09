import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import clsx from "clsx";
import { useEffect, useRef, useState, type ReactNode } from "react";
import invariant from "tiny-invariant";
import type { Coord, HoveredState, PieceRecord } from "../types";
import {
  canMove,
  getSquareBackgroundColor,
  isCoord,
  isEqualCoord,
  isPieceType,
} from "../utils";

export function Square({
  pieces,
  location,
  children,
}: {
  pieces: PieceRecord[];
  location: Coord;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<HoveredState>("idle");

  useEffect(() => {
    const element = ref.current;
    invariant(element);

    return dropTargetForElements({
      element,
      canDrop: ({ source }) => {
        if (!isCoord(source.data.location)) {
          return false;
        }

        return !isEqualCoord(source.data.location, location);
      },
      onDragEnter: ({
        // source is the piece being dragged over the drop target
        source,
      }) => {
        if (
          !isCoord(source.data.location) ||
          !isPieceType(source.data.pieceType)
        ) {
          return;
        }

        if (
          canMove({
            start: source.data.location,
            destination: location,
            pieceType: source.data.pieceType,
            pieces,
          })
        ) {
          setState("validMove");
        } else {
          setState("invalidMove");
        }
      },
      onDragLeave: () => setState("idle"),
      onDrop: () => setState("idle"),
    });
  }, [location, pieces]);

  const [row, col] = location;
  const isDark = (row + col) % 2 === 1;

  return (
    <div
      ref={ref}
      className={clsx(
        "flex size-full items-center justify-center",
        getSquareBackgroundColor(state, isDark),
      )}
    >
      {children}
    </div>
  );
}
