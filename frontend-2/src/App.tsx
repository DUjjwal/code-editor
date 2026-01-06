import './App.css'
import {Route, Routes, BrowserRouter} from "react-router-dom"
import { Dashboard } from './components/Dashboard'
import { Home } from './components/Home'
import { ToastContainer, Bounce } from 'react-toastify'

function App() {
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/dashboard" element={<Dashboard/>}></Route>
        </Routes>
        
      
      </BrowserRouter>
      <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Bounce}
      />
      
    </>
  )
}



export default App
