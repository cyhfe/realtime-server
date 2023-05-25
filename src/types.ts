export interface UserPayload {
  id: string;
  username: string;
  iat: number;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: UserPayload;
  }
}
