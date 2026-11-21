import type { ComponentType } from 'react'
import { ShieldingView } from '../views/ShieldingView'

export const VIEW_ID = {
  shielding: 'shielding'
} as const

export type ViewId = (typeof VIEW_ID)[keyof typeof VIEW_ID]

export const NAV_ICON = {
  shielding: 'shield',
  panel: 'panel'
} as const

export type NavIconName = (typeof NAV_ICON)[keyof typeof NAV_ICON]

export const NAV_ITEMS = [
  { id: VIEW_ID.shielding, label: 'Shielding', icon: NAV_ICON.shielding }
] as const

export const DOM_ID = {
  sideNav: 'side-nav'
} as const

export const MENU_LABEL = {
  title: 'Menu',
  open: 'Open menu',
  close: 'Close menu',
  sections: 'Sections'
} as const

export const VIEWS: Record<ViewId, ComponentType> = {
  [VIEW_ID.shielding]: ShieldingView
}
