import { TaskStats } from './components/TaskStats'
import { TaskList } from './components/TaskList'
import { useHome } from '@renderer/contexts/HomeContext'
import GoogleAuthSection from './sections/GoogleAuthSection';

export default function HomePage() {
  const {
    tasks,
    handleMoveTask,
    calculateCompletedCount,
    fetchTasks
  } = useHome();

  async function handleSyncDatabase() {
    await fetchTasks();
  }

  return (
    <div
      className="min-h-screen w-screen bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 py-12 px-4"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handleMoveTask(null);
      }}
    >

      <div className="max-w-2xl mx-auto">
        <GoogleAuthSection onSyncDatabase={handleSyncDatabase} />

        <TaskStats />

        <TaskList />

        <p className="text-center text-gray-500 text-sm mt-8">
          {tasks.length > 0 &&
            calculateCompletedCount() === tasks.length
            ? '🎉 Parabéns! Todas as tarefas concluídas!'
            : `${tasks.length - calculateCompletedCount()} tarefa(s) pendente(s)`}
        </p>
      </div>
    </div>
  );
}
