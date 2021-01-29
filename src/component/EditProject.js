import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import './css/NewProject.css'
axios.defaults.withCredentials = true;
function EditProject({ data, editProjectChange, getProject }) {
  const [state, setState] = useState({
    title: data.title,
    startDate: data.start_date,
    endDate: data.end_date,
    team: data.contributers,
    member: '',
    description: data.description,
    memberErrorMsg: '',
    inputErrorMsg: '',
    checked: data.end_date === '9999-01-01' ? true : null,
    isEditing: false,
    isDelete: false,
    newContributer: [],
    delContributer: []
  })
  const history = useHistory();
  const { title, startDate, endDate, team, member, description, memberErrorMsg, inputErrorMsg, checked, isEditing, isDelete, newContributer, delContributer } = state
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
  const editChange = () => {
    if (!isLogin) {
      setState({ ...state, isEditing: !isEditing })
    } else {
      if (data.manager_id === Number(window.sessionStorage.id)) {
        setState({ ...state, isEditing: !isEditing })
      } else {
        setState({ ...state, inputErrorMsg: '프로젝트 매니저만 수정 가능합니다.' })
      }
    }
  }
  const deleteChange = () => {
    setState({ ...state, isDelete: !isDelete })
  }
  const deleteProject = () => {
    if (isLogin) {
      axios.post(`https://localhost:4001/project/${data.id}/delete`, null, {
        headers: {
          Authorization: `Bearer ${window.sessionStorage.accessToken}`,
          "Content-Type": "application/json"
        }
      })
        .then(() => {
          history.push("/");
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      let sessList = JSON.parse(window.sessionStorage.guestProjectList)
      let sessContributer = JSON.parse(window.sessionStorage.guestProjectList).contributers
      for (let i = 0; i < sessContributer.length; i++) {
        if (sessContributer[i].project_id === data.id) {
          sessContributer.splice(i, 1)
          sessList.contributers = sessContributer
        }
      }
      window.sessionStorage.guestProjectList = JSON.stringify(sessList)
      history.push("/");
    }
  }
  const addMember = function () {
      if(isLogin){
      team.filter(item => item.user.username.toLowerCase() === member.toLowerCase()).length
        ? setState({ ...state, memberErrorMsg: '이미 포함되어있는 멤버입니다.' })
        : axios.post('https://localhost:4001/user/getOne', { username: member })
          .then((param) => {
            setState({ ...state, team: [...team, param.data], newContributer: [...newContributer, { id: param.data.user.id }],memberErrorMsg: '' })
          })
          .catch(() => {
            setState({ ...state, memberErrorMsg: '일치하는 유저네임이 없습니다.' })
          })
      }    
  }
  const deleteMember = function (e) {
    if (isLogin) {
      if(Number(e.target.name)===data.manager_id){
        setState({ ...state, memberErrorMsg: '프로젝트 매니저는 삭제할 수 없습니다.' })
      }else{
        let newTeam = [];
        for (let i = 0; i < team.length; i++) {
          if (Number(e.target.name) !== team[i].user.id) {
            newTeam.push(team[i])
          }
        }
        let newAddTeam = [];
        for (let i = 0; i < newContributer.length; i++) {
          if (Number(e.target.name) !== newContributer[i].id) {
            newAddTeam.push(newContributer[i])
          }
        }
        setState({ ...state, team: newTeam, newContributer: newAddTeam, delContributer: [...delContributer, { id: e.target.name }] })
      }
    }
  }
  const teamList = team.length > 0 && team.map(ele => {
    return <div className="memberEnt" key={ele.user.id}>
      <img className='hi' src={ele.user.profile}></img>
      <span className="listUserName">{ele.user.username}</span>
      {isEditing && <button className="deleteMember" name={ele.user.id} onClick={deleteMember}>X</button>}
    </div>
  })
  const editProject = function () {
    if (title && startDate && (endDate || checked) && description) {
      if (isLogin) {
        axios.post(`https://localhost:4001/project/${data.id}/update`, {
          title: title,
          startDate: startDate,
          endDate: !checked ? endDate : '9999-01-01',
          newContributer: newContributer,
          delContributer: delContributer,
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
        let sessList = JSON.parse(window.sessionStorage.guestProjectList)
        let sessContributer = JSON.parse(window.sessionStorage.guestProjectList).contributers
        for (let i = 0; i < sessContributer.length; i++) {
          if (sessContributer[i].project_id === data.id) {
            sessList.contributers[i].project = {
              id: data.id,
              title: title,
              description: description,
              manager_id: 8,
              start_date: startDate,
              end_date: !checked ? endDate : '9999-01-01',
              contributers: team,
              user: {
                profile: '/img/레킹볼.png'
              }
            }
          }
        }
        window.sessionStorage.guestProjectList = JSON.stringify(sessList)
        // history.push("/");
        // setProject({ ...data, title: title, start_date: startDate, end_date: !checked ? endDate : '9999-01-01', description: description })
        editProjectChange()
      }
    }
    else {
      setState({ ...state, inputErrorMsg: '프로젝트 정보는 필수입니다.' })
    }
  }
  return (
    <div className='newProjectModal_container' onClick={editProjectChange}>
      <div className='newProjectModal' onClick={(e) => e.stopPropagation()}>
      <div className='res'>
        {!isEditing && <button className="editButton" onClick={editChange}>수정</button>}
          {/* <p>프로젝트 이름</p> */}
        {isEditing
          ? <>
          <p className="projectName2">프로젝트 이름</p>
          <button className="editInfoButton" onClick={editProject}>수정</button>
          <input className="changeTitle" type='text' name='title' value={title} onChange={changeData}></input>
          </>
          : <>
          <p className="projectName">{title}</p>
          <p className="guestErrMsg">{inputErrorMsg}</p>
          </>
        }
        <p className="DateTitle">시작날짜</p>
        {isEditing
          ? <input type='date' className="changeDate" name='startDate' value={startDate} onChange={changeData}></input>
          : <p className="Date"> - {startDate}</p>
        }
        {isEditing
          ?//수정화면일 때
          <>
            {!checked &&
              <>
                <p className="DateTitle">종료날짜</p>
                <input type='date' className="changeDate" name='endDate' value={endDate} onChange={changeData}></input>
              </>
            }
            <p className="DateTitle">종료날짜 미정</p>
            {checked
              ? <>
              <input className="checkbotton" type='checkbox' name='checked' checked onChange={changeData}></input>
              <hr className="line"></hr>
              </>
              : <>
              <input className="checkbotton" type='checkbox' name='checked' onChange={changeData}></input>
              <hr className="line"></hr>
              </>
            }
          </>
          : //정보조회화면일 때
          (<>
            <p className="DateTitle">종료날짜</p>
            <p className="Date"> - {endDate === '9999-01-01' ? '완료날짜 미정' : endDate}</p>
            <hr className="line"></hr>
          </>)
        }
        <p className="joinUser">참여 팀원</p>
        {isEditing && (
          <div className="errMsgInterval">
            <input className="addMember" type='text' name='member' onChange={changeData}></input>
            <button className="memberButton" onClick={addMember}>추가</button>
            <p className="errMsg">{memberErrorMsg}</p>
            {!isLogin && <p className="errMsg">로그인 상태에서만 팀원 삭제 추가가 가능합니다.</p>}
          </div>
        )
        }
        {teamList}
        <hr className="line"></hr>
        <p className="projectExplain">프로젝트 설명</p>
        {isEditing
          ? <textarea className="textArea" name='description' value={description} onChange={changeData}></textarea>
          : <p className="description">{description}</p>
        }
        {isEditing &&
          <div className="divInline">
            {/* <button className="editInfoButton" onClick={editProject}>수정</button> */}
            <button className="deleteButton" onClick={deleteChange}>삭제</button>
          </div>
        }
        {/* <p className="guestErrMsg">{inputErrorMsg}</p> */}
      </div>
      </div>
      {isDelete &&
        <div className='deleteModal_container' onClick={deleteChange}>
          <div className='deleteModal' onClick={(e) => e.stopPropagation()}>
            <div className="warningImg"></div>
            <div className="deleteProjectAlerts">프로젝트 복구는 불가능합니다. <br/>정말로 삭제하시겠습니까?</div>
            <div className="buttonInterval">
            <button className="deleteProjectButton" onClick={deleteProject}>네</button>
            <button className="deleteProjectButtonNot" onClick={deleteChange}>아니요</button>
            </div>
          </div>
        </div>
      }
      </div>
    
  )
}
export default EditProject