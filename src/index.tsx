import React, { useImperativeHandle, useRef } from 'react';
import { View, StyleSheet } from 'react-native';

import Background from './components/chessboard-background';
import { HighlightedSquares } from './components/highlighted-squares';
import { Pieces } from './components/pieces';
import { SuggestedDots } from './components/suggested-dots';
import { ChessboardContextProvider } from './context/board-context-provider';
import type { ChessboardRef } from './context/board-refs-context';
import {
  ChessboardProps,
  ChessboardPropsContextProvider,
} from './context/props-context';
import { useChessboardProps } from './context/props-context/hooks';

const styles = StyleSheet.create({
  container: {
    aspectRatio: 1,
  },
});

const Chessboard: React.FC = React.memo(() => {
  const { boardSize } = useChessboardProps();

  return (
    <View style={[styles.container, { width: boardSize }]}>
      <Background />
      <Pieces />
      <HighlightedSquares />
      <SuggestedDots />
    </View>
  );
});

const ChessboardContainerComponent = React.forwardRef<
  ChessboardRef,
  ChessboardProps
>((props, ref) => {
  const chessboardRef = useRef<ChessboardRef>(null);

  useImperativeHandle(
    ref,
    () => ({ move: (params) => chessboardRef.current?.move?.(params) }),
    []
  );

  return (
    <ChessboardPropsContextProvider {...props}>
      <ChessboardContextProvider ref={chessboardRef} fen={props.fen}>
        <Chessboard />
      </ChessboardContextProvider>
    </ChessboardPropsContextProvider>
  );
});

const ChessboardContainer = React.memo(ChessboardContainerComponent);

export type { ChessboardRef };
export default ChessboardContainer;
