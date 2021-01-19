import React, { useState } from "react";
import ProjectListEntry from './ProjectListEntry'
import { Link } from "react-router-dom";
import fakeproject from './fakeproject.js';
import Login from './Login';
import Signup from './Signup';
import axios from 'axios';
import UpdateUserinfo from './UpdateUserinfo'
axios.defaults.withCredentials = true;

function ProjectList() {
  
  const [state, setState] = useState({ //모달창을위한 state
    loginModal: false,
    signupModal: false,
    updateModal: false,
    logoutControll: true
  })

  const { loginModal, signupModal, updateModal,logoutControll } = state;
  const taskCardCount = fakeproject.projectList.taskCardCount
  const isLogin = window.sessionStorage.isLogin
  let done = 0 // kda계산
  let inprogress = 0
  let todo = 0
  taskCardCount.map(ele => {
    done = done + ele.done;
    inprogress = inprogress + ele.inprogress;
    todo = todo + ele.todo;
  })

  const loginChange = () => { //로그인모달
    setState({ ...state, loginModal: !loginModal, signupModal: false })
  }
  const signupChange = () => { //회원가입모달
    setState({ ...state, signupModal: !signupModal, loginModal: false })
  }
  const updateUserinfoModal = () => { //수정모달
    setState({ ...state, updateModal: !updateModal })
  }
  let result
  // const loginList = function () { //list변수에서 실행시킬 함수 (로그인시 유저 프로젝트리스트)
  //   axios.post('https://localhost:4001/',null, {
  //     headers: {
  //       Authorization: `Bearer ${window.sessionStorage.accessToken}`,
  //       "content-type": "application/json"
  //     }
  //   })
  //     .then(param => {
  //       param.data.accessToken && (window.sessionStorage.accessToken = param.data.accessToken);
  //       result = param
  //       return result
  //     })
  //     // .then(param=>{
  //     //   // console.log(param.data)

  //     //   return result = param.data.projectList.contributers.map((ele, idx) => {
  //     //     return <ProjectListEntry key={idx} content={ele} taskCardCount={taskCardCount[idx]}></ProjectListEntry>
  //     //   })
  //     // })
  //     console.log(result)
  // }


  const getMyData = async()=>{
    let LoginList = await axios.post('https://localhost:4001/',null, {
      headers: {
        Authorization: `Bearer ${window.sessionStorage.accessToken}`,
        "content-type": "application/json"
      }
    })
    LoginList=LoginList.data;
    console.log(JSON.stringify(LoginList))
    // return JSON.stringify(LoginList)
  }
  getMyData()
  let list = isLogin //로그인 상태별 리스트
    ? getMyData()
    : fakeproject.projectList.contributers.map((ele, idx) => {
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
        <img src={fakeproject.profile}></img> //! 테스트 끝나면 세션스토리지값으로 변경해라
        <p>{fakeproject.username}</p>
        <p>todo:{todo}</p>
        <p>inprogress:{inprogress}</p>
        <p>done:{done}</p>
        <button onClick={updateUserinfoModal}>프로필수정</button>
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

      { loginModal && <Login loginChange={loginChange} signupChange={signupChange} />}
      { signupModal && <Signup loginChange={loginChange} signupChange={signupChange} />}
      { updateModal && <UpdateUserinfo updateUserinfoModal={updateUserinfoModal} />}
      <button>+</button>
      {/* {list} */}
    </>
  )
}

export default ProjectList 