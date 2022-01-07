import { Component, OnInit } from '@angular/core';
import { UsuarioService, PrivilegiosUsuariosService } from '../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import swal2 from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
declare var $;


@Component({
  selector: 'app-privilegiousuario',
  templateUrl: './privilegiousuario.component.html',
  styles: []
})
export class PrivilegioUsuarioComponent implements OnInit {

  constructor( public _usuarioservice: UsuarioService,
               public _privilegiosusuarios: PrivilegiosUsuariosService,
               private route: ActivatedRoute,
               public http: HttpClient) { }

  doc = new jsPDF();
  usuarios: any[] = [];
  usuario: string;
  cols: any[];
  selectedFac: any[];
  router: Router;
  fileName = 'ListaDeUsuarios.xlsx';
  selectedColumns: any[];
  exportColumns: any[];
  privilegios: any[] = [];
  id: string;
  nombrepriv: string;

  ngOnInit() {

    this.id = this.route.snapshot.paramMap.get('id');

    this._privilegiosusuarios.getPrivilegiosUsuario( this.id ).subscribe( resp => { this.privilegios = resp; 
      this._privilegiosusuarios.getUsuario( this.id ).subscribe( (resp: string) => this.nombrepriv = resp );
    } );

    this.cols = [

      { field: 'id', header: 'ID' },
      { field: 'value', header: 'Valor' },
      { field: 'description', header: 'Descripcion' },
      { field: 'documentation', header: 'Documentacion' },
      { field: 'herramientas', header: 'Herramientas' }


  ];

  }

  borraPrivilegio(privilegioid: string, usuarioid: string) {

    swal2.fire({
      title: 'Desea Eliminar el Privilegio',
      text: 'Seleccionado',
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      allowOutsideClick: false
    }). then ( resp => {
      if ( resp.value) {
 
        this._privilegiosusuarios.borraPrivilegio( privilegioid, usuarioid ).subscribe( () => {

          swal2.fire({
            title: 'El Privilegio',
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
         }  );

      }
    });

   // this._privilegiosusuarios.borraPrivilegio( privilegioid, usuarioid ).subscribe();
  }

}
