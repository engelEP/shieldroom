import type { NavIconName } from '../../navigation/views'
import { NavIcon } from './NavIcon'

export interface NavItemButtonProps<Id extends string> {
  id: Id
  label: string
  icon: NavIconName
  active: boolean
  onSelect: (id: Id) => void
}

export function NavItemButton<Id extends string>({
  id,
  label,
  icon,
  active,
  onSelect
}: NavItemButtonProps<Id>): React.JSX.Element {
  return (
    <button
      type="button"
      className="nav-item-button"
      aria-current={active ? 'page' : undefined}
      aria-label={label}
      onClick={() => onSelect(id)}
    >
      <NavIcon name={icon} />
      <span className="nav-item-label">{label}</span>
    </button>
  )
}
