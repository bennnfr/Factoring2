import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { PagosService, ReportesService, OptionsService } from '../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import swal2 from 'sweetalert2';

declare var $;

@Component({
  selector: 'app-aproveedor',
  templateUrl: './aproveedor.component.html',
  styles: []
})
export class AproveedorComponent implements OnInit {

  constructor(private _formBuilder: FormBuilder,
              public _optionsservice: OptionsService,
              public router: Router,
              private route: ActivatedRoute,
              public _reportesservice: ReportesService,
              public _pagosservice: PagosService) {}

  cols: any[];
  a = new Date();
  fecha: string;
  proveedores: any[];
  proveedoreso: any[] = [];
  proveedoresw: any[];
  proveedoresow: any[] = [];
  correo: string;
  facturas: any[] = [];
  selectedFac: any[];
  idp: string;
  idcontribuyente: string;
  idcontfinan: string;
  pago: any[] = [];
  supplierpaymentid = '';
  totalFac = 0;
  totalFacs = '0';
  totalFacsFormateado = '0';
  sinrecurso = 'false';
  valorcsrecurso = 'false';

  ngOnInit() {
    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
    swal2.showLoading();
    this.sinrecurso = 'false';
   // this.getAcceso('/pagos/aproveedor');

    this.a = new Date();

    (document.getElementById('npago') as HTMLInputElement).value = '';

    (document.getElementById('voucher') as HTMLInputElement).value = '';

    (document.getElementById('notas') as HTMLInputElement).value = '';

    this.totalFacs = '0';

    this.totalFacsFormateado = '0';

    this.proveedoreso = [];

    this.proveedores = [];

    this.selectedFac = [];

    this.facturas = [];

    this.correo = '';

    this.idp = '';

    this.totalFac = 0;

    this._pagosservice.getProveedores().subscribe( resp => {this.proveedores = resp; console.log(this.proveedores)
                                                            
                                                            swal2.close();
    } );

    this.a.setMinutes( this.a.getMinutes() + this.a.getTimezoneOffset() );
    let montha = '' + (this.a.getMonth() + 1);
    let daya = '' + this.a.getDate();
    const yeara = this.a.getFullYear();

    if (montha.length < 2) {
        montha = '0' + montha;
    }
    if (daya.length < 2) {
        daya = '0' + daya;
    }

    this.fecha = [yeara, montha, daya].join('-');

    this.cols = [
      { field: 'folio_reporte', header: 'Folio Reporte' },
      { field: 'folio_factura', header: 'Folio Factura' },
      { field: 'uuid', header: 'UUID' },
      { field: 'importe_neto', header: 'Importe Neto' },
      { field: 'porcentaje_operado', header: 'Porcentaje Operado' },
      { field: 'emisor', header: 'Emisor' },
      { field: 'receptor', header: 'Receptor' },
      { field: 'moneda', header: 'Moneda' },
      { field: 'fecha_operacion', header: 'Fecha Operacion' },
      { field: 'fecha_vencimiento', header: 'Fecha Vencimiento' },
      { field: 'fecha_emision', header: 'Fecha Emision' },
      { field: 'fecha_carga', header: 'Fecha Carga' },
      { field: 'estatus', header: 'Estatus' }
    ];

  }

  seleccioncsrecurso() {
    this.proveedoreso = [];
    this.proveedores = [];
    this.proveedoresow = [];
    this.proveedoresw = [];
   /* this.idp = '';
    this.correo = '';
    this.idcontribuyente = '';
    this.idcontfinan = ''; */
    this.valorcsrecurso = (document.querySelector('input[name = "screcurso"]:checked') as HTMLInputElement).value;
    this.sinrecurso = this.valorcsrecurso;
    if ( this.valorcsrecurso === 'false' ) {
      swal2.showLoading();
      this._pagosservice.getProveedores().subscribe( resp => {this.proveedores = resp; console.log(resp);
        swal2.close();
} );
    } else if (this.valorcsrecurso === 'true') {
      swal2.showLoading();
      this._pagosservice.getpayment_with_recourse_companies().subscribe( resp => {this.proveedoresw = resp; console.log(resp);
        swal2.close();
} );
    }
  }

  getcorreo() {
    if (this.valorcsrecurso === 'false') {
      const proveedor: any = document.getElementById('proveedor');
      const valorproveedor = proveedor.options[proveedor.selectedIndex].value;
       for ( const prop in this.proveedores ) {
  
        if ( this.proveedores[prop].id_proveedor == valorproveedor ) {
          this.idp = this.proveedores[prop].id_proveedor;
          this.correo = this.proveedores[prop].email_contribuyente;
          this.idcontribuyente = this.proveedores[prop].id_contribuyente;
          this.idcontfinan = this.proveedores[prop].id_cont_finan;
        //  break;
  
        }
        
      } 
    } else if (this.valorcsrecurso === 'true') {
      const proveedorw: any = document.getElementById('proveedorw');
    const valorproveedorw = proveedorw.options[proveedorw.selectedIndex].value;
    for ( const prop in this.proveedoresw ) {
  
      if ( this.proveedoresw[prop].id_cadena == valorproveedorw ) {
        this.idp = this.proveedoresw[prop].id_cadena;
        this.correo = this.proveedoresw[prop].email_contribuyente;
        this.idcontribuyente = this.proveedoresw[prop].id_contribuyente;
        this.idcontfinan = this.proveedoresw[prop].id_cont_finan;
      //  break;

      }
    } 
    }
    

  }

