import React,{useState} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import axios from 'axios'

import Login from './component/Login';
import Signup from "./component/Signup";
import UpdateUserinfo from "./component/UpdateUserinfo";
import ProjectList from "./component/ProjectList";
import NewProject from "./component/NewProject";

import './App.css'
axios.defaults.withCredentials = true;

function App(){
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
                <ProjectList ></ProjectList>
            <Route path="/newproject">
              <NewProject />
            </Route>
          </Switch>
        </Router>
      </>
    )
  
}

export default App;

