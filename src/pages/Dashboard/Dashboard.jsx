import React from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

function Dashboard() {
  return (
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
}

export default Dashboard;