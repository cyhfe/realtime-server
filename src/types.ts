export type Role = "ADMIN" | "MEMBER";
export interface UserPayload {
  id: number;
  username: string;
  role: Role;
  iat: number;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: UserPayload;
  }
}
