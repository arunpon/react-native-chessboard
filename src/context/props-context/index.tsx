import type { Move } from 'chess.js';
import React, { useMemo } from 'react';
import { Dimensions } from 'react-native';
import type { PieceType } from '../../types';

import type { ChessboardState } from '../../helpers/get-chessboard-state';

type ChessMoveInfo = {
  move: Move;
  state: ChessboardState & { in_promotion: boolean };
};

type ChessboardColorsType = {
  white: string;
  black: string;
  lastMoveHighlight?: string;
  checkmateHighlight?: string;
  promotionPieceButton?: string;
};

type ChessboardDurationsType = {
  move?: number;
};

type ChessboardProps = {
  /**
   * Enables gestures for chess pieces.
   */
  gestureEnabled?: boolean;
  /**
   * Indicates the initial fen position of the chessboard.
   */
  fen?: string;
  /**
   * Decides whether or not to show the letters on the bottom horizontal axis of the chessboard.
   */
  withLetters?: boolean;
  /**
   * Decides whether or not to show the letters on the bottom horizontal axis of the chessboard.
   */
  withNumbers?: boolean;
  /**
   * Indicates the chessboard width and height.
   */
  boardSize?: number;
  /**
   *
   * It gives the possibility to customise the chessboard pieces.
   *
   * In detail, it takes a PieceType as input, which is constructed as follows:
   */
  renderPiece?: (piece: PieceType) => React.ReactElement | null;
  /**
   * It's a particularly useful callback if you want to execute an instruction after a move.
   */
  onMove?: (info: ChessMoveInfo) => void;
  /**
   * Useful if you want to customise the default colors used in the chessboard.
   */
  colors?: ChessboardColorsType;
  /**
   * Useful if you want to customise the default durations used in the chessboard (in milliseconds).
   */
  durations?: ChessboardDurationsType;
  /**
   * Defines which side should be at the bottom of the board.
   * Possible values are 'w' (white) or 'b' (black).
   * By default it will follow the turn from the provided fen string.
   */
  orientation?: 'w' | 'b';
};

type ChessboardContextType = ChessboardProps &
  Required<
    Pick<
      ChessboardProps,
      'gestureEnabled' | 'withLetters' | 'withNumbers' | 'boardSize' | 'orientation'
    >
  > & { pieceSize: number } & {
    colors: Required<ChessboardColorsType>;
    durations: Required<ChessboardDurationsType>;
  };

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEFAULT_BOARD_SIZE = Math.floor(SCREEN_WIDTH / 8) * 8;

const defaultChessboardProps: ChessboardContextType = {
  gestureEnabled: true,
  colors: {
    black: '#62B1A8',
    white: '#D9FDF8',
    lastMoveHighlight: 'rgba(255,255,0, 0.5)',
    checkmateHighlight: '#E84855',
    promotionPieceButton: '#FF9B71',
  },
  durations: {
    move: 150,
  },
  withLetters: true,
  withNumbers: true,
  boardSize: DEFAULT_BOARD_SIZE,
  pieceSize: DEFAULT_BOARD_SIZE / 8,
  orientation: 'w',
};

const ChessboardPropsContext = React.createContext<ChessboardContextType>(
  defaultChessboardProps
);

const ChessboardPropsContextProvider: React.FC<ChessboardProps> = React.memo(
  ({ children, ...rest }) => {
    const value = useMemo(() => {
      const orientationFromFen =
        rest.fen?.split(' ')[1] === 'b' ? 'b' : 'w';
      const data = {
        ...defaultChessboardProps,
        ...rest,
        orientation: rest.orientation ?? orientationFromFen,
        colors: { ...defaultChessboardProps.colors, ...rest.colors },
        durations: { ...defaultChessboardProps.durations, ...rest.durations },
      };
      return { ...data, pieceSize: data.boardSize / 8 };
    }, [rest]);

    return (
      <ChessboardPropsContext.Provider value={value}>
        {children}
      </ChessboardPropsContext.Provider>
    );
  }
);

export { ChessboardPropsContextProvider, ChessboardPropsContext };
// eslint-disable-next-line no-undef
export type { ChessboardProps };
