import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { OptionsService } from '../options/options.service';
import { UsuarioService } from '../usuario/usuario.service';
import { GuardService } from './guard.service';
@Injectable()
export class RolesGuard implements CanActivate {
    tieneacceso = false
    options: any[] = [];
  constructor(
    public _usuarioService: UsuarioService,
    public _optionsservice: OptionsService,
    public _guard: GuardService,
    public router: Router
  ) {
    
  }
  canActivate() {
    this.options = JSON.parse(localStorage.getItem('dataacc'));
    if ( this.options.includes(btoa('/roles')) ) {
      return true
    } else {
      this.router.navigate(['/dashboard']);
      return false;
    }
    
    
  }
}