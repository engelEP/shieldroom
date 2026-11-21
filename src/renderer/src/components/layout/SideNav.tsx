import { MENU_LABEL, NAV_ICON, type NavIconName } from '../../navigation/views'
import { NavIcon } from './NavIcon'
import { NavItemButton } from './NavItemButton'

export interface NavEntry<Id extends string> {
  id: Id
  label: string
  icon: NavIconName
}

export interface SideNavProps<Id extends string> {
  id: string
  items: readonly NavEntry<Id>[]
  activeId: Id
  open: boolean
  onToggle: () => void
  onSelect: (id: Id) => void
}

export function SideNav<Id extends string>({
  id,
  items,
  activeId,
  open,
  onToggle,
  onSelect
}: SideNavProps<Id>): React.JSX.Element {
  const className = open ? 'side-nav is-open' : 'side-nav'

  return (
    <nav id={id} className={className} aria-label={MENU_LABEL.sections}>
      <div className="side-nav-header">
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls={id}
          aria-label={open ? MENU_LABEL.close : MENU_LABEL.open}
          onClick={onToggle}
        >
          <NavIcon name={NAV_ICON.panel} />
          <span className="nav-item-label" aria-hidden="true">
            {MENU_LABEL.title}
          </span>
        </button>
      </div>
      <ul className="side-nav-list">
        {items.map((item) => (
          <li key={item.id}>
            <NavItemButton
              id={item.id}
              label={item.label}
              icon={item.icon}
              active={item.id === activeId}
              onSelect={onSelect}
            />
          </li>
        ))}
      </ul>
    </nav>
  )
}
