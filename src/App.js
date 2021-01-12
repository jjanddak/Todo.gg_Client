import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
} from "react-router-dom";
// import Signup from "./component/Signup";
import Login from './component/Login';
class App extends React.Component{
  render(){
    return(
      <>
        <h1>hello world</h1>
        <Router>
          <Switch>
            {/* <Route path="/user/signup">
              <Signup />
            </Route> */}
            <Route patn="/user/login">
              <Login />
            </Route>
          </Switch>
        </Router>
      </>
    )
  }
}
export default withRouter(App);