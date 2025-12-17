import { HashRouter, Route } from '@solidjs/router'
import { Component } from 'solid-js'
import HomePage from './pages/home/HomePage';

const App: Component = () => {
  return (
    <HashRouter>
      <Route path="/" component={HomePage} />
    </HashRouter>
  )
}

export default App;