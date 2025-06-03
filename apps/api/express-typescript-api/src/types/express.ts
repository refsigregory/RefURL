import type { Request as ExpressRequest } from 'express';

export interface RequestUser {
  userId: number;
}

export interface Request extends ExpressRequest {
  user?: RequestUser;
}

export {}; 