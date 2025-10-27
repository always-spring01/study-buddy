import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../api/authApi';

function Header() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    // Tailwind 스타일이 적용된 헤더
    <header className="bg-white shadow-sm font-sans">
      {/* NoteDetail의 main 태그와 너비/패딩을 맞춥니다. */}
      <div className="mx-auto p-4 md:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* 로고/타이틀 */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              Study Buddy
            </Link>
          </div>

          {/* 인증 상태에 따른 우측 메뉴 */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              // 로그인 상태일 때
              <>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {currentUser.email}님 환영합니다!
                </span>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              // 로그아웃 상태일 때
              <>
                <Link 
                  to="/login" 
                  className="text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  로그인
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

