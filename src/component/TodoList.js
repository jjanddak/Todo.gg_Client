import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import dummy from "./faketodo";
import EditProject from "./EditProject";
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
  const [newMember, setNewMember] = useState("");
  const [newMemberErr, setNewMemberErr] = useState("");
  const [showAddCard, setShowAddCard] = useState(false);
  const [showEditCard, setShowEditCard] = useState({});
  const [showAddMembar, setShowAddMembar] = useState({});
  const [editProjectModal, setEditProjectModal] = useState(false);
  const process = Math.round(counts.done / (counts.todo + counts.inprogress + counts.done) * 100);
  const todoList = [];
  const inprogressList = [];
  const doneList = [];
  /**
   * DONE 태스크카드 CRUD ,진행도 따라 색 표시
   * TODO 햄버거 모달, 인원 추가 삭제
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
          setProject({
            ...param.data.projectInfo,
            start_date: param.data.projectInfo.start_date.split(" ")[0],
            end_date: param.data.projectInfo.end_date.split(" ")[0],
          });
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
    e.target.name === "member"
      ? setNewMember(e.target.value)
      : setTaskContent(e.target.value)
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
      })
  }
  const addMember = (id) => {
    console.log("asdfasdf");
    project.contributers.includes(newMember)
      ? (
        axios.post(`https://localhost:4001/project/${projectId}/addContributer`, {
          userId: id,
          taskCardId: newMember,
        }, {
          headers: {
            Authorization: `Bearer ${window.sessionStorage.accessToken}`,
            "Content-Type": "application/json"
          }
        })
          .then(() => {
            getProject();
            setNewMemberErr("");
          })
          .catch((err) => {
            console.log(err);
          })
      ) : (
        setNewMemberErr("프로젝트에 참여하지 않은 인원입니다")
      );
  }
  const setCard = (entryName, item) => {
    return (
      <div className={entryName} key={item.id}>
        {showEditCard[item.id]
          ? (
            <>
              <textarea className="todoList_card_text" name="content" value={taskContent} onChange={onChange} />
              <button className="todoList_card_button" onClick={() => { editCard(item.id) }}>submit</button>
            </>
          ) : (
            <>
              <div className="todoList_card_content">{item.content}</div>
              <button className="todoList_card_button" onClick={() => {
                setTaskContent(item.content)
                setShowEditCard({ [item.id]: true })
              }}>⚙</button>
              <button className="todoList_card_button" onClick={() => { deleteCard(item.id) }}>✖</button>
              <div className="todoList_contributers">
                {item.contributers.map((el) => {
                  return <img className="todoList_contributers_profile" src={el.user.profile} title={el.user.username} alt={el.user.username} key={el.user.id} />
                })}
              </div>
              <button className="todoList_card_button" onClick={() => { setShowAddMembar({ [item.id]: !showAddMembar[item.id] }) }}>➕</button>
              {showAddMembar[item.id] && (
                <div className="todoList_add_member">
                  <input type="text" name="member" />
                  <button className="todoList_card_button" onClick={() => { addMember(item.id) }}>add</button>
                  <div className="todoList_add_member_err">{newMemberErr}</div>
                </div>
              )}
            </>
          )
        }
      </div>
    )
  }
  project.taskCards.forEach((item) => {
    item.state === "todo" && todoList.push(setCard("todoList_todo_entry", item));
    item.state === "inprogress" && inprogressList.push(setCard("todoList_inprogress_entry", item));
    item.state === "done" && doneList.push(setCard("todoList_inprogress_entry", item));
  });
  const editProjectChange = () => {
    setEditProjectModal(!editProjectModal)
  }
  return (
    <div className="todoList">
      <nav className="todoList_nav">
        <div className="todoList_process_color" style={color} />
        <span className="todoList_title">{project.title}</span>
        <span className="todoList_date">{`${project.start_date} ~${project.end_date === '9999-01-01' ? '완료날짜 미정' : project.end_date}`}</span>
        <span className="todoList_process">{`진행도 ${process ? process : 0}%`}</span>
        {isLogin && <button className="todoList_logout" onClick={logout}>로그아웃</button>}
        <button className="todoList_home" onClick={() => { history.push("/") }}>홈버튼</button>
        <button className="todoList_set_project" onClick={editProjectChange} >프로젝트 관리</button>
      </nav>
      <div className="todoList_taskCards">
        <div className="todoList_todo">todo
          <button className="todoList_add_card" onClick={() => setShowAddCard(!showAddCard)}>add card</button>
          <div className="todoList_counts">{counts.todo}</div>
          <div className="todoList_add_" style={{ display: showAddCard ? "block" : "none" }}>
            <textarea className="todoList_input" name="content" onChange={onChange} value={taskContent} />
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
      { editProjectModal && <EditProject getProject={getProject} editProjectChange={editProjectChange} data={project} setProject={setProject} />}
    </div>
  )
}

export default TodoList;
