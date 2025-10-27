// [파일 전체를 이 내용으로 교체]

import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { addNote, getNotes } from '../../api/firebaseApi';
import { useAuth } from '../../context/AuthContext';

function Dashboard() {
  const editorRef = useRef(null);
  const [notes, setNotes] = useState([]); // 노트 목록
  const [title, setTitle] = useState(''); // 새 노트 제목
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // 저장 로딩 상태

  // 1. [로직] 로그인 상태 확인 및 노트 불러오기 (기존과 동일)
  useEffect(() => {
    if (currentUser) {
      const fetchNotes = async () => {
        const notesData = await getNotes(currentUser.uid);
        setNotes(notesData);
      };
      fetchNotes();
    } else {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // 2. [로직] 저장 핸들러 (기존과 동일)
  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const content = editorRef.current.getInstance().getMarkdown();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력하세요.');
      return;
    }
    
    setLoading(true);
    const newNoteId = await addNote(currentUser.uid, title, content);
    setLoading(false);

    if (newNoteId) {
      alert('노트가 성공적으로 저장되었습니다!');
      setTitle('');
      editorRef.current.getInstance().setMarkdown('');
      const notesData = await getNotes(currentUser.uid); // 목록 새로고침
      setNotes(notesData);
    } else {
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  // 3. [UI] HTML 초안의 2단 레이아웃 적용
  return (
    <main className="max-w-7xl mx-auto p-4 md:p-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* --- 왼쪽 컬럼: 노트 목록 --- */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-6 h-fit">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">내 노트 목록</h2>
          <ul className="space-y-2">
            {notes.length > 0 ? (
              // 4. [로직] 목업 데이터 대신 실제 notes state를 map으로 렌더링
              notes.map((note) => (
                <li key={note.id}>
                  <Link 
                    to={`/note/${note.id}`} 
                    className="block p-3 rounded-md text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                  >
                    {note.title}
                  </Link>
                </li>
              ))
            ) : (
              <p className="text-gray-500">아직 작성한 노트가 없습니다.</p>
            )}
          </ul>
        </div>

        {/* --- 오른쪽 컬럼: 새 노트 작성 --- */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">새 노트 작성</h2>
          <form className="space-y-6" onSubmit={handleSave}>
            
            {/* 제목 입력 */}
            <div className="space-y-2">
              <label htmlFor="title-input" className="sr-only">제목</label>
              <input
                id="title-input"
                type="text"
                placeholder="새 노트 제목을 입력하세요."
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 text-xl font-semibold text-gray-900 border-b-2 border-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* 5. [UI] TUI Editor 컴포넌트 적용 */}
            <div className="space-y-2">
              <label className="sr-only">내용</label>
              <div className="border border-gray-300 rounded-md shadow-sm">
                <Editor
                  ref={editorRef}
                  initialValue=""
                  placeholder="여기에 마크다운을 입력하세요..."
                  previewStyle="vertical" // 요청하신 세로 미리보기
                  height="400px"
                  initialEditType="markdown"
                  useCommandShortcut={true}
                  // 툴바 옵션 (HTML 프리뷰와 유사하게)
                  toolbarItems={[
                    ['heading', 'bold', 'italic', 'strike'],
                    ['hr', 'quote'],
                    ['ul', 'ol', 'task'],
                    ['table', 'link'],
                  ]}
                />
              </div>
            </div>

            {/* 저장 버튼 */}
            <button 
              type="submit" 
              className="w-full px-4 py-2 text-lg font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? '저장 중...' : '저장하기'}
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}

export default Dashboard;
