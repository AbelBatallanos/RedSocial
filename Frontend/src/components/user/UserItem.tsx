import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UserItem: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>UserItem</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserItem;
