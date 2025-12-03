import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/user.repository.js';
import type { SignupDto, LoginDto, TokenPayload } from '../dtos/auth.dto.js';
import type { UpdateUserInfoDto, ChangePasswordDto } from '../dtos/user.dto.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const SALT_ROUNDS = 10;

class AuthService {
    async registerUser(data: SignupDto) {
        const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
        return await userRepository.createUserWithInfo(data, hashedPassword);
    }

    async loginUser(data: LoginDto) {
        const { email, password } = data;

        const user = await userRepository.findUserByEmail(email); 
        if (!user) {
            throw new Error("INVALID_CREDENTIALS");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error("INVALID_CREDENTIALS");
        }

        const payload: TokenPayload = {
            userId: user.userId,
            role: user.role
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

        return { 
            token, 
            user: { 
                userId: user.userId, 
                name: user.name, 
                nickname: user.nickname, 
                role: user.role 
            } 
        };
    }

    async modifyUserInfo(userId: number, data: UpdateUserInfoDto) {
        return await userRepository.updateUserInfo(userId, data);
    }

    async changePassword(userId: number, data: ChangePasswordDto) {
        const userById = await userRepository.findUserWithInfo(userId);
        
        if (!userById || !userById.password) {
            throw new Error("USER_NOT_FOUND");
        }

        const isValidPassword = await bcrypt.compare(data.oldPassword, userById.password);
        if (!isValidPassword) {
            throw new Error("INCORRECT_OLD_PASSWORD");
        }
        
        const newHashedPassword = await bcrypt.hash(data.newPassword, SALT_ROUNDS);
        await userRepository.updatePassword(userId, newHashedPassword);

        return { message: "비밀번호가 성공적으로 변경되었습니다." };
    }
}

export default new AuthService();