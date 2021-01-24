import React, { useEffect, useState } from "react";
import ProjectListEntry from './ProjectListEntry'
import { Link } from "react-router-dom";
import fakeproject from './fakeproject.js';
import Login from './Login';
import Signup from './Signup';
import axios from 'axios';
import UpdateUserinfo from './UpdateUserinfo';
import NewProject from './NewProject'
axios.defaults.withCredentials = true;

function ProjectList() {
  const [state, setState] = useState({ 
    loginModal: false,
    signupModal: false,
    updateModal: false,
    newProjectModal: false,
    logoutControll: true,
    dataList:[],
    taskCountList:[],

  })
  const { loginModal, signupModal, updateModal,newProjectModal,logoutControll,dataList,taskCountList } = state;
  const isLogin = window.sessionStorage.isLogin
  
  const loginChange = () => { //로그인모달
    setState({ ...state, loginModal: !loginModal, signupModal: false })
  }
  const signupChange = () => { //회원가입모달
    setState({ ...state, signupModal: !signupModal, loginModal: false })
  }
  const updateUserinfoChange = () => { //수정모달
    setState({ ...state, updateModal: !updateModal })
  }
  const addProjectChange = () => { //프로젝트 추가 모달
    setState({ ...state, newProjectModal: !newProjectModal })
  }

  useEffect(()=>{
    if(isLogin){
      const loginList = ()=>{// 회원 - 유저 프로젝트리스트
        axios.post('https://localhost:4001/',null, {
          headers: {
            Authorization: `Bearer ${window.sessionStorage.accessToken}`,
            "content-type": "application/json"
          }
        })
          .then(param => {
            param.data.accessToken && (window.sessionStorage.accessToken = param.data.accessToken);
            setState({...state, dataList:param.data.projectList.contributers,taskCountList:param.data.projectList.taskCardCount})
          })
      }
      loginList()
    }
  },[isLogin])
  if(!window.sessionStorage.guestProjectList){ //비회원 - 세션에 더미데이터 저장
    window.sessionStorage.guestProjectList=JSON.stringify(fakeproject.projectList)
  }

  let taskCardCount = isLogin //로그인 상태별 태스크카운트
  ? taskCountList
  : JSON.parse(window.sessionStorage.guestProjectList).taskCardCount 
  let done = 0 // kda계산
  let inprogress = 0
  let todo = 0
  taskCardCount.map(ele => {
    done = done + ele.done;
    inprogress = inprogress + ele.inprogress;
    todo = todo + ele.todo;
  })

  let list = isLogin //로그인 상태별 리스트
  ? dataList.map((ele, idx) => {
    return <ProjectListEntry key={idx} content={ele} taskCardCount={taskCardCount[idx]}></ProjectListEntry>
  })
  : JSON.parse(window.sessionStorage.guestProjectList).contributers.map((ele, idx) => {
    return <ProjectListEntry key={idx} content={ele} taskCardCount={taskCardCount[idx]}></ProjectListEntry>
  })

  const handleLogout = function () { 
    axios.post("https://localhost:4001/user/logout", null, {
      headers: {
        Authorization: `Bearer ${window.sessionStorage.accessToken}`,
        "content-type": "application/json"
      }
    })
      .then(() => {
        window.sessionStorage.clear()
        setState({
          ...state, logoutControll: !logoutControll
        })
      })
  }

  const main = isLogin
    ? <div>
        <img src={window.sessionStorage.profile}></img>
        <p>{window.sessionStorage.username}</p>
        <p>todo:{todo}</p>
        <p>inprogress:{inprogress}</p>
        <p>done:{done}</p>
        <button onClick={updateUserinfoChange}>프로필수정</button>
      </div>
    : <div>
        <h1>업무티어 올리기 투두관리부터 !<br />협업은 todo.gg와 함께</h1>
        <button onClick={loginChange}>로그인</button>
        <button onClick={signupChange}>회원가입</button>
      </div>

  return (
    <>
      <nav>
        <Link to='/'>로고</Link>
        {
          isLogin && <button onClick={handleLogout}>로그아웃</button>
        }
      </nav>
      {main}
      <button onClick={addProjectChange}>+</button>
      { loginModal && <Login loginChange={loginChange} signupChange={signupChange} />}
      { signupModal && <Signup loginChange={loginChange} signupChange={signupChange} />}
      { updateModal && <UpdateUserinfo updateUserinfoChange={updateUserinfoChange} />}
      { newProjectModal && <NewProject addProjectChange={addProjectChange}/>}
      {list}
    </>
  )
}

export default ProjectList 