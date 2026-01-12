import HomePage from '../pages/home/HomePage';
import TaskPage from '@renderer/pages/task/TaskPage';

export const routes = {
  homePage: {
    path: '/',
    element: HomePage
  },
  taskPage: {
    path: (taskId: string) => `/task/${taskId}`,
    element: TaskPage
  }
}