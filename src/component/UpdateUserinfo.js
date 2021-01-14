import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import Pictures from "./Pictures";

axios.defaults.withCredentials = true;

function UpdateUserinfo() {
  const history = useHistory();
  const [state, setState] = useState({
    usernameChecked: true,
    username: window.sessionStorage.username,
    newUsername: "",
    usernameMessage: "",
    oldPassword: "",
    oldPasswordChecked: false,
    oldPasswordMessage: "정보를 변경하려면 기존 비밀번호를 입력해야 합니다",
    password: "",
    firstPassword: "",
    lastPassword: "",
    newPasswordMessage: "비밀번호를 변경하려면 새 비밀번호를 입력 해주세요",
    profile: window.sessionStorage.profile,
    showList: false,
    errorMessage: "",
  });
  const { usernameChecked, username, newUsername, usernameMessage, oldPassword, oldPasswordChecked, oldPasswordMessage, password, firstPassword, lastPassword, newPasswordMessage, profile, showList, errorMessage } = state;
  const onChange = (e) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    })
  };
  useEffect(() => {
    checkPassword();
  }, [firstPassword, lastPassword]);
  const handleUpdateUserinfo = () => {
    if (!oldPassword) {
      setState({
        ...state,
        errorMessage: "기존 비밀번호를 입력 해주세요"
      })
    } else if (!oldPasswordChecked) {
      setState({
        ...state,
        errorMessage: "기존 비밀번호를 확인 해주세요"
      })
    } else if (!usernameChecked) {
      setState({
        ...state,
        errorMessage: "새 닉네임의 중복확인을 확인 해주세요"
      })
    } else {
      axios.post("https://localhost:4001/user/updateUserinfo", {
        username: username ? username : window.sessionStorage.username,
        password: password ? password : oldPassword,
        profile: profile,
      }, {
        headers: {
          Authorization: `Bearer ${window.sessionStorage.accessToken}`,
          "content-type": "multipart/form-data"
        }
      })
        .then(() => {
          history.push(``);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const checkUsername = () => {
    if (newUsername === window.sessionStorage.username) {
      setState({
        ...state,
        usernameChecked: true,
        usernameMessage: "현재 닉네임과 동일한 닉네임 입니다"
      });
    } else {
      axios.post("http://localhost:4000/user/checkUsername", {
        username: newUsername,
      })
        .then((param) => {
          if (param.data.message === "invalid") {
            setState({
              ...state,
              usernameChecked: false,
              usernameMessage: "사용 중인 닉네임 입니다",
            })
          } else if (param.data.message === "valid") {
            setState({
              ...state,
              username: newUsername,
              usernameChecked: true,
              usernameMessage: "사용 가능한 닉네임 입니다",
            })
          }
        })
        .catch((err) => {
          console.log(err);
        })
    }
  };
  const checkOldPassword = () => {
    if (oldPassword) {
      axios.post("http://localhost:4000/user/checkPassword", {
        oldPassword: oldPassword,
      })
        .then(() => {
          setState({
            ...state,
            oldPasswordChecked: true,
            oldPasswordMessage: ""
          });
        })
        .catch(() => {
          setState({
            ...state,
            oldPasswordChecked: false,
            oldPasswordMessage: "기존 비밀번호가 일치하지 않습니다",
          });
        });
    } else {
      setState({
        ...state,
        oldPasswordChecked: false,
        oldPasswordMessage: "정보를 변경하려면 기존 비밀번호를 입력해야 합니다",
      })
    }
  };
  const checkPassword = () => {
    if (firstPassword.length < 1 && lastPassword.length < 1) {
      setState({
        ...state,
        password: "",
        newPasswordMessage: "비밀번호를 변경하려면 새 비밀번호를 입력 해주세요",
      })
    } else if (firstPassword.length < 1 || lastPassword.length < 1) {
      setState({
        ...state,
        password: "",
        newPasswordMessage: "비밀번호를 입력 해 주세요",
      })
    } else if (firstPassword.length < 6 || firstPassword.length > 12) {
      setState({
        ...state,
        password: "",
        newPasswordMessage: "비밀번호는 6~12자리 이내로 입력 해 주세요",
      })
    } else if (firstPassword === lastPassword) {
      setState({
        ...state,
        newPasswordMessage: "비밀번호가 일치합니다",
        password: firstPassword,
      })
    } else {
      setState({
        ...state,
        password: "",
        newPasswordMessage: "비밀번호가 일치하지 않습니다",
      })
    }
  };
  const choosePicture = (idx) => {
    setState({
      ...state,
      profile: Pictures[idx],
      showList: false,
    })
  }
  const changeProfile = (e) => {
    e.preventDefault();
    setState({
      ...state,
      showList: !showList,
    })
  }
  const pictureList = Pictures.map((item, idx) => {
    return (
      <button key={idx} onClick={()=>choosePicture(idx)}>
        <img src={item} />
      </button>
    )
  })

  return (
    <div className="updateUserinfo">
      <h2 className="updateUserinfo_title">updateUserinfo</h2>
      <form>
        <div className="updateUserinfo_profile"> 프로필
          <img src={profile} alt="" name="profile" />
          <button
            className="updateUserinfo_button"
            onClick={changeProfile}
          >프로필 변경</button>
        </div>
        <div className="updateUserinfo_pictures">
          {showList && pictureList}
        </div>
        <span className="updateUserinfo_subtitle">닉네임</span>
        <button
          className="updateUserinfo_button"
          type="submit"
          onClick={checkUsername}
        >중복확인</button>
        <input
          className="updateUserinfo_input"
          name="newUsername"
          type="text"
          placeholder={window.sessionStorage.username}
          onChange={onChange}
        />
        <div className="updateUserinfo_alert_box">{usernameMessage}</div>
        <span className="updateUserinfo_subtitle">기존 비밀번호</span>
        <input
          className="updateUserinfo_input"
          name="oldPassword"
          type="password"
          onBlur={checkOldPassword}
          onChange={onChange}
          value={oldPassword}
        />
        <div className="updateUserinfo_alert_box">{oldPasswordMessage}</div>
        <span className="updateUserinfo_subtitle">새 비밀번호</span>
        <input
          className="updateUserinfo_input"
          name="firstPassword"
          type="password"
          onChange={onChange}
          value={firstPassword}
        />
        <span className="updateUserinfo_subtitle">비밀번호 확인</span>
        <input
          className="updateUserinfo_input"
          name="lastPassword"
          type="password"
          onChange={onChange}
          value={lastPassword}
        />
      </form>
      <div className="updateUserinfo_alert_box">{newPasswordMessage}</div>
      <div className="updateUserinfo_alert_box">{errorMessage}</div>
      <button
        className="updateUserinfo_submit_button"
        onClick={handleUpdateUserinfo}
      >적용</button>
    </div>
  )
}

export default UpdateUserinfo;
