import axios from 'axios';
import dayjs from 'dayjs';
import healthRepository from '../repositories/health.repository.js';
import userRepository from '../repositories/user.repository.js';
import { type CreateLogDto, formatSummaryResponse } from '../dtos/health.dto.js';

const AI_SERVER_URL = process.env.AI_SERVER_URL || 'http://localhost:5000/process';
const INTERNAL_AI_KEY = process.env.INTERNAL_AI_KEY;

class HealthService {
  async recordHealthLog(data: CreateLogDto) {
    const { userId, date, height, weight, ...rest } = data;

    await healthRepository.createRawLog(
      { userId, date: new Date(date), ...rest }, 
      height, 
      weight
    );

    const aiPayload = {
        userId,
        date,
        height, 
        weight,
        ...rest
    };

    // AI 서버로 비동기 요청 (응답을 기다리지 않음)
    axios.post(AI_SERVER_URL, aiPayload, {
      headers: { 
        'X-API-KEY': INTERNAL_AI_KEY 
      },
      timeout: 3000
    })
    .catch(error => {
      console.error(`[AI FAILED] User ${userId} log analysis failed:`, error.message);
    });

    return { success: true, message: "로그 저장 완료. 분석이 곧 시작됩니다." };
  }

  async processAiResult(userId: number, dateStr: string, score: number, plans: any[]) {
    const date = dayjs(dateStr).toDate();
    if (score === undefined || !plans) {
        throw new Error("AI 결과 데이터 누락");
    }
    await healthRepository.updateScoreAndCreatePlans(userId, date, score, plans);
  }

  async getHealthSummary(userId: string, dateStr: string) {
    const targetDate = new Date(dateStr);
    const userIdInt = parseInt(userId);

    const user = await userRepository.findUserWithInfo(userIdInt);
    if (!user) throw new Error("USER_NOT_FOUND");

    const todayLog = await healthRepository.findLogByDate(userIdInt, targetDate);
    if (!todayLog) return null; 

    const yesterdayDate = dayjs(dateStr).subtract(1, 'day').toDate();
    const yesterdayLog = await healthRepository.findLogByDate(userIdInt, yesterdayDate);
    const plans = await healthRepository.findPlansByDate(userIdInt, targetDate);

    return formatSummaryResponse(user, todayLog, yesterdayLog, dateStr, plans);
  }
}

export default new HealthService();