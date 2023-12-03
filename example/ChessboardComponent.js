import React from 'react';
import { View, StyleSheet } from 'react-native';
import Chessboard from 'react-native-chessboard';

const ChessboardComponent = () => {
  return (
    <View style={styles.container}>
      <Chessboard size={320} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f',
  },
});

export default ChessboardComponent;
