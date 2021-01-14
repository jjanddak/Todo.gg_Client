import React, { useState } from "react";
import ProjectListEntry from './ProjectListEntry'
import { Link } from "react-router-dom";
import fakeproject from './fakeproject.js'
import Login from './Login'
import Signup from './Signup'


function ProjectList() {
  const [state, setState] = useState({ //모달창을위한 state
    login: false,
    signup: false
  })
  const { login, signup } = state;
  const loginChange = () => {
    setState({ ...state, login: !login, signup: false })
  }
  const signupChange = () => {
    setState({ ...state, signup: !signup, login: false })
  }

  const { isLogin } = window.sessionStorage //네비와 메인을 위한 세션읽기
  const list = isLogin
    ? fakeproject.List.map(ele => {
      return <ProjectListEntry key={ele.id} content={ele}></ProjectListEntry>
    })
    : fakeproject.List.map(ele => {
      return <ProjectListEntry key={ele.id} content={ele}></ProjectListEntry>
    })

  const main = isLogin
  ?<h1>업무티어 올리기 투두관리부터 !<br />협업은 todo.gg와 함께</h1>
  :<h1>업무티어 올리기 투두관리부터 !<br />협업은 todo.gg와 함께</h1>



  return (
    <>
      <nav>
        <Link to='/'>로고</Link>
        {
          isLogin && <Link>로그아웃</Link>
        }
      </nav>
      {main}
      <button onClick={loginChange}>로그인</button>
      <button onClick={signupChange}>회원가입</button>
      { login && <Login loginChange={loginChange} signupChange={signupChange} />}
      { signup && <Signup loginChange={loginChange} signupChange={signupChange} />}
      {list}
    </>
  )
}

export default ProjectList 