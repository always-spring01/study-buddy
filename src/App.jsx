import { Routes, Route } from "react-router-dom";
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

const Dashboard = () => (
  <div>
    <h2>대시보드 페이지</h2>
    <Editor
      initialValue="Toast UI Editor Loaded!"
      previewStyle="vertical"
      height="600px"
      initialEditType="markdown"
      useCommandShortcut={true}
    />
  </div>
);
const NoteDetail = () => <h2>노트 상세 페이지</h2>;

function App() {
  return (
    <div>
      <h1>Study Buddy</h1>
      <nav>
        <a href="/">Dashboard</a> | <a href="/note/1">Note 1</a>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/note/:noteId" element={<NoteDetail />} />
      </Routes>
    </div>
  );
}

export default App;