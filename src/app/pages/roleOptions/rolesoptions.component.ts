import { Component, OnInit } from '@angular/core';
import { RolesService, OptionsService } from '../../services/service.index';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import swal2 from 'sweetalert2';

@Component({
  selector: 'app-rolesoptions',
  templateUrl: './rolesoptions.component.html',
  styles: []
})
export class RolesOptionsComponent implements OnInit {

  constructor(
               public _roleService: RolesService,
               public _optionsservice: OptionsService,
               public router: Router,
               public http: HttpClient) { }

  token = localStorage.getItem('token');
  roles: any[] = [];
  cols: any[];
  selectedFac: any[];
  prueba: any[] = [];

  ngOnInit() {
    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
    swal2.showLoading();
  //  this.getAcceso('/rolesoptions');
    this._roleService.getRoles().subscribe( resp => { this.roles = resp; swal2.close(); }
    , (err) => {swal2.fire({title: 'Ocurrio un error al cargar la informacion', allowOutsideClick: false })} );

   // this._roleService.prueba().subscribe( resp => { this.prueba = resp; console.log(this.prueba) } )

    this.cols = [

      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Nombre' },
      { field: 'description', header: 'Descripcion' },
      { field: 'herramientas', header: 'Opciones' }

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

  borraRol( id: string ) {

    swal2.fire({
      title: 'Desea Eliminar el Rol',
      text: 'Seleccionado',
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      allowOutsideClick: false
    }). then ( resp => {
      if ( resp.value) {

        this._roleService.borrarRol( id ).subscribe( () => {

          swal2.fire({
            title: 'El Rol',
            text: 'fue eliminado con exito',
            icon: 'success',
            showConfirmButton: true,
            showCancelButton: false,
            allowOutsideClick: false
          }). then ( res => {

            if ( res.value ) {
              this.ngOnInit();
            }

          } );

        }, (err) => {
         // swal2.close();
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
         }  );

      }
    });

  }


}
