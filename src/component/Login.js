import React from 'react';
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import SHA256 from "./SHA256";
import './css/Login.css'
axios.defaults.withCredentials = true;
class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: "",
      password: "",
      errorMessage: ""
    }
    this.handleInputValue = this.handleInputValue.bind(this);
  }

  handleInputValue = (key) => (e) => {
    this.setState({ [key]: e.target.value });
  };

  handleLogin = () => {
    const { email, password } = this.state; //변수할당
    if (email && password) { //다 채워져있으면 서버에보내기
      axios.post('https://localhost:4001/user/login', {
        email: email,
        password: SHA256(password),
      })
        .then((param) => {
          window.sessionStorage.accessToken = param.data.accessToken
          window.sessionStorage.email = param.data.userinfo.email //세션저장
          window.sessionStorage.username = param.data.userinfo.username
          window.sessionStorage.profile = param.data.userinfo.profile
          window.sessionStorage.isLogin = true
          this.props.loginChange()
        }).catch(() => {
          this.setState({ errorMessage: '일치하는 회원 정보가 없습니다.' })
        })
    } else {
      this.setState({ errorMessage: '이메일과 비밀번호는 필수입니다.' })
    }
  };


  render() {
    return (
      <div className='login_container' onClick={this.props.loginChange}>
        <div className='loginmodal'onClick={(e)=>e.stopPropagation()}>
          <h1>Login</h1>
          <p>이메일</p>
          <input type='email' onChange={this.handleInputValue('email')}></input>
          <p>비밀번호</p>
          <input type='password' onChange={this.handleInputValue('password')}></input>
          <div>{this.state.errorMessage}</div>
          <button onClick={this.handleLogin}>
            로그인
        </button>
        <button onClick={this.props.signupChange}>
            회원가입
            </button>
          <Link to='/user/social'>
            소셜로그인
      </Link>
        </div>
      </div>
    )
  }
}


export default withRouter(Login);