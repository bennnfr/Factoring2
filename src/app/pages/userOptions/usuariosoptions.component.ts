import { Component, OnInit } from '@angular/core';
import { UsuarioService, PrivilegiosUsuariosService } from '../../services/service.index';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import swal2 from 'sweetalert2';


@Component({
  selector: 'app-usuariosoptions',
  templateUrl: './usuariosoptions.component.html',
  styles: []
})
export class UsuariosOptionsComponent implements OnInit {

  constructor( public _usuarioservice: UsuarioService,
               public _privilegiosusuarios: PrivilegiosUsuariosService,
               public http: HttpClient) { }
  usuarios: any[] = [];
  cols: any[];
  selectedFac: any[];
  router: Router;

  ngOnInit() {
    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
    swal2.showLoading();
    this._usuarioservice.getUsuarios().subscribe(resp => {this.usuarios = resp; swal2.close(); }
    , (err) => {swal2.fire({title: 'Ocurrio un error al cargar la informacion', allowOutsideClick: false })} );

    this.cols = [

      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Nombre' },
      { field: 'email', header: 'Correo' },
      { field: 'privilegios', header: 'Opciones' }

  ];

  }


}
