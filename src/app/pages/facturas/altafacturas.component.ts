import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ɵConsole } from '@angular/core';
import { FacturasService, OptionsService } from '../../services/service.index';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import swal2 from 'sweetalert2';

declare var $;

@Component({
  selector: 'app-altafacturas',
  templateUrl: './altafacturas.component.html',
  styles: []
})
export class AltaFacturasComponent implements OnInit {
  facturasbien = 0;
  facturaserror = 0;
  facturaserrorarr = [];
  facturasbienarr = [];
  muestrareporte: boolean;
  habilitaprocesar: boolean;
  currency: any[] = [];
  estatus: any[] = [];
  xmlData: string;
  datosxml: any[] = [];
  facturasexc: any[] = [];
  arrayBuffer:any;
  file:File;
  constructor( public _facturasservice: FacturasService,
               public _optionsservice: OptionsService,
               public http: HttpClient,
               public router: Router ) {}

  ngOnInit() {
    swal2.showLoading();
    this.muestrareporte = false;
    this.habilitaprocesar = true;
    this._facturasservice.getInvoiceCurrency().subscribe( resp => this.currency = resp );
    this._facturasservice.getInvoiceStatus().subscribe( resp => this.estatus = resp );
    swal2.close();
  }

  refrescar() {
    window.location.reload();
  }

  formatoFecha( fecha: string ) {

    const a = new Date((document.getElementById(fecha)as HTMLInputElement).value);
    a.setMinutes( a.getMinutes() + a.getTimezoneOffset() );
    let montha = '' + (a.getMonth() + 1);
    let daya = '' + a.getDate();
    const yeara = a.getFullYear();

    if (montha.length < 2) {
        montha = '0' + montha;
    }
    if (daya.length < 2) {
        daya = '0' + daya;
    }

    const resul = [yeara, montha, daya].join('-');

    return resul;

  }

  formatoFechaexcel( fecha: string ) {
  //  fecha = '06/07/2021';
    const a = new Date(fecha);
   // console.log(a);
    a.setMinutes( a.getMinutes() + a.getTimezoneOffset() );
    let montha = '' + (a.getMonth() + 1);
    let daya = '' + a.getDate();
    const yeara = a.getFullYear();

    if (montha.length < 2) {
        montha = '0' + montha;
    }
    if (daya.length < 2) {
        daya = '0' + daya;
    }

    const resul = [yeara, montha, daya].join('-');

    return resul;

  }

  guardaFactura() {
    swal2.showLoading();
    const moneda: any = document.getElementById('currency');
    const estatus: any = document.getElementById('status');

    const valormoneda = moneda.options[moneda.selectedIndex].value;
    const valorestatus = estatus.options[estatus.selectedIndex].value;

    const data = {
      token: '',
      secret_key: '',
      emitter_rfc: (document.getElementById('emitter_rfc') as HTMLInputElement).value,
      receiver_rfc: (document.getElementById('receiver_rfc') as HTMLInputElement).value,
      document_type: (document.getElementById('document_type') as HTMLInputElement).value,
      invoice_serie: (document.getElementById('invoice_serie') as HTMLInputElement).value,
      invoice_folio: (document.getElementById('invoice_folio') as HTMLInputElement).value,
      invoice_date: this.formatoFecha('invoice_date'),
      entry_date: this.formatoFecha('entry_date'),
     // used_date: this.formatoFecha('used_date'),
     // due_date: this.formatoFecha('due_date'),
      currency: valormoneda,
     // exchange_rate: (document.getElementById('exchange_rate') as HTMLInputElement).value,
      total: (document.getElementById('total') as HTMLInputElement).value,
     // total_used: (document.getElementById('total_used') as HTMLInputElement).value,
      status: valorestatus,
      xml: (document.getElementById('xml') as HTMLInputElement).value,
      pdf: (document.getElementById('pdf') as HTMLInputElement).value,
    //  payment_report_folio: (document.getElementById('payment_report_folio') as HTMLInputElement).value,
    //  charge_report_folio: (document.getElementById('charge_report_folio') as HTMLInputElement).value,
      uuid: (document.getElementById('uuid') as HTMLInputElement).value,
      project_key: (document.getElementById('nproyecto') as HTMLInputElement).value,
      project_description: (document.getElementById('dproyecto') as HTMLInputElement).value,
     /* on_request: (document.getElementById('on_request') as HTMLInputElement).value,
      rug: (document.getElementById('rug') as HTMLInputElement).value,
      company_id: (document.getElementById('company_id') as HTMLInputElement).value,
      supplier_id: (document.getElementById('supplier_id') as HTMLInputElement).value,
      company_payment_id: (document.getElementById('company_payment_id') as HTMLInputElement).value,
      supplier_payment_id: (document.getElementById('supplier_payment_id') as HTMLInputElement).value,
      order_id: (document.getElementById('order_id') as HTMLInputElement).value */

  };

    this._facturasservice.guardaFactura(data).subscribe( () => {
      swal2.close();
      swal2.fire({
        title: 'Alta de factura',
        text: 'Exitosa',
        icon: 'success',
        showConfirmButton: true,
        showCancelButton: false,
        allowOutsideClick: false
      }). then ( res => {

        if ( res.value ) {
          window.location.reload();
        }

      } );
}, (err) => {               swal2.close();
                            console.log(err);
                            Swal.fire(
                              'Error al dar de alta la Factura',
                              err.error.errors[0],
                              'error'
                           );
                        } );

  }

