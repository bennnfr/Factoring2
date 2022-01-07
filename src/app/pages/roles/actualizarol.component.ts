import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService, PrivilegiosUsuariosService, RolesService } from '../../services/service.index';
import { Privilegio, Usuario2 } from '../../models/usuario.model';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

declare function init_plugins();

@Component({
  selector: 'app-actualizarol',
  templateUrl: './actualizarol.component.html',
  styles: []
})
export class ActualizaRolComponent implements OnInit {

  forma: FormGroup;
  idr: string;
  rol: any[] = [];

  constructor(
    public _usuarioService: UsuarioService,
    private route: ActivatedRoute,
    public _privilegiosusuarios: PrivilegiosUsuariosService,
    public _rolesService: RolesService,
    public router: Router
  ) { }


  ngOnInit() {

      this.idr = this.route.snapshot.paramMap.get('id');

      this.forma = new FormGroup({
        Name: new FormControl( null , Validators.required ),
        Descripcion: new FormControl( null , Validators.required )
      } );

      this._rolesService.getRol( this.idr ).subscribe( resp => { this.rol = resp; } );

  }


  actualizaRol() {

    // Obtener el elemento por el id
    const Name: any = document.getElementById('Name');
    const Descripcion: any = document.getElementById('Descripcion');
// Obtener el valor de la opción seleccionada

    const valorDescripcion = Descripcion.value;
    const valorName = Name.value;

    this._rolesService.actualizaRol( this.idr, valorName, valorDescripcion ).subscribe( () => {
    Swal.fire({
      title: 'Modificacion de rol exitosa',
      text: '',
      icon: 'success',
      showConfirmButton: true,
      showCancelButton: false,
      allowOutsideClick: false
    }). then ( res => {
      if ( res.value ) {
        this.router.navigate(['/roles']);
      }

    } );

  }, (err) => {             console.log(err);
                            Swal.fire(
                              'Error al modificar Rol',
                              'Error',
                              'error'
                           );
                        } );

  }


}
