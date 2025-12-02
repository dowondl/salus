import prisma from '../prisma.js';
import { Prisma } from '@prisma/client';

class HealthRepository {
  async createRawLog(data: Prisma.DailyHealthLogUncheckedCreateInput, height?: number, weight?: number) {
    return await prisma.$transaction(async (tx) => {
      const existingLog = await tx.dailyHealthLog.findFirst({
        where: { userId: data.userId, date: data.date }
      });

      let log;
      if (existingLog) {
        log = await tx.dailyHealthLog.update({
          where: { logId: existingLog.logId },
          data: { ...data, conditionScore: undefined }
        });
      } else {
        log = await tx.dailyHealthLog.create({
          data: { ...data, conditionScore: null }
        });
      }

      if (height || weight) {
        await tx.userInfo.update({
          where: { userId: data.userId },
          data: {
            height: height || undefined,
            weight: weight || undefined
          }
        });
      }
      return log;
    });
  }

  async updateScoreAndCreatePlans(userId: number, date: Date, score: number, plans: any[]) {
    return await prisma.$transaction(async (tx) => {
      await tx.dailyHealthLog.updateMany({
        where: { userId, date },
        data: { conditionScore: score }
      });

      await tx.dailyPlan.deleteMany({
        where: { userId, date }
      });

      if (plans.length > 0) {
        await tx.dailyPlan.createMany({
          data: plans.map(p => ({
            userId,
            date,
            category: p.category,
            content: p.content,
            isChecked: false
          }))
        });
      }
    });
  }

  async findLogByDate(userId: number, date: Date) {
    return await prisma.dailyHealthLog.findFirst({
      where: { userId, date }
    });
  }

  async findPlansByDate(userId: number, date: Date) {
    return await prisma.dailyPlan.findMany({
      where: { userId, date }
    });
  }
}

export default new HealthRepository();