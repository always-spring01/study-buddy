import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { addNote, getNotes } from '../../api/firebaseApi';

function Dashboard() {
  const editorRef = useRef(null);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const notesData = await getNotes();
      setNotes(notesData);
    };
    fetchNotes();
  }, []);

  const handleSave = async () => {
    if (editorRef.current) {
      const content = editorRef.current.getInstance().getMarkdown();
      
      if (!content.trim()) {
        alert('Please enter content.');
        return;
      }
      
      console.log('Saving content:', content);
      
      const newNoteId = await addNote(content);
      if (newNoteId) {
        alert('Note saved successfully!');
        const notesData = await getNotes();
        setNotes(notesData);
      } else {
        alert('Error saving note.');
      }
    }
  };

  return (
    <div>
      <div>
        <h3>My Notes</h3>
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
        <button onClick={handleSave}>저장하기</button>
        <Editor
          ref={editorRef}
        />
      </div>
    </div>
  );
}

export default Dashboard;