import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

interface AuthRequest {
  user?: { role: string };
  admin?: { role: string };
}
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest<AuthRequest>();

    const userRole: string | undefined = request.user?.role;
    const adminRole: string | undefined = request.admin?.role;

    if (userRole && requiredRoles.includes(userRole)) return true;
    if (adminRole && requiredRoles.includes(adminRole)) return true;

    throw new ForbiddenException('Insufficient role for protected resource');
  }
}
