import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import './css/NewProject.css'
axios.defaults.withCredentials = true;
function NewProject({addProjectChange}) {
  const history = useHistory();
  const [state, setState] = useState({
    title: '',
    startDate: '',
    endDate: '',
    team: [],
    member: '',
    description: '',
    memberErrorMsg: '',
    inputErrorMsg: '',
    checked: null
  })
  const { title, startDate, endDate, team, member, description, memberErrorMsg, inputErrorMsg, checked } = state
  const isLogin = window.sessionStorage.isLogin
  const changeData = e => { 
    const { name, value } = e.target
    if (name === 'checked') { //미정버튼
      setState({ ...state, checked: e.target.checked })
    }
    else if ((name === 'endDate' && startDate)) {//날짜 어그러지는거 막는거
      if (value < startDate) {
        setState({ ...state, inputErrorMsg: '종료날짜는 시작날짜보다 늦어야합니다.' })
      } else {
        setState({ ...state, inputErrorMsg: '', [name]: value })
      }
    }
    else if ((name === 'startDate' && endDate)) {
      if (value > endDate) {
        setState({ ...state, inputErrorMsg: '종료날짜는 시작날짜보다 늦어야합니다.' })
      } else {
        setState({ ...state, inputErrorMsg: '', [name]: value })
      }
    }
    else {
      setState({ ...state, [name]: value })
    }
  }
  const addMember = function () {
    if(isLogin){
      axios.post('https://localhost:4001/user/getOne', { username: member })
      .then((param) => {
        setState({ ...state, team: [...team, param.data],memberErrorMsg: '' })
      })
      .catch(() => {
        setState({ ...state, memberErrorMsg: '일치하는 유저네임이 없습니다.' })
      })
    }else{
      //아무 동작 X
    }
  }
  const teamList = team.length > 0 && team.map(ele => {
    return <div key={ele.user.id}>
      <img className='hi' src={ele.user.profile}></img>
      <span>{ele.user.username}</span>
    </div>
  })
  const addProject = function () {
    if (title && startDate && (endDate || checked) && description) {
      if (isLogin) {
        axios.post('https://localhost:4001/project/new', {
          title: title,
          startDate: startDate,
          endDate: !checked ? endDate : '9999-01-01',
          member: team,
          description: description
        },
          {
            headers: {
              Authorization: `Bearer ${window.sessionStorage.accessToken}`,
              "Content-Type": "application/json"
            }
          })
          .then((param) => {
            console.log(param.data);
            const proId = param.data.project_id;
            history.push(`/project/${proId}`) 
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        let oldProjectLst = JSON.parse(window.sessionStorage.guestProjectList)
        const newProject = JSON.parse(window.sessionStorage.guestProjectList).contributers
        let newProjectId = JSON.parse(window.sessionStorage.guestProjectList).contributers[oldProjectLst.contributers.length-1].project_id+1
        // setState({...state,newProjectId:newProjectId++});
        oldProjectLst.contributers.push(
          {
            project_id:newProjectId,
            user_id: 2,
            project:{
              id:newProjectId,
              title:title,
              description:description,
              manager_id:2,
              start_date:startDate,
              end_date: !checked ? endDate : '9999-01-01',
              contributers:[],
              user:{
                profile: '/img/레킹볼.png'
              }
            }
          }
        )
        oldProjectLst.taskCardCount.push({
          project_id:newProjectId,
          done:0,
          inprogress: 0,
          todo: 0
        })
        window.sessionStorage.guestProjectList =JSON.stringify(oldProjectLst)
        history.push(`/project/${newProjectId}`)
      }
    }
    else {
      setState({ ...state, inputErrorMsg: '프로젝트 정보는 필수입니다.' })
    }
  }
  return (
    <div className='newProjectModal_container' onClick={addProjectChange}>
      <div className='newProjectModal' onClick={(e)=>e.stopPropagation()}>
        <div className="res">
        <p className="projectName2">프로젝트 이름</p>
        <input className="changeTitle" type='text' name='title' onChange={changeData}></input>
        <p className="DateTitle">시작날짜</p>
        <input className="changeDate" type='date' name='startDate' onChange={changeData}></input>
        {!checked &&
        <>
          <p className="DateTitle">종료날짜</p>
          <input className="changeDate" type='date' name='endDate' value={endDate} onChange={changeData}></input>
        </>
      }
        <p className="DateTitle">종료날짜 미정</p>
        <input className="checkbotton" type='checkbox' name='checked' onChange={changeData}></input>
        <p className="joinUser">참여 팀원</p>
        <input className="addMember" type='text' name='member' onChange={changeData}></input>
        <button className="memberButton" onClick={addMember}>추가</button>
        {!isLogin && <p className="errMsg">팀원 추가는 로그인 상태에서만 가능합니다.</p>}
        {teamList}
        <p>{memberErrorMsg}</p>
        <p className="projectExplain">프로젝트 설명</p>
        <textarea className="textArea" name='description' onChange={changeData}></textarea>
        <button className="createProject" onClick={addProject}>생성</button>
        <p>{inputErrorMsg}</p>
      </div>
      </div>
      </div>
  )
}
export default NewProject