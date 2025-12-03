import React from 'react';
import './Welcome.css';


function Welcome({ userName, onStart }) {
  return (
    <div className="Welcome">
      <h2>반가워요😊 [{userName}]님!</h2>
      <h3>오늘의 컨디션은 어떠신가요?</h3>
      <button className="button" onClick={onStart}>
        오늘의 상태 입력하기
      </button>
    </div>
  );
}

export default Welcome;