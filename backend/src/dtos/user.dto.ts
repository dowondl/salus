
export interface UpdateUserInfoDto {
  nickname?: string;
  age?: number;
  height?: number;
  weight?: number;
  goalWeight?: number;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}