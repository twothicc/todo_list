import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import View from './View';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
        <Route exact path = "/Home" component = {Home}/>
        <Route exact path = "/Home/:id" component = {View}/>
        <Route exact path = "/Login" component = {Login}/>
        <Route exact path = "/Signup" component = {Signup}/>
    </Switch>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
