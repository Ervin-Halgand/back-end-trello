import { Request } from 'express';

export interface BoardRequest extends Request {
  user: number;
  params: { id: string };
}
