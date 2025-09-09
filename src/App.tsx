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
  AskBenny,
  Lookups
} from '@/components/pages/PlaceholderPages'
import { DigitalContentManager } from './components/pages/DigitalContentManager'
import { MedicareEOCMasterList } from './components/pages/MedicareEOCMasterList'
import { DCMEditPage } from './components/pages/DCMEditPage'
import { RuleData } from '@/lib/types'

function App() {
  const [currentPage, setCurrentPage] = useKV('sda-current-page', 'dashboard')
  const [isCollapsed, setIsCollapsed] = useKV('sda-sidebar-collapsed', false)
  const [editingRule, setEditingRule] = useKV<RuleData | null>('dcm-editing-rule', null)
  const [rules, setRules] = useKV<RuleData[]>('rule-data', [])

  const handleRuleCreate = (newRule: RuleData) => {
    setRules((current: RuleData[]) => {
      if (!Array.isArray(current)) {
        return [newRule];
      }
      return [newRule, ...current];
    });
  };

  const handleRuleUpdate = (updatedRule: RuleData) => {
    setRules((current: RuleData[]) => {
      if (!Array.isArray(current)) {
        return [updatedRule];
      }
      return current.map(rule => 
        rule.id === updatedRule.id ? updatedRule : rule
      );
    });
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />
      case 'global-template':
        return <MedicareEOCMasterList onNavigate={setCurrentPage} />
      case 'collaborate':
        return <Collaborate />
        case 'masterlist':
        return <MasterList />
      case 'lookups':
        return <Lookups />
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
        return <DigitalContentManager 
          onNavigate={setCurrentPage}
          onEditRule={(rule) => {
            setEditingRule(rule)
            setCurrentPage('edit-rule')
          }}
        />
      case 'create-rule':
        return <DCMEditPage 
          rule={null}
          onNavigate={setCurrentPage}
          onSave={(rule) => {
            handleRuleCreate(rule);
            setCurrentPage('dcm');
          }}
          mode="create"
        />
      case 'edit-rule':
        return <DCMEditPage 
          rule={editingRule}
          onNavigate={setCurrentPage}
          onSave={(rule) => {
            handleRuleUpdate(rule);
            setCurrentPage('dcm');
          }}
          mode="edit"
        />
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