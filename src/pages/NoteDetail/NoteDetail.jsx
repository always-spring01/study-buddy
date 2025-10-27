import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getNoteById } from '../../api/firebaseApi';
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

function NoteDetail() {
  const { noteId } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      const noteData = await getNoteById(noteId);
      setNote(noteData);
    };

    if (noteId) {
      fetchNote();
    }
  }, [noteId]);

  if (!note) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h2>{note.title}</h2>
      <Viewer initialValue={note.content} />
    </div>
  );
}

export default NoteDetail;