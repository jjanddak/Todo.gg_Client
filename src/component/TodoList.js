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
  const [showDelete, setShowDelete] = useState({func: () => {}});
  const [showAddCard, setShowAddCard] = useState(false);
  const [showEditCard, setShowEditCard] = useState({});
  const [showAddMembar, setShowAddMembar] = useState({});
  const [editProjectModal, setEditProjectModal] = useState(false);
  const process = Math.round(counts.done / (counts.todo + counts.inprogress + counts.done) * 100);
  let todoList = [];
  let inprogressList = [];
  let doneList = [];
  const setStorage = () => {
    storage[`pjt${projectId}`] = JSON.stringify(project);
    storage[`cnt${projectId}`] = JSON.stringify({
      todo: todoList.length,
      inprogress: inprogressList.length,
      done: doneList.length,
    });
  };
  const getProject = () => {
    if (!isLogin) { //* 로그인 상태 아닐 때
      setProject(JSON.parse(storage[`pjt${projectId}`]));
      setCounts(JSON.parse(storage[`cnt${projectId}`]));
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
    if (!isLogin && !storage[`pjt${projectId}`]) {
      try {
        if (projectId < 3) {
          storage[`pjt${projectId}`] = JSON.stringify(dummy[projectId].projectInfo);
          storage[`cnt${projectId}`] = JSON.stringify(dummy[projectId].taskCardCount);
        } else {
          storage[`pjt${projectId}`] = JSON.stringify(JSON.parse(storage.guestProjectList.contributers)[projectId]);
          storage[`cnt${projectId}`] = JSON.stringify(counts);
        }
      } catch {
        history.push("/"); //* 없으면 홈으로
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
  const addCard = () => {
    if (!isLogin) {
    const newId = project.taskCards.sort((a, b) => { return a.id - b.id })[project.taskCards.length - 1].id + 1;
    setProject({
        ...project,
        taskCards: [...project.taskCards, {
          id: newId,
          content: taskContent,
          state: "todo",
          project_id: projectId,
          position: todoList.length,
          contributers: [],
        }]
      })
      setTaskContent("");
      setShowAddCard(false);
    } else {
      axios.post(`https://localhost:4001/project/${projectId}/newTask`, {
        content: taskContent,
        position: todoList.length,
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
    setShowDelete({[id]: false});
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
  const removeMember = (cardId, userId) => {
    setShowDelete({[cardId]: false});
    if (!isLogin) {
      const newCards = [];
      for(let card of project.taskCards) {
        if(card.id === cardId) {
          const editedMember = [];
          for(let member of card.contributers) {
            if(member.user.id === userId) {
              continue;
            }
            editedMember.push(member);
          }
          card.contributers = editedMember;
        }
        newCards.push(card);
      }
      setProject({
        ...project,
        taskCards: newCards,
      })
    } else {
      axios.post(`https://localhost:4001/project/${projectId}/deleteContributer`, {
        userId: userId,
        taskCardId: cardId,
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
  };
  let movingCard;
  const changeState = (movingCard, newState, position) => {
    //* 기존 스테이트 확인하고 배열에서 삭제
    const remove = (list) => {
      list.splice(movingCard.position, 1);
    };
    movingCard.state === "todo" && remove(todoList);
    movingCard.state === "inprogress" && remove(inprogressList);
    movingCard.state === "done" && remove(doneList);
    //* 새 스테이트 확인하고 배열에 추가
    const reAdd = (list) => {
      list.splice(position, 0, { //* 포지션 위치에 이동한 카드 추가
        ...movingCard,
        state: newState,
        position: position,
      });
      for (let i = position + 1; i < list.length; i++) { //* 포지션 뒷쪽 카드 포지션++;
        list[i].position++;
      }
    };
    newState === "todo" && reAdd(todoList);
    newState === "inprogress" && reAdd(inprogressList);
    newState === "done" && reAdd(doneList);
    const cards = todoList.concat(inprogressList, doneList);
    if (!isLogin) {
      setProject({
        ...project,
        taskCards: cards,
      });
    } else {
      axios.post(`https://localhost:4001/project/${projectId}/updateState`, {
        taskCards: cards,
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
  };
  const allowDrop = (e) => {
    e.preventDefault();
  };
  const dragItem = (item) => { //* 이동 할 카드 정보
    movingCard = item;
  };
  const dropItem = (state, position) => {
    changeState(movingCard, state, position);
  };
  const setCard = (item) => {
    return (
      <div className="todoList_cards"
        draggable={!showEditCard[item.id]}
        onDragStart={() => { dragItem(item) }}
        key={item.id}
      >
        {showDelete[item.id]
          ? (<div className="todoList_cards_delete">
            삭제 하시겠습니까?
            <button onClick={showDelete.func}>O</button>
            <button onClick={() => {setShowDelete({[item.id]: false})}}>X</button>
          </div>)
          : (showEditCard[item.id]
              ? (<>
                  <textarea className="todoList_cards_textarea" name="content" value={taskContent} onChange={onChange} />
                  <button className="todoList_cards_button" onClick={() => { editCard(item.id) }}>submit</button>
                  <button className="todoList_cards_button" onClick={() => { setShowEditCard({ [item.id]: false }) }}>cancel</button>
                </>) 
              : (<>
                  <div onDrop={() => { dropItem(item.state, item.position) }}>
                    <div className="todoList_cards_content">{item.content}</div>
                    <button className="todoList_cards_button" onClick={() => {
                      setTaskContent(item.content)
                      setShowEditCard({ [item.id]: true })
                    }}>⚙</button>
                    <button className="todoList_cards_button" onClick={() => {setShowDelete({ [item.id]: true, func: () => {deleteCard(item.id)} })}}>✖</button>
                  </div>
                  <div onDrop={() => { dropItem(item.state, item.position - 1) }}>
                    <div className="todoList_cards_contributers">
                      {item.contributers.map((el) => {
                        return (
                          <button onClick={() => {setShowDelete({ [item.id]: true, func: () => {removeMember(item.id, el.user.id)} })}} key={el.id}>
                            <img className="todoList_cards_contributers_profile" src={el.user.profile} title={el.user.username} alt={el.user.username} />
                          </button>
                        )
                      })}
                    </div>
                    <button className="todoList_cards_button" onClick={() => { setShowAddMembar({ [item.id]: !showAddMembar[item.id] }) }}>➕</button>
                  </div>
                  {showAddMembar[item.id] && (
                    <div className="todoList_cards_add_member">
                      <input type="text" name="member" onChange={onChange} />
                      <button className="todoList_cards_button" onClick={() => { addMember(item.id) }}>add</button>
                      <div className="todoList_cards_add_member_err">{newMemberErr}</div>
                    </div>
                  )}
                </>)
            )
          }
      </div>
    )
  };
  project.taskCards.sort((a, b) => { //* 포지션 순으로 정렬
    return a.position - b.position;
  })
    .forEach((item) => { //* 정렬 된 카드 분류
      item.state === "todo" && todoList.push(item);
      item.state === "inprogress" && inprogressList.push(item);
      item.state === "done" && doneList.push(item);
    });
  //* 배열의 인덱스로 포지션 재설정 후 setCard()
  todoList.forEach((item, idx) => { item.position = idx })
  const renderTodoList = todoList.map((item) => { return setCard(item) }).reverse();
  inprogressList.forEach((item, idx) => { item.position = idx })
  const renderInprogressList = inprogressList.map((item) => { return setCard(item) }).reverse();
  doneList.forEach((item, idx) => { item.position = idx })
  const renderDoneList = doneList.map((item) => { return setCard(item) }).reverse();

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
        <button className="todoList_nav_button edit_project" onClick={editProjectChange} >함바가?</button>
      </nav>
      <div className="todoList_taskCards" onDragOver={allowDrop}>
        <div className="todoList_todo">todo
          <button className="todoList_add_card" onClick={() => setShowAddCard(!showAddCard)}>add card</button>
          <div className="todoList_counts">{counts.todo}</div>
          <div className="todoList_add_" style={{ display: showAddCard ? "block" : "none" }}>
            <textarea className="todoList_input" name="content" onChange={onChange} value={taskContent} />
            <button className="todoList_submit_input" onClick={addCard}>add</button>
          </div>
          <div className="todoList_todo_list">
            {renderTodoList.length
              ? renderTodoList
              : <div className="todoList_position_box" onDrop={() => { dropItem("todo", -1) }} />
            }
          </div>
        </div>
        <div className="todoList_inprogress" onDragOver={allowDrop}>in progress
          <div className="todoList_counts">{counts.inprogress}</div>
          <div className="todoList_inprogress_list">
            {renderInprogressList.length
              ? renderInprogressList
              : <div className="todoList_position_box" onDrop={() => { dropItem("inprogress", -1) }} />
            }
          </div>
        </div>
        <div className="todoList_done" onDragOver={allowDrop}>done
          <div className="todoList_counts">{counts.done}</div>
          <div className="todoList_done_list">
            {renderDoneList.length
              ? renderDoneList
              : <div className="todoList_position_box" onDrop={() => { dropItem("done", -1) }} />
            }
          </div>
        </div>
      </div>
      { editProjectModal && <EditProject getProject={getProject} editProjectChange={editProjectChange} data={project} />}
    </div>
  )
}

export default TodoList;
