import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert, Button } from 'react-native';
import {theme} from './color.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto, Octicons  } from '@expo/vector-icons'; 

// (v) 과제1 : 탭 시작을 기억하기
// (v) 과제2 : 완성으로 바꾸기 (삭제하지 말고)
// (v) 과제3 : 할일 텍스트 수정하기

const STORAGE_KEY = "@task";

export default function App() {

  const [tap, setTap] = useState("work"); // Work(true), Travel(false) 탭이동 
  const [text, setText] = useState(''); // 할 일 입력 텍스트
  const [newText, setNewText] = useState('') // 할일 수정할 때 쓰는 텍스트
  const [task, setTask] = useState({}); // 할일 목록들
  const [done, setDone] = useState(false); // 완료 여부
  const [edit, setEdit] = useState(false); // 수정 여부

  // 리로딩 될 때 마지막 탭 위치 기억
  useEffect(() => { 
    loadTap();
    console.log(task);
  },[]);

  // 탭 위치가 변경될 때 할일 가져오기
  useEffect(()=>{
    loadTask();
    console.log(task);
  },[tap])

  // Travel 탭을 누르면 tap 이 travel 로 바뀜
  const travel = () => {
    setTap("travel")
    AsyncStorage.setItem("tap", "travel");
  }; 
  // Work 탭을 누르면 tap 이 work 로 바뀜
  const work = () => {
    setTap("work"); 
    AsyncStorage.setItem("tap", "work");
  }
  // 로딩될때 탭 위치 가져오기
  const loadTap = async () => {
    const t = await AsyncStorage.getItem("tap");
    setTap(t);
  }
  // 입력 텍스트가 바뀔 때 state 변경하기
  const onChangeText = (payload) => setText(payload); 
  /* 할 일 모바일에 저장 */
  const saveTask = async (toSave) => { 
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  };
  /* 할 일 모바일 내용 가져오기 */
  const loadTask = async() => { 
    const s = await AsyncStorage.getItem(STORAGE_KEY)
    setTask(JSON.parse(s)); // 할일 목록들에 가져온 내용 넣기
  };
  /* 할일 추가 */
  const addTask = async () => {  // 할일을 추가하면 text 를 비운다
    if (text === '') { // 입력 텍스트가 비어있으면 할일 추가 안됨
      return
    }
    const newTask = { // 새로운 할 일 
      ...task, 
      [Date.now()]: { text, tap, done, edit }
    } // 기존 할 일에 새로운 할 일 객체를 합친다
    setTask(newTask); 
    await saveTask(newTask);
    setText(''); // 입력 텍스트 비우기
  };
  /* 할일 삭제 */
  const deleteTask = async (key) => {
    Alert.alert("Delete To Do", "Are you sure?", [
      {text:"Cancel"},
      {text: "I'm Sure",
        onPress: () => { 
          const newTask = {...task};
          delete newTask[key];
          setTask(newTask); 
          saveTask(newTask);
        },
      },
    ]);
  }
  /* 할 일 체크 토글 */
  const toggleTask = async (key) => {
    const updateTask = {...task};
    updateTask[key].done = !updateTask[key].done;
    setTask(updateTask);
    saveTask(updateTask);
  }
  /* 할 일 수정 모드로 전환 */
  const changeEditStatus = (key) => {
    const updateTask = {...task};
    updateTask[key].edit = !updateTask[key].edit;
    setTask(updateTask);
    saveTask(updateTask);
    setNewText(updateTask[key].text);
   }
   const editTask = async (key) => {
    const updateTask = { ...task };
    updateTask[key].text = newText; // newText 상태를 사용하여 텍스트 업데이트
    updateTask[key].edit = false; // 수정 모드 종료
    setTask(updateTask);
    saveTask(updateTask);
    setNewText(''); // 수정 후 newText 초기화
   }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* 탭 부분 */}
      <View style={styles.header}> 
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: (tap==="work")? "white" : theme.gray}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color: (tap==="travel")? "white" : theme.gray }}>Travel</Text>
        </TouchableOpacity>
      </View>
      {/* 할 일 입력 부분 */}
      <View>
        <TextInput 
          onSubmitEditing={addTask}
          onChangeText={onChangeText} // 텍스트가 바뀔때 실행
          returnKeyType="done" // 키보드 컨트롤
          value={text}
          placeholder={(tap === "work")? "Add a To do" : "Where do you want do go?"} 
          style={styles.input} />
      </View>
      {/* 할 일 목록 부분 */}
      <ScrollView>{
        Object.keys(task).map(key =>  // 키로 이루워진 배열을 반환 (Object.keys)
          task[key].tap === tap? (  // work / travel 탭 확인
            !task[key].edit ? (  // 수정모드를 눌렀는지 
              <View key={key} style={styles.task} >
                <View style={styles.check}>
                  <TouchableOpacity 
                    style={styles.icon}
                    onPress={()=> toggleTask(key)}>
                    <Fontisto name={task[key].done ? "checkbox-active" : "checkbox-passive"} size={20} color={theme.trash} /> 
                  </TouchableOpacity>
                  <Text 
                      style={{...styles.taskText, textDecorationLine: task[key].done? "line-through" : "none"}}>
                      {task[key].text}
                    </Text> 
                </View>
                <View style={styles.icons}>
                  <TouchableOpacity onPress={()=> changeEditStatus(key)} style={styles.icon}>
                    <Octicons name="pencil" size={24} color={theme.trash} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=> deleteTask(key)}>
                    <Fontisto name="trash" size={20} color={theme.trash} />
                  </TouchableOpacity>
                </View>
              </View> ) : (
                // 할일 수정 부분
              <View key={key}>
                <TextInput  
                  onSubmitEditing={() => editTask(key)}
                  onChangeText={setNewText}
                  returnKeyType="done"
                  value={newText}
                  style={styles.editInput} 
                />
              </View>
              )
          ) : null
          )}
      </ScrollView>
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
    justifyContent: "space-between",
    marginTop: 100,
  },
  editInput: {
    backgroundColor: "white",
    color: "black",
    fontSize: 15,
    marginBottom: 10,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  check: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 15,
  },
  icons: {
    flexDirection: "row",
  },
  task: {
    backgroundColor: theme.taskBg,
    marginBottom: 10,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
  },
  btnText: {
    color: "white",
    fontSize: 35,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "white",
    color: "black",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 15,
  }
});
