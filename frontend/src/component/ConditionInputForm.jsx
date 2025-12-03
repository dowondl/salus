import React, { useState } from 'react';
import './ConditionInputForm.css'; 

function ConditionInputForm() {
  const [formData, setFormData] = useState({
    weight: '',
    steps: '',
    sleepHours: '',
    sleepMinutes: '',
    isExercising: null, // true: 운동함, false: 운동안함, null: 선택 안 함
    exerciseMinutes: '',
    exerciseType: '', // none, 걷기, 달리기, 요가, 유산소, 근력, 스트레칭 중 하나
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleExerciseToggle = (isExercising) => {
    setFormData(prevData => ({
      ...prevData,
      isExercising,
      
      exerciseMinutes: isExercising ? prevData.exerciseMinutes : '',
      exerciseType: isExercising ? prevData.exerciseType : 'none',
    }));
  };

  const handleExerciseTypeChange = (type) => {
    setFormData(prevData => ({
      ...prevData,
      exerciseType: type,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('폼 데이터 전송:', formData); //데이터 출력 어케하징,,
  };

  const exerciseTypes = ['걷기', '달리기', '요가', '유산소', '근력', '스트레칭'];

  return (
    <div className="main-container">
      <header className="header">
        <div className="logo">Salus</div>
        <div className="icons">
          <span role="img" aria-label="notification">🔔</span>
          <span role="img" aria-label="profile">👤</span>
        </div>
      </header>
      
      <form onSubmit={handleSubmit} className="condition-form">
        <h1>오늘의 컨디션을 입력해주세요!</h1>
        
        <div className="form-group">
          <label htmlFor="weight">몸무게</label>
          <div className="input-group">
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              min="0"
            />
            <span className="unit">Kg</span>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="steps">걸음 수</label>
          <div className="input-group">
            <input
              type="number"
              id="steps"
              name="steps"
              value={formData.steps}
              onChange={handleInputChange}
              min="0"
            />
            <span className="unit">보</span>
          </div>
        </div>

        <div className="form-group">
          <label>수면 시간</label>
          <div className="input-group sleep-time">
            <input
              type="number"
              name="sleepHours"
              value={formData.sleepHours}
              onChange={handleInputChange}
              min="0"
            />
            <span className="unit">시간</span>
            <input
              type="number"
              name="sleepMinutes"
              value={formData.sleepMinutes}
              onChange={handleInputChange}
              min="0"
            />
            <span className="unit">분</span>
          </div>
        </div>
        
        <div className="form-group">
          <label>운동 여부</label>
          <div className="radio-group">
            <button
              type="button"
              className={`toggle-button ${formData.isExercising === true ? 'active' : ''}`}
              onClick={() => handleExerciseToggle(true)}
            >
              <span className="check-icon">✅</span> 운동함
            </button>
            <button
              type="button"
              className={`toggle-button ${formData.isExercising === false ? 'active-disabled' : ''}`}
              onClick={() => handleExerciseToggle(false)}
            >
              <span className="cross-icon">❌</span> 운동 안 함
            </button>
            
            {formData.isExercising === true && (
              <div className="exercise-time-input">
                <input
                  type="number"
                  name="exerciseMinutes"
                  value={formData.exerciseMinutes}
                  onChange={handleInputChange}
                  min="0"
                />
                <span className="unit">분</span>
              </div>
            )}
          </div>
        </div>

        <div className="form-group exercise-type-group">
          <label>운동</label>
          <div className="exercise-buttons-row">
            <button
              type="button"
              className={`type-button ${formData.exerciseType === 'none' ? 'selected' : ''}`}
              onClick={() => handleExerciseTypeChange('none')}
            >
              none
            </button>
            {exerciseTypes.slice(0, 3).map(type => (
              <button
                key={type}
                type="button"
                className={`type-button ${formData.exerciseType === type ? 'selected' : ''}`}
                onClick={() => handleExerciseTypeChange(type)}
                disabled={formData.isExercising === false}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="exercise-buttons-row">
            {exerciseTypes.slice(3).map(type => (
              <button
                key={type}
                type="button"
                className={`type-button ${formData.exerciseType === type ? 'selected' : ''}`}
                onClick={() => handleExerciseTypeChange(type)}
                disabled={formData.isExercising === false}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        
        <button type="submit" className="submit-button">
          저장하기
        </button>
      </form>
    </div>
  );
}

export default ConditionInputForm;