import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// import * as swal from 'sweetalert';
import { UsuarioService } from '../../services/service.index';
import { Usuario, Usuario2 } from '../../models/usuario.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import swal2 from 'sweetalert2';

declare function init_plugins();

@Component({
  selector: 'app-crearusuario',
  templateUrl: './crearusuario.component.html',
  styles: []
})
export class CrearUsuarioComponent implements OnInit {

  forma: FormGroup;
  genero: any[];
  estatus: any[];

  constructor(
    public _usuarioService: UsuarioService,
    public router: Router
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

  validar_email( email )
  {
      const regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      return regex.test(email) ? true : false;
  }

  valida_password(pass) {
    console.log('hola');
    const regex = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;
    return regex.test( pass ) ? true : false;
  }

  ngOnInit() {

      this.forma = new FormGroup({
        nombre: new FormControl( null , Validators.required ),
        correo: new FormControl( null , [Validators.required, Validators.email] ),
        password: new FormControl( null , Validators.required ),
        password2: new FormControl( null , Validators.required ),
        puesto: new FormControl( null ),
        genero: new FormControl( null ),
        estatus: new FormControl( null )

      }, { validators: this.sonIguales( 'password', 'password2' )  } );

      this._usuarioService.getUserGender().subscribe( resp => this.genero = resp );

      this._usuarioService.getUserStatus().subscribe( resp => this.estatus = resp );
  }


  registrarUsuario() {
    swal2.showLoading();
// Obtener el elemento por el id
    const genero: any = document.getElementById('genero');
    const estatus: any = document.getElementById('estatus');

// Obtener el valor de la opción seleccionada
    const valorGenero = genero.options[genero.selectedIndex].value;
    const valorEstatus = estatus.options[estatus.selectedIndex].value;

// Obtener el texto que muestra la opción seleccionada
//    let valorSeleccionado2 = this.genero.options[this.genero.selectedIndex].text;

    if ( this.validar_email( this.forma.value.correo ) ) {
    // el correo es valido
    } else {
      Swal.fire(
        'Error al crear usuario',
        'El correo electronico no es valido',
        'error'
     );
      return null;
    }

    if ( this.valida_password( this.forma.value.password ) ) {
      // el correo es valido
      } else {
        Swal.fire(
          'Error al crear usuario',
          'La contraseña no tiene el formato correcto',
          'error'
       );
        return null;
      }

    if ( this.forma.value.password !== this.forma.value.password2 ) {

    Swal.fire(
      'Error al crear usuario',
      'Las contraseñas no son iguales',
      'error'
   );
    return null;
    }

    if ( this.forma.invalid ) {
      return;
    }

    const usuario = new Usuario2(
      this.forma.value.nombre,
      this.forma.value.correo,
      this.forma.value.password,
      this.forma.value.puesto,
      valorGenero,
      valorEstatus
    );

    this._usuarioService.crearUsuario( usuario )
              .subscribe( resp => {
              swal2.close();
              Swal.fire({
                title: 'Creacion de usuario exitosa',
                text: '',
                icon: 'success',
                showConfirmButton: true,
                showCancelButton: false,
                allowOutsideClick: false
              }). then ( res => {
                if ( res.value ) {
                  this.router.navigate(['/verusuarios']);
                }
              } );
            }, (err) => {           swal2.close();
                                    console.log(err);
                                    Swal.fire(
                                        'Error al crear usuario',
                                        '',
                                        'error'
                                     );
                                  } );

 //   this.router.navigate([ '/verusuarios' ]);

  //  console.log(usuario);
  }



}
