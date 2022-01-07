import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService, PrivilegiosUsuariosService } from '../../services/service.index';
import { Privilegio, Usuario2 } from '../../models/usuario.model';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

declare function init_plugins();

@Component({
  selector: 'app-crearprivilegio',
  templateUrl: './crearprivilegio.component.html',
  styles: []
})
export class CrearPrivilegioComponent implements OnInit {

  forma: FormGroup;
  id: string;

  constructor(
    public _usuarioService: UsuarioService,
    private route: ActivatedRoute,
    public _privilegiosusuarios: PrivilegiosUsuariosService,
    public router: Router
  ) { }


  ngOnInit() {

      this.id = this.route.snapshot.paramMap.get('id');

      this.forma = new FormGroup({
        Descripcion: new FormControl( null , Validators.required ),
        Key: new FormControl( null , Validators.required ),
        Valor: new FormControl( null , Validators.required ),
        Documentacion: new FormControl( null , Validators.required )

      } );

  }


  registrarPrivilegio() {

    const privilegio = new Privilegio(
      this.forma.value.Descripcion,
      this.forma.value.Key,
      this.forma.value.Valor,
      this.forma.value.Documentacion
    );
    // console.log(privilegio);
    this._privilegiosusuarios.guardarPrivilegio( this.id, privilegio ).subscribe( resp => {this.router.navigate(['/privilegiosusuarios/privilegiousuario/', this.id]),
    Swal.fire(
      'Creacion de Privilegio',
      'Exitosa',
      'success'
   ); }, (err) => {
                            Swal.fire(
                              'Error al crear Privilegio',
                              'Error',
                              'error'
                           );
                        } );

  }


}
