import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
} from "react-router-dom";
import './App.css';
import React from 'react'
import Login from './component/Login'

class App extends React.Component{
  state = {
    accessToken:''
  }
  handleAccessToken(token){ //액세스 토큰 스테이트에 저장
    this.setState(
      {accessToken:token}
    )
  }


  render(){
    return(
      <>
      <h1>hello world</h1>
      <Router>
       <Login></Login>
      </Router>
      </>
    )
  }
}


export default App;
