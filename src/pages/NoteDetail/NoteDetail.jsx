import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getNoteById } from '../../api/firebaseApi';
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { useAuth } from '../../context/AuthContext';

function NoteDetail() {
    const { noteId } = useParams();
    const [note, setNote] = useState(null);
    const { currentUser } = useAuth(); // 2. 현재 유저 정보 가져오기
  
    useEffect(() => {
      // 3. 로그인 상태일 때만 노트를 불러옴
      if (currentUser && noteId) {
        const fetchNote = async () => {
          const noteData = await getNoteById(currentUser.uid, noteId); // 4. uid 전달
          setNote(noteData);
        };
        fetchNote();
      }
    }, [noteId, currentUser]); // 5. currentUser가 바뀔 때마다 실행
  
    if (!currentUser) {
      return <div>로그인이 필요합니다.</div>;
    }
    
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