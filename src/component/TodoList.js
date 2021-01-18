import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import dummy from "./faketodo"

axios.defaults.withCredentials = true;

function TodoList() {
  const history = useHistory();
  const projectId = window.location.href.split("/")[4]; //* url 에서 아이디 가져오기
  const isLogin = window.sessionStorage.isLogin;
  //TODO ↓↓↓ dummy에 없는 id 넘어오면 홈으로 보내고 싶은데 에러가 먼저 나옴
  (!isLogin && projectId>2) && history.push("/"); 

  const [project, setProject] = useState(dummy[projectId]);

  const counts = project.task_card_count;
  const process =Math.round(counts.done / (counts.todo + counts.inprogress + counts.done) * 100);
  const todoList = [];
  const inprogressList = [];
  const doneList = [];
  project.task_card_list.map((item) => {
    item.state === "todo" && todoList.push(<div className="todoList_todo_entry" key={item.id}>{item.content}</div>)
    item.state === "inprogress" && inprogressList.push(<div className="todoList_todo_entry" key={item.id}>{item.content}</div>)
    item.state === "done" && doneList.push(<div className="todoList_todo_entry" key={item.id}>{item.content}</div>)
  })
  /**
   * DONE 리스트 받아서 뿌려주는 것 까지.
   * TODO 투두 이동, 햄버거 모달, 진행도 따라 색 표시
   */
  useEffect(() => {
    if(isLogin) { //* 로그인 상태일 때
      axios.get(`https://localhost:4001/project/${projectId}`, {
      headers: {
        Authorization: `Bearer ${window.sessionStorage.accessToken}`,
        "Content-Type": "application/json"
      }
    })
      .then((param) => {
        param.data.accessToken && (window.sessionStorage.accessToken = param.data.accessToken);
        setProject(param.data.project);
      })
      .catch((err) => {
        console.log(err);
        history.push("/"); //* 에러나면 홈으로
      })
    }
  }, []);
  
  
  return (
    <div className="todoList">
      <nav className="todoList_nav">
        <div className="todoList_precess_color" />
        <div className="todoList_title">{project.title}</div>
        <div className="todoList_date">{`${project.start_date} ~ ${project.end_date}`}</div>
        <div className="todoList_process">{`진행도 ${process}%`}</div>
        <button className="todoList_logout"></button>
        <button className="todoList_home" onClick={() => { history.push("/") }}></button>
        <button className="todoList_set_project"></button>
      </nav>
      todo<div className="todoList_todo">{todoList}</div>
      inprogress<div className="todoList_inprogress">{inprogressList}</div>
      done<div className="todoList_done">{doneList}</div>
    </div>
  )
}

export default TodoList;