  incomingfile(event) 
  {

  this.file= event.target.files[0];
  this.habilitaprocesar = false;
  }

  Upload() {
    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
  swal2.showLoading();
  let fileReader = new FileReader();
    fileReader.onload =  (e) => {
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, {type:"binary", cellDates: true});
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
       // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
        this.facturasexc = XLSX.utils.sheet_to_json(worksheet,{raw:true});
      //  console.log(this.facturasexc);
        this.guardafacturasexcel(this.facturasexc)
     
      const idd =  setTimeout(() => {
          swal2.close();
          this.muestrareporte = true;
          
        }, 5000);
    
  }
    fileReader.readAsArrayBuffer(this.file);
}

 guardafacturasexcel(facturas) {
  let f = new Date();
  let fechaactual = this.formatoFechaexcel(f.toString());
  
  for (const prop in facturas) {
      const data = {
        token: '',
        secret_key: '',
        emitter_rfc: facturas[prop].RFC_contribuyente_emisor,
        receiver_rfc: facturas[prop].RFC_contribuyente_receptor,
        document_type: facturas[prop].Tipo_documento,
        invoice_serie: facturas[prop].Serie_factura,
        invoice_folio: facturas[prop].Folio_de_la_factura,
        invoice_date: this.formatoFechaexcel(facturas[prop].Fecha_de_la_factura),
        entry_date: fechaactual,
        currency: facturas[prop].Moneda,
        total: facturas[prop].Total_de_la_factura,
        status: 'PENDIENTE',
        xml: facturas[prop].XML,
        pdf: facturas[prop].PDF,
        uuid: facturas[prop].UUID,
        project_key: '',
        project_description: '',
    
    };
        if ( data.document_type === undefined ) {
          data.document_type = '';
        }
        if ( data.invoice_serie === undefined ) {
          data.invoice_serie = '';
        }
        if ( data.pdf === undefined ) {
          data.pdf = '';
        }
        // console.log(data);
       
        this._facturasservice.guardaFactura(data).subscribe( (res) => {
          this.facturasbien = this.facturasbien + 1;
          this.facturasbienarr.push( {folio: data.uuid, error: 'OK'} );
        }, 
        (err) => {     //console.log(err)
          //console.clear();
          this.facturaserror = this.facturaserror + 1;
          if (err.status === 500) {
            this.facturaserrorarr.push( {folio: data.uuid, error: 'Error desconocido'} );
          } else {
            switch (err.error.errors[0]) {
              case 'Uuid has already been taken':
                err.error.errors[0] = 'La factura ya existe';
                break;
              case `Uuid can't be blank`:
                err.error.errors[0] = 'El campo UUID esta vacio';
                break;
              case `Invoice folio can't be blank`:
                err.error.errors[0] = 'El campo folio de la factura esta vacio';
                break;
              case `Xml can't be blank`:
                err.error.errors[0] = 'El campo xml esta vacio';
                break;
              case `Total can't be blank`:
                err.error.errors[0] = 'El Total de la factura esta vacio';
                break;  
            }
            this.facturaserrorarr.push( {folio: data.uuid, error: err.error.errors[0]} );
          }  
                        }
                         );
                    
} 
}

exportexcelcorrectas() {
  /* table id is passed over here */
  const element = document.getElementById('facturasCorrectas');
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
  /* generate workbook and add the worksheet */
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  /* save to file */
  XLSX.writeFile(wb, 'facturascorrectas.xlsx');
}

exportexcelerrores() {
  /* table id is passed over here */
  const element = document.getElementById('facturasErrores');
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
  /* generate workbook and add the worksheet */
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  /* save to file */
  XLSX.writeFile(wb, 'facturaserrores.xlsx');
}

}







