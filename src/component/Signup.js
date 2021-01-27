import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SHA256 from "./SHA256";
import Pictures from "./Pictures";
import './css/Login.css';
import GoogleLogin from "react-google-login";
import githubIcon from "../avatars/GitHubMark.png";
import googleIcon from "../avatars/google-icon.svg";

axios.defaults.withCredentials = true;

function Signup({signupChange,loginChange}) {
  const [state, setState] = useState({
    emailChecked: false,
    email: "",
    emailMessage: "",
    usernameChecked: false,
    username: "",
    usernameMessage: "",
    password: "",
    firstPassword: "",
    lastPassword: "",
    passwordMessage: "",
    errorMessage: "",
  })
  const GITHUB_LOGIN_URL = 'https://github.com/login/oauth/authorize?client_id=48913fb6f49bac54449a'
  const { emailChecked, email, emailMessage, usernameChecked, username, usernameMessage, password, firstPassword, lastPassword, passwordMessage, errorMessage } = state;
  const onChange = (e) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    })
  };
  useEffect(() => { //* 비밀번호 입력되면 비밀번호확인 함수 실행
    checkPassword();
  }, [firstPassword, lastPassword]); //? 배열에 state 추가 하라는데 그러면 무한루프파티!!! 경고 없애고 싶음...
  const checkEmail = () => {
    function isEmail(asValue) {
      let regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
      return regExp.test(asValue);
    }
    if (!email) {
      setState({
        ...state,
        emailMessage: "이메일을 입력 해 주세요",
        emailChecked: false,
      })
    } else if (!isEmail(email)) {
      setState({
        ...state,
        emailMessage: "이메일 형식이 올바르지 않습니다",
        emailChecked: false,
      })
    } else {
      axios.post("https://localhost:4001/user/checkEmail", {
        email: email
      })
        .then(() => {
          setState({
            ...state,
            emailMessage: "사용 가능한 이메일 입니다",
            emailChecked: true,
          })
        })
        .catch(() => {
          setState({
            ...state,
            emailMessage: "이미 가입된 이메일 입니다",
            emailChecked: false,
          })
        })
    }
  };
  const checkUsername = () => {
    if (username === "") {
      setState({
        ...state,
        usernameMessage: "닉네임을 입력 해 주세요",
        usernameChecked: false,
      })
    } else {
      axios.post("https://localhost:4001/user/checkUsername", {
        username: username
      })
        .then(() => {
          setState({
            ...state,
            usernameMessage: "사용 가능한 닉네임 입니다",
            usernameChecked: true,
          })
        })
        .catch(() => {
          setState({
            ...state,
            usernameMessage: "사용 중인 닉네임 입니다",
            usernameChecked: false,
          })
        })
    }
  };
  const checkPassword = () => {
    if (firstPassword.length < 1 || lastPassword.length < 1) {
      setState({
        ...state,
        password: "",
        passwordMessage: "비밀번호를 입력해 주세요",
      })
    } else if (firstPassword.length < 6 || firstPassword.length > 12) {
      setState({
        ...state,
        password: "",
        passwordMessage: "비밀번호는 6~12자리 이내로 입력 해 주세요",
      })
    } else if (firstPassword === lastPassword) {
      setState({
        ...state,
        passwordMessage: "비밀번호가 일치합니다",
        password: firstPassword,
      })
    } else {
      setState({
        ...state,
        password: "",
        passwordMessage: "비밀번호가 일치하지 않습니다",
      })
    }
  };
  const handleSignup = () => {
    if (!username || !password || !email) {
      setState({
        ...state,
        errorMessage: "모든 항목은 필수입니다",
      })
    } else if (!emailChecked || !usernameChecked) {
      setState({
        ...state,
        errorMessage: "이메일과 닉네임 중복 확인을 해주세요",
      })
    } else {
      axios.post("https://localhost:4001/user/signup", {
        username: username,
        password: SHA256(password),
        email: email,
        profile: Pictures[Math.floor(Math.random() * 16)],
      })
      .then(()=>{
        signupChange()
      })
    }
  };

  //Google Login
  const responseGoogle = (res) => {
    axios.post("https://localhost:4001/user/googleLogin", {
      email: res.profileObj.googleId,
      username: res.profileObj.name,
      password: res.profileObj.email,
      profile: res.profileObj.imageUrl
    }, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: false
    })
      .then((param) => {
        window.sessionStorage.clear()
        window.sessionStorage.accessToken = param.data.accessToken
        window.sessionStorage.email = param.data.userinfo.email
        window.sessionStorage.username = param.data.userinfo.username
        window.sessionStorage.profile = param.data.userinfo.profile
        window.sessionStorage.id = param.data.userinfo.id
        window.sessionStorage.isLogin = true
        this.props.loginChange()
      })
      .catch(err => {
        console.log(err)
      })
  }

  //Google Login Fail
  const responseFail = (err) => {
    console.log(err);
  }

  

  const socialLoginHandler = () => { 
    window.location.assign(GITHUB_LOGIN_URL)
  }

  return (
    <div className='login_container' onClick={signupChange}>
    <div className="Signup loginmodal" onClick={(e)=>e.stopPropagation()}>
      {/* <h1 className="Signup_title">Signup</h1> */}
      <p>
        <input
          className="Signup_input"
          name="email"
          type="text"
          onChange={onChange}
          autoComplete='off' required
        />
        <label>
          <span className="Signup_subtitle">이메일</span>
        </label>
        <button
          className="SignUp_check_button"
          onClick={checkEmail}
        >중복확인</button>
      </p>
      <div className="Signup_alert_box">{emailMessage}</div>
      
      <p>
        <input
          className="Signup_input"
          name="firstPassword"
          type="password"
          onChange={onChange}
          value={firstPassword}
          autoComplete='off' required
        />
        <label>
          <span className="Signup_subtitle">비밀번호</span>
        </label>
      </p>   

      <p>
        <input
          className="Signup_input"
          name="lastPassword"
          type="password"
          onChange={onChange}
          value={lastPassword}
          autoComplete='off' required
        />
        <label>
          <span className="Signup_subtitle">비밀번호 확인</span>
        </label>
      </p>
        <div className="Signup_alert_box">{passwordMessage}</div>

      <p>
        <input
          className="Signup_input"
          name="username"
          type="text"
          onChange={onChange}
          autoComplete='off' required
        />
        <label>
          <span className="Signup_subtitle">닉네임</span>
        </label>
        <button
          className="SignUp_check_button"
          type="submit"
          onClick={checkUsername}
        >중복확인</button>
      </p>
      <div className="Signup_alert_box">{usernameMessage}</div>
      <div className="Signup_alert_box signupErr">{errorMessage}</div>
      
      <div className='socialwrapper'>
        <div style={{height:40, padding:10, color:'rgb(111,111,111)'}}>Or login with</div>
        <span>
          <button className='githubbtn socialbtn' onClick={socialLoginHandler}><img src={githubIcon} /></button>              
          <GoogleLogin 
            render={renderProps => (
              <button className='googlebtn socialbtn' onClick={renderProps.onClick} >
                <img src={googleIcon} />
                </button>
            )}
            className='googleBtn socialbtn' 
            clientId="743718284620-8frgfcjhl356cc6llkl21galrcoj2s61.apps.googleusercontent.com"
            buttonText="Google"
            onSuccess={responseGoogle}
            onFailure={responseFail}
            // isSignedIn={true}
            cookiePolicy={"single_host_origin"}
          />
        </span>
      </div>
      <div>
        <button
          className="SignUp_submit_button modalbtn"
          onClick={handleSignup}
        >Sign up</button>
      </div>
    </div>
    </div>
  )
}

export default Signup;
