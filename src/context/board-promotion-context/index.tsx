import React, { useCallback, useMemo, useState } from 'react';
import type { ChessInstance, PieceType } from 'chess.js';
import { PromotionDialog } from './dialog';

export type BoardPromotionContextType = {
  showPromotionDialog: (_: {
    type: PromotionDialogType;
    onSelect?: (_: PieceType) => void;
  }) => void;
  isPromoting: boolean;
};

const BoardPromotionContext = React.createContext<BoardPromotionContextType>({
  showPromotionDialog: () => {},
  isPromoting: false,
});

type PromotionDialogType = ReturnType<ChessInstance['turn']>;

export type BoardPromotionContextState = {
  isDialogActive: boolean;
  type?: PromotionDialogType;
  onSelect?: (_: PieceType) => void;
};

const BoardPromotionContextProvider: React.FC = React.memo(({ children }) => {
  const [dialog, setDialog] = useState<BoardPromotionContextState>({
    isDialogActive: false,
  });

  const showPromotionDialog: BoardPromotionContextType['showPromotionDialog'] =
    useCallback(({ type, onSelect }) => {
      setDialog({ isDialogActive: true, type, onSelect });
      console.log('activated', dialog.isDialogActive);

    }, []);

  const onSelect = useCallback(
    (piece: PieceType) => {
      dialog.onSelect?.(piece);
      setDialog({ isDialogActive: false });
      console.log('activated', dialog.isDialogActive);
    },
    [dialog]
  );

  const value = useMemo(
    () => ({
      showPromotionDialog,
      isPromoting: dialog.isDialogActive,
    }),
    [dialog.isDialogActive, showPromotionDialog]
  );

  return (
    <BoardPromotionContext.Provider value={value}>
      {dialog.isDialogActive && (
        <PromotionDialog type="w" {...dialog} onSelect={onSelect} />
      )}
      {children}
    </BoardPromotionContext.Provider>
  );
});

export { BoardPromotionContextProvider, BoardPromotionContext };
