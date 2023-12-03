import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChessInstance, PieceType } from 'chess.js';
import { PromotionDialog } from './dialog';
import { View, Text, Button } from 'react-native';

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

    }, []);

  const onSelect = useCallback(
    (piece: PieceType) => {
      console.log('Piece received', piece)
      dialog.onSelect?.(piece);
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

  const dummy = (active: boolean) => {
    console.log("DUMMY CALLED. IS DIALOG ACTIVE?", active);
    if (active)
      return (
        // <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
        //   <View style={{ width: 200, height: 100, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
        //     <Text>Simple Promotion Dialog</Text>
        //     <Button title="Select Piece" onPress={() => onSelect('q')} />
        //   </View>
        // </View>
        <PromotionDialog type="w" {...dialog} onSelect={onSelect} />
      ); // <PromotionDialog type="w" {...dialog} onSelect={onSelect} />
    else
      return <></>;
    // console.log("PROMOTION DIALOG RENDERED");
    // return true;
  };

  return (
    <BoardPromotionContext.Provider value={value}>
      {console.log("PRERERENDERED. IS DIALOG ACTIVE?", dialog.isDialogActive)}
      {dialog.isDialogActive && <PromotionDialog type="w" {...dialog} onSelect={onSelect} />}
      {console.log("RERENDERED. IS DIALOG ACTIVE?", dialog.isDialogActive)}
      {children}
    </BoardPromotionContext.Provider>
  );
});

export { BoardPromotionContextProvider, BoardPromotionContext };
