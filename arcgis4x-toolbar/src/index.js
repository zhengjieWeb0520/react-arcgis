import React from 'react';
import ReactDOM from 'react-dom';
import './Reset.css';
import './index.css';
import Main from './component/main';
import { HashRouter, Route, Switch } from 'react-router-dom'
//引入redux
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
//异步中间件
import thunk from 'redux-thunk'
//reducer整合
import reducers from './reducers'
import registerServiceWorker from './registerServiceWorker';

export const store = createStore(reducers, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : fn => fn
))

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <div id = "container">
        <Switch>
          <Route path='/' component ={Main}></Route>
        </Switch>
      </div>
    </HashRouter>
  </Provider>
, document.getElementById('root'));
registerServiceWorker();
