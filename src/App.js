import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom' // Route Library

import './App.css';

import Layout from './components/Basic/Drawer/Sidebar'
import Login from './pages/Login/Login'

function App() {
  const login = 'sameer'
  return (
      <Router>
        {
          login !== 'sameer' ?
          <Login />
          :
            <Layout/>
        }
      </Router>
    );
}

export default App;
