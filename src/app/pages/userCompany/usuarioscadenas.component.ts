import { Component, OnInit } from '@angular/core';
import { UsuarioService, PrivilegiosUsuariosService, OptionsService } from '../../services/service.index';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import swal2 from 'sweetalert2';


@Component({
  selector: 'app-usuarioscadenas',
  templateUrl: './usuarioscadenas.component.html',
  styles: []
})
export class UsuariosCadenasComponent implements OnInit {

  constructor( public _usuarioservice: UsuarioService,
               public _privilegiosusuarios: PrivilegiosUsuariosService,
               public _optionsservice: OptionsService,
               public router: Router,
               public http: HttpClient) { }
  usuarios: any[] = [];
  cols: any[];
  selectedFac: any[];
//  router: Router;

  ngOnInit() {
    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
    swal2.showLoading();
   // this.getAcceso('/usuarioscadenas');
    this._usuarioservice.getUsuarios().subscribe(resp => {this.usuarios = resp; swal2.close(); }
    , (err) => {swal2.fire({title: 'Ocurrio un error al cargar la informacion', allowOutsideClick: false })} );

    this.cols = [

      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Nombre' },
      { field: 'email', header: 'Correo' },
      { field: 'privilegios', header: 'Opciones' }

  ];

  }

  getAcceso(url) {
    let tieneacceso = false;
    this._optionsservice.getOptionsxUsuario(localStorage.getItem('id')).subscribe(resp2 => {
      // tslint:disable-next-line: forin
      for (const j in resp2 ) {
          if ( resp2[j].url === url ) {
            tieneacceso = true;
            break;
          }
        }
      if (!tieneacceso) {
        this.router.navigate(['/accesodenegado']);
      }
    });
  }


}
