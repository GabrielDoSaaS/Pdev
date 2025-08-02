import { BrowserRouter, Routes, Route } from "react-router-dom"
import Register  from "./screens/Register";
import Login from './screens/Login'
import Home from "./screens/Home";
import Plans from "./screens/Plans";

function App() {
  return (
        <BrowserRouter>
            <Routes>
                <Route index path="/" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/Home" element={<Home/>} />
                <Route path="/plans" element={<Plans/> } />
            </Routes>
        </BrowserRouter>
  )
}

export default App;
