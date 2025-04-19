export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  phone: string;
  addresses: Array<Record<string, any>>;
  isVerified: boolean;
  lastAccess: Date;
  avatar: string | null;
  createdAt: Date;
  iat?: number;
  exp?: number;
}
