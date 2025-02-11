import { Request } from 'express';
import { JwtPayload } from 'src/auth/dto/jwt.dto';

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
