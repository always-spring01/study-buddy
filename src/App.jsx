
import { Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Dashboard from "./pages/Dashboard/Dashboard";
import NoteDetail from "./pages/NoteDetail/NoteDetail";

function App() {
  return (
    <div>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/note/:noteId" element={<NoteDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;