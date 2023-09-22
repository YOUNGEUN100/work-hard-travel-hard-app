import { StatusBar } from 'expo-status-bar';
import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import {theme} from './color.js';

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState('');
  const [task, setTask] = useState({});
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
  const addToDo = () => { 
    if (text === '') {
      return
    }
    // alert(text) 
    setText('');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working? "white" : theme.gray}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color: working? theme.gray : "white" }}>Travel</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput 
          onSubmitEditing={addToDo}
          onChangeText={onChangeText}
          returnKeyType="done"
          value={text}
          placeholder={working? "Add a To do" : "Where do you want do go?"} 
          style={styles.input} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 100,
  },
  btnText: {
    color: "white",
    fontSize: 35,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "white",
    color: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    fontSize: 15,
  }
});
