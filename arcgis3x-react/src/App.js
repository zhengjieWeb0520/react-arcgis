import React, { Component } from 'react'
import './App.css'
import './css/base.css'

import Header from './component/Layerout/Header'
import Main from './component/Layerout/Main'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Main />
      </div>
    );
  }
}

export default App;
