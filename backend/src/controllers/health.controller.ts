import type { Request, Response } from 'express';
import healthService from '../services/health.service.js';

const INTERNAL_AI_KEY = process.env.INTERNAL_AI_KEY;

class HealthController {
  createLog = async (req: Request, res: Response) => {
    try {
      const result = await healthService.recordHealthLog(req.body);
      res.status(202).json(result); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "상태 저장 실패" });
    }
  };

  getSummary = async (req: Request, res: Response) => {
    try {
      const { userId, date } = req.query;
      if (!userId || !date) {
        return res.status(400).json({ error: "userId와 date는 필수입니다." });
      }

      const data = await healthService.getHealthSummary(userId as string, date as string);
      
      if (!data) {
        return res.status(200).json({ message: "해당 날짜의 기록이 없습니다." });
      }
      res.status(200).json(data);
    } catch (error: any) {
      console.error(error);
      if (error.message === 'USER_NOT_FOUND') {
        return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
      }
      res.status(500).json({ error: "데이터 조회 실패" });
    }
  };

  handleAiResult = async (req: Request, res: Response) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== INTERNAL_AI_KEY) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const { userId, date, finalConditionScore, recommendations } = req.body;
      if (!userId || !date) {
         return res.status(400).json({ error: "필수 데이터 누락" });
      }

      await healthService.processAiResult(userId, date, finalConditionScore, recommendations);
      res.status(200).json({ success: true, message: "AI 분석 결과 저장 완료" });
    } catch (error: any) {
      console.error("AI Webhook Error:", error);
      res.status(500).json({ error: "처리 실패" });
    }
  };
}

export default new HealthController();