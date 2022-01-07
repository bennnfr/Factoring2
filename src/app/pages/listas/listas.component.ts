import { Component, OnInit } from '@angular/core';
import { ListasService, OptionsService } from '../../services/service.index';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import swal2 from 'sweetalert2';

@Component({
  selector: 'app-listas',
  templateUrl: './listas.component.html',
  styles: []
})
export class ListasComponent implements OnInit {

  constructor(
               public _listasService: ListasService,
               public _optionsservice: OptionsService,
               public router: Router,
               public http: HttpClient) { }

  token = localStorage.getItem('token');
  listas: any[] = [];
  cols: any[];
  selectedFac: any[];

  ngOnInit() {
    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
    swal2.showLoading();
  //  this.getAcceso('/listas');
    this._listasService.getListas().subscribe( resp => { this.listas = resp; swal2.close(); }
    , (err) => {swal2.fire({title: 'Ocurrio un error al cargar la informacion', allowOutsideClick: false })} );

    this.cols = [

      { field: 'id', header: 'ID' },
      { field: 'domain', header: 'Dominio' },
      { field: 'key', header: 'Key' },
      { field: 'value', header: 'Valor' },
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

  borraLista( id: string ) {

    swal2.fire({
      title: 'Desea Eliminar la Lista',
      text: 'Seleccionada',
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      allowOutsideClick: false
    }). then ( resp => {
      if ( resp.value) {

        this._listasService.borrarLista( id ).subscribe( () => {

          swal2.fire({
            title: 'La Lista',
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
        //  console.log(err);
          console.clear();
          swal2.fire({
            title: 'Ocurrio un error',
            text: err.error.errors[0],
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
