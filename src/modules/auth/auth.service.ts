import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Helpers } from '../../common/utils/helpers';
import { 
  UnauthorizedException, 
  ConflictException, 
  BusinessException,
  NotFoundException 
} from '../../common/exceptions/custom.exceptions';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string; user: Partial<User> }> {
    try {
      const { email, password, name } = registerDto;

      // Validate email format
      if (!Helpers.isValidEmail(email)) {
        throw new BusinessException('Invalid email format', 'INVALID_EMAIL');
      }

      // Validate password strength
      if (!Helpers.isStrongPassword(password)) {
        throw new BusinessException(
          'Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters',
          'WEAK_PASSWORD'
        );
      }

      // Check if user already exists
      const existingUser = await this.usersRepository.findOne({ 
        where: [{ email }] 
      });
      
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      // Create user
      const user = this.usersRepository.create({
        email,
        password,
        name,
      });

      await this.usersRepository.save(user);

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;

      return { 
        message: 'User registered successfully',
        user: userWithoutPassword
      };
    } catch (error) {
      if (error instanceof BusinessException || 
          error instanceof ConflictException) {
        throw error;
      }
      
      // Log unexpected errors
      console.error('Registration error:', error);
      throw new BusinessException('Registration failed', 'REGISTRATION_ERROR');
    }
  }

  async login(loginDto: LoginDto): Promise<{ 
    access_token: string; 
    refresh_token: string;
    user: any; 
  }> {
    try {
      const { email, password } = loginDto;

      // Validate input
      if (!email || !password) {
        throw new BusinessException('Email and password are required', 'MISSING_CREDENTIALS');
      }

      // Find user by email
      const user = await this.usersRepository.findOne({ 
        where: { email } 
      });
      
      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Check if account is locked (you can implement this logic)
      if (user['isLocked']) {
        throw new BusinessException('Account is temporarily locked', 'ACCOUNT_LOCKED');
      }

      // Validate password
      const isPasswordValid = await user.validatePassword(password);
      if (!isPasswordValid) {
        // Increment failed login attempts (you can implement this)
        throw new UnauthorizedException('Invalid email or password');
      }

      // Reset failed login attempts on successful login
      // await this.usersRepository.update(user.id, { failedLoginAttempts: 0 });

      // Generate JWT tokens
      const payload = { 
        email: user.email, 
        sub: user.id,
        uuid: user.uuid,
        username: user.userName 
      };
      
      const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
      const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

      // Return user data without password
      const { password: _, ...userWithoutPassword } = user;

      return {
        access_token,
        refresh_token,
        user: userWithoutPassword,
      };
    } catch (error) {
      if (error instanceof BusinessException || 
          error instanceof UnauthorizedException) {
        throw error;
      }
      
      console.error('Login error:', error);
      throw new BusinessException('Login failed', 'LOGIN_ERROR');
    }
  }

  async validateUserById(userId: number): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BusinessException('User validation failed', 'USER_VALIDATION_ERROR');
    }
  }

  async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    try {
      if (!refreshToken) {
        throw new BusinessException('Refresh token is required', 'MISSING_REFRESH_TOKEN');
      }

      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.validateUserById(payload.sub);

      // Generate new access token
      const newPayload = { 
        email: user.email, 
        sub: user.id,
        uuid: user.uuid 
      };
      
      const access_token = this.jwtService.sign(newPayload, { expiresIn: '15m' });

      return { access_token };
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid refresh token');
      }
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh token expired');
      }
      throw new BusinessException('Token refresh failed', 'TOKEN_REFRESH_ERROR');
    }
  }
}