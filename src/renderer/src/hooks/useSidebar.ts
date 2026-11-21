import { useCallback, useEffect, useState } from 'react'

const SIDEBAR_SHORTCUT = 'b'

export function useSidebar(): {
  expanded: boolean
  toggle: () => void
} {
  const [expanded, setExpanded] = useState(true)

  const toggle = useCallback((): void => {
    setExpanded((value) => !value)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === SIDEBAR_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggle()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [toggle])

  return { expanded, toggle }
}
