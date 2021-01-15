import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
} from "react-router-dom";

import Login from './component/Login';
import Signup from "./component/Signup";
import UpdateUserinfo from "./component/UpdateUserinfo";
import ProjectList from "./component/ProjectList";
import NewProject from "./component/NewProject";

import './App.css'

class App extends React.Component {
  render() {
    return (
      <>
        <h1>hello world</h1>
        <Router>
          <Switch>
            {/* <Route path="/user/login">
              <Login />
            </Route> */}
            <Route path="/user/signup">
              <Signup />
            </Route>

            <Route path="/user/updateUserinfo">
              <UpdateUserinfo />
            </Route>
            {/* {
              window.sessionStorage.isLogin === false
              ?(
                <ProjectList></ProjectList>
              )
              :(
                <ProjectList></ProjectList>
              )
            } */}
            <Route path="/newproject">
              <NewProject />
            </Route>
          </Switch>
        </Router>
      </>
    )
  }
}

export default withRouter(App);
