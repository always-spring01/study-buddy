import React, { useRef } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { addNote } from '../../api/firebaseApi';

function Dashboard() {
  const editorRef = useRef(null);

  const handleSave = async () => {
    if (editorRef.current) {
      const content = editorRef.current.getInstance().getMarkdown();
      
      if (!content.trim()) {
        alert('내용을 입력하세요.');
        return;
      }
      
      console.log('저장할 내용:', content);
      
      const newNoteId = await addNote(content);
      if (newNoteId) {
        alert('노트가 성공적으로 저장되었습니다!');
      } else {
        alert('저장 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div>
      <h2>대시보드 페이지</h2>
      
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
  );
}

export default Dashboard;