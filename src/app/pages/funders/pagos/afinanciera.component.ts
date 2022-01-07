import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { PagosService, ReportesService, OptionsService, AltaSolicitudesService, FundersService, ContribuyentesService } from '../../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import swal2 from 'sweetalert2';

declare var $;

@Component({
  selector: 'app-afinanciera',
  templateUrl: './afinanciera.component.html',
  styles: []
})
export class AfinancieraComponent implements OnInit {

  constructor(private _formBuilder: FormBuilder,
              public _optionsservice: OptionsService,
              public router: Router,
              public _solicitudesservice: AltaSolicitudesService,
              public _contribuyentesService: ContribuyentesService,
              public _reportesservice: ReportesService,
              public _fundersservice: FundersService,
              public _pagosservice: PagosService) {}

  cols: any[];
  a = new Date();
  fecha: string;
  correo: string;
  facturas: any[] = [];
  selectedFac: any[];
  idp: string;
  idcontribuyente: string;
  idcontfinan: string;
  idc: string;
  contribuyentes: any [] = [];
  pago: any[] = [];
  supplierpaymentid = '';
  totalFac = 0;
  totalFacs = '0';
  totalFacsFormateado = '0';
  idu = '';
  cadenaproveedor: any[];
  nombrecadena: string[];
  financieras: any[] = [];
  contributor_from_id: string;
  contributor_to_id: string;
  cadenas: any[];
  cadenaso: any[] = [];

  ngOnInit() {
    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
    swal2.showLoading();

   // this.getAcceso('/pagos/afinanciera');

    this.a = new Date();

    (document.getElementById('npago') as HTMLInputElement).value = '';

    (document.getElementById('voucher') as HTMLInputElement).value = '';

    (document.getElementById('notas') as HTMLInputElement).value = '';

    this.totalFacs = '0';

    this.totalFacsFormateado = '0';

    this.selectedFac = [];

    this.facturas = [];

    this.correo = '';

    this.idp = '';

    this.totalFac = 0;

    this.idu = localStorage.getItem('id');

    this._pagosservice.getCadenas().subscribe( resp => {this.cadenas = resp; // console.log(this.cadenas);
      // tslint:disable-next-line: forin
        for ( const prop in this.cadenas ) {
       this.cadenaso.push( this.cadenas[prop].nombre_cadena);
         }
  this.cadenaso.sort();
} );
 
    this._fundersservice.getfundersfinancial().subscribe( resp => {this.financieras = resp; swal2.close();} );

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

  getcorreo() {
    const idfunder = (document.getElementById('fondeador') as HTMLInputElement).value
    for ( const prop in this.financieras ) {
      if ( this.financieras[prop].id_funder == idfunder ) {
      //  console.log(this.financieras[prop]);
        this.correo = this.financieras[prop].email_finan;
        this.contributor_from_id = this.financieras[prop].id_contribuyente;
        this.contributor_to_id = this.financieras[prop].id_cont_finan;
        break;

      }

    }
  //  console.log(this.contributor_from_id);
  //  console.log(this.contributor_to_id);
  }

  vaciafacturas() {
    this.facturas = [];
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
    const moneda: any = document.getElementById('moneda');
    const valormoneda = moneda.options[moneda.selectedIndex].value;
    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
 swal2.fire({
  title: 'Cargando',
  allowOutsideClick: false
});
    swal2.showLoading();
  //  console.log(this.idc);
  //  console.log(valormoneda);
    this._fundersservice.getcompanyfacturas( (document.getElementById('cadena') as HTMLInputElement).value, valormoneda ).subscribe( resp => {
                                                                                              swal2.close();
                                                                                              this.facturas = resp; // console.log(this.facturas);
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
          this.ngOnInit();
        }
      } );
     }  );

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
        payment_source: 'FONDEO',
        invoices: [],
        payment: { payment_date: (document.getElementById('fecha') as HTMLInputElement).value,
                   payment_number: (document.getElementById('npago') as HTMLInputElement).value,
                   payment_type: valortpago,
                   currency: valormoneda,
                   amount: this.totalFacs,
                   email_cfdi: (document.getElementById('correo') as HTMLInputElement).value,
                   notes: (document.getElementById('notas') as HTMLInputElement).value,
                   voucher: (document.getElementById('voucher') as HTMLInputElement).value,
                   contributor_from_id: this.contributor_from_id,
                   contributor_to_id: this.contributor_to_id
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
   swal2.fire({
    title: 'Cargando',
    allowOutsideClick: false
});
      swal2.showLoading();
    //  console.log(params);
      this._pagosservice.aplicarPagoRAWproveedor(params).subscribe( resp => { // console.log(resp);
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

    }


  }

}







