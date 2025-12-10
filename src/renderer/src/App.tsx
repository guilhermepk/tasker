import { Router, Route } from '@solidjs/router'
import { Component } from 'solid-js'
import HomePage from './pages/HomePage';

const App: Component = () => {
  return (
    <Router>
      <Route path="/" component={HomePage} />
    </Router>
  )
}

export default App;