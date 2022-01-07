import { Component, Inject, OnInit } from '@angular/core';
import { SettingsService, UsuarioService } from '../../services/service.index';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import swal2 from 'sweetalert2';
import { Usuario, Usuario2, Usuario3 } from '../../models/usuario.model';

@Component({
  selector: 'app-accout-settings',
  templateUrl: './accout-settings.component.html',
  styles: []
})
export class AccoutSettingsComponent implements OnInit {

  forma: FormGroup;
  formaRc: FormGroup;
  idUsuario: string;
  resp: any;
  checked1: boolean;
  showModal: boolean;
  ajustes = {
    temaUrl: 'assets/css/colors/default.css',
    tema: 'default'
  };
  temaAc: string;

  constructor( public _ajustes: SettingsService,
               public _usuarioService: UsuarioService ) {

                if ( localStorage.getItem('ajustes') ) {
                  this.ajustes = JSON.parse( localStorage.getItem('ajustes') );
                  if ( this.ajustes.tema === 'blue' ) {
                    this.checked1 = false;
                  } else if ( this.ajustes.tema === 'blue-dark' ) {
                    this.checked1 = true;
                  }
                }

               }

  ngOnInit() {

    this.forma = new FormGroup({
      nombre: new FormControl( null),
      correo: new FormControl( null),
      password: new FormControl( null),
      puesto: new FormControl( null ),
      genero: new FormControl( null ),
      estatus: new FormControl( null ),

    });

    this.formaRc = new FormGroup({
      passwordRc: new FormControl( null , Validators.required ),
      password2Rc: new FormControl( null , Validators.required ),
    }, { validators: this.sonIguales( 'passwordRc', 'password2Rc' )  });

    this.idUsuario = localStorage.getItem('id');
    this.colocarCheck();
    this._usuarioService.getUsuario( this.idUsuario ).subscribe( resp => this.resp = resp );

  }

  cambiarColor( tema: string) {  // , link: any ) {

    this.checked1 = !this.checked1;
    if (this.checked1) {
      tema = 'blue';
      this.checked1 = false;
    } else {
      tema = 'blue-dark';
      this.checked1 = true;
    }
    this._ajustes.aplicarTema( tema );

  }

  aplicarCheck( link: any ) {

    const selectores: any = document.getElementsByClassName('selector');
    for ( const ref of selectores ) {
      ref.classList.remove('working');
    }
    link.classList.add('working');

  }

  colocarCheck() {

    const selectores: any = document.getElementsByClassName('selector');
    const tema = this._ajustes.ajustes.tema;
    for ( const ref of selectores ) {
      if ( ref.getAttribute('data-theme') === tema ) {
        ref.classList.add('working');
        break;
      }
    }

  }

  guardarCambios() {
    // Obtener el elemento por el id
    this.idUsuario = localStorage.getItem('id');
    const genero: any = document.getElementById('genero');
    const estatus: any = document.getElementById('estatus');
    const nombre: any = document.getElementById('nomb');
    const email: any = document.getElementById('mail');
    const puesto: any = document.getElementById('pues');

// Obtener el valor de la opción seleccionada
    const valorGenero = genero.options[genero.selectedIndex].value;
    const valorEstatus = estatus.options[estatus.selectedIndex].value;
    const valorNombre = nombre.value;
    const valorEmail = email.value;
    const valorPuesto = puesto.value;

    if ( this.forma.invalid ) {
      return;
    }

    const usuario = new Usuario3(
      this.idUsuario,
      valorNombre,
      valorEmail,
      valorPuesto,
      valorGenero,
      valorEstatus
    );

    swal2.fire({
      title: 'Desea Modificar sus Datos',
      text: '?',
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      allowOutsideClick: false
    }). then ( resp => {
      if ( resp.value) {

        this._usuarioService.actualizaUsuario(usuario).subscribe( () => {

          swal2.fire({
            title: 'Sus Datos Fueron Guardados',
            text: 'Con exito',
            icon: 'success',
            showConfirmButton: true,
            showCancelButton: false,
            allowOutsideClick: false
          }). then ( res => {

            if ( res.value ) {
              window.location.reload();
            }

          } );

        } );

      }
    });

  }

  show() {
    this.showModal = true; // Show-Hide Modal Check
  }
  hide() {
    this.showModal = false;
  }

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

  resetpassword() {
    

  //  if ( this.formaRc.invalid ) {
  //    return;
  //  }

    if ( this.valida_password( this.formaRc.value.passwordRc ) ) {
      // el correo es valido
      } else {
        swal2.fire(
          'Error al cambiar contraseña',
          'La contraseña no tiene el formato correcto',
          'error'
       );
        return null;
      }
      
      if ( this.formaRc.value.passwordRc !== this.formaRc.value.password2Rc ) {

        swal2.fire(
          'Error al cambiar contraseña',
          'Las contraseñas no son iguales',
          'error'
       );
        return null;
        }  
    const params = {
      token: '',
      secret_key: '',
      password: this.formaRc.value.passwordRc
    };

    this._usuarioService.actualizaUsuarioRcPc( this.idUsuario, params )
              .subscribe( resp => {// this.router.navigate(['/login']);
              swal2.fire(
                'Cambio de contraseña',
                'Exitosa',
                'success'
             );
              this.hide();
            }, (err) => { console.log(err);
                          swal2.fire(
                                        'Error al cambiar contraseña',
                                        'Error',
                                        'error'
                                     );
                          this.hide();
                                  }
            );


  }

}
