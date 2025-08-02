import { BrowserRouter, Routes, Route } from "react-router-dom"
import Register  from "./screens/Register";
import Login from './screens/Login'

function App() {
  return (
        <BrowserRouter>
            <Routes>
                <Route index path="/" element={<Login/>} />
                <Route  path="/register" element={<Register/>} />
                
                
            </Routes>
        </BrowserRouter>
  )
}

export default App;
