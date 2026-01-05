import {Route, Routes, BrowserRouter} from "react-router-dom"
import {Home} from "./components/Home"
import {Dashboard} from "./components/Dashboard"

function App() {

  return (
    <div className="">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/dashboard" element={<Dashboard/>}></Route>
        </Routes>
      
      </BrowserRouter>
    </div>

  )
}

export default App
