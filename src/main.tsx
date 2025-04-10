import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/fonts.css'
import App from './App.tsx'
import '@/i18n/config'

// Import CSS & fonts
import "./index.css";
import "./styles/fonts.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
