import { FormEvent, useRef, FocusEvent as ReactFocusEvent } from 'react'
import { Plus } from 'lucide-react'
import { Input } from '../../../components/Input'
import { Button } from '../../../components/Button'

interface Props {
  value: string
  onChange: (v: string) => void
  onSubmit: (e: FormEvent) => void
  onBlur?: () => void
  autoFocus?: boolean
}

export function TaskForm(props: Props) {
  const formRef = useRef<HTMLFormElement>(null)

  const handleFocusOut = (e: ReactFocusEvent<HTMLFormElement>) => {
    if (props.onBlur && formRef.current && !formRef.current.contains(e.relatedTarget as Node)) {
      props.onBlur()
    }
  }

  return (
    <div className="p-6">
      <form
        ref={formRef}
        onSubmit={props.onSubmit}
        onBlur={handleFocusOut}
        className="flex gap-3"
      >
        <Input
          autoFocus={props.autoFocus}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder="Adicionar nova tarefa..."
          className={`
        `}
        />
        <Button type="submit" className="h-12 px-6 cursor-pointer hover:bg-purple-500">
          <Plus className="w-5 h-5 mr-2" />
          Adicionar
        </Button>
      </form>
    </div>
  );
}
