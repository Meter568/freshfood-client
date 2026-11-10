import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import { UserContextProvider } from './context/UserContextProvider.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider 
      clientId={"1009051467850-0pmtj23mak4mv9e01mntebprfufl1n4m.apps.googleusercontent.com"}
    >
      <BrowserRouter>
        <Provider store={store}>
          <UserContextProvider>
            <App />
          </UserContextProvider>
        </Provider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)
