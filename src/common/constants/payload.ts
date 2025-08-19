export type JwtAdminPayload = {
  sub: number;
  name: string;
  email: string;
  role: string;
  kind: 'admin';
  ver: 1;
};
export type JwtUserPayload = {
  sub: number;
  name: string;
  email: string;
  role: string;
  tenantSchema?: string;
  kind: 'user';
  ver: 1;
};
export type JwtPayload = JwtAdminPayload | JwtUserPayload;

export type Principal = {
  kind: 'admin' | 'user';
  id: number;
  name: string;
  email: string;
  role: string;
  tenantSchema?: string;
};
