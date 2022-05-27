export interface LoginResponse {
  access_token: string;
  domain: string;
  path: string;
  httpOnly: boolean;
  maxAge: number;
  status: string;
}
