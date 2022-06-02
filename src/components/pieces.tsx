import React, { useMemo } from 'react';
import { useChessboardProps } from '../context/props-context/hooks';

import { useBoard } from '../context/board-context/hooks';
import { useBoardRefs } from '../context/board-refs-context/hooks';

import Piece from '../piece';
import { useReversePiecePosition } from '../notation';
import { useChessEngine } from '../context/chess-engine-context/hooks';

const Pieces = React.memo(() => {
  const board = useBoard();
  const chess = useChessEngine();
  const refs = useBoardRefs();
  const { pieceSize } = useChessboardProps();
  const { toPosition } = useReversePiecePosition();

  const chessTurn = useMemo(() => chess.turn(), [chess]);

  return (
    <>
      {board.map((row, y) =>
        row.map((piece, x) => {
          if (piece !== null) {
            const square = toPosition({
              x: x * pieceSize,
              y: y * pieceSize,
            });

            return (
              <Piece
                ref={refs?.current?.[square]}
                key={`${x}-${y}`}
                id={`${piece.color}${piece.type}` as const}
                startPosition={{ x, y }}
                square={square}
                size={pieceSize}
                gestureEnabled={chessTurn === piece.color}
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
