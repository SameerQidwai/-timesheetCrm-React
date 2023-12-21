import React, { createContext } from 'react';
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom'; // Route Library
import Layout from './components/Basic/Drawer/Sidebar';
import Login from './pages/Login/Login';
import ForgotPassword from './pages/ResetPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';

import './App.css';
import './pages/styles/table.css';
function App() {
  const appRoutes = [
    {
      name: 'Login',
      path: '/login',
      component: <Login />,
    },
    {
      name: 'Forgot Password',
      path: '/forgot-password',
      component: <ForgotPassword />,
    },
    {
      name: 'Login',
      path: '/reset-password/:token',
      component: <ResetPassword />,
    },
  ];
  let routesComponent = appRoutes.map((route, i) => (
    <Route exact path={route.path} key={i}>
      {route.component}
    </Route>
  ));
  return (
    <Router>
      <Switch>
        {routesComponent}
        <Layout />
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

//TODO ATTACHMENT DELETE
