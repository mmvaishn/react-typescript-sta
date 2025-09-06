import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Navigation } from '@/components/Navigation'
import { Dashboard } from '@/components/pages/Dashboard'
import { 
  MasterList, 
  Collaborate, 
  Generate, 
  Publish, 
  AdminSettings, 
  DesignStudio,
  AskBenny
} from '@/components/pages/PlaceholderPages'
import { DigitalContentManager } from './components/pages/DigitalContentManager'
import { DocuGenPage } from './components/pages/DocuGenPage'

function App() {
  const [currentPage, setCurrentPage] = useKV('sda-current-page', 'dashboard')
  const [isCollapsed, setIsCollapsed] = useKV('sda-sidebar-collapsed', false)

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />
      case 'global-template':
        return <DocuGenPage onNavigate={function (page: string): void {
          throw new Error('Function not implemented.')
        } } />
      case 'master-list':
        return <MasterList />
      case 'collaborate':
        return <Collaborate />
      case 'generate':
        return <Generate />
      case 'publish':
        return <Publish />
      case 'ask-benny':
        return <AskBenny />
      case 'admin-settings':
        return <AdminSettings />
      case 'design-studio':
        return <DesignStudio />
      case 'dcm':
        return <DigitalContentManager onNavigate={function (page: string): void {
          throw new Error('Function not implemented.')
        } } />
      default:
        return <Dashboard onNavigate={setCurrentPage} />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Navigation 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
      <main className="flex-1 overflow-auto">
        {renderCurrentPage()}
      </main>
    </div>
  )
}

export default App