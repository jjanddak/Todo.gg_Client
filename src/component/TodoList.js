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
  const storage = window.sessionStorage;
  const isLogin = storage.isLogin;
  const [project, setProject] = useState({ //* 프로젝트 초기화
    id: 0, title: "", description: "", start_date: "", end_date: "", contributers: [], taskCards: [],
  });
  const [counts, setCounts] = useState({ todo: 0, inprogress: 0, done: 0, }); //* 카운트 초기화
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
  const setStorage = () => {
    storage[`pjt${projectId}`] = JSON.stringify(project);
    storage[`cnt${projectId}`] = JSON.stringify(counts);
  };
  const getProject = () => {
    if (!isLogin) { //* 로그인 상태 아닐 때
      if (projectId === "guest") { //* 게스트프로젝트
        setProject(JSON.parse(storage.guestProject));
      } else { //* 더미프로젝트
        setProject(JSON.parse(storage[`pjt${projectId}`]));
        setCounts(JSON.parse(storage[`cnt${projectId}`]));
      }
    } else {
      axios.get(`https://localhost:4001/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${storage.accessToken}`,
          "Content-Type": "application/json"
        }
      })
        .then((param) => {
          param.data.accessToken && (storage.accessToken = param.data.accessToken);
          setProject({
            ...param.data.projectInfo,
            start_date: param.data.projectInfo.start_date.split(" ")[0],
            end_date: param.data.projectInfo.end_date.split(" ")[0],
          });
          setCounts(param.data.taskCardCount);
        })
        .catch((err) => {
          console.log(err);
          history.push("/"); //* 에러나면 홈으로
        })
    }
  };
  useEffect(() => {
    if (!isLogin && !storage[`pjt${projectId}`] && !storage[`cnt${projectId}`]) {
      try {
        storage[`pjt${projectId}`] = JSON.stringify(dummy[projectId].projectInfo);
        storage[`cnt${projectId}`] = JSON.stringify(dummy[projectId].taskCardCount);
      } catch (err) {
        console.log(err);
        history.push("/"); //* 에러나면 홈으로
      }
    }
    getProject();
  }, []);
  useEffect(() => {
    if (!isLogin) {
      setStorage();
      setCounts({ todo: todoList.length, inprogress: inprogressList.length, done: doneList.length, });
    }
  }, [project]);
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
        Authorization: `Bearer ${storage.accessToken}`,
        "content-type": "application/json"
      }
    })
      .then(() => {
        storage.clear();
        history.push("/");
      });
  };
  let idCount = project.taskCards.length;
  const addCard = () => {
    if (!isLogin) {
      idCount++;
      setProject({
        ...project,
        taskCards: [...project.taskCards, {
          id: idCount,
          content: taskContent,
          state: "todo",
          project_id: projectId,
          contributers: [],
        }]
      })
      setTaskContent("");
      setShowAddCard(false);
    } else {
      axios.post(`https://localhost:4001/project/${projectId}/newTask`, {
        content: taskContent,
      }, {
        headers: {
          Authorization: `Bearer ${storage.accessToken}`,
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
    }
  };
  const deleteCard = (id) => {
    if (!isLogin) {
      setProject({
        ...project,
        taskCards: project.taskCards.filter(item => item.id !== id),
      });
    } else {
      axios.post(`https://localhost:4001/project/${projectId}/deleteTask`, {
        id: id,
      }, {
        headers: {
          Authorization: `Bearer ${storage.accessToken}`,
          "Content-Type": "application/json"
        }
      })
        .then(() => {
          getProject();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const editCard = (id) => {
    if (!isLogin) {
      const cards = project.taskCards.map((item) => {
        if (item.id === id) {
          return { ...item, content: taskContent };
        } else {
          return item;
        }
      });
      setProject({
        ...project,
        taskCards: cards,
      });
      setShowEditCard({ [id]: false })
    } else {
      axios.post(`https://localhost:4001/project/${projectId}/updateTask`, {
        id: id,
        content: taskContent,
      }, {
        headers: {
          Authorization: `Bearer ${storage.accessToken}`,
          "Content-Type": "application/json"
        }
      })
        .then(() => {
          getProject();
          setShowEditCard({ [id]: false });
        })
        .catch((err) => {
          console.log(err);
        })
    }
  };
  const addMember = (id) => {
    if (!project.contributers.filter(item => item.user.username === newMember).length) {
      setNewMemberErr("프로젝트에 참여하지 않은 인원입니다");
      return;
    }
    const user = project.contributers.filter(item => item.user.username === newMember)[0].user;
    if (project.taskCards.filter(item => item.id === id)[0].contributers.filter(item => item.user.id === user.id).length) {
      setNewMemberErr("태스크카드에 이미 참여 한 인원입니다");
    } else {
      if (!isLogin) {
        const cards = project.taskCards.map((item) => {
          if (item.id === id) {
            return {
              ...item, contributers: [
                ...item.contributers, {
                  project_id: projectId,
                  taskCard_id: id,
                  user_id: user.id,
                  user: user,
                }
              ]
            };
          } else {
            return item;
          }
        });
        setProject({
          ...project,
          taskCards: cards,
        });
        setNewMemberErr("");
        setShowAddMembar({ [id]: false });
      } else {
        axios.post(`https://localhost:4001/project/${projectId}/addContributer`, {
          userId: user.id,
          taskCardId: id,
        }, {
          headers: {
            Authorization: `Bearer ${storage.accessToken}`,
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
      }
    }
  };
 
  let cardId; 
  const changeState = (id, state) => {
    if (!isLogin) {
      const cards = project.taskCards.map((item) => {
        if (item.id === id) {
          return { ...item, state: state };
        } else {
          return item;
        }
      });
      setProject({
        ...project,
        taskCards: cards,
      })
    } else {
      axios.post(`https://localhost:4001/project/${projectId}/updateState`, {
        id: id,
        state: state,
      }, {
        headers: {
          Authorization: `Bearer ${storage.accessToken}`,
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
  }
  const allowDrop = (e) => {
    e.preventDefault();
  };
  const dropItem = (state) => {
    changeState(cardId, state);
  };
  const dragStart = (id) => {
    cardId = id;
  };

  const setCard = (item) => {
    return (
      <div className="todoList_cards"
        draggable="true"
        onDragStart={() => { dragStart(item.id) }}
        key={item.id}
      >
        {showEditCard[item.id]
          ? (
            <>
              <textarea className="todoList_cards_textarea" name="content" value={taskContent} onChange={onChange} />
              <button className="todoList_cards_button" onClick={() => { editCard(item.id) }}>submit</button>
            </>
          ) : (
            <>
              <div className="todoList_cards_content">{item.content}</div>
              <button className="todoList_cards_button" onClick={() => {
                setTaskContent(item.content)
                setShowEditCard({ [item.id]: true })
              }}>⚙</button>
              <button className="todoList_cards_button" onClick={() => { deleteCard(item.id) }}>✖</button>
              <div className="todoList_cards_contributers">
                {item.contributers.map((el) => {
                  return <img className="todoList_cards_contributers_profile" src={el.user.profile} title={el.user.username} alt={el.user.username} key={el.user.id} />
                })}
              </div>
              <button className="todoList_cards_button" onClick={() => { setShowAddMembar({ [item.id]: !showAddMembar[item.id] }) }}>➕</button>
              {showAddMembar[item.id] && (
                <div className="todoList_cards_add_member">
                  <input type="text" name="member" onChange={onChange} />
                  <button className="todoList_cards_button" onClick={() => { addMember(item.id) }}>add</button>
                  <div className="todoList_cards_add_member_err">{newMemberErr}</div>
                </div>
              )}
            </>
          )
        }
      </div>
    )
  };
  project.taskCards.forEach((item) => {
    item.state === "todo" && todoList.push(setCard(item));
    item.state === "inprogress" && inprogressList.push(setCard(item));
    item.state === "done" && doneList.push(setCard(item));
  });
  const editProjectChange = () => {
    setEditProjectModal(!editProjectModal)
  };
  return (
    <div className="todoList">
      <nav className="todoList_nav">
        <div className="todoList_process_color" style={color} />
        <span className="todoList_title">{project.title}</span>
        <span className="todoList_date">{`${project.start_date} ~ ${project.end_date === '9999-01-01' ? '완료날짜 미정' : project.end_date}`}</span>
        <span className="todoList_process">{`진행도 ${process ? process : 0}%`}</span>
        {isLogin && <button className="todoList_nav_button logout" onClick={logout}>로그아웃</button>}
        <button className="todoList_nav_button home" onClick={() => { history.push("/") }}>홈버튼</button>
        <button className="todoList_nav_button edit_project" onClick={editProjectChange} >프로젝트 관리</button>
      </nav>
      <div className="todoList_taskCards">
        <div className="todoList_todo" onDragOver={allowDrop} onDrop={() => { dropItem("todo") }}>todo
          <button className="todoList_add_card" onClick={() => setShowAddCard(!showAddCard)}>add card</button>
          <div className="todoList_counts">{counts.todo}</div>
          <div className="todoList_add_" style={{ display: showAddCard ? "block" : "none" }}>
            <textarea className="todoList_input" name="content" onChange={onChange} value={taskContent} />
            <button className="todoList_submit_input" onClick={addCard}>add</button>
          </div>
          <div className="todoList_todo_list">
            {todoList}
          </div>
        </div>
        <div className="todoList_inprogress" onDragOver={allowDrop} onDrop={() => { dropItem("inprogress") }}>inprogress
          <div className="todoList_counts">{counts.inprogress}</div>
          <div className="todoList_inprogress_list">
            {inprogressList}
          </div>
        </div>
        <div className="todoList_done" onDragOver={allowDrop} onDrop={() => { dropItem("done") }}>done
          <div className="todoList_counts">{counts.done}</div>
          <div className="todoList_done_list">
            {doneList}
          </div>
        </div>
      </div>
      { editProjectModal && <EditProject getProject={getProject} editProjectChange={editProjectChange} data={project} />}
    </div>
  )
}

export default TodoList;
