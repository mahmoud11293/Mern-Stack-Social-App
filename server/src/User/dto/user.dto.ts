import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

// ========== Signup Dto ==========
export class SignUpDto {
  @IsString()
  @MinLength(3)
  name: string;
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(8)
  password: string;
  @IsString()
  @MinLength(8)
  rePassword: string;
  @IsString()
  dateOfBirth: string;
  @IsString()
  @IsEnum(['male', 'female'])
  gender: string;
}

// ========== Signin Dto ==========
export class SignInDto {
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(8)
  password: string;
}

// ========== Change Password Dto ==========
export class ChangePasswordDto {
  @IsString()
  @MinLength(8)
  oldPassword: string;
  @IsString()
  @MinLength(8)
  newPassword: string;
}
