import { Card } from '../../../components/Card'

interface Props {
  completed: number
  total: number
}

export function TaskStats(props: Props) {
  const progress = () =>
    props.total > 0
      ? Math.round((props.completed / props.total) * 100)
      : 0

  return (
    <Card class="mb-6 p-6 bg-slate-800/50 backdrop-blur-sm shadow-lg border border-slate-700/50 rounded-[5px]">
      <div class="flex justify-between items-center">
        <div>
          <p class="text-sm text-gray-400 mb-1">Progresso</p>
          <p class="text-2xl">
            <span class="text-indigo-400">{props.completed}</span>
            <span class="text-gray-500 text-lg"> de {props.total}</span>
          </p>
        </div>

        <div class="w-20 h-20 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
          <span class="text-white text-xl">{progress()}%</span>
        </div>
      </div>

      <div class="mt-4 w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
        <div
          class="h-full bg-linear-to-r from-indigo-500 to-purple-500 transition-all duration-500"
          style={{ width: `${progress()}%` }}
        />
      </div>
    </Card>
  )
}
