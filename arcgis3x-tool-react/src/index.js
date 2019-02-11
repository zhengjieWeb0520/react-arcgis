import React from 'react'
import ReactDOM from 'react-dom'
//react-router
import { HashRouter, Route, Switch } from 'react-router-dom'
//redux
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
//异步中间件
import thunk from 'redux-thunk'

import './index.css'
import * as serviceWorker from './serviceWorker'
import reducers from './reducers'
//加载组件
import Main from './component/main'
import asyncComponent from './asyncComponent'

const asyncMain = asyncComponent(()=>{return import('./component/main')})
export const store = createStore(reducers, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : fn => fn
))

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <div id = "container">
        <Switch>
          <Route path='/index' component ={asyncMain}></Route>
        </Switch>
      </div>
    </HashRouter>
  </Provider>, document.getElementById('root'));

serviceWorker.unregister();
