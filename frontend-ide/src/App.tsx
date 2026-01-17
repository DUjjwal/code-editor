import { Button } from "@/components/ui/button"
import {BrowserRouter, Routes, Route} from "react-router-dom"
import { Playground } from "./components/Playground"
import { ToastContainer, Bounce } from "react-toastify"

function App() {
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/playground/:id" element={<Playground/>}></Route>

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
