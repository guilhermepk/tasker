import { FormEvent, useRef, FocusEvent as ReactFocusEvent } from 'react'
import { Plus } from 'lucide-react'
import { Input } from '../../../components/Input'
import { Button } from '../../../components/Button'
import Card from '../../../components/Card'

interface Props {
  value: string
  onChange: (v: string) => void
  onSubmit: (e: FormEvent) => void
  onBlur?: () => void
  autoFocus?: boolean
}

export function TaskForm(props: Props & { noCard?: boolean }) {
  const formRef = useRef<HTMLFormElement>(null)

  const handleFocusOut = (e: ReactFocusEvent<HTMLFormElement>) => {
    if (props.onBlur && formRef.current && !formRef.current.contains(e.relatedTarget as Node)) {
      props.onBlur()
    }
  }

  const content = (
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
          flex-1
          h-12
          active:border-purple-500 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none
          rounded-[10px]
          px-4
          hover:border hover:border-purple-500
        `}
      />
      <Button type="submit" className="h-12 px-6 cursor-pointer hover:bg-purple-500">
        <Plus className="w-5 h-5 mr-2" />
        Adicionar
      </Button>
    </form>
  )

  if (props.noCard) {
    return <div className="p-6">{content}</div>
  }

  return (
    <Card className="mb-6 p-6 bg-slate-800/50 backdrop-blur-sm shadow-lg border border-slate-700/50 rounded-[5px]">
      {content}
    </Card>
  )
}
