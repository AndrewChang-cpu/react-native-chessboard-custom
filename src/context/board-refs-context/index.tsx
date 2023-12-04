import type { Move, Square, PieceType } from 'chess.js';
import React, {
  createContext,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  ChessboardState,
  getChessboardState,
} from '../../helpers/get-chessboard-state';
import type { ChessPieceRef } from '../../components/piece';
import type { HighlightedSquareRefType } from '../../components/highlighted-squares/highlighted-square';

import { useChessEngine } from '../chess-engine-context/hooks';
import { useSetBoard } from '../board-context/hooks';

const PieceRefsContext = createContext<React.MutableRefObject<Record<
  Square,
  React.MutableRefObject<ChessPieceRef>
> | null> | null>(null);

const SquareRefsContext = createContext<React.MutableRefObject<Record<
  Square,
  React.MutableRefObject<HighlightedSquareRefType>
> | null> | null>(null);

export type ChessboardRef = {
  undo: () => void;
  move: (_: {
    from: Square;
    to: Square;
  }) => Promise<Move | undefined> | undefined;
  put: (_:{type: PieceType, dest: Square, color: "b" | "w" | "x"}) => void;
  highlight: (_: { square: Square; color?: string }) => void;
  resetAllHighlightedSquares: () => void;
  resetBoard: (fen?: string) => void;
  getState: () => ChessboardState;
};

const BoardRefsContextProviderComponent = React.forwardRef<
  ChessboardRef,
  { children?: React.ReactNode }
>(({ children }, ref) => {
  const chess = useChessEngine();
  const board = chess.board();
  const setBoard = useSetBoard();

  // There must be a better way of doing this.
  const generateBoardRefs = useCallback(() => {
    let acc = {};
    for (let x = 0; x < board.length; x++) {
      const row = board[x];
      for (let y = 0; y < row.length; y++) {
        const col = String.fromCharCode(97 + Math.round(x));
        // eslint-disable-next-line no-shadow
        const row = `${8 - Math.round(y)}`;
        const square = `${col}${row}` as Square;

        // eslint-disable-next-line react-hooks/rules-of-hooks
        acc = { ...acc, [square]: useRef(null) };
      }
    }
    return acc as any;
  }, [board]);

  const pieceRefs: React.MutableRefObject<Record<
    Square,
    React.MutableRefObject<ChessPieceRef>
  > | null> = useRef(generateBoardRefs());

  const squareRefs: React.MutableRefObject<Record<
    Square,
    React.MutableRefObject<HighlightedSquareRefType>
  > | null> = useRef(generateBoardRefs());

  useImperativeHandle(
    ref,
    () => ({
      move: ({ from, to }) => {
        return pieceRefs?.current?.[from].current?.moveTo?.(to);
      },
      undo: () => {
        chess.undo();
        setBoard(chess.board());
      },
      put: ({type, dest, color}) => {
        console.log("!!!!PUTTING", type, color, "ON", dest);

        if (color == 'x') chess.remove(dest);
        else if (type == 'k') {
          function placeKingOnFEN(fen: string, position: Square, color: "b" | "w") {
            const ranks = fen.split(' ')[0].split('/');
            const file = position.charCodeAt(0) - 'a'.charCodeAt(0); // Column, 'a' -> 0, 'b' -> 1, ...
            const rankIndex = 8 - parseInt(position[1], 10); // Row, '1' -> 7, '2' -> 6, ...
            const rank = ranks[rankIndex];
        
            let newRank = '';
            let n = 0;
            for (let i = 0; i < rank.length; i++)
            {
              if (rank[i] > '0' && rank[i] < '9')
              {
                let num = parseInt(rank[i], 10);
                if (file < n + num && file >= n)
                {
                  let before = (file - n != 0 ? (file - n).toString() : '')
                  let after = (n + num - file - 1 != 0 ? (n + num - file - 1).toString() : '');
                  newRank += before + (color == 'w' ? 'K' : 'k') + after;
                }
                else newRank += rank[i];
                n += num;
              }
              else
              {
                if (n == file) newRank += color == 'w' ? 'K' : 'k';
                else newRank += rank[i];
                n++;
              }
              console.log(i, rank, newRank)
            }
            console.log("OLD RANK", rank, "NEW RANK:", newRank)
        
            ranks[rankIndex] = newRank;
        
            return ranks.join('/') + fen.slice(fen.indexOf(' '));
          }
          console.log('Replacing king');

          const fen = chess.fen();
          if (fen.split(' ')[0].includes((color == 'w' ? 'K' : 'k'))) return;

          const newFen = placeKingOnFEN(fen, dest, color);
          chess.load(newFen);
          console.log("PUTTING KING. NEW FEN:", newFen);
          // setBoard(chess.board());
        }
        else console.log("PUT", type, color, chess.put({ type, color }, dest));

        console.log('VALID FEN?', chess.validate_fen(chess.fen()));
        setBoard(chess.board());
      },
      highlight: ({ square, color }) => {
        squareRefs.current?.[square].current.highlight({
          backgroundColor: color,
        });
      },
      resetAllHighlightedSquares: () => {
        for (let x = 0; x < board.length; x++) {
          const row = board[x];
          for (let y = 0; y < row.length; y++) {
            const col = String.fromCharCode(97 + Math.round(x));
            // eslint-disable-next-line no-shadow
            const row = `${8 - Math.round(y)}`;
            const square = `${col}${row}` as Square;
            squareRefs.current?.[square].current.reset();
          }
        }
      },
      getState: () => {
        return getChessboardState(chess);
      },
      resetBoard: (fen) => {
        chess.reset();
        if (fen) chess.load(fen);
        setBoard(chess.board());
      },
    }),
    [board, chess, setBoard]
  );

  return (
    <PieceRefsContext.Provider value={pieceRefs}>
      <SquareRefsContext.Provider value={squareRefs}>
        {children}
      </SquareRefsContext.Provider>
    </PieceRefsContext.Provider>
  );
});

const BoardRefsContextProvider = React.memo(BoardRefsContextProviderComponent);

export { PieceRefsContext, SquareRefsContext, BoardRefsContextProvider };
