import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNoteById, updateNote, deleteNote } from '../../api/firebaseApi';
import { Viewer, Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { useAuth } from '../../context/AuthContext';
import { generateQuiz } from '../../api/openAiApi';

function NoteDetail() {
    const { noteId } = useParams();
    const navigate = useNavigate();
    const [ note, setNote] = useState(null);
    const [ isEditing, setIsEditing ] = useState(false);
    const editorRef = useRef(null);
    const { currentUser } = useAuth();
    const [ quizzes, setQuizzes ] = useState([]);
    const [ loadingQuiz, setLoadingQuiz] = useState(false);
    const [ quizCount, setQuizCount ] = useState(1);
    const [ editTitle, setEditTitle ] = useState('');
  
    useEffect(() => {
      if (currentUser && noteId) {
        const fetchNote = async () => {
          const noteData = await getNoteById(currentUser.uid, noteId);
          setNote(noteData);
          setEditTitle(noteData.title);
        };
        fetchNote();
      }
    }, [noteId, currentUser]);

    const handleUpdate = async () => {
        if (editorRef.current) {
          const newContent = editorRef.current.getInstance().getMarkdown();
          const success = await updateNote(currentUser.uid, noteId, editTitle, newContent);
          if (success) {
            alert('수정 완료!');
            setNote({ ...note, title: editTitle, content: newContent });
            setIsEditing(false);
          } else {
            alert('수정 실패.');
          }
        }
      };

      const handleCancelEdit = () => {
        setIsEditing(false);
        setEditTitle(note.title);
      };

      const handleDelete = async () => {
        if (window.confirm('정말 이 노트를 삭제하시겠습니까?')) {
          const success = await deleteNote(currentUser.uid, noteId);
          if (success) {
            alert('삭제 완료!');
            navigate('/'); // 대시보드(홈)로 이동
          } else {
            alert('삭제 실패.');
          }
        }
      };

    const handleGenerateQuiz = async () => {
        if (!note || !note.content) {
            alert('노트 내용이 없습니다.');
            return;
        }
        setLoadingQuiz(true);
        setQuizzes([]);

        const quizDataArray = await generateQuiz(note.content, quizCount);
        if (quizDataArray && quizDataArray.length > 0) {
            setQuizzes(quizDataArray);
        }else {
            alert('퀴즈 생성에 실패하였습니다.')
        }
        setLoadingQuiz(false);
    }
  
    if (!currentUser) {
      return <div>로그인이 필요합니다.</div>;
    }
    
    if (!note) {
      return <div>로딩 중...</div>;
    }
  
    return (
        <div>
          <div style={{ float: 'right', margin: '10px' }}>
            {isEditing ? (
              <>
                <button onClick={handleUpdate} style={{ marginRight: '5px' }}>저장</button>
                <button onClick={handleCancelEdit}>취소</button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)} style={{ marginRight: '5px' }}>수정</button>
                <button onClick={handleDelete}>삭제</button>
              </>
            )}
          </div>
    
          {isEditing ? (
            <input 
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              style={{ fontSize: '2em', fontWeight: 'bold', margin: '10px 0', width: '100%' }}
            />
          ) : (
            <h2>{note.title}</h2>
          )}
          
          {isEditing ? (
            <Editor
              ref={editorRef}
              initialValue={note.content}
              previewStyle="vertical"
              height="600px"
              initialEditType="markdown"
            />
          ) : (
            <Viewer initialValue={note.content} />
          )}
    
          <hr style={{ margin: '20px 0' }} />
          
          <div>
            <h3>AI 복습 퀴즈</h3>
            
            <label htmlFor="quiz-count">퀴즈 개수 선택: </label>
            <select 
              id="quiz-count"
              value={quizCount} 
              onChange={(e) => setQuizCount(Number(e.target.value))}
              style={{ marginRight: '10px' }}
            >
              <option value={1}>1개</option>
              <option value={3}>3개</option>
              <option value={5}>5개</option>
            </select>
            
            <button onClick={handleGenerateQuiz} disabled={loadingQuiz}>
              {loadingQuiz ? '퀴즈 생성 중...' : `퀴즈 ${quizCount}개 생성하기`}
            </button>
    
            {quizzes.length > 0 && (
              <div style={{ marginTop: '15px' }}>
                {quizzes.map((quiz, index) => (
                  <div key={index} style={{ background: '#f9f9f9', padding: '15px', marginTop: '10px' }}>
                    <h4>Q {index + 1}. {quiz.question}</h4>
                    <ul>
                      {quiz.options.map((option, optIndex) => (
                        <li key={optIndex}>{option}</li>
                      ))}
                    </ul>
                    <p><strong>정답:</strong> {quiz.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
}

export default NoteDetail;