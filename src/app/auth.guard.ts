// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt'; // Importa JwtHelperService
import { AuthService } from './auth.service'; // Importa el servicio de autenticación

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private jwtHelper: JwtHelperService, // Inyecta JwtHelperService
    private authService: AuthService // Inyecta AuthService
  ) {}

  canActivate(): boolean {
    console.log('AuthGuard canActivate called');
    const token = this.authService.getToken(); // Obtén el token del servicio de autenticación

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      // Si hay un token y no ha expirado, el usuario está autenticado
      console.log('User is authenticated');
      return true;
    } else {
      // Si no hay un token válido, redirige al usuario a /login
      console.log('User is not authenticated');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
