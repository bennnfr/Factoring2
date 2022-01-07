import { Component, OnInit } from '@angular/core';
import { TarifasService, OptionsService } from '../../services/service.index';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import swal2 from 'sweetalert2';

@Component({
  selector: 'app-tarifas',
  templateUrl: './tarifas.component.html',
  styles: []
})
export class TarifasComponent implements OnInit {

  constructor(
               public _tarifasservice: TarifasService,
               public _optionsservice: OptionsService,
               public router: Router,
               public http: HttpClient) { }

  token = localStorage.getItem('token');
  tarifas: any[] = [];
  cols: any[];
  selectedFac: any[];
  // router: Router;

  ngOnInit() {
    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
    swal2.showLoading();
   // this.getAcceso('/tarifas');
    this._tarifasservice.getTarifas().subscribe( resp => { this.tarifas = resp; swal2.close(); }
    , (err) => {swal2.fire({title: 'Ocurrio un error al cargar la informacion', allowOutsideClick: false })} );

    this.cols = [

      { field: 'key', header: 'Key' },
      { field: 'start_date', header: 'Fecha Inicio' },
      { field: 'end_date', header: 'Fecha Fin' },
      { field: 'value', header: 'Valor' },
      { field: 'rate_type', header: 'Tipo' },
      { field: 'description', header: 'Descripcion' },
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

  borraTarifa( id: string ) {

    swal2.fire({
      title: 'Desea Eliminar la Tarifa',
      text: 'Seleccionada',
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      allowOutsideClick: false
    }). then ( resp => {
      if ( resp.value) {
        swal2.showLoading();
        this._tarifasservice.borraTarifa( id ).subscribe( () => {
          swal2.close();
          swal2.fire({
            title: 'La Tarifa',
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
