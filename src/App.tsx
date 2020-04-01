import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import 'uikit/dist/css/uikit.min.css';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

import { Router, Switch, Route, BrowserRouter, Link, NavLink } from 'react-router-dom';
import Demons from './Demons';
import MakeSuggestion from './MakeSuggestion';
import NewOne from './NewOne';
import { firebaseConfig, Initialize } from './firebase';
import firebase from 'firebase';
import { Login } from './Login';
import { PrivateRoute, PublicRoute } from './PrivateRoute';
import { Demon } from './Demon';
import { Author } from './Auther';
import { getUserData } from './utils';

//@ts-ignore
UIkit.use(Icons);

Initialize();

function App() {

  const [authed, setAuthed] = useState(true)

  const [user, setUser] = useState(null);

  async function checkLogin() {
    firebase.auth().onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        setAuthed(true);
        setUser(getUserData() as any);
      } else {
        setAuthed(false);
      }
    })
  }

  async function Logout(e) {
    e.preventDefault();

    await firebase.auth().signOut()

    window.location.reload();
  }

  useEffect(() => {
    checkLogin();
    return () => {

    }
  }, [])

  return (
    <div className="App uk-container" style={{ backgroundColor: '#fcfcfc' }}>
      <BrowserRouter>
        <nav
          style={{
            position: "fixed",
            width: '100%',
            display: authed ? 'flex' : 'none',
            background: '#fcfcfc',
            zIndex: 101010101,
            maxWidth: '1200px'
          }}
          className="uk-navbar-container uk-navbar-transparent" uk-navbar="true">
          <div className="uk-navbar-left">
            <ul className="uk-navbar-nav">
              <li>
                <NavLink activeClassName="uk-active" to="/">
                  Home
              </NavLink>
              </li>
              <li>
                <NavLink activeClassName="uk-active" to="/new">
                  Create New
              </NavLink>
              </li>
            </ul>
          </div>
          <div className="uk-navbar-right">
            <ul className="uk-navbar-nav">
              <li style={{ display: 'flex', alignItems: 'center' }}>
                {
                  user ? <Author onlyPhoto={true} author={user as any}></Author> : null
                }
                <a onClick={Logout} href="#"> Logout</a>
              </li>
            </ul>
          </div>
        </nav>

        <div style={{ paddingTop: 90, paddingBottom: 90 }}>
          <Switch>

            <PrivateRoute authed={authed} path="/new" component={NewOne}></PrivateRoute>

            <PrivateRoute authed={authed} path="/make" component={MakeSuggestion}></PrivateRoute>
            <PublicRoute path="/login" component={Login} authed={authed} ></PublicRoute>

            <PrivateRoute authed={authed} exact path="/" component={Demons}></PrivateRoute>
            <PrivateRoute authed={authed} path="/demons/:id" component={Demon}></PrivateRoute>

          </Switch>
        </div>
      </BrowserRouter>
    </div >
  );
}

export default App;
