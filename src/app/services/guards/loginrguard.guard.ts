import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';
@Injectable()
export class LoginRGuardGuard implements CanActivate {
  constructor(
    public _usuarioService: UsuarioService,
    public router: Router
  ) {}
  canActivate() {
    if ( this._usuarioService.estaLogueador() ) {
      this.router.navigate(['/dashboard']);
      return true;
    } else {
      this.router.navigate(['/login']);
      return true;
    }
  }
}
