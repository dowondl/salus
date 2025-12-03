from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "../models")
health_model = joblib.load(os.path.join(MODEL_PATH, "health_model.pkl"))
ex_model = joblib.load(os.path.join(MODEL_PATH, "exercise_model.pkl"))
supp_model = joblib.load(os.path.join(MODEL_PATH, "supp_model.pkl"))

le_gender = joblib.load(os.path.join(MODEL_PATH, "le_gender.pkl"))
le_exercised = joblib.load(os.path.join(MODEL_PATH, "le_exercised.pkl"))
le_condition = joblib.load(os.path.join(MODEL_PATH, "le_condition.pkl"))
le_exercise_rec = joblib.load(os.path.join(MODEL_PATH, "le_exercise_rec.pkl"))

supplements_classes = joblib.load(os.path.join(MODEL_PATH, "supplements_classes.pkl"))

app = FastAPI()

class CreateLogDto(BaseModel):
    userId: int
    date: str
    gender: str
    age: int
    height: float
    weight: float
    goal_weight: float
    step_number: int
    sleep_time: int
    exercised: str
    condition: str

class AiResultDto(BaseModel):
    userId: int
    date: str
    finalConditionScore: float
    recommendations: list

# Post-processing 
def postprocess_recommendations(row, exercise_pred, supp_pred):
    step = row['step_number']
    age = row['age']
    condition = row['condition']
    exercise = exercise_pred
    supps = list(supp_pred)

    # 나이, 걸음, 컨디션 기반 조정
    if age >= 60 and exercise in ['run_20','run_30','strength_30','strength_60','cardio_30','cardio_60']:
        exercise = "walk_20"
    if step > 15000:
        exercise = "walk_20"
    elif step < 2000 and exercise in ['run_20','run_30','strength_30','strength_60']:
        exercise = 'walk_30'
    if condition in ['indigestion','tired','cold','flu','exhausted'] and exercise not in ['stretch_15','yoga_20']:
        exercise = "None"

    # 컨디션 기반 영양제
    if condition == 'indigestion' and 'probiotics' not in supps:
        supps.append('probiotics')
    if condition == 'tired' and 'magnesium' not in supps:
        supps.append('magnesium')
    if condition == 'cold' and 'vitamin_c' not in supps:
        supps.append('vitamin_c')

    # 나이 기반 추천
    if age >= 50:
        for s in ['calcium', 'vitamin_d']:
            if s not in supps:
                supps.append(s)

    # 같이 먹으면 안 되는 조합
    if 'probiotics' in supps and 'vitamin_c' in supps:
        supps.remove('vitamin_c')
    if 'iron' in supps and 'calcium' in supps:
        supps.remove('calcium')

    return exercise, supps


@app.post("/predict", response_model=AiResultDto)
def predict_health(data: CreateLogDto):
    BMI = data.weight / (data.height / 100) ** 2
    weight_diff = data.weight - data.goal_weight
    row = {
        "gender_enc": le_gender.transform([data.gender])[0],
        "age": data.age,
        "height": data.height,
        "weight": data.weight,
        "BMI": BMI,
        "weight_diff": weight_diff,
        "step_number": data.step_number,
        "sleep_time": data.sleep_time,
        "exercised_enc": le_exercised.transform([data.exercised])[0],
        "condition_enc": le_condition.transform([data.condition])[0],
    }
    df_row = pd.DataFrame([row])

    # 예측
    health_pred = float(health_model.predict(df_row)[0])
    ex_pred_label = le_exercise_rec.inverse_transform([ex_model.predict(df_row)[0]])[0]
    supp_pred = [supplements_classes[i] for i, v in enumerate(supp_model.predict(df_row)[0]) if v == 1]

    ex_final, supp_final = postprocess_recommendations(
        {"age": data.age, "step_number": data.step_number, "condition": data.condition},
        ex_pred_label, supp_pred
    )

    full_recs = [
        {"category": "exercise", "content": ex_final},
        {"category": "supplements", "content": ", ".join(supp_final)}
    ]

    return AiResultDto(
        userId=data.userId,
        date=data.date,
        finalConditionScore=round(health_pred, 2),
        recommendations=full_recs
    )
