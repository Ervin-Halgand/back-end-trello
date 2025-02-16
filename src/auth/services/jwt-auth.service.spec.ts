import { JwtStrategy } from './jwt-auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../dto/jwt.dto';
import { ExtractJwt } from 'passport-jwt';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let configService: ConfigService;
  let spy: any;

  beforeEach(() => {
    configService = new ConfigService();
    spy = jest.spyOn(configService, 'get').mockImplementation((key: string) => {
      if (key === 'JWT_SECRET') return 'test-secret';
      return null;
    });

    jwtStrategy = new JwtStrategy(configService);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  it('should validate and return payload', () => {
    const payload: JwtPayload = { id: 1, email: 'test@example.com' };
    expect(jwtStrategy.validate(payload)).toEqual(payload);
  });
});
