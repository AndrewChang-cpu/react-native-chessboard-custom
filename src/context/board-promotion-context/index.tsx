import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChessInstance, PieceType } from 'chess.js';
import { PromotionDialog } from './dialog';
import { View, Text, Button } from 'react-native';

export type BoardPromotionContextType = {
  showPromotionDialog: (_: {
    type: PromotionDialogType;
    onSelect?: (_: PieceType, x_: 'b' | 'w' | 'x') => void;
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
  onSelect?: (_: PieceType, x_: "b" | "w" | "x") => void;
};

const BoardPromotionContextProvider: React.FC = React.memo(({ children }) => {
  const [dialog, setDialog] = useState<BoardPromotionContextState>({
    isDialogActive: false,
  });

  const showPromotionDialog: BoardPromotionContextType['showPromotionDialog'] =
    useCallback(({ type, onSelect }) => {
      setDialog({ isDialogActive: true, type, onSelect });

    }, []);

  const onSelect = useCallback(
    (piece: PieceType, type: 'b' | 'w' | 'x') => {
      console.log('Piece received', piece)
      dialog.onSelect?.(piece, type);
      setDialog({ isDialogActive: false });
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

  useEffect(() => {
    console.log("USE EFFECT CALLED. IS DIALOG ACTIVE?", dialog.isDialogActive);
  }, [dialog.isDialogActive]);

  return (
    // TYPE ISN'T USED
    <BoardPromotionContext.Provider value={value}>
      {console.log("PRERERENDERED. IS DIALOG ACTIVE?", dialog.isDialogActive)}
      {dialog.isDialogActive && <PromotionDialog type="w" {...dialog} onSelect={onSelect} />} 
      {console.log("RERENDERED. IS DIALOG ACTIVE?", dialog.isDialogActive)}
      {children}
    </BoardPromotionContext.Provider>
  );
});

export { BoardPromotionContextProvider, BoardPromotionContext };
