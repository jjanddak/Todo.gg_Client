import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;
function Signup() {
  const history = useHistory();
  const [emailChecked, setEmailChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [usernameChecked, setUsernameChecked] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [password, setPassword] = useState("");
  const [firstPassword, setFirstPassword] = useState("");
  const [lastPassword, setLastPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const getKeyword = (e) => {
    if (e.target.name === "email") setEmail(e.target.value);
    if (e.target.name === "username") setUsername(e.target.value);
    if (e.target.name === "firstPassword") {
      setFirstPassword(e.target.value);
      checkPassword(e.target.value, lastPassword);
    }
    if (e.target.name === "lastPassword") {
      setLastPassword(e.target.value);
      checkPassword(firstPassword, e.target.value);
    }
  };
  const checkEmail = () => {
    function isEmail(asValue) {
      let regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
      return regExp.test(asValue);
    }
    if (!email) {
      setEmailMessage("이메일을 입력 해 주세요");
      setEmailChecked(false);
    } else if (!isEmail(email)) {
      setEmailMessage("이메일 형식이 올바르지 않습니다");
      setEmailChecked(false);
    } else {
      axios.post("https://localhost:4001/user/checkEmail", {
        email: email
      })
        .then(res => {
          setEmailMessage("사용 가능한 이메일 입니다");
          setEmailChecked(true);
        })
        .catch(()=>{
          setEmailMessage("이미 가입된 이메일 입니다");
          setEmailChecked(false);
        })
    }
  };
  const checkUsername = () => {
    if (username === "") {
      setUsernameMessage("닉네임을 입력 해 주세요");
      setUsernameChecked(false);
    } else {
      axios.post("https://localhost:4001/user/checkUsername", {
        username: username
      })
        .then(res => {
          setUsernameMessage("사용 가능한 닉네임 입니다");
          setUsernameChecked(true);
        })
        .catch(()=>{
          setUsernameMessage("사용 중인 닉네임 입니다");
          setUsernameChecked(false);
        })
    }
  };
  const checkPassword = (pw1, pw2) => {
    if (pw1.length < 1 || pw2.length < 1) {
      setPasswordMessage("비밀번호를 입력 해 주세요");
    } else if (pw1.length < 6 || pw1.length > 12) {
      setPasswordMessage("비밀번호는 6~12자리 이내로 입력 해 주세요");
    } else if (pw1 === pw2) {
      setPasswordMessage("비밀번호가 일치합니다");
      setPassword(pw1);
    } else {
      setPasswordMessage("비밀번호가 일치하지 않습니다");
    }
  };
  const handleSignup = () => {
    if (!username || !password || !email) {
      setErrorMessage("모든 항목은 필수입니다");
    } else if (!emailChecked || !usernameChecked) {
      setErrorMessage("이메일과 닉네임 중복 확인을 해주세요");
    } else {
      axios.post("https://localhost:4001/user/signup", {
        username: username,
        password: password,
        email: email
      })
        .then(() => {
          history.push("/user/login");
        });
    }
  };
  return (
    <div className="Signup">
      <h2 className="Signup_title">SignUp</h2>
      <span className="Signup_subtitle">이메일</span>
      <button
        className="SignUp_check_button"
        onClick={checkEmail}
      >중복확인</button>
      <input
        className="Signup_input"
        name="email"
        type="text"
        onChange={getKeyword}
      />
      <div className="Signup_alert_box">{emailMessage}</div>
      <span className="Signup_subtitle">비밀번호</span>
      <input
        className="Signup_input"
        name="firstPassword"
        type="password"
        onChange={getKeyword}
        value={firstPassword}
      />
      <span className="Signup_subtitle">비밀번호 확인</span>
      <input
        className="Signup_input"
        name="lastPassword"
        type="password"
        onChange={getKeyword}
        value={lastPassword}
      />
      <div className="Signup_alert_box">{passwordMessage}</div>
      <span className="Signup_subtitle">닉네임</span>
      <button
        className="SignUp_check_button"
        type="submit"
        onClick={checkUsername}
      >중복확인</button>
      <input
        className="Signup_input"
        name="username"
        type="text"
        onChange={getKeyword}
      />
      <div className="Signup_alert_box">{usernameMessage}</div>
      <div>
        <Link to="/user/login">이미 아이디가 있으신가요?</Link>
      </div>
      <div className="Signup_alert_box">{errorMessage}</div>
      <button
        className="SignUp_submit_button"
        onClick={handleSignup}
      >
        회원가입
        </button>
    </div>
  )
}
export default Signup;