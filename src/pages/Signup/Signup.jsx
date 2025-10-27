import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../../api/authApi';

const signupStyles = {
  display: 'flex',
  flexDirection: 'column',
  width: '300px',
  margin: '50px auto',
  gap: '10px',
};

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('이메일과 비밀번호를 모두 입력하세요.');
      return;
    }

    const user = await signup(email, password);

    if (user) {
      alert('회원가입 성공! 로그인 페이지로 이동합니다.');
      navigate('/login');
    } else {
      alert('회원가입 실패. (Firebase 오류: 이미 사용 중인 이메일이거나 비밀번호가 6자리 미만일 수 있습니다.)');
    }
  };

  return (
    <div style={signupStyles}>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호 (6자리 이상)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">회원가입</button>
      </form>
      <p>
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
      </p>
    </div>
  );
}

export default Signup;