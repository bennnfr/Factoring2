import { Component, OnInit } from '@angular/core';
import { ParametrosGeneralesService, OptionsService } from '../../services/service.index';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import swal2 from 'sweetalert2';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styles: []
})
export class ParametrosComponent implements OnInit {

  constructor(
               public _parametrosService: ParametrosGeneralesService,
               public _optionsservice: OptionsService,
               public router: Router,
               public http: HttpClient ) { }

  token = localStorage.getItem('token');
  parametros: any[] = [];
  cols: any[];
  selectedFac: any[];

  ngOnInit() {
    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
    swal2.showLoading();
   // this.getAcceso('/parametros');
    this._parametrosService.getParametros().subscribe( resp => { this.parametros = resp; swal2.close(); }
    , (err) => {swal2.fire({title: 'Ocurrio un error al cargar la informacion', allowOutsideClick: false })} );

    this.cols = [

      { field: 'id', header: 'ID' },
      { field: 'table', header: 'Table' },
      { field: 'id_table', header: 'Id_Table' },
      { field: 'key', header: 'Key' },
      { field: 'description', header: 'Descripcion' },
      { field: 'used_values', header: 'Used_Values' },
      { field: 'value', header: 'Valor' },
      { field: 'documentation', header: 'Documentacion' },
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

  borraParametro( id: string ) {

    swal2.fire({
      title: 'Desea Eliminar el Parametro',
      text: 'Seleccionado',
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      allowOutsideClick: false
    }). then ( resp => {
      if ( resp.value) {

        this._parametrosService.borrarParametro( id ).subscribe( () => {

          swal2.fire({
            title: 'El Parametro',
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