  getTotal() {

    this.totalFac = 0;
    let tp = 0;

    if ( this.selectedFac.length === 0 ) {

      this.totalFac = 0;

    } else {

      // tslint:disable-next-line: forin
      for ( const prop in this.selectedFac ) {

      //  this.totalFac = this.totalFac + parseFloat(this.selectedFac[prop].importe_neto);
        tp = tp + parseFloat(this.selectedFac[prop].importe_neto.replace(/,/g, ''));

      }

    }

   // this.totalFacs = this.totalFac.toFixed(2);
    this.totalFacs = tp.toFixed(2);
    this.totalFacsFormateado = tp.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  muestraFacturas() {
    if (this.valorcsrecurso === 'false') {
      const moneda: any = document.getElementById('moneda');

    const valormoneda = moneda.options[moneda.selectedIndex].value;

    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
    swal2.showLoading();

    this._pagosservice.getFacturasPagoProveedor( this.idp, valormoneda ).subscribe( resp => {
                                                                                              swal2.close();
                                                                                              this.facturas = resp;
                                                                                              if ( this.facturas.length === 0 ) {
                                                                                              swal2.fire(
                                                                                                'No se encontraron Datos',
                                                                                                '',
                                                                                                'error'
                                                                                              );
                                                                                            }
    } , (err) => {
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
          location.reload();
        }
      } );
     }  );
    } else if (this.valorcsrecurso === 'true') {
      const moneda: any = document.getElementById('moneda');

      const valormoneda = moneda.options[moneda.selectedIndex].value;
  
      swal2.fire({
        title: 'Cargando',
        allowOutsideClick: false
   });
      swal2.showLoading();
  
      this._pagosservice.getFacturasPagoProveedorw( this.idp, valormoneda ).subscribe( resp => {
                                                                                                swal2.close();
                                                                                                this.facturas = resp;
                                                                                                if ( this.facturas.length === 0 ) {
                                                                                                swal2.fire(
                                                                                                  'No se encontraron Datos',
                                                                                                  '',
                                                                                                  'error'
                                                                                                );
                                                                                              }
      } , (err) => {
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
            location.reload();
          }
        } );
       }  );
    }

  }

  guardar() {

    if (this.selectedFac.length === 0) {

      swal2.fire(
        'Debe seleccionar al menos una Factura',
        '',
        'error'
      );

    } else {

      const tpago: any = document.getElementById('tdpago');
      const moneda: any = document.getElementById('moneda');

      const valortpago = tpago.options[tpago.selectedIndex].value;
      const valormoneda = moneda.options[moneda.selectedIndex].value;

      const params = {
        token: '',
        secret_key: '',
        payment_source: 'PROVEEDOR',
        invoices: [],
        payment: { payment_date: (document.getElementById('fecha') as HTMLInputElement).value,
                   payment_number: (document.getElementById('npago') as HTMLInputElement).value,
                   payment_type: valortpago,
                   currency: valormoneda,
                   amount: this.totalFacs,
                   email_cfdi: (document.getElementById('correo') as HTMLInputElement).value,
                   notes: (document.getElementById('notas') as HTMLInputElement).value,
                   voucher: (document.getElementById('voucher') as HTMLInputElement).value,
                   contributor_from_id: this.idcontfinan,
                   contributor_to_id: this.idcontribuyente
      }
      };

      // tslint:disable-next-line: forin
      for (const prop in this.selectedFac) {
        params.invoices[prop] = {id: this.selectedFac[prop].id_factura.toString() };
      }
      swal2.fire({
        title: 'Cargando',
        allowOutsideClick: false
   });
      swal2.showLoading();
      this._pagosservice.aplicarPagoRAWproveedor(params).subscribe( resp => {
        swal2.close();
        swal2.fire({
          title: 'La informacion se registro',
          text: 'con exito',
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

   /*   swal2.fire({
        title: 'Cargando',
        allowOutsideClick: false
   });
      swal2.showLoading();

      this._pagosservice.aplicarPago(params).subscribe( resp => {
                                                                  swal2.close();

                                                                  // tslint:disable-next-line: forin
                                                                  for (const prop in this.selectedFac) {

                                                                  this._pagosservice.patchFacturas(this.selectedFac[prop].id_factura, resp).subscribe();

                                                                  }
                                                                  swal2.fire(
                                                                    'La informacion se registro con exito',
                                                                    '',
                                                                    'success'
                                                                  );
                                                                  this.ngOnInit();

      } , (err) => {
        swal2.close();
        console.log(err);
        swal2.fire(
             'Ocurrio un error',
             '',
             'error'
          );
        this.ngOnInit();
       } ); */

    }


  }

}







