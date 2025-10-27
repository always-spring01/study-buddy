
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/layout/Header";
import Dashboard from "./pages/Dashboard/Dashboard";
import NoteDetail from "./pages/NoteDetail/NoteDetail";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";

function App() {
  const location = useLocation();
  const hideHeaderPaths = ['/login', '/signup'];
  const showHeader = !hideHeaderPaths.includes(location.pathname);

  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      {showHeader && <Header />}

      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/note/:noteId" element={<NoteDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;