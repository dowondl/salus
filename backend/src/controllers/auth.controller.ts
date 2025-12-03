import type { Request, Response } from 'express';
import authService from '../services/auth.service.js';
import type { CustomRequest } from '../middlewares/auth.middleware.js';

class AuthController {
  signup = async (req: Request, res: Response) => {
    try {
      const result = await authService.registerUser(req.body);
      res.status(201).json({ success: true, userId: result.user.userId, message: "회원가입 완료" });
    } catch (error) {
      console.error(error);
      if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
         return res.status(409).json({ error: "이미 존재하는 이메일입니다." });
      }
      res.status(500).json({ error: "회원가입 실패" });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const result = await authService.loginUser(req.body);
      res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      if (error.message === "INVALID_CREDENTIALS") {
        return res.status(401).json({ error: "이메일 또는 비밀번호 불일치" });
      }
      res.status(500).json({ error: "로그인 에러" });
    }
  };
  updateInfo = async (req: CustomRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: "인증 정보가 없습니다." });

      const updatedInfo = await authService.modifyUserInfo(userId, req.body);
      res.status(200).json({ success: true, data: updatedInfo, message: "정보 수정 완료" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "정보 수정 실패" });
    }
  };

  changePassword = async (req: CustomRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: "인증 정보가 없습니다." });

      const result = await authService.changePassword(userId, req.body);
      res.status(200).json({ success: true, message: result.message });
    } catch (error: any) {
      if (error.message === "INCORRECT_OLD_PASSWORD") {
        return res.status(401).json({ error: "기존 비밀번호가 일치하지 않습니다." });
      }
      console.error(error);
      res.status(500).json({ error: "비밀번호 변경 실패" });
    }
  };
}

export default new AuthController();