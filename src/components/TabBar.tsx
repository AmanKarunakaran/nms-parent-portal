import type { Tab } from '../tabs'
import './TabBar.css'

type TabBarProps = {
  tabs: readonly Tab[]
  activeId: string
  onSelect: (id: string) => void
}

export function TabBar({ tabs, activeId, onSelect }: TabBarProps) {
  return (
    <nav className="tab-bar" aria-label="Portal sections">
      <div className="tab-bar__inner" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={tab.id === activeId}
            aria-controls={`panel-${tab.id}`}
            className="tab-bar__tab"
            onClick={() => onSelect(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
