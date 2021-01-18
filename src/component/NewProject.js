import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from 'axios';

axios.defaults.withCredentials = true;

function NewProject() {
  const history = useHistory();
  const [state, setState] = useState({
    title: '',
    startDate: '',
    endDate: '',
    team:[
      {email:'dd',
    username:'dd',
  profile:'/img/레킹볼.png'}
    ],
    member: '',
    description: '',
    memberErrorMsg:'',
    inputErrorMsg:'',
    checked:null
  })

  const { title, startDate, endDate, team, member, description,memberErrorMsg,inputErrorMsg,checked} = state

  const changeData = e => { //온체인지 스테이트변경
    const { name, value } = e.target
    if(name === 'checked'){ //미정버튼
      setState({ ...state, checked: e.target.checked })
    }
    else if((name === 'endDate' && startDate) ){//날짜 어그러지는거 막는거
      if( value < startDate){
        setState({...state,inputErrorMsg:'ㅡㅡ'})
      }else{
        setState({...state,inputErrorMsg:'',[name]: value })
      }
    }
    else if((name === 'startDate' && endDate) ){
      if( value > endDate){
        setState({...state,inputErrorMsg:'ㅡㅡ'})
      }else{
        setState({...state,inputErrorMsg:'',[name]: value })
      }
    }
    else{
      setState({ ...state,[name]: value })
    }
  }
  const addMember = function(){
    axios.post('https://localhost:4001/user/getOne', {username:member})
    .then((param)=>{
      setState({...state,team:[...team,param.data.userinfo]})
    })
    .catch(()=>{
      setState({...state,memberErrorMsg:'일치하는 유저네임이 없습니다.'})
    })
  }
  const teamList = team.length > 0 && team.map(ele=>{
    return <div key={ele.username}>
      <img src={ele.profile}></img>
      <span>{ele.username}</span>
    </div>
  })
  const addProject = function(){
    if(title&&startDate&&(endDate||checked)&&team&&description){
        axios.post('https://localhost:4001/project/new', {
          title:title,
          startDate:startDate,
          endDate:!checked ? endDate :'완료날짜 미정',
          member:team,
          description:description
        },
        {
          headers: {
            Authorization: `Bearer ${window.sessionStorage.accessToken}`,
            "Content-Type": "application/json"
          }
        })
        .then((param)=>{
          console.log(param.data);
          const proId = param.data.project_id;
          history.push(`/project/${proId}`)
        })
        .catch(err=>{
          console.log(err)
        })
      }
    else{
      setState({...state,inputErrorMsg:'프로젝트 정보는 필수입니다.'})
    }

  }
  
  // 프로젝트 이름 기간 인원 설명onchange //! 완료
  // 인원 -> 추가누르면 서버에 인원 유저네임 보내서 값 받아서   //!
  // setTeam([...team,{email : ...,username : ...,profile : ...}]) //!

  // 동그라미 하나추가해서 profile 이미지태그에넣기 => 팀 매핑해서 이미지 넣으면될듯 //!
  //axios 데이터
  // 리스폰스에 프로젝트 아이디 넣어서 history.push같은걸로 투두페이지 넘어가야함

  // 미정 체크하면 종료날짜 없어지고 종료날짜는 none
  // endDate === none > 종료날짜 미정


  return (
    <div>
      <p>프로젝트 이름</p>
      <input type='text' name='title' onChange={changeData}></input>
      <p>시작날짜</p>
      <input type='date' name='startDate' onChange={changeData}></input>
      {
        !checked &&
        <>
        <p>종료날짜</p>
        <input type='date' name='endDate' onChange={changeData}></input>
        </>
      }
      <p>미정</p>
      <input type='checkbox' name='checked' onChange={changeData}></input>
      <p>참여 팀원</p>
      <input type='text' name='member' onChange={changeData}></input>
      <button onClick={addMember}>추가</button>
      {teamList}
      <p>{memberErrorMsg}</p>
      <p>프로젝트 설명</p>
      <textarea name='description' onChange={changeData}></textarea>
      <button onClick={addProject}>생성</button>
      <p>{inputErrorMsg}</p>
    </div>
  )
}

export default NewProject