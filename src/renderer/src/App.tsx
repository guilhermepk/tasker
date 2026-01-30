import { HashRouter, Routes, Route } from 'react-router-dom';
import { routes } from './common/routes';
import HomeLayout from './pages/home/HomeLayout';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path={routes.homePage.path} element={<routes.homePage.element />} />
          <Route path={routes.taskPage.path(':id')} element={<routes.taskPage.element />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}