import type { JSX } from 'solid-js'
import { cn } from './utils'

type DivProps = JSX.HTMLAttributes<HTMLDivElement>

export function Card(props: DivProps) {
  return (
    <div
      data-slot="card"
      class={cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border',
        props.class,
      )}
      {...props}
    />
  )
}

export function CardHeader(props: DivProps) {
  return (
    <div
      data-slot="card-header"
      class={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        props.class,
      )}
      {...props}
    />
  )
}

export function CardTitle(props: DivProps) {
  return (
    <h4
      data-slot="card-title"
      class={cn('leading-none', props.class)}
      {...props}
    />
  )
}

export function CardDescription(props: DivProps) {
  return (
    <p
      data-slot="card-description"
      class={cn('text-muted-foreground', props.class)}
      {...props}
    />
  )
}

export function CardAction(props: DivProps) {
  return (
    <div
      data-slot="card-action"
      class={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        props.class,
      )}
      {...props}
    />
  )
}

export function CardContent(props: DivProps) {
  return (
    <div
      data-slot="card-content"
      class={cn('px-6 [&:last-child]:pb-6', props.class)}
      {...props}
    />
  )
}

export function CardFooter(props: DivProps) {
  return (
    <div
      data-slot="card-footer"
      class={cn(
        'flex items-center px-6 pb-6 [.border-t]:pt-6',
        props.class,
      )}
      {...props}
    />
  )
}
