import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import dummy from "./faketodo";
import "./css/todoList.css";

axios.defaults.withCredentials = true;

function TodoList() {
  const history = useHistory();
  const projectId = window.location.href.split("/")[4]; //* url 에서 아이디 가져오기
  const isLogin = window.sessionStorage.isLogin;

  const [project, setProject] = useState({ //* 프로젝트 초기화
    id: 0, title: "", description: "", start_date: "", end_date: "", contributers: [], taskCards: [],
  });
  const [counts, setCount] = useState({ todo: 0, inprogress: 0, done: 0, }); //* 카운트 초기화
  const [taskContent, setTaskContent] = useState("");
  const [showAddCard, setShowAddCard] = useState(false);
  const [showEditCard, setShowEditCard] = useState({});
  const process = Math.round(counts.done / (counts.todo + counts.inprogress + counts.done) * 100);
  const todoList = [];
  const inprogressList = [];
  const doneList = [];
  /**
   * DONE 태스크카드 받아서 뿌려주는 것 까지 R
   * TODO 태스크카드 C UD, 햄버거 모달, 진행도 따라 색 표시
   * DONE 3 이상의 아이디 넘어올 때 에러(더미에 2까지 밖에 없어서) -> 하드코딩...
   */
  const getProject = () => {
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
    }
    useEffect(() => {
      getProject();
  }, []);
  let color = { backgroundColor: 'red' }; //* process_color
  if (process > 76 && process <= 99) {
    color = { backgroundColor: 'yellow' };
  } else if (process === 100) {
    color = { backgroundColor: 'blue' };
  }
  const onChange = (e) => {
    setTaskContent(
      e.target.value,
    )
  };
  const logout = () => {
    axios.post("https://localhost:4001/user/logout", null, {
      headers: {
        Authorization: `Bearer ${window.sessionStorage.accessToken}`,
        "content-type": "application/json"
      }
    })
    .then(() => {
      window.sessionStorage.clear();
      history.push("/");
    });
  };
  const addCard = () => {
    axios.post(`https://localhost:4001/project/${projectId}/newTask`, {
      content: taskContent,
    }, {
      headers: {
        Authorization: `Bearer ${window.sessionStorage.accessToken}`,
        "Content-Type": "application/json"
      }
    })
    .then(() => {
      setTaskContent("");
      setShowAddCard(false);
      getProject();
    })
    .catch((err) => {
      console.log(err);
    });
  };
  const deleteCard = (id) => {
    axios.post(`https://localhost:4001/project/${projectId}/deleteTask`, {
      id: id,
    }, {
      headers: {
        Authorization: `Bearer ${window.sessionStorage.accessToken}`,
        "Content-Type": "application/json"
      }
    })
    .then(() => {
      getProject();
    })
    .catch((err) => {
      console.log(err);
    });
  };
  const editCard = (id) => {
    axios.post(`https://localhost:4001/project/${projectId}/updateTask`, {
      id: id,
      content: taskContent,
    })
      .then(() => {
        getProject();
      })
      .catch((err) => {
        console.log(err);
      })
  }
  project.taskCards.forEach((item) => {
    item.state === "todo" && todoList.push(<div className="todoList_todo_entry" key={item.id}>
      {showEditCard[item.id]
        ? (<div>
            <input type="text" value={taskContent} onChange={onChange} />
            <button className="todoList_edit_submit" onClick={() => {editCard(item.id)}}>submit</button>
          </div>)
        : (<div>{item.content}
            <button className="todoList_edit_card" onClick={() => {
              setTaskContent(item.content)
              setShowEditCard({[item.id]:true})
            }}>⚙</button>
            <button className="todoList_delete_card" onClick={() => {deleteCard(item.id)}}>✖</button>
          </div>)
      }
    </div>)
    item.state === "inprogress" && inprogressList.push(<div className="todoList_inprogress_entry" key={item.id}>
      {item.content}
      <button className="todoList_delete_card" onClick={() => {deleteCard(item.id)}}>✖</button>
    </div>)
    item.state === "done" && doneList.push(<div className="todoList_done_entry" key={item.id}>
      {item.content}
      <button className="todoList_delete_card" onClick={() => {deleteCard(item.id)}}>✖</button>
    </div>)
  });
  return (
    <div className="todoList">
      <nav className="todoList_nav">
        <div className="todoList_process_color" style={color} />
        <span className="todoList_title">{project.title}</span>
        <span className="todoList_date">{`${project.start_date} ~ ${project.end_date}`}</span>
        <span className="todoList_process">{`진행도 ${process ? process : 0}%`}</span>
        {isLogin && <button className="todoList_logout" onClick={logout}>로그아웃</button>}
        <button className="todoList_home" onClick={() => { history.push("/") }}>홈버튼</button>
        <button className="todoList_set_project">프로젝트 관리</button>
      </nav>
      <div className="todoList_taskCards">
        <div className="todoList_todo">todo
          <button className="todoList_add_card" onClick={() => setShowAddCard(!showAddCard)}>add card</button>
          <div className="todoList_counts">{counts.todo}</div>
          <div className="todoList_add_" style={{display:showAddCard ? "block" : "none"}}>
            <input type="text" className="todoList_input" onChange={onChange} value={taskContent} />
            <button className="todoList_submit_input" onClick={addCard}>add</button>
          </div>
          {todoList}
        </div>
        <div className="todoList_inprogress">inprogress
          <div className="todoList_counts">{counts.inprogress}</div>
          {inprogressList}
        </div>
        <div className="todoList_done">done
          <div className="todoList_counts">{counts.done}</div>
          {doneList}
        </div>
      </div>
    </div>
  )
}

export default TodoList;
