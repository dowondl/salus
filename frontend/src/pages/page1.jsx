import { useNavigate } from "react-router-dom";
import "../style/step.css";

function Page1() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <h1 className="page-title">반가워요😊 [닉네임]님!</h1>

      <p className="page-sub">
        맞춤형 건강 솔루션을 제공하기 위해 가장 기본적인 정보가 필요해요.
        <br />
        목표를 설정하면 더 정확한 추천을 받을 수 있어요!
      </p>

      <button className="next-btn" onClick={() => navigate("/page2")}>
        다음
      </button>
    </div>
  );
}

export default Page1;
