import React, { createContext } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom' // Route Library
import Layout from './components/Basic/Drawer/Sidebar'
import Login from './pages/Login/Login'

import './App.css';
import { refreshToken } from './service/constant-Apis';
function App() {
  return (
        <Router>
          <Switch>
            {<Route path="/" exact> 
              <Login />
            </Route>}
            <Layout/>
          </Switch>
        </Router>
    );
  }
  
  export default App;

//   loggedIn()?
//   <Switch>
//     <Route path="/" exact> 
//       <Login />
//     </Route>
//     <Layout/>
//   </Switch>:
//   <Redirect to={{ pathname: '/'}} /> 
// }
