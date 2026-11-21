import { useState } from 'react'
import { useSidebar } from '../../hooks/useSidebar'
import { DOM_ID, NAV_ITEMS, VIEW_ID, VIEWS } from '../../navigation/views'
import type { ViewId } from '../../navigation/views'
import { Navbar } from './Navbar'
import { SideNav } from './SideNav'

export function AppShell(): React.JSX.Element {
  const [activeView, setActiveView] = useState<ViewId>(VIEW_ID.shielding)
  const { expanded, toggle } = useSidebar()
  const ActiveView = VIEWS[activeView]

  return (
    <div className="app-frame">
      <Navbar />
      <div className="app-body">
        <SideNav
          id={DOM_ID.sideNav}
          items={NAV_ITEMS}
          activeId={activeView}
          open={expanded}
          onToggle={toggle}
          onSelect={setActiveView}
        />
        <div className="app-content">
          <ActiveView />
        </div>
      </div>
    </div>
  )
}
