import { HashRouter, Route } from '@solidjs/router'
import { Component } from 'solid-js'
import HomePage from './pages/home/HomePage';
import TaskPage from './pages/task/TaskPage';

const App: Component = () => {
  return (
    <HashRouter>
      <Route path="/" component={HomePage} />
      <Route path="/task/:id" component={TaskPage} />
    </HashRouter>
  )
}

export default App;