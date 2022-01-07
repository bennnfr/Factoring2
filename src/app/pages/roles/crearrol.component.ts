import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService, PrivilegiosUsuariosService, RolesService } from '../../services/service.index';
import { Privilegio, Usuario2 } from '../../models/usuario.model';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

declare function init_plugins();

@Component({
  selector: 'app-crearrol',
  templateUrl: './crearrol.component.html',
  styles: []
})
export class CrearRolComponent implements OnInit {

  forma: FormGroup;

  constructor(
    public _usuarioService: UsuarioService,
    private route: ActivatedRoute,
    public _privilegiosusuarios: PrivilegiosUsuariosService,
    public _rolService: RolesService,
    public router: Router
  ) { }


  ngOnInit() {


      this.forma = new FormGroup({
        Descripcion: new FormControl( null , Validators.required ),
        Name: new FormControl( null , Validators.required )

      } );

  }


  registrarRol() {

    const rolName =  this.forma.value.Name;
    const rolDesc =  this.forma.value.Descripcion;

    // console.log(privilegio);
    this._rolService.crearRol(rolName, rolDesc).subscribe( resp => {
    Swal.fire({
      title: 'Creacion de rol exitosa',
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

  }, (err) => {
                            Swal.fire(
                              'Error al crear Rol',
                              'Error',
                              'error'
                           );
                        } );

  }


}
