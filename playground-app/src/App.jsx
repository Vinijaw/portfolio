import { Routes, Route } from "react-router-dom";
import PlaygroundSection from "./components/Playground/PlaygroundSection.jsx";
import PlaygroundPage from "./pages/PlaygroundPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PlaygroundSection />} />
      <Route path="/playground" element={<PlaygroundPage />} />
    </Routes>
  );
}
