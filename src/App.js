import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";

import UpdateUserinfo from "./component/UpdateUserinfo";
import ProjectList from "./component/ProjectList";
import NewProject from "./component/NewProject";
import TodoList from "./component/TodoList";

import "./App.css";
import axios from "axios";

function App() {
  const history = useHistory();
  const [gitLogin, setGitLogin] = useState(false)
  const getAccessToken = async (authorizationCode) => {
    // 받아온 authorization code로 다시 OAuth App에 요청해서 access token을 받을 수 있습니다.
    // access token은 보안 유지가 필요하기 때문에 클라이언트에서 직접 OAuth App에 요청을 하는 방법은 보안에 취약할 수 있습니다.
    // authorization code를 서버로 보내주고 서버에서 access token 요청을 하는 것이 적절합니다.
    // TODO: 서버의 /callback 엔드포인트로 authorization code를 보내주고 access token을 받아옵니다.
    // access token을 받아온 후
    //  - 로그인 상태를 true로 변경하고,
    //  - state에 access token을 저장하세요
    await axios.post('https://localhost:4001/user/callback',
    {
      authorizationCode: authorizationCode
    })
    .then((res=>{
      const accessToken=res.data.accessToken;
      axios.get('https://api.github.com/user',
      {
        headers:{
          authorization: `token ${accessToken}`
        },
        withCredentials:false
      })
      .then(res=>{
        axios.post("https://localhost:4001/user/githubLogin",{
          data:res.data
        })
        .then(result=>{
          window.sessionStorage.username=result.data.userinfo.username;
          window.sessionStorage.profile=result.data.userinfo.profile;
          window.sessionStorage.email=result.data.userinfo.email;
          window.sessionStorage.accessToken=result.data.accessToken;
          window.sessionStorage.isLogin=true;
          setGitLogin(!gitLogin);
          history.push("/");
        })
      })
    }))
  }
  useEffect(()=>{
    const url = new URL(window.location.href)
    const authorizationCode = url.searchParams.get('code')
    if (authorizationCode) {
      // authorization server로부터 클라이언트로 리디렉션된 경우, authorization code가 함께 전달됩니다.
      // ex) http://localhost:3000/?code=5e52fb85d6a1ed46a51f
      getAccessToken(authorizationCode)
    }
  },[])
  return (
    <div className="App">
      <h1>hello world</h1>
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
