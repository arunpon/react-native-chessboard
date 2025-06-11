import React from 'react';
import type { Square } from 'chess.js';
import { useChessboardProps } from '../context/props-context/hooks';

import { useBoard } from '../context/board-context/hooks';
import { usePieceRefs } from '../context/board-refs-context/hooks';

import Piece from './piece';

const Pieces = React.memo(() => {
  const board = useBoard();
  const refs = usePieceRefs();
  const { pieceSize, orientation } = useChessboardProps();

  return (
    <>
      {board.map((row, y) =>
        row.map((piece, x) => {
          if (piece !== null) {
            const square = ((): Square => {
              const col = String.fromCharCode(97 + x);
              const rowIndex = 8 - y;
              return `${col}${rowIndex}` as Square;
            })();

            const displayPosition =
              orientation === 'w'
                ? { x, y }
                : { x: 7 - x, y: 7 - y };

            return (
              <Piece
                ref={refs?.current?.[square]}
                key={`${x}-${y}`}
                id={`${piece.color}${piece.type}` as const}
                startPosition={displayPosition}
                square={square}
                size={pieceSize}
              />
            );
          }
          return null;
        })
      )}
    </>
  );
});

export { Pieces };
