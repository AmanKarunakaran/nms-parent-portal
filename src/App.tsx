import { PortalHeader } from './components/PortalHeader'
import { TabBar } from './components/TabBar'
import { star } from './data/star'
import { useHashRoute } from './lib/useHashRoute'
import { tabs } from './tabs'

export default function App() {
  const activeId = useHashRoute(tabs.map((tab) => tab.id))
  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0]

  return (
    <>
      <PortalHeader starName={star.name} />
      <div className="layout">
        <TabBar tabs={tabs} activeId={activeTab.id} />
        <main className="page">
          <activeTab.Component />
        </main>
      </div>
    </>
  )
}
