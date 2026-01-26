import Card from '@renderer/components/Card'
import { useHome } from '@renderer/contexts/HomeContext'
import { useEffect, useState } from 'react';

interface Props { }

export function TaskStats(_props: Props) {
  const { tasks, calculateCompletedCount } = useHome();
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    setCompleted(calculateCompletedCount());
  }, [tasks]);

  const progress =
    tasks.length > 0
      ? Math.round((completed / tasks.length) * 100)
      : 0

  return (
    <>
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400 mb-1">Progresso</p>
            <p className="text-2xl">
              <span className="text-indigo-400">{completed}</span>
              <span className="text-gray-500 text-lg"> de {tasks.length}</span>
            </p>
          </div>

          <div className="w-20 h-20 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
            <span className="text-white text-xl">{progress}%</span>
          </div>
        </div>

        <div className="mt-4 w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </Card>
    </>
  )
}
