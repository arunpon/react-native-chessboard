import type { Square } from 'chess.js';
import { useCallback } from 'react';
import { useChessboardProps } from './context/props-context/hooks';

import type { Vector } from './types';

const useReversePiecePosition = () => {
  const { pieceSize, orientation } = useChessboardProps();

  const toTranslation = useCallback(
    (to: Square) => {
      'worklet';
      const tokens = to.split('');
      const col = tokens[0];
      const row = tokens[1];
      if (!col || !row) {
        throw new Error('Invalid notation: ' + to);
      }
      const indexes = {
        x: col.charCodeAt(0) - 'a'.charCodeAt(0),
        y: parseInt(row, 10) - 1,
      };
      if (orientation === 'w') {
        return {
          x: indexes.x * pieceSize,
          y: 7 * pieceSize - indexes.y * pieceSize,
        };
      }
      return {
        x: (7 - indexes.x) * pieceSize,
        y: indexes.y * pieceSize,
      };
    },
    [pieceSize, orientation]
  );

  const toPosition = useCallback(
    ({ x, y }: Vector) => {
      'worklet';
      const colIndex = orientation === 'w'
        ? Math.round(x / pieceSize)
        : 7 - Math.round(x / pieceSize);
      const rowIndex = orientation === 'w'
        ? 7 - Math.round(y / pieceSize)
        : Math.round(y / pieceSize);
      const col = String.fromCharCode(97 + colIndex);
      const row = `${rowIndex + 1}`;
      return `${col}${row}` as Square;
    },
    [pieceSize, orientation]
  );

  return { toPosition, toTranslation };
};

export { useReversePiecePosition };
