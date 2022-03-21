import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';

const Tasks = props => {
  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <TouchableOpacity style={styles.squre}></TouchableOpacity>
        <Text style={styles.text}>{props.text}</Text>
      </View>
      <View style={styles.circle}></View>
    </View>
  );
};

export default Tasks;
const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
  },
  squre: {
    width: 24,
    height: 24,
    backgroundColor: '#75c7c9',
    borderRadius: 4,
  },
  itemLeft: {
    flexDirection: 'row',

    alignItems: 'center',
    flexWrap: 'wrap',
    margin: 10,
  },
  text: {
    marginLeft: 10,
    maxWidth: '80%',
    fontWeight: '500',
    fontSize: 16,
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#65ba5f',
  },
});
