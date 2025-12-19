import { onMount, onCleanup } from 'solid-js'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

type NotionEditorProps = {
  value?: object
  onChange?: (json: object) => void
}

export function TextEditor(props: NotionEditorProps) {
  let el!: HTMLDivElement
  let editor: Editor

  onMount(() => {
    editor = new Editor({
      element: el,
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: 'Comece a escrever...'
        })
      ],
      content: props.value ?? '',
      onUpdate: ({ editor }) => {
        props.onChange?.(editor.getJSON())
      }
    })
  })

  onCleanup(() => {
    editor?.destroy()
  })

  return (
    <div>
      <p> Aqui: </p>

      <div
        ref={el}
        class="prose max-w-none outline-none hover:border"
      />
    </div>
  )
}
