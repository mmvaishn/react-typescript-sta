import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages'
import GlobalTemplate from './GlobalTemplate'
import DigitalContentManager from './DigitalContentManager'
import Collaborate from './Collaborate'
import Generate from './Generate'
import Integrate from './Integrate'
import AdminSettings from './AdminSettings'
import DesignStudio from './DesignStudio'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Router>
      <div className="flex min-h-screen bg-background">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 lg:ml-64">
          <div className="p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/global-template" element={<GlobalTemplate />} />
              <Route path="/digital-content-manager" element={<DigitalContentManager />} />
              <Route path="/collaborate" element={<Collaborate />} />
              <Route path="/generate" element={<Generate />} />
              <Route path="/integrate" element={<Integrate />} />
              <Route path="/admin-settings" element={<AdminSettings />} />
              <Route path="/design-studio" element={<DesignStudio />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App