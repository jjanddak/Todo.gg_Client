import React, { useState, useEffect } from "react";
import axios from "axios";
import SHA256 from "./SHA256";
import Pictures from "./Pictures";
import './css/updateUserinfo.css';
import cameraimg from "../avatars/camerafilled.png";

axios.defaults.withCredentials = true;

function UpdateUserinfo({ updateUserinfoChange }) {
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
    pictureList: null,
    errorMessage: "",
  });
  const { usernameChecked, username, newUsername, usernameMessage, oldPassword, oldPasswordChecked, oldPasswordMessage, password, firstPassword, lastPassword, newPasswordMessage, profile, pictureList, errorMessage } = state;
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
        errorMessage: "기존 비밀번호가 일치하지 않습니다"
      })
    } else if (!usernameChecked) {
      setState({
        ...state,
        errorMessage: "새 닉네임의 중복확인을 확인 해주세요"
      })
    } else {
      axios.post("https://localhost:4001/user/updateUserinfo", {
        username: username ? username : window.sessionStorage.username,
        password: SHA256(password ? password : oldPassword),
        profile: profile,
      }, {
        headers: {
          Authorization: `Bearer ${window.sessionStorage.accessToken}`,
          "content-type": "application/json"
        }
      })
        .then((param) => {
          window.sessionStorage.username = username;
          window.sessionStorage.profile = profile;
          param.data.accessToken && (window.sessionStorage.accessToken = param.data.accessToken);
          updateUserinfoChange()
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const checkUsername = () => {
    if (!newUsername) {
      setState({
        ...state,
        usernameChecked: false,
        usernameMessage: "변경할 닉네임을 입력 해주세요",
      });
    } else if (newUsername === window.sessionStorage.username) {
      setState({
        ...state,
        usernameChecked: true,
        usernameMessage: "현재 닉네임과 동일한 닉네임 입니다",
      });
    } else {
      axios.post("https://localhost:4001/user/checkUsername", {
        username: newUsername,
      })
        .then((param) => {
          if (param.data.message === "invalid") {
            // setState({
            //   ...state,
            //   usernameChecked: false,
            //   usernameMessage: "사용 중인 닉네임 입니다",
            // })
            // 400응답하면 에러로 판단해서 catch 블록에 작성해야함
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
          setState({
            ...state,
            usernameChecked: false,
            usernameMessage: "사용 중인 닉네임 입니다",
          })
        })
    }
  };
  const checkOldPassword = () => {
    if (oldPassword) {
      axios.post("https://localhost:4001/user/checkPassword", {
        password: SHA256(oldPassword),
      }, {
        headers: {
          Authorization: `Bearer ${window.sessionStorage.accessToken}`,
          "content-type": "application/json"
        }
      })
        .then((param) => {
          param.data.accessToken && (window.sessionStorage.accessToken = param.data.accessToken);
          if (param.data.message === "valid") {
            setState({
              ...state,
              oldPasswordChecked: true,
              oldPasswordMessage: ""
            });
          } else {
            setState({
              ...state,
              oldPasswordChecked: false,
              oldPasswordMessage: "기존 비밀번호가 일치하지 않습니다",
            });
          }
        })
        .catch((err) => {
          console.log(err);
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
      pictureList: null,
    })
  };
  const changeProfile = () => {
    setState({
      ...state,
      pictureList: pictureList ? null : Pictures.map((item, idx) => {
        return (
          <img className='profilelistimg' src={item} alt="" key={idx} onClick={() => choosePicture(idx)} />
        )
      })
    })
  };

  return (
    <div className="updateUserinfo" onClick={updateUserinfoChange}>
      <div className="updateModal" onClick={(e) => e.stopPropagation()}>
        <div className="updateUserinfo_profile"> 
          <img src={profile} alt="" name="profile" onClick={changeProfile}/>
          <img className="profilecamera" src={cameraimg} />
        </div>
        <div className="updateUserinfo_pictures">
          {pictureList}
        </div>
        
        <p>
          <input
            className="updateUserinfo_input"
            name="newUsername"
            type="text"
            placeholder={window.sessionStorage.username}
            onChange={onChange}
          />
          <label>
            <span>닉네임 변경</span>
          </label>
          <button
            className="updateUserinfo_button"
            type="submit"
            onClick={checkUsername}
          >중복확인</button>
        </p>

     
        <div className="updateUserinfo_alert_box">{usernameMessage}</div>
        <p>
          <input
            className="updateUserinfo_input"
            // placeholder=""
            name="oldPassword"
            type="password"
            onBlur={checkOldPassword}
            onChange={onChange}
            value={oldPassword}
            autoComplete='off'
            required
          />
          <label>
            <span>기존 비밀번호</span>
          </label>
          {/* <div className="updateUserinfo_alert_box">
            {oldPasswordMessage}
          </div> */}
        </p>

        <div className="updateUserinfo_info_box">소셜로그인 유저의 초기 비밀번호는 <br/>해당 계정의 닉네임 또는 이메일 입니다</div>
       
        <p>
          <input
            className="updateUserinfo_input"
            placeholder=""
            name="firstPassword"
            type="password"
            onChange={onChange}
            value={firstPassword}
            autoComplete='off'
            required
          />
          <label>
            <span>새 비밀번호</span>
          </label>
        </p>
        <div className="updateUserinfo_alert_box">{newPasswordMessage}</div>
        <p>
          <input
            className="updateUserinfo_input"
            placeholder=""
            name="lastPassword"
            type="password"
            onChange={onChange}
            value={lastPassword}
            autoComplete='off'
            required
          />
          <label>
            <span>비밀번호 확인</span>
          </label>
        </p>
        <div className="updateUserinfo_alert_box updateErr">{errorMessage}</div>
        
        <button
          className="updateUserinfo_submit_button"
          onClick={handleUpdateUserinfo}
        >적용</button>
      </div>
    </div>
  )
}

export default UpdateUserinfo;