import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../dto/jwt.dto';
import { RefreshJwtStrategy } from './refresh-jwt-auth.service';

describe('RefreshJwtStrategy', () => {
  let jwtStrategy: RefreshJwtStrategy;
  let configService: ConfigService;

  beforeEach(() => {
    configService = new ConfigService();
    jest.spyOn(configService, 'get').mockImplementation((key: string) => {
      if (key === 'JWT_REFRESH_SECRET') return 'test-secret';
      return null;
    });

    jwtStrategy = new RefreshJwtStrategy(configService);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  it('should validate and return payload', () => {
    const payload: JwtPayload = { id: 1 };
    expect(jwtStrategy.validate(payload)).toEqual(payload.id);
  });
});
