import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getNoteById } from '../../api/firebaseApi';
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { useAuth } from '../../context/AuthContext';
import { generateQuiz } from '../../api/openAiApi';

function NoteDetail() {
    const { noteId } = useParams();
    const [note, setNote] = useState(null);
    const { currentUser } = useAuth();
    const [ quizzes, setQuizzes ] = useState([]);
    const [ loadingQuiz, setLoadingQuiz] = useState(false);
    const [ quizCount, setQuizCount ] = useState(1);
  
    useEffect(() => {
      if (currentUser && noteId) {
        const fetchNote = async () => {
          const noteData = await getNoteById(currentUser.uid, noteId);
          setNote(noteData);
        };
        fetchNote();
      }
    }, [noteId, currentUser]);

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
          <h2>{note.title}</h2>
          <Viewer initialValue={note.content} />
    
          <hr style={{ margin: '20px 0' }} />
    
          <div>
            <h3>AI 복습 퀴즈</h3>
            
            {/* 4. [추가] 퀴즈 개수 선택 UI */}
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
    
            {/* 5. [수정] 퀴즈 배열을 .map()으로 순회하며 렌더링 */}
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