import { Component, OnInit } from '@angular/core';
import { UsuarioService, ListasService } from '../../services/service.index';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Usuario3 } from '../../models/usuario.model';
import { Router } from '@angular/router';
import swal2 from 'sweetalert2';

@Component({
  selector: 'app-editarusuario',
  templateUrl: './editarusuario.component.html',
  styles: []
})
export class EditarUsuarioComponent implements OnInit {

  forma: FormGroup;
  formaRc: FormGroup;
  resp: any;
  listaEstatus: any;
  genero: any[];
  showModal: boolean;
  idu = '';
  constructor( public _usuarioService: UsuarioService,
               public http: HttpClient,
               private route: ActivatedRoute,
               private lista: ListasService,
               public router: Router ) { }

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');
    this.idu = this.route.snapshot.paramMap.get('id');
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

    this._usuarioService.getUsuario( id ).subscribe( resp => this.resp = resp );

    this._usuarioService.getUserGender().subscribe( resp => this.genero = resp );

    this._usuarioService.getUserStatus().subscribe( resp => this.listaEstatus = resp );


  }

  guardarCambios() {
    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
    swal2.showLoading();
    // Obtener el elemento por el id
    const id = this.route.snapshot.paramMap.get('id');
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

// Obtener el texto que muestra la opción seleccionada
//    let valorSeleccionado2 = this.genero.options[this.genero.selectedIndex].text;

    if ( this.forma.invalid ) {
      return;
    }

    const usuario = new Usuario3(
      id,
      valorNombre,
      valorEmail,
      valorPuesto,
      valorGenero,
      valorEstatus
    );

    this._usuarioService.actualizaUsuario(usuario).subscribe( () => {
          swal2.close();
          swal2.fire({
            title: 'El usuario',
            text: 'fue Modificado con exito',
            icon: 'success',
            showConfirmButton: true,
            showCancelButton: false,
            allowOutsideClick: false
          }). then ( res => {

            if ( res.value ) {
              this.router.navigate(['/verusuarios']);
            }

          } );

        }, (err) => {
          swal2.close();
          console.log(err);
          swal2.fire({
            title: 'Ocurrio un error',
            text: '',
            icon: 'error',
            showConfirmButton: true,
            showCancelButton: false,
            allowOutsideClick: false
          }). then ( res => {
            if ( res.value ) {
              this.ngOnInit();
            }
          } );
         } );


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

resetpassword() {

    if ( this.formaRc.invalid ) {
      return;
    }

    const params = {
      token: '',
      secret_key: '',
      password: this.formaRc.value.passwordRc
    };

    this._usuarioService.actualizaUsuarioRcPc( this.idu, params )
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
