import { JwtStrategy } from './jwt-auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../dto/jwt.dto';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let configService: ConfigService;

  beforeEach(() => {
    configService = new ConfigService();
    jest.spyOn(configService, 'get').mockImplementation((key: string) => {
      if (key === 'JWT_SECRET') return 'test-secret';
      return null;
    });

    jwtStrategy = new JwtStrategy(configService);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  it('should validate and return payload', () => {
    const payload: JwtPayload = { id: 1 };
    expect(jwtStrategy.validate(payload)).toEqual(payload.id);
  });
});
