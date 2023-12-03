/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useChessboardProps } from '../context/props-context/hooks';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useBoardPromotion } from '../context/board-promotion-context/hooks';
import { useChessEngine } from '../context/chess-engine-context/hooks';
import { useBoardOperations } from '../context/board-operations-context/hooks';
import type { PieceType } from 'src/types';
import type { Square } from 'chess.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
});

type BackgroundProps = {
  letters: boolean;
  numbers: boolean;
};

interface BaseProps extends BackgroundProps {
  white: boolean;
}

interface RowProps extends BaseProps {
  row: number;
}

interface SquareProps extends RowProps {
  col: number;
}

const Square = React.memo(
  ({ white, row, col, letters, numbers }: SquareProps) => {
    const { colors } = useChessboardProps();
    const backgroundColor = white ? colors.black : colors.white;
    const color = white ? colors.white : colors.black;
    const textStyle = { fontWeight: '500' as const, fontSize: 10, color };
    const newLocal = col === 0;
    const { showPromotionDialog } = useBoardPromotion();
    const { putPiece } = useBoardOperations();
    const chess = useChessEngine();


    const onSelectSquare = () => {
      console.log('fen', chess.fen())
      console.log('square selected', row, col)
      const squareNotation = `${String.fromCharCode(97 + col)}${8 - row}`;
      showPromotionDialog({
        type: 'w', // or based on the current turn
        onSelect: (pieceType) => {
          console.log("SQUARE PRESSED", pieceType, squareNotation)
          putPiece(pieceType, squareNotation as Square, 'w')
          // Logic to place the selected piece on 'squareNotation'
          // Update the game state or board representation accordingly
        },
      });
    };
    
    const tapGesture = Gesture.Tap().onEnd(onSelectSquare);


    return (
      <GestureDetector gesture={tapGesture}>
      <View
        style={{
          flex: 1,
          backgroundColor,
          padding: 4,
          justifyContent: 'space-between',
        }}
      >
        {numbers && (
          <Text style={[textStyle, { opacity: newLocal ? 1 : 0 }]}>
            {'' + (8 - row)}
          </Text>
        )}
        {row === 7 && letters && (
          <Text style={[textStyle, { alignSelf: 'flex-end' }]}>
            {String.fromCharCode(97 + col)}
          </Text>
        )}
      </View>
      </GestureDetector>
    );
  }
);

const Row = React.memo(({ white, row, ...rest }: RowProps) => {
  const offset = white ? 0 : 1;
  return (
    <View style={styles.container}>
      {new Array(8).fill(0).map((_, i) => (
        <Square
          {...rest}
          row={row}
          col={i}
          key={i}
          white={(i + offset) % 2 === 1}
        />
      ))}
    </View>
  );
});

const Background: React.FC = React.memo(() => {
  const { withLetters, withNumbers } = useChessboardProps();
  return (
    <View style={{ flex: 1 }}>
      {new Array(8).fill(0).map((_, i) => (
        <Row
          key={i}
          white={i % 2 === 0}
          row={i}
          letters={withLetters}
          numbers={withNumbers}
        />
      ))}
    </View>
  );
});

export default Background;
