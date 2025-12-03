import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/step.css";

function Page2() {
  const navigate = useNavigate();
  const [gender, setGender] = useState("");

  const handleNext = () => {
    if (!gender) {
      alert("성별을 선택해주세요!");
      return;
    }
    navigate("/page3");
  };

  return (
    <div className="page-container">
      <h1 className="page-title">성별이 어떻게 되시나요?</h1>

      <button
        className={`select-btn ${gender === "female" ? "selected" : ""}`}
        onClick={() => setGender("female")}
      >
        여성
      </button>

      <button
        className={`select-btn ${gender === "male" ? "selected" : ""}`}
        onClick={() => setGender("male")}
      >
        남성
      </button>

      <button className="next-btn" onClick={handleNext}>
        다음
      </button>
    </div>
  );
}
export default Page2;
