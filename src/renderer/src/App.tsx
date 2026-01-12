import { HashRouter, Routes, Route } from 'react-router-dom';
import { routes } from './common/routes';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path={routes.homePage.path} element={<routes.homePage.element />} />
        <Route path={routes.taskPage.path(':id')} element={<routes.taskPage.element />} />
      </Routes>
    </HashRouter>
  )
}