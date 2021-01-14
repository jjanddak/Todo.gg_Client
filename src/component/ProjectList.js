import React, { useState } from "react";
import ProjectListEntry from './ProjectListEntry'
import { Link } from "react-router-dom";
import fakeproject from './fakeproject.js';
import Login from './Login';
import Signup from './Signup';
import axios from 'axios';


function ProjectList() {
  const [state, setState] = useState({ //모달창을위한 state
    login: false,
    signup: false,
  })
  const { login, signup } = state;
  const loginChange = () => {
    setState({ ...state, login: !login, signup: false })
  }
  const signupChange = () => {
    setState({ ...state, signup: !signup, login: false })
  }
  const taskCardCount = fakeproject.taskCardCount
  const { isLogin } = window.sessionStorage //네비와 메인을 위한 세션읽기
  let list = isLogin //로그인 상태별 리스트
    ? fakeproject.contributers.map((ele, idx) => {
      return <ProjectListEntry key={idx} content={ele} taskCardCount={taskCardCount[idx]}></ProjectListEntry>
    })
    : fakeproject.contributers.map((ele, idx) => {
      return <ProjectListEntry key={idx} content={ele} taskCardCount={taskCardCount[idx]}></ProjectListEntry>
    })

  const test = function () {
    axios.post('https://localhost:4001/', null)
      .then(param => {
        param.data.contributers.map((ele, idx) => {
          return <ProjectListEntry key={idx} content={ele} taskCardCount={taskCardCount[idx]}></ProjectListEntry>
        })
      })
  }
  console.log(test())
  let done = 0 // kda계산
  let inprogress = 0
  let todo = 0
  fakeproject.taskCardCount.map(ele => {
    done = done + ele.done;
    inprogress = inprogress + ele.inprogress;
    todo = todo + ele.todo;
  })

  const main = isLogin
    ? <div>
      <img src={fakeproject.profile}></img>
      <p>{fakeproject.username}</p>
      <p>todo:{todo}</p>
      <p>inprogress:{inprogress}</p>
      <p>done:{done}</p>
      <button>프로필수정</button>
    </div>
    : <h1>업무티어 올리기 투두관리부터 !<br />협업은 todo.gg와 함께</h1>
    


  return (
    <>
      <nav>
        <Link to='/'>로고</Link>
        {
          isLogin && <button>로그아웃</button>
        }
      </nav>
      {main}
      <button onClick={loginChange}>로그인</button>
      <button onClick={signupChange}>회원가입</button>
      { login && <Login loginChange={loginChange} signupChange={signupChange} />}
      { signup && <Signup loginChange={loginChange} signupChange={signupChange} />}
      <button>+</button>
      {list}
    </>
  )
}

export default ProjectList 