import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { addNote, getNotes } from '../../api/firebaseApi';
import { useAuth } from '../../context/AuthContext';

function Dashboard() {
  const editorRef = useRef(null);
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');

  useEffect(() => {
    console.log("Current user:", currentUser);
    if (currentUser) {
      const fetchNotes = async () => {
        const notesData = await getNotes(currentUser.uid);
        console.log("Fetched notes:", notesData);
        setNotes(notesData);
      };
      fetchNotes();
    } else {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleSave = async () => {
    if (!currentUser) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    if (!title.trim()) {
      alert('제목을 입력하세요.');
      return;
    }

    const content = editorRef.current.getInstance().getMarkdown();
    if (!content.trim()) {
      alert('내용을 입력하세요.');
      return;
    }
    
    const newNoteId = await addNote(currentUser.uid, title, content);
    
    if (newNoteId) {
      alert('노트가 성공적으로 저장되었습니다!');
      setTitle('');
      editorRef.current.getInstance().setMarkdown('');
      const notesData = await getNotes(currentUser.uid);
      setNotes(notesData);
    } else {
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  if (!currentUser) {
    return <div>로그인 페이지로 이동 중...</div>;
  }

  return (
    // ... (기존 return JSX 코드와 동일) ...
    <div>
      <div>
        <h3>내 노트 목록</h3>
        <ul>
          {notes.map((note) => (
            <li key={note.id}>
              <Link to={`/note/${note.id}`}>{note.title} (ID: {note.id})</Link>
            </li>
          ))}
        </ul>
      </div>
      <hr />
      <div>
        <h2>새 노트 작성</h2>
        <div style={{ margin: '10px 0' }}>
          <input 
            type="text" 
            placeholder="새 노트 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button onClick={handleSave}>저장하기</button>
        <Editor
          ref={editorRef}
          initialValue="여기에 마크다운을 입력하세요..."
          previewStyle="vertical"
          height="600px"
          initialEditType="markdown"
          useCommandShortcut={true}
        />
      </div>
    </div>
  );
}

export default Dashboard;