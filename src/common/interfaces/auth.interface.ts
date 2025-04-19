export class AuthInterface {
  id: string;
  email: string;
  phone: string;
  addresses: Array<Record<string, any>>;
  lastAccess: Date;
  isVerified: boolean;
  avatar: string | null;
  createdAt: Date;
  iat?: number | undefined;
  exp?: number | undefined;
}
