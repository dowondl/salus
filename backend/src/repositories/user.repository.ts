import prisma from '../prisma.js';
import type { SignupDto } from '../dtos/auth.dto.js';
import type { UpdateUserInfoDto } from '../dtos/user.dto.js';

class UserRepository {
  async createUserWithInfo(data: SignupDto, hashedPassword: string) {
    return await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: data.email,
          name: data.name,
          nickname: data.nickname,
          password: hashedPassword,
          status: 'active',
          role: 'user'
        }
      });

      const newUserInfo = await tx.userInfo.create({
        data: {
          userId: newUser.userId,
          gender: data.gender,
          age: data.age,
          height: data.height,
          weight: data.weight,
          goalWeight: data.goalWeight
        }
      });

      return { user: newUser, userInfo: newUserInfo };
    });
  }

 async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email: email } 
    });
  }

  async findUserWithInfo(userId: number) {
    return await prisma.user.findUnique({
      where: { userId },
      include: { userInfo: true }
    });
  }

  async updateUserInfo(userId: number, data: UpdateUserInfoDto) {
    return await prisma.$transaction(async (tx) => {
      // 1. User 테이블 업데이트 (닉네임만)
      if (data.nickname !== undefined) {
        await tx.user.update({
          where: { userId },
          data: { nickname: data.nickname }
        });
      }

      // 2. UserInfo 테이블 업데이트 (나이, 키, 몸무게, 목표 체중)
      await tx.userInfo.update({
        where: { userId },
        data: {
          age: data.age,
          height: data.height,
          weight: data.weight,
          goalWeight: data.goalWeight
        }
      });

      // 업데이트된 UserInfo를 반환 (필요에 따라 User 정보 포함 가능)
      return tx.userInfo.findUnique({ where: { userId } });
    });
  }
  
  // 💡 [추가] 비밀번호 업데이트
  async updatePassword(userId: number, newHashedPassword: string) {
    return await prisma.user.update({
      where: { userId },
      data: { password: newHashedPassword }
    });
  }
}

export default new UserRepository();