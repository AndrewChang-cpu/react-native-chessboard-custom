import { useChessboardProps } from '../../../context/props-context/hooks';
import React from 'react';
import type { PieceType } from 'chess.js';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { StyleSheet, View, Text, Button, Modal } from 'react-native';
import type { BoardPromotionContextState } from '..';
import { DialogPiece } from './dialog-piece';

const PROMOTION_PIECES: PieceType[] = ['k', 'q', 'r', 'n', 'b', 'p'];

const PromotionDialog: React.FC<Required<BoardPromotionContextState>> =
  React.memo(({ type, onSelect }) => {
    const { boardSize } = useChessboardProps();

    console.log('PromotionDialog called!!!');
    return (
      <Animated.View
        // entering={FadeIn}
        // exiting={FadeOut}
        style={[
          styles.container,
          {
            width: boardSize * 5 / 6,
            left: boardSize / 12,
            top: boardSize / 4,
          },
        ]}
      >
        {PROMOTION_PIECES.map((piece, i) => {
          return (
            <DialogPiece
              key={i}
              width={boardSize / 6}
              index={i}
              piece={piece}
              type='w'
              onSelectPiece={onSelect}
            />
          );
        })}
        {PROMOTION_PIECES.map((piece, i) => {
          return (
            <DialogPiece
              key={i+6}
              width={boardSize / 6}
              index={i+6}
              piece={piece}
              type='b'
              onSelectPiece={onSelect}
            />
          );
        })}
        <DialogPiece
          key={12}
          width={boardSize / 6}
          index={12}
          piece={'k'}
          type='x'
          onSelectPiece={onSelect}
        />
      </Animated.View>

      // <View style={ styles.container }>
      //     <Text>Simple Promotion Dialog</Text>
      //     {PROMOTION_PIECES.map((piece, i) => {
      //       return (
      //         <DialogPiece
      //           key={i}
      //           width={boardSize / 6}
      //           index={i}
      //           piece={piece}
      //           type={type}
      //           onSelectPiece={onSelect}
      //         />
      //       );
      //     })}
      // </View>
    );
  });


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    aspectRatio: 5/3,
    backgroundColor: 'rgba(256,256,256,0.85)',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 11,
    elevation: 53,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 5,
      width: 0,
    },
    flexWrap: 'wrap',
  },
});


// const styles = StyleSheet.create({
//   container: {
//     position: 'absolute',
//     aspectRatio: 1,
//     backgroundColor: 'rgba(256,256,256,0.85)',
//     borderRadius: 5,
//     zIndex: 9,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: 'black',
//     shadowOpacity: 0.2,
//     shadowOffset: {
//       height: 5,
//       width: 0,
//     },
//     flexWrap: 'wrap',
//   },
// });

export { PromotionDialog };
