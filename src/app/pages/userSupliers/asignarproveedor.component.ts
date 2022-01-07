import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserOptionsService, UsuarioService, AltaSolicitudesService, PagosService } from '../../services/service.index';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import swal2 from 'sweetalert2';
import { map } from 'rxjs/operators';
import { Idd } from '../../models/usuario.model';
declare var $;

@Component({
  selector: 'app-asignarproveedor',
  templateUrl: './asignarproveedor.component.html',
  styles: []
})
export class AsignarProveedorComponent implements OnInit {

  idu: string;
  nombreUsuaOp: string;
  subscription: Subscription;
  NombreProveedor = '';
  proveedores: any[];
  proveedoreso: any[] = [];
  selectedProv = [];
  cols: any[] = [];
  hayproveedor: boolean;
  constructor( public _optionsservice: UserOptionsService,
               public _usuariosservice: UsuarioService,
               public _solicitudesservice: AltaSolicitudesService,
               public _pagosservice: PagosService,
               public router: Router,
               public http: HttpClient,
               private route: ActivatedRoute ) {

                }

  ngOnInit() {
    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
    swal2.showLoading();
    this.proveedoreso = [];

    this.proveedores = [];

    this.idu = this.route.snapshot.paramMap.get('id');

    this._optionsservice.getUsuario(this.idu).subscribe( (resp: string) =>  this.nombreUsuaOp = resp  );

    this._solicitudesservice.getCadenaProveedor(this.idu).subscribe( resp => {
                                                                               if (resp.length === 0) {
                                                                                 this.NombreProveedor = 'Ninguno';
                                                                                 this.hayproveedor = false;
                                                                               } else {
                                                                                this.NombreProveedor = resp[0].proveedor;
                                                                                this.hayproveedor = true;
                                                                               }
                                                                               swal2.close();

} );

    this._pagosservice.getProveedores().subscribe( resp => {this.proveedores = resp;
} );

    this.cols = [
  { field: 'nombre_proveedor', header: 'Nombre Proveedor' }
];

  }

  refresh() {

    this.ngOnInit();
  // window.location.reload();
  }

  Asignaproveedor() {
    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
    swal2.showLoading();
    if (this.selectedProv.length === 0) {
      swal2.close();
      swal2.fire({
        title: 'Debe seleccionar al menos un Proveedor',
        text: '',
        icon: 'error',
        showConfirmButton: true,
        showCancelButton: false,
        allowOutsideClick: false
      });

    } else if (this.selectedProv.length > 1) {
      swal2.close();
      swal2.fire({
        title: 'Debe seleccionar solo un Proveedor',
        text: '',
        icon: 'error',
        showConfirmButton: true,
        showCancelButton: false,
        allowOutsideClick: false
      });

    } else {

    const params = {
      token: '',
      secret_key: '',
      user_id: this.idu,
      supplier_id: this.selectedProv[0].id_proveedor
    };

    this._pagosservice.postUsuarioProveedor(params).subscribe( resp => {
      swal2.close();
      swal2.fire({
        title: 'El proveedor fue asignado',
        text: 'Con exito',
        icon: 'success',
        showConfirmButton: true,
        showCancelButton: false,
        allowOutsideClick: false
      }). then ( res => {

        if ( res.value ) {
          this.router.navigate(['/usuariosproveedores']);
        }

      } );

     }, (err) => {
      swal2.close();
      console.log(err);
      swal2.fire(
           'Error al guardar',
           err.error.errors[0],
           'error'
        );
     } );
    }
  }

  borraproveedor() {
    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
    swal2.showLoading();
    if (this.hayproveedor) {

      this._pagosservice.getSuplierUser(this.idu).subscribe( resp => { swal2.close(); // console.log(resp[0].supplier_user_id);
                                                                       this._pagosservice.borraSuplierUser(resp[0].supplier_user_id).subscribe(
                                                                         resp2 => {
                                                                          swal2.fire({
                                                                            title: 'El proveedor fue eliminado',
                                                                            text: 'Con exito',
                                                                            icon: 'success',
                                                                            showConfirmButton: true,
                                                                            showCancelButton: false,
                                                                            allowOutsideClick: false
                                                                          }). then ( res => {
                                                                            if ( res.value ) {
                                                                              this.router.navigate(['/usuariosproveedores']);
                                                                            }

                                                                          } );
                                                                         }, (err) => {
                                                                          swal2.close();
                                                                          console.log(err);
                                                                          swal2.fire(
                                                                               'Error al eliminar',
                                                                               err.error.errors[0],
                                                                               'error'
                                                                            );
                                                                         }
                                                                       ); } );

    } else {
      swal2.close();
      swal2.fire({
        title: 'No existe proveedor asignado',
        text: '',
        icon: 'error',
        showConfirmButton: true,
        showCancelButton: false,
        allowOutsideClick: false
      });
    }

  }

}







