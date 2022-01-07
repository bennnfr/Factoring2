import { Component, OnInit, Input } from '@angular/core';
import { ReportesService } from '../../services/service.index';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import swal2 from 'sweetalert2';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
declare var $;



@Component({
  selector: 'app-layoutbanorte',
  templateUrl: './layoutbanorte.component.html',
  styles: []
})
export class LayoutBanorteComponent implements OnInit {

  constructor( public _reportesservice: ReportesService,
               public http: HttpClient) { }

  token = localStorage.getItem('token');
  doc = new jsPDF();
  facturas: any[] = [];
  usuario: string;
  cols: any[];
  colspdf: any[];
  selectedFac: any[];
  router: Router;
  fileName = 'ListaDeFacturas.xlsx';
  selectedColumnsp: any[];
  selectedColumnspdf: any[];
  exportColumns: any[];
  fecha: string;
  _selectedColumns: any[];

  ngOnInit() {

    

    for (  let i = 1; i < 30; i++ ) {
      this.fecha = '2020-02-';
     // console.log(i.toString());
      this.fecha = this.fecha + i.toString();
      
      this._reportesservice.getBanorte(this.fecha,'supplier').subscribe( resp => {
       // console.log(resp);
        if (resp.length !== 0) {
          console.log('hola');
          console.log(this.fecha);
        }
      } );
    }

    this.cols = [

    //  { field:  'id_factura', header: 'ID'},
      { field:  'id_factura', header: 'ID Factura'},
      { field:  'oper', header: 'Operacion'},
      { field:  'clave_id', header: 'Clave'},
      { field:  'cuenta_origen', header: 'Cuenta Origen'},
      { field:  'cuenta_destino', header: 'Cuenta Destino'},
      { field:  'importe', header: 'Importe'},
      { field:  'referencia', header: 'Referencia'},
      { field:  'descripcion', header: 'Descripcion'},
      { field:  'rfc_ordenante', header: 'RFC Ordenante'},
      { field:  'iva', header: 'IVA'},
      { field:  'fecha_aplicacion', header: 'Fecha Aplicacion'},
      { field:  'instruccion_pago', header: 'Instruccion Pago'}
  ];

    this._selectedColumns = this.cols;
    this.colspdf = [

    //  { field:  'id_factura', header: 'ID'},
    { field:  'id_factura', header: 'ID Factura'},
    { field:  'oper', header: 'Operacion'},
    { field:  'clave_id', header: 'Clave'},
    { field:  'cuenta_origen', header: 'Cuenta Origen'},
    { field:  'cuenta_destino', header: 'Cuenta Destino'},
    { field:  'importe', header: 'Importe'},
    { field:  'referencia', header: 'Referencia'},
    { field:  'descripcion', header: 'Descripcion'},
    { field:  'rfc_ordenante', header: 'RFC Ordenante'},
    { field:  'iva', header: 'IVA'},
    { field:  'fecha_aplicacion', header: 'Fecha Aplicacion'},
    { field:  'instruccion_pago', header: 'Instruccion Pago'}
];
    this.selectedColumnsp = this.cols;
    this.exportColumns = this.colspdf.map(col => ({title: col.header, dataKey: col.field}));

  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
}

set selectedColumns(val: any[]) {
  // restore original order
  this._selectedColumns = this.cols.filter(col => val.includes(col));
}

generarReporte() {

  swal2.fire({
    title: 'Cargando',
    allowOutsideClick: false
});
  swal2.showLoading();

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

  this._reportesservice.getBanorte(fecharepor,'proveedor').subscribe(resp => {this.facturas = resp;
                                                                  swal2.close();
                                                                  if ( this.facturas.length === 0 ) {

                                                                        swal2.fire(
                                                                          'No se encontraron datos con la fecha:',
                                                                          fecharepor,
                                                                          'error'
                                                                          );
                                                                      }
  }, (err) => {
    swal2.close();
    console.log(err);
    swal2.fire(
         'Error al Confirmar los Datos',
         '',
         'error'
      );
    this.ngOnInit();
   } );


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

      this.fileName = this.facturas[0].payment_report_folio + '.xlsx';

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
