import { Accessor } from 'solid-js'
import { Plus } from 'lucide-solid'
import { Card } from '../../../components/Card'
import { Input } from '../../../components/Input'
import { Button } from '../../../components/Button'

interface Props {
  value: Accessor<string>
  onChange: (v: string) => void
  onSubmit: (e: Event) => void
}

export function TaskForm(props: Props) {
  return (
    <Card class="mb-6 p-6 bg-slate-800/50 backdrop-blur-sm shadow-lg border border-slate-700/50">
      <form onSubmit={props.onSubmit} class="flex gap-3">
        <Input
          value={props.value()}
          onInput={e => props.onChange(e.currentTarget.value)}
          placeholder="Adicionar nova tarefa..."
          class="flex-1 h-12"
        />
        <Button type="submit" class="h-12 px-6">
          <Plus class="w-5 h-5 mr-2" />
          Adicionar
        </Button>
      </form>
    </Card>
  )
}
