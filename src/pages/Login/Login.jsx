// [파일 전체를 이 내용으로 교체]

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../api/authApi';

// 1. [삭제] './Login.css' import를 삭제합니다.

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('이메일과 비밀번호를 모두 입력하세요.');
      return;
    }
    
    setLoading(true);
    const user = await login(email, password);
    setLoading(false);

    if (user) {
      navigate('/');
    } else {
      alert('로그인 실패. 이메일 또는 비밀번호를 확인하세요.');
    }
  };

  // 2. [수정] JSX를 login-preview.html의 Tailwind 클래스로 교체
  // body 태그 대신 div를 사용하고, font-sans 클래스를 적용합니다.
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Study Buddy 로그인
        </h2>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              이메일
            </label>
            <input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full px-4 py-2 text-lg font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        
        <p className="text-sm text-center text-gray-600">
          계정이 없으신가요? 
          <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
