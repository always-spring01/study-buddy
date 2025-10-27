# 🚀 Study Buddy: AI 학습 노트 퀴즈 생성기

## 1. 프로젝트 소개

React와 Firebase를 기반으로 구현한 개인화 학습 노트 웹 애플리케이션입니다.

사용자가 마크다운(Markdown)으로 학습 노트를 작성, 저장, 관리할 수 있습니다. 핵심 기능은 로컬 AI(LMStudio) 서버와 연동하여, 저장된 노트 본문을 기반으로 AI가 실시간으로 복습 퀴즈를 생성해 주는 것입니다.

모든 페이지는 Tailwind CSS와 'IBM Plex Sans KR' 폰트를 적용하여 반응형 UI로 구현되었습니다.

## 2. 구현한 기능

### 🧑‍💻 인증 (Firebase Auth)

* 이메일/비밀번호 기반 회원가입 및 로그인 기능
* 로그인 상태에 따른 헤더 UI 동적 변경 (환영 메시지 / 로그인 버튼)
* 로그아웃 기능
* 인증 기반 라우트 접근 제어 (보호된 경로)

### 📚 노트 관리 (Firestore CRUD)

* **데이터 분리**: `users/{userId}/notes` 경로를 사용해 사용자별 노트 데이터 완벽 분리
* **생성(C)**: TUI 에디터로 '제목'과 '마크다운 내용'을 입력받아 새 노트 생성
* **읽기(R)**: 본인 노트 목록 대시보드 조회 및 상세 페이지 뷰어(TUI Viewer) 렌더링
* **수정(U)**: 상세 페이지에서 노트의 '제목' 및 '본문' 수정
* **삭제(D)**: 노트 삭제 기능 (삭제 확인창 포함)

### 🤖 AI 퀴즈 생성 (LMStudio 연동)

* **로컬 서버 연동**: LMStudio(`localhost:1234`)와 `axios` 통신
* **CORS 해결**: Vite 프록시(proxy) 설정을 통한 CORS 이슈 해결
* **옵션 선택**: 퀴즈 개수(1, 3, 5개) 선택 기능
* **JSON 파싱**: AI 응답(Text)에서 퀴즈 JSON 데이터만 추출 및 렌더링

## 3. 실행 방법

### 1단계: 프로젝트 클론 및 설치

```bash
git clone [https://github.com/always-spring01/study-buddy.git](https://github.com/always-spring01/study-buddy.git)
cd study-buddy
npm install
```

### 2단계: Firebase 설정
1. Firebase 콘솔에서 새 프로젝트를 생성합니다.
2. Authentication: `시작하기` > '이메일/비밀번호' 제공업체를 활성화합니다.
3. Firestore Database: `데이터베이스 만들기` > '테스트 모드'로 Firestore를 생성합니다. (보안 규칙은 4단계 참고)
4. 프로젝트 설정 > 내 앱 > 웹 앱(`</>`)을 등록하고 `firebaseConfig` 객체를 복사합니다.

### 3단계: `.env` 파일 생성
프로젝트 최상위 폴더에 `.env` 파일을 생성하고, 2단계에서 복사한 `firebaseConfig` 키를 VITE_ 접두사를 붙여 입력합니다.
```
VITE_FIREDOG_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

### 4단계: LMStudio 서버 실행
AI 퀴즈 기능을 사용하려면 로컬 AI 서버가 필요합니다.
1. LMStudio를 공식 홈페이지에서 다운로드 후 실행합니다.
2. 앱에서 사용할 LLM 모델을 검색하고 다운로드합니다. (예: Llama 3, Qwen 등)
3. 다운로드한 모델을 로드합니다.
4. Local Server 탭으로 이동하여 Start Server를 클릭합니다.

### 5단계: 프로젝트 실행
```Bash
npm run dev
```

## 4. 사용한 기술 스택
- **Frontend**: React, Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS, Google Fonts (IBM Plex Sans KR)
- **Backend** (BaaS): Firebase Authentication, Firebase Firestore
- **AI (Local)**: LMStudio (Local LLM Server)
- **Editor**: Toast UI Editor (React)
- **API Client**: Axios

## 5. 기타 참고사항
- AI 퀴즈 생성 기능은 사용자의 로컬 PC에서 **LMStudio가 실행 중이고**, **모델이 로드된** 상태여야 정상적으로 작동합니다.
- LMStudio 서버가 꺼져있을 경우, 퀴즈 생성 시 브라우저 콘솔에 404 또는 500대 오류가 발생할 수 있습니다.
- `src/api/openAiApi.js` 파일의 `model` 변수 값은, LMStudio에 로드한 모델의 식별자(Identifier)와 일치시켜야 합니다.

## 6. 시연 화면
### 1. 로그인 페이지
<img width="2879" height="1452" alt="image" src="https://github.com/user-attachments/assets/062aff7a-e531-4994-8274-703aff11339c" />

### 2. 회원가입 페이지
<img width="2879" height="1459" alt="image" src="https://github.com/user-attachments/assets/132947c1-fee3-44d1-b4ef-acc985a81cc4" />

### 3. 대시보드 페이지
<img width="2879" height="1455" alt="image" src="https://github.com/user-attachments/assets/4fd43d75-dc91-4ab2-9c66-e0d090fb8701" />

### 4. 상세보기 & AI 문제 페이지
<img width="2879" height="1449" alt="image" src="https://github.com/user-attachments/assets/1908dab6-fdee-421b-abc4-195df51c8190" />


