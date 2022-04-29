import "./App.css";
import { Routes, Route } from "react-router-dom";
import About from "./Components/About";
import Login from "./Components/login";
import ResponsiveAppBar from "./Components/Appbar";
import Upload from "./Components/upload";
import Trade from "./Components/Home";

function App() {
  return (
    <div className="App">
      <ResponsiveAppBar />
      <br />
      <Routes>
        <Route path="/" element={<Trade />} />
        <Route path="/about" element={<About />} />
        <Route path="/upload" element={<Login />} />
        <Route path="/faq" element={<About />} />
        <Route path="/login" element={<Upload/>}/>
      </Routes>
    </div>
  );
}

export default App;
