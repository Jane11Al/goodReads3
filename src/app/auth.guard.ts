// src/app/auth.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Получаем требуемую роль из данных маршрута
    const requiredRole = next.data['role'];
    const currentUser = this.authService.getCurrentUser();

    // Если пользователь не авторизован
    if (!currentUser) {
      return this.router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
      });
    }

    // Если требуется определенная роль, но у пользователя она другая
    if (requiredRole && currentUser.role !== requiredRole) {
      return this.router.parseUrl('/');
    }

    return true;
  }
}
