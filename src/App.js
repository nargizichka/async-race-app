import "./App.css";
import Home from "./components/home";
import Winners from "./components/winners";
import { Routes, Route } from "react-router-dom";
  
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} exact />
        <Route path="/winners" element={<Winners />}  />
      </Routes>
    </div>
  );
}
export default App;
