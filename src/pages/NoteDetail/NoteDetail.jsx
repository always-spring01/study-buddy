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
  const { currentUser } = useAuth();
  
  // 상태(State)
  const [note, setNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [quizCount, setQuizCount] = useState(1);
  
  // Ref
  const editorRef = useRef(null);

  // 이펙트 (데이터 로드)
  useEffect(() => {
    if (currentUser && noteId) {
      const fetchNote = async () => {
        const noteData = await getNoteById(currentUser.uid, noteId);
        if (noteData) {
          setNote(noteData);
          setEditTitle(noteData.title); // 수정용 제목 state 초기화
        } else {
          // 존재하지 않는 노트일 경우
          alert('노트를 찾을 수 없습니다.');
          navigate('/');
        }
      };
      fetchNote();
    }
  }, [noteId, currentUser, navigate]);

  // 핸들러: 노트 수정
  const handleUpdate = async () => {
    if (!editorRef.current) return;
    
    const newContent = editorRef.current.getInstance().getMarkdown();
    if (!editTitle.trim() || !newContent.trim()) {
      alert('제목과 내용을 모두 입력해야 합니다.');
      return;
    }

    const success = await updateNote(currentUser.uid, noteId, editTitle, newContent);
    
    if (success) {
      alert('수정 완료!');
      setNote({ ...note, title: editTitle, content: newContent });
      setIsEditing(false); // 보기 모드로 전환
    } else {
      alert('수정 실패.');
    }
  };

  // 핸들러: 수정 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(note.title); // 원본 제목으로 복구
  };

  // 핸들러: 노트 삭제
  const handleDelete = async () => {
    if (window.confirm('정말 이 노트를 삭제하시겠습니까?')) {
      const success = await deleteNote(currentUser.uid, noteId);
      if (success) {
        alert('삭제 완료!');
        navigate('/'); // 대시보드로 이동
      } else {
        alert('삭제 실패.');
      }
    }
  };

  // 핸들러: AI 퀴즈 생성
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
    } else {
      alert('퀴즈 생성에 실패했습니다.');
    }
    setLoadingQuiz(false);
  };

  // --- 로딩 및 인증 가드 ---
  if (!currentUser) {
    // AuthProvider가 currentUser를 로드하기 전일 수 있으므로 navigate 대신 메시지 표시
    return <div className="p-8 text-center">로그인이 필요합니다.</div>;
  }
  if (!note) {
    return <div className="p-8 text-center">노트 로딩 중...</div>;
  }

  // --- 렌더링 ---
  return (
    // [수정] max-w-7xl 제거, w-full은 기본값이므로 mx-auto로 중앙 정렬
    <main className="mx-auto p-4 md:p-8 font-sans">

      {/* [수정] 5단 그리드 레이아웃 적용 (lg:grid-cols-5) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* --- 카드 1: 노트 내용 (3/5 너비) --- */}
        {/* [수정] lg:col-span-3으로 변경 */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-lg p-6 md:p-8">
          
          {/* 상단: 제목 (또는 수정용 input) + 버튼 */}
          <div className="flex justify-between items-start mb-6">
            {isEditing ? (
              <input 
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-3xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none"
              />
            ) : (
              <h2 className="text-3xl font-bold text-gray-900">
                {note.title}
              </h2>
            )}
            
            <div className="flex-shrink-0 flex space-x-2 ml-4">
              {isEditing ? (
                <>
                  <button 
                    onClick={handleUpdate}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    저장
                  </button>
                  <button 
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    수정
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200"
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 본문: 뷰어 또는 에디터 */}
          {isEditing ? (
            <div className="border border-gray-300 rounded-md shadow-sm">
              <Editor
                ref={editorRef}
                initialValue={note.content}
                previewStyle="vertical"
                height="600px"
                initialEditType="markdown"
                toolbarItems={[
                  ['heading', 'bold', 'italic', 'strike'],
                  ['hr', 'quote'],
                  ['ul', 'ol', 'task'],
                  ['table', 'link'],
                ]}
              />
            </div>
          ) : (
            <div className="prose max-w-none">
              <Viewer initialValue={note.content} />
            </div>
          )}
        </div>

        {/* --- 카드 2: AI 퀴즈 섹션 (2/5 너비) --- */}
        {/* [수정] lg:col-span-2로 변경 */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6 md:p-8 h-fit">
          <h3 className="text-2xl font-bold mb-6 text-gray-900">AI 복습 퀴즈</h3>

          <div className="flex flex-col sm:flex-row items-center sm:space-x-4 mb-6">
            <div className="flex-shrink-0 mb-4 sm:mb-0">
              <label htmlFor="quiz-count" className="text-sm font-medium text-gray-700">퀴즈 개수 선택: </label>
              <select 
                id="quiz-count"
                value={quizCount} 
                onChange={(e) => setQuizCount(Number(e.target.value))}
                className="ml-2 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={1}>1개</option>
                <option value={3}>3개</option>
                <option value={5}>5개</option>
              </select>
            </div>
            <button 
              onClick={handleGenerateQuiz} 
              disabled={loadingQuiz}
              className="w-full sm:w-auto px-6 py-2 text-base font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loadingQuiz ? '퀴즈 생성 중...' : `퀴즈 ${quizCount}개 생성하기`}
            </button>
          </div>

          {/* 퀴즈 결과 렌더링 */}
          <div className="space-y-4">
            {quizzes.length > 0 ? (
              quizzes.map((quiz, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800">Q {index + 1}. {quiz.question}</h4>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                    {quiz.options.map((option, optIndex) => (
                      <li key={optIndex}>{option}</li>
                    ))}
                  </ul>
                  <p className="mt-3">
                    <strong className="text-blue-600">정답:</strong> {quiz.answer}
                  </p>
                </div>
              ))
            ) : (
              !loadingQuiz && <p className="text-gray-500">퀴즈를 생성해 보세요!</p>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}

export default NoteDetail;

