import { Navigate, Route, Routes } from 'react-router-dom'
import { DesignSystemColorsPage } from './pages/DesignSystemColorsPage'
import { DesignSystemComponentsPage } from './pages/DesignSystemComponentsPage'
import { DesignSystemPage } from './pages/DesignSystemPage'
import { DesignSystemPatternsPage } from './pages/DesignSystemPatternsPage'
import { DesignSystemStudiesPage } from './pages/DesignSystemStudiesPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DesignSystemPage />} />
      <Route path="/components" element={<DesignSystemComponentsPage />} />
      <Route path="/patterns" element={<DesignSystemPatternsPage />} />
      <Route path="/colors" element={<DesignSystemColorsPage />} />
      <Route path="/studies" element={<DesignSystemStudiesPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
