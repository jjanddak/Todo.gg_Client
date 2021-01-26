import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import ProjectList from "./component/ProjectList";
import NewProject from "./component/NewProject";
import TodoList from "./component/TodoList";

import "./App.css";

function App() {

  return (
    <div className="App">
      <Router>
        <Switch>
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
