import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { logout } from "../../api/authApi";

function Header() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    alert('로그아웃되었습니다.');
    navigate('/login');
  };

  return (
    <header style={{ padding: '10px', background: '#f4f4f4', display: 'flex', justifyContent: 'space-between' }}>
      <h1>
        <Link to="/">Study Buddy</Link>
      </h1>
      <nav>
        {currentUser ? (
          <>
            <span>{currentUser.email}님 환영합니다!</span>
            <button onClick={handleLogout} style={{ marginLeft: '10px' }}>로그아웃</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: '10px' }}>로그인</Link>
            <Link to="/signup">회원가입</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;