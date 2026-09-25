import { useState } from 'react'
import { PortalHeader } from './components/PortalHeader'
import { TabBar } from './components/TabBar'
import { star } from './data/star'
import { tabs } from './tabs'

export default function App() {
  const [activeId, setActiveId] = useState(tabs[0].id)
  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0]

  return (
    <>
      <PortalHeader starName={star.name} />
      <div className="layout">
        <TabBar tabs={tabs} activeId={activeTab.id} onSelect={setActiveId} />
        <main
          className="page"
          role="tabpanel"
          id={`panel-${activeTab.id}`}
          aria-labelledby={`tab-${activeTab.id}`}
        >
          <activeTab.Component />
        </main>
      </div>
    </>
  )
}
