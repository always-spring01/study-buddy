import axios from 'axios';

const API_URL = '/api/v1/chat/completions';

export const generateQuiz = async (noteContent, count = 1) => {
  if (!noteContent) return null;

  const systemPrompt = `당신은 유능한 퀴즈 생성기입니다. 주어진 텍스트 내용을 바탕으로, 사용자가 복습할 수 있도록 객관식 퀴즈 ${count}개를 생성해주세요.
  
  퀴즈는 다음 JSON 형식의 "배열"로만 응답해야 합니다.
  JSON 배열 외에 어떠한 설명이나 서문도 추가하지 마십시오. 오직 JSON 배열만 반환하세요.
[
  {
    "question": "첫 번째 퀴즈 질문",
    "options": ["선택지 1", "선택지 2", "선택지 3", "선택지 4"],
    "answer": "정답 선택지"
  },
  {
    "question": "두 번째 퀴즈 질문",
    "options": ["...", "...", "...", "..."],
    "answer": "..."
  }
]`;

  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'openai/gpt-oss-20b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: noteContent }
        ]
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const rawContent = response.data.choices[0].message.content;
    
    const jsonMatch = rawContent.match(/\[[\s\S]*\]/); 
    
    if (!jsonMatch) {
      throw new Error("AI가 유효한 JSON 퀴즈 배열을 반환하지 않았습니다. 응답: " + rawContent);
    }
    
    const quizDataArray = JSON.parse(jsonMatch[0]);
    return quizDataArray;

  } catch (e) {
    console.error("AI 퀴즈 생성 오류:", e);
    return null;
  }
};