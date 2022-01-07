import { Component, OnInit, Input } from '@angular/core';
import { ReportesService } from '../../../services/service.index';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import swal2 from 'sweetalert2';
import * as XLSX from 'xlsx';
//import jsPDF from 'jspdf';
//import 'jspdf-autotable';
//declare var $;
import * as fs from 'file-saver';


@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styles: []
})
export class BaseComponent implements OnInit {

  constructor( public _reportesservice: ReportesService,
               public http: HttpClient) { }

  token = localStorage.getItem('token');
  //doc = new jsPDF();
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

  _selectedColumns: any[];

  ngOnInit() {

    this.cols = [

    //  { field:  'id_factura', header: 'ID'},
    //  { field:  'payment_report_folio', header: 'Folio'},
      { field:  'tipo_operacion', header: 'Operacion'},
      { field:  'destinatario', header: 'Destinatario'},
      { field:  'cuenta_destino', header: 'Cuenta Destino'},
      { field:  'importe', header: 'Importe'},
      { field:  'referencia_concepto', header: 'Referencia Concepto'},
      { field:  'referencia', header: 'Referencia'},
      { field:  'divisa', header: 'Divisa'}
  ];

    this._selectedColumns = this.cols;
    this.colspdf = [

    //  { field:  'id_factura', header: 'ID'},
      { field:  'payment_report_folio', header: 'Folio'},
      { field:  'tipo_operacion', header: 'Operacion'},
      { field:  'destinatario', header: 'Destinatario'},
      { field:  'cuenta_destino', header: 'Cuenta Destino'},
      { field:  'importe', header: 'Importe'},
      { field:  'referencia_concepto', header: 'Referencia Concepto'},
      { field:  'referencia', header: 'Referencia'},
      { field:  'divisa', header: 'Divisa'}
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
  const curr: any = document.getElementById('curr');
  const valorCurr = curr.options[curr.selectedIndex].value;
  console.log(valorCurr);
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
  const type = ((document.getElementById('type')as HTMLInputElement).value);
  this._reportesservice.getBase(fecharepor, valorCurr, type).subscribe(resp => {this.facturas = resp;
                                                                          swal2.close();
                                                                          if ( this.facturas.length === 0 ) {

                                                                        swal2.fire(
                                                                          'No se encontraron datos con la fecha:',
                                                                          fecharepor,
                                                                          'error'
                                                                          );
                                                                      } else {
                                                                        // tslint:disable-next-line: forin
                                                                        for (const prop in this.facturas) {
                                                                          this.facturas[prop].importe = this.facturas[prop].importe.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                                                        }
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
   /*  const element = document.getElementById('tablaFacturas');
     const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
     if ( this.facturas.length > 0 ) {
      this.fileName = this.facturas[0].payment_report_folio + '.xlsx';
     }
     XLSX.writeFile(wb, this.fileName); */
     this.fileName = this.facturas[0].payment_report_folio + '.xlsx';
     const Excel = require('exceljs');
     let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('banorte');
    let header=['Operacion', 'Destinatario','Cuenta destino', 'Importe', 'Referencia Concepto', 'Referencia', 'Divisa'];
    worksheet.addRow(header);
    for (const prop in this.facturas) {
      /*let fechaaplicacion = this.facturas[prop].fecha_aplicacion;
      console.log(fechaaplicacion)
      let fecapli = fechaaplicacion.split('/');
      console.log(fecapli) */
      worksheet.addRow([this.facturas[prop].tipo_operacion,this.facturas[prop].destinatario,(this.facturas[prop].cuenta_destino).toString(),this.facturas[prop].importe,
        this.facturas[prop].referencia_concepto,this.facturas[prop].referencia,this.facturas[prop].divisa]);
        //worksheet.getCell('K' + numberrow).value = new Date(`${fecapli[2]}, ${fecapli[1]}, ${fecapli[0]} GMT-0000`);
        //numberrow = numberrow + 1;
    } 
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: '.xlsx' });
      const file = blob;
      fs.saveAs(blob, this.fileName);
    });
  }


  exportpdf() {

  /* import('jspdf').then( jsPDF => {
    import('jspdf-autotable').then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportColumns, this.facturas);
        doc.save('base.pdf');
    });
}); */

  }

}
