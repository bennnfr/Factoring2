import { Component, OnInit, Input } from '@angular/core';
import { ReportesService, OptionsService } from '../../services/service.index';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import swal2 from 'sweetalert2';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
declare var $;



@Component({
  selector: 'app-pagoscompany',
  templateUrl: './pagoscompany.component.html',
  styles: []
})
export class PagosCompanyComponent implements OnInit {

  constructor( public _reportesservice: ReportesService,
               public router: Router,
               public _optionsservice: OptionsService,
               public http: HttpClient) { }

  doc = new jsPDF();
  facturas: any[] = [];
  usuario: string;
  cols: any[];
  colspdf: any[];
  selectedFac: any[];
 // router: Router;
  fileName = 'ListaDeFacturas.xlsx';
  idc: string;
  selectedColumnsp: any[];
  selectedColumnspdf: any[];
  exportColumns: any[];
  companyes: any[];
  companyesw: any[];
  cdirecta = 'true';
  valorcdirecta = 'true';
  _selectedColumns: any[];

  ngOnInit() {
    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
    swal2.showLoading();
   // this.getAcceso('/pagoscompany');
    this._reportesservice.getCompapanyes().subscribe( resp => { this.companyes = resp; swal2.close();}
    , (err) => {swal2.fire({title: 'Ocurrio un error al cargar la informacion', allowOutsideClick: false })} );

    this.cols = [

    //  { field:  'id_factura', header: 'ID'},
      { field:  'id_factura', header: 'ID Factura'},
      { field:  'folio_solicitud', header: 'folio_solicitud'},
      { field:  'cadena', header: 'Cadena'},
      { field:  'no_factura', header: 'NoFactura'},
      { field:  'proveedor', header: 'Proveedor'},
      { field:  'importe', header: 'Importe'},
      { field:  'moneda', header: 'Moneda'},
      { field:  'fecha_operacion', header: 'Fecha Operacion'},
      { field:  'fecha_vencimiento', header: 'Fecha Vencimiento'},
      { field:  'fecha_carga', header: 'Fecha Carga'},
      { field:  'dias_transcurridos', header: 'Dias Transcurridos'},

  ];

    this._selectedColumns = this.cols;
    this.colspdf = [

    //  { field:  'id_factura', header: 'ID'},
    { field:  'id_factura', header: 'ID Factura'},
      { field:  'folio_solicitud', header: 'folio_solicitud'},
      { field:  'cadena', header: 'Cadena'},
      { field:  'no_factura', header: 'NoFactura'},
      { field:  'proveedor', header: 'Proveedor'},
      { field:  'importe', header: 'Importe'},
      { field:  'moneda', header: 'Moneda'},
      { field:  'fecha_operacion', header: 'Fecha Operacion'},
      { field:  'fecha_vencimiento', header: 'Fecha Vencimiento'},
      { field:  'fecha_carga', header: 'Fecha Carga'},
      { field:  'dias_transcurridos', header: 'Dias Transcurridos'},
];
    this.selectedColumnsp = this.cols;
    this.exportColumns = this.colspdf.map(col => ({title: col.header, dataKey: col.field}));

  }

  seleccioncsrecurso() {
    this.valorcdirecta = (document.querySelector('input[name = "screcurso"]:checked') as HTMLInputElement).value;
    this.cdirecta = this.valorcdirecta;
    if ( this.cdirecta === 'true' ) {
      swal2.showLoading();
      this._reportesservice.getCompapanyes().subscribe( resp => {this.companyes = resp;
    swal2.close();
} );
    } else if (this.cdirecta === 'false') {
      swal2.showLoading();
      this._reportesservice.getCompapanyesw().subscribe( resp => {this.companyesw = resp;
    swal2.close();
} );
    }
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
}

set selectedColumns(val: any[]) {
  // restore original order
  this._selectedColumns = this.cols.filter(col => val.includes(col));
}

generarReporte() {
  if (this.cdirecta === 'true') {
    
  const company: any = document.getElementById('cadena');

  const valorcompany = company.options[company.selectedIndex].value;

  

  /* for ( const prop in this.companyes ) {
    if ( this.companyes[prop].nombre_cadena === valorcompany ) {
      this.idc = this.companyes[prop].id_cadena;
      break;
    }
  } */

  const d = new Date((document.getElementById('fechaconsulta')as HTMLInputElement).value);
  d.setMinutes( d.getMinutes() + d.getTimezoneOffset() );
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) {
        month = '0' + month;
    }
  if (day.length < 2) {
        day = '0' + day;
    }

  const fecharepor = [year, month, day].join('-');

  swal2.fire({
    title: 'Cargando',
    allowOutsideClick: false
});
  swal2.showLoading();

  this._reportesservice.getCompanyPayments(fecharepor, valorcompany).subscribe(resp => {swal2.close(); this.facturas = resp;

                                                                                    if (this.facturas.length === 0) {
                                                                                      swal2.fire(
                                                                                        'No se encontraron datos',
                                                                                        '',
                                                                                        'error'
                                                                                      );
                                                                                    }

                                                                                    }, (err) => {
                                                                                    swal2.close();
                                                                                    swal2.fire(
                                                                                         'Ocurrio un error al procesar la informacion',
                                                                                         '',
                                                                                         'error'
                                                                                      );
                                                                                   // this.ngOnInit();
                                                                                    } );

                                                                                  }
else if (this.cdirecta === 'false' ) {
  
  const company: any = document.getElementById('cadenaw');

  const valorcompany = company.options[company.selectedIndex].value;

  

  /* for ( const prop in this.companyes ) {
    if ( this.companyes[prop].nombre_cadena === valorcompany ) {
      this.idc = this.companyes[prop].id_cadena;
      break;
    }
  } */

  const d = new Date((document.getElementById('fechaconsulta')as HTMLInputElement).value);
  d.setMinutes( d.getMinutes() + d.getTimezoneOffset() );
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) {
        month = '0' + month;
    }
  if (day.length < 2) {
        day = '0' + day;
    }

  const fecharepor = [year, month, day].join('-');

  swal2.fire({
    title: 'Cargando',
    allowOutsideClick: false
});
  swal2.showLoading();

  this._reportesservice.getCompanyPaymentsw(fecharepor, valorcompany).subscribe(resp => {swal2.close(); this.facturas = resp;

                                                                                    if (this.facturas.length === 0) {
                                                                                      swal2.fire(
                                                                                        'No se encontraron datos',
                                                                                        '',
                                                                                        'error'
                                                                                      );
                                                                                    }

                                                                                    }, (err) => {
                                                                                    swal2.close();
                                                                                    swal2.fire(
                                                                                         'Ocurrio un error al procesar la informacion',
                                                                                         '',
                                                                                         'error'
                                                                                      );
                                                                                   // this.ngOnInit();
                                                                                    } );
}
}


  exportexcel() {
     /* table id is passed over here */
     const element = document.getElementById('tablaFacturas');
     const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
     /* generate workbook and add the worksheet */
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
     /* save to file */
     if ( this.facturas.length > 0 ) {

      this.fileName = this.facturas[0].charge_report_folio + '.xlsx';

     }
     XLSX.writeFile(wb, this.fileName);
  }


  exportpdf() {

   import('jspdf').then( jsPDF => {
    import('jspdf-autotable').then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportColumns, this.facturas);
        doc.save('ListaFacturas.pdf');
    });
});

  }

}
