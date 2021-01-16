import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import UpdateUserinfo from "./component/UpdateUserinfo";
import ProjectList from "./component/ProjectList";
import NewProject from "./component/NewProject";
import TodoList from "./component/TodoList";

import "./App.css";

function App() {

  return (
    <div className="App">
      <h1>hello world</h1>
      <Router>
        <Switch>
          <Route path="/user/updateUserinfo"> {/** 모달 완료되면 삭제 */}
            <UpdateUserinfo />
          </Route>

          <Route path="/project/">
            <TodoList />
          </Route>
          <Route path="/newproject">
            <NewProject />
          </Route>
          <Route exact path="/">
            <ProjectList />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App;
