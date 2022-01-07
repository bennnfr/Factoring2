import { Component, OnInit } from '@angular/core';
import { OptionsService } from '../../services/service.index';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import swal2 from 'sweetalert2';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styles: []
})
export class OptionsComponent implements OnInit {

  constructor(
               public _optionsservice: OptionsService,
               public router: Router,
               public http: HttpClient ) { }

  token = localStorage.getItem('token');
  options: any[] = [];
  cols: any[];
  selectedFac: any[];
  tieneacceso = false;
  ngOnInit() {
    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
    swal2.showLoading();
   // this.getAcceso('/options');
    this._optionsservice.getOptions().subscribe( resp => { this.options = resp; swal2.close(); }
    , (err) => {swal2.fire({title: 'Ocurrio un error al cargar la informacion', allowOutsideClick: false })} );

    this.cols = [

      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Nombre' },
      { field: 'description', header: 'Descripcion' },
      { field: 'group', header: 'Grupo' },
      { field: 'url', header: 'URL' },
      { field: 'herramientas', header: 'Herramientas' }

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

  borraOption( id: string ) {
    swal2.showLoading();
    swal2.fire({
      title: 'Desea Eliminar la opcion',
      text: 'Seleccionada',
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      allowOutsideClick: false
    }). then ( resp => {
      if ( resp.value) {

        this._optionsservice.borrarOption( id ).subscribe( () => {
          swal2.close();
          swal2.fire({
            title: 'La opcion',
            text: 'fue eliminada con exito',
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
    });

  }

}
