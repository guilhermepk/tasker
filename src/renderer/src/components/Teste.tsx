import { createMemo } from "solid-js"

interface TesteProps {
  mainColor: string
  text: string
}

export default function Teste({ mainColor, text }: TesteProps) {
  const textColor = createMemo(() => getContrastColor(mainColor))

  function normalizeHex(hex: string) {
    let c = hex.replace("#", "").trim()
    if (c.length === 3) c = c.split("").map(ch => ch + ch).join("")
    return `#${c.toLowerCase()}`
  }

  function getContrastColor(hex: string) {
    const h = normalizeHex(hex)
    const r = parseInt(h.substring(1, 3), 16)
    const g = parseInt(h.substring(3, 5), 16)
    const b = parseInt(h.substring(5, 7), 16)

    const luminance = 0.299 * r + 0.587 * g + 0.114 * b

    return luminance > 125 ? "#000" : "#fff"
  }

  return (
    <div class="flex items-center justify-center gap-4">
      <Tag text={text} bgColor={mainColor} textColor={textColor()} />
    </div>
  )
}

interface TagProps {
  text: string
  bgColor: string
  textColor: string
}

function Tag({ text, bgColor, textColor }: TagProps) {
  return (
    <div
      style={{ "background-color": bgColor, color: textColor }}
      class="rounded-[10px] p-2"
    >
      <p>{text}</p>
    </div>
  )
}
