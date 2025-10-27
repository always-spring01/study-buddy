// [파일 전체를 이 내용으로 교체]

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../../api/authApi'; // 1. signup 함수 import

// './Signup.css' import는 필요 없습니다. (Tailwind가 전역으로 작동)

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState(''); // 2. 비밀번호 확인 state
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 3. 비밀번호 일치 여부 확인
    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    if (!email || !password) {
      alert('이메일과 비밀번호를 모두 입력하세요.');
      return;
    }
    
    setLoading(true);
    const user = await signup(email, password); // 4. signup API 호출
    setLoading(false);

    if (user) {
      alert('회원가입 성공! 로그인 페이지로 이동합니다.');
      navigate('/login'); // 5. 성공 시 로그인 페이지로 이동
    } else {
      alert('회원가입 실패. (Firebase 오류: 이미 사용 중인 이메일이거나 비밀번호가 6자리 미만일 수 있습니다.)');
    }
  };

  // 6. JSX를 signup-preview.html의 Tailwind 클래스로 교체
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Study Buddy 회원가입
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
              비밀번호 (6자리 이상)
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

          {/* 7. '비밀번호 확인' 필드 */}
          <div className="space-y-2">
            <label htmlFor="password-confirm" className="text-sm font-medium text-gray-700">
              비밀번호 확인
            </label>
            <input
              id="password-confirm"
              type="password"
              placeholder="비밀번호 확인"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full px-4 py-2 text-lg font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>
        
        <p className="text-sm text-center text-gray-600">
          이미 계정이 있으신가요? 
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;

