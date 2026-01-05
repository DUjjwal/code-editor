import {Route, Routes, BrowserRouter} from "react-router-dom"
import {Home} from "./components/Home"
import {Dashboard} from "./components/Dashboard"
import { ToastContainer, Bounce } from "react-toastify"

function App() {

  return (
    <div className="">
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
    </div>

  )
}

export default App
