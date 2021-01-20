import React, { useState,useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import './css/NewProject.css'

axios.defaults.withCredentials = true;

function EditProject({data,editProjectChange,getProject}) {
    const [state, setState] = useState({
        title: data.title,
        startDate: data.start_date,
        endDate: data.end_date,
        team: data.contributers,
        member: '',
        description: data.description,
        memberErrorMsg: '',
        inputErrorMsg: '',
        checked: data.end_date === '9999-01-01' ? true : null
      })
  const { title, startDate, endDate, team, member, description, memberErrorMsg, inputErrorMsg, checked } = state
  const isLogin = window.sessionStorage.isLogin

  const changeData = e => { //온체인지 스테이트변경
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
    axios.post('https://localhost:4001/user/getOne', { username: member })
      .then((param) => {
        setState({ ...state, team: [...team, param.data.userinfo] })
      })
      .catch(() => {
        setState({ ...state, memberErrorMsg: '일치하는 유저네임이 없습니다.' })
      })
  }
  const teamList = team.length > 0 && team.map(ele => {
    return <div key={ele.user_id}>
      <img className='hi' src={ele.user.profile}></img>
      <span>{ele.user.username}</span>
    </div>
  })
  const addProject = function () {
    if (title && startDate && (endDate || checked) && description) {
      if (isLogin) {
        axios.post(`https://localhost:4001/project/${data.id}/update`, {
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
            param.data.accessToken && (window.sessionStorage.accessToken = param.data.accessToken);
            getProject()
            editProjectChange()
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        window.sessionStorage.guestProject = JSON.stringify({state})
        editProjectChange()
      }
    }
    else {
      setState({ ...state, inputErrorMsg: '프로젝트 정보는 필수입니다.' })
    }
  }

  return (
    <div className='newProjectModal_container' onClick={editProjectChange}>
      <div className='newProjectModal' onClick={(e)=>e.stopPropagation()}>
        <p>프로젝트 이름</p>
        <input type='text' name='title' value={title} onChange={changeData}></input>
        <p>시작날짜</p>
        <input type='date' name='startDate' value={startDate} onChange={changeData}></input>
        {
          !checked &&
          <>
            <p>종료날짜</p>
            <input type='date' name='endDate' value={endDate} onChange={changeData}></input>
          </>
        }
        <p>미정</p>
        {checked
            ?<input type='checkbox' name='checked' checked onChange={changeData}></input>
            :<input type='checkbox' name='checked' onChange={changeData}></input>
      }   
        
        <p>참여 팀원</p>
        <input type='text' name='member' onChange={changeData}></input>
        <button onClick={addMember}>추가</button>
        {teamList}
        <p>{memberErrorMsg}</p>
        <p>프로젝트 설명</p>
        <textarea name='description' value={description} onChange={changeData}></textarea>
        <button onClick={addProject}>생성</button>
        <p>{inputErrorMsg}</p>
      </div>
      </div>
    
  )
}

export default EditProject