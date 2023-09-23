# work-hard-travel-hard-app
리액트 네이티브로 만든 할일 여행앱
## 구현 
- Work, Travel 두 개의 탭이 있다. 재로딩하면 탭의 위치를 기억한다. AsyncStroage(expo API) 사용함. 
- TextInput 으로 할 일을 입력할 수 있다. 
- 입력된 할 일들은 AsyncStorage 를 사용하여 모바일에 저장한다.
- 할 일을 삭제할 수 있다. Alert(알림)으로 삭제할 건지 다시 확인한다. 삭제를 한다면 객체의 key 값을 받아서 해당 할 일을 삭제한다. 
- 한 일(Done)을 체크할 수 있다. 체크박스를 누르면 체크된 박스로 아이콘을 변경하고 텍스트에 가로줄을 긋는다. 해당 객체의 done 을 false 에서 true 로 변경.
- (구현중) 할 일 수정
