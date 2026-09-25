import { tabHref } from '../lib/tabHref'
import type { Tab } from '../tabs'
import { ResetDemoButton } from './ResetDemoButton'
import './TabBar.css'

type TabBarProps = {
  tabs: readonly Tab[]
  activeId: string
}

export function TabBar({ tabs, activeId }: TabBarProps) {
  return (
    <nav className="tab-bar" aria-label="Portal sections">
      <div className="tab-bar__inner">
        {tabs.map((tab) => (
          <a
            key={tab.id}
            href={tabHref(tab.id)}
            aria-current={tab.id === activeId ? 'page' : undefined}
            className="tab-bar__tab"
          >
            <span className="tab-bar__label">
              {tab.label}
              {tab.Badge && (
                <span className="tab-bar__badge">
                  <tab.Badge />
                </span>
              )}
            </span>
          </a>
        ))}
        <ResetDemoButton />
      </div>
    </nav>
  )
}
