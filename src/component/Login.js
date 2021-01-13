import React from 'react';
import { Link,withRouter } from "react-router-dom";
import axios from "axios";
class Login extends React.Component{
  constructor(props){
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
        password: password
      }, { withCredentials: true })
        .then((param) => {
          window.sessionStorage.accessToken = param.data.accessToken
          window.sessionStorage.email = param.data.userinfo.email //세션저장
          window.sessionStorage.username = param.data.userinfo.username
          window.sessionStorage.isLogin = true
        }).then(() => {
          this.props.history.push("/") // 메인화면으로 넘어가기
        }).catch(() => {
          this.setState({ errorMessage: '일치하는 회원 정보가 없습니다.' })
        })
    } else {
      this.setState({ errorMessage: '이메일과 비밀번호는 필수입니다.' })
    }
  };


  render(){
    return(
      <div>
      <h1>Login</h1>
        <p>이메일</p>
        <input type='email' onChange={this.handleInputValue('email')}></input>
        <p>비밀번호</p>
        <input type='password' onChange={this.handleInputValue('password')}></input>
        <div>{this.state.errorMessage}</div>
        <button onClick={this.handleLogin}>
          로그인
        </button>
      <Link to='/user/signup'>
       회원가입
      </Link>
      <Link to='/user/social'>
       소셜로그인
      </Link>
    </div>
    )
  }
}


export default withRouter(Login);