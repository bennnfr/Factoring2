import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
import { Router, ActivatedRoute } from '@angular/router';

declare function init_plugins();

@Component({
  selector: 'app-resetpwd',
  templateUrl: './resetpwd.component.html',
  styleUrls: ['./login.component.css']
})
export class ResetpwdComponent implements OnInit { //esto es otra prueba de cambio

  forma: FormGroup;
  rtoken = '';
  usuarios: any[] = [];
  iduser = '';
  usuario: any[] = [];
  tokenvalido: boolean;
  tokeninvalido: boolean;
  constructor(
    public _usuarioService: UsuarioService,
    public router: Router,
    private route: ActivatedRoute,
  ) { }

  sonIguales( campo1: string, campo2: string ) {

    return ( group: FormGroup ) => {

      let pass1 = group.controls[campo1].value;
      let pass2 = group.controls[campo2].value;

      if ( pass1 === pass2 ) {
        return null;
      }

      return {
        sonIguales: true
      };

    };

  }

  valida_password(pass) {
    const regex = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;
    return regex.test( pass ) ? true : false;
  }

  ngOnInit() {
      init_plugins();
      this.tokenvalido = false;
      this.tokeninvalido = false;
      this.iduser = '';
      this.rtoken = this.route.snapshot.paramMap.get('token');
      this.forma = new FormGroup({
        password: new FormControl( null , Validators.required ),
        password2: new FormControl( null , Validators.required ),
      }, { validators: this.sonIguales( 'password', 'password2' )  } );

      this._usuarioService.getUsuariosRc(this.rtoken).subscribe( resp => { this.usuarios = resp; this.tokenvalido = true;
       }, (err) => { this.tokeninvalido = true; } );

  }

  resetpassword() {

    if ( this.forma.invalid ) {
      return;
    }

    if ( this.valida_password( this.forma.value.password ) ) {
      // el correo es valido
      } else {
        Swal.fire(
          'La contraseña no tiene el formato correcto',
          '',
          'error'
       );
        return null;
      }
    const params = {
    token: this.rtoken,
    secret_key: '',
    password: this.forma.value.password
  };
    this._usuarioService.getResetPasswordToken(this.rtoken).subscribe( resp => { this.usuario = resp;  this.iduser = this.usuario[0].id; 
                                                                                 this._usuarioService.actualizaUsuarioRc( this.iduser, params )
              .subscribe( () => {
              Swal.fire(
                'Cambio de contraseña',
                'Exitosa',
                'success'
             );
              this.router.navigate(['/login']);
            }, (err) => {
                          Swal.fire(
                                        'Error al cambiar contraseña',
                                        'Error',
                                        'error'
                                     );
                                  }
            );
          } );

  }

}
