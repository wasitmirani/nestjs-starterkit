import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'supersecret_jwt_key',
    });
  }

  async validate(payload: any) {
    // Validate if user still exists
    const user = await this.authService.validateUserById(payload.sub);
    if (!user) {
    //   throw new UnauthorizedException('User not found');
        throw new UnauthorizedException('Invalid token or user does not exist');
    }
    
    return {
      userId: payload.sub,
      email: payload.email,
      uuid: payload.uuid,
      username: payload.username,
    };
  }
}