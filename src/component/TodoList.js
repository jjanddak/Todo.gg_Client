import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import dummy from "./faketodo";

axios.defaults.withCredentials = true;

function TodoList() {
  const history = useHistory();
  const projectId = window.location.href.split("/")[4]; //* url 에서 아이디 가져오기
  const isLogin = window.sessionStorage.isLogin;

  const [project, setProject] = useState({
    id: 0,
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    contributers: [],
    taskCards: [],
  });
  const [counts, setCount] = useState({
    todo: 0,
    inprogress: 0,
    done: 0,
  });

  const process = Math.round(counts.done / (counts.todo + counts.inprogress + counts.done) * 100);
  const todoList = [];
  const inprogressList = [];
  const doneList = [];
  project.taskCards.forEach((item) => {
    item.state === "todo" && todoList.push(<div className="todoList_todo_entry" key={item.id}>{item.content}</div>)
    item.state === "inprogress" && inprogressList.push(<div className="todoList_inprogress_entry" key={item.id}>{item.content}</div>)
    item.state === "done" && doneList.push(<div className="todoList_done_entry" key={item.id}>{item.content}</div>)
  });
  /**
   * DONE 태스크카드 받아서 뿌려주는 것 까지 R
   * TODO 태스크카드 C UD, 햄버거 모달, 진행도 따라 색 표시
   * DONE 3 이상의 아이디 넘어올 때 에러(더미에 2까지 밖에 없어서) -> 하드코딩...
   */
  useEffect(() => {
    if (!isLogin) { //* 로그인 상태 아닐 때
      try {
        setProject(dummy[projectId].projectInfo);
        setCount(dummy[projectId].taskCardCount);
      } catch (err) {
        console.log(err);
        history.push("/"); //* 에러나면 홈으로
      }
    } else {
      axios.get(`https://localhost:4001/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${window.sessionStorage.accessToken}`,
          "Content-Type": "application/json"
        }
      })
        .then((param) => {
          param.data.accessToken && (window.sessionStorage.accessToken = param.data.accessToken);
          setProject(param.data.projectInfo);
          setCount(param.data.taskCardCount);
        })
        .catch((err) => {
          console.log(err);
          history.push("/"); //* 에러나면 홈으로
        })
    }
  }, []);
  let color = { backgroundColor: 'red' }; //* process_color
  if (process > 76 && process <= 99) {
    color = { backgroundColor: 'yellow' };
  } else if (process === 100) {
    color = { backgroundColor: 'blue' };
  }

  return (
    <div className="todoList">
      <nav className="todoList_nav">
        <div className="todoList_precess_color" style={color} />
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
