import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { ROLES_KEY } from "../decorators/roles-auth.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
        context.getClass(),
        context.getHandler(),
      ]) as string;

      if (!requiredRoles) {
        return true;
      }

      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization as string;
      const bearer = authHeader.split(" ")[0];
      const token = authHeader.split(" ")[1];

      if (bearer !== "Bearer" && !token) {
        throw new UnauthorizedException({
          message: "Пользователь не авторизован",
        });
      }

      const user = this.jwtService.verify(token);
      req.user = user;
      return user.roles.some((role: { value: string; id: number }) =>
        requiredRoles.includes(role.value)
      );
    } catch (error) {
      throw new HttpException("Нет доступа", HttpStatus.FORBIDDEN);
    }
  }
}
