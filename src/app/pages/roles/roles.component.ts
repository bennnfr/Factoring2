import { Component, OnInit } from '@angular/core';
import { RolesService, OptionsService, SettingsService } from '../../services/service.index';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import swal2 from 'sweetalert2';
import * as jsPDF from 'jspdf';
import * as firebase from 'firebase';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styles: []
})
export class RolesComponent implements OnInit {

  constructor(
               public _roleService: RolesService,
               public _options: OptionsService ,
               public route: Router,
               public http: HttpClient) { }

  roles: any[] = [];
  cols: any[];
  selectedFac: any[];
  router: Router;
  tieneacceso = false;
  ngOnInit() {
   // this.tieneacceso = this.setings.getPermiso('/roles');
   swal2.fire({
    title: 'Cargando',
    allowOutsideClick: false
});
    swal2.showLoading();
  //  this.getAcceso('/roles');
    this._roleService.getRoles().subscribe( resp => { this.roles = resp; swal2.close(); }
    , (err) => {swal2.fire({title: 'Ocurrio un error al cargar la informacion', allowOutsideClick: false })} );

    this.cols = [

      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Nombre' },
      { field: 'description', header: 'Descripcion' },
      { field: 'herramientas', header: 'Herramientas' }

  ];

  }

  getAcceso(url) {
    this._options.getOptionsxUsuario(localStorage.getItem('id')).subscribe(resp2 => {
      // tslint:disable-next-line: forin
      for (const j in resp2 ) {
          if ( resp2[j].url === url ) {
            this.tieneacceso = true;
            break;
          }
        }
      if (!this.tieneacceso) {
        this.route.navigate(['/accesodenegado']);
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
         // console.log(err);
         console.clear();
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
