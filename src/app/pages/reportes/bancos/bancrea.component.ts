import { Component, OnInit, Input } from '@angular/core';
import { ReportesService } from '../../../services/service.index';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import swal2 from 'sweetalert2';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
//import 'jspdf-autotable';
//declare var $;
import * as fs from 'file-saver';


@Component({
  selector: 'app-bacrea',
  templateUrl: './bancrea.component.html',
  styles: []
})
export class BancreaComponent implements OnInit {

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
  resumen: any[] = [];
  _selectedColumns: any[];

  ngOnInit() {

    this.cols = [

    //  { field:  'id_factura', header: 'ID'},
      { field:  'payment_report_folio', header: 'Folio'},
      { field:  'fecha_registro', header: 'Fecha Registro'},
      { field:  'fecha_aplicacion', header: 'Fecha Aplicacion'},
      { field:  'tipo_cuenta_abono', header: 'Tipo Cuenta Abono'},
      { field:  'cuenta_abono', header: 'Cuenta Abono'},
      { field:  'importe', header: 'Importe'},
      { field:  'referencia', header: 'Referencia'},
      { field:  'descripcion', header: 'Descripcion'},
      { field:  'iva', header: 'IVA'}
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
  const type = ((document.getElementById('type')as HTMLInputElement).value);
  this._reportesservice.getBancrea(fecharepor,type).subscribe(resp => {console.log(resp); // this.facturas = resp;
                                                                  //  this.facturas.push(resp.resumen[0]);
                                                                  /*  this.facturas[0].cuenta_origen_resumen = this.facturas[0].cuenta_origen;
                                                                    this.facturas[0].fecha_registro_resumen = this.facturas[0].fecha_registro;
                                                                    this.facturas[0].importe_total_resumen = this.facturas[0].importe_total;
                                                                    this.facturas[0].payment_report_folio_resumen = this.facturas[0].payment_report_folio;
                                                                    this.facturas[0].total_registros_resumen = this.facturas[0].total_registros;
                                                                    delete this.facturas[0].cuenta_origen;
                                                                    delete this.facturas[0].fecha_registro;
                                                                    delete this.facturas[0].importe_total;
                                                                    delete this.facturas[0].payment_report_folio;
                                                                    delete this.facturas[0].total_registros; */
                                                                   // console.log(this.facturas);
                                                                   // console.log(this.resumen);
                                                                  swal2.close();
                                                                  if ( resp.detalles.length === 0 ) {

                                                                        swal2.fire(
                                                                          'No se encontraron datos con la fecha:',
                                                                          fecharepor,
                                                                          'error'
                                                                          );
                                                                      } else {
                                                                        resp.resumen[0].importe_total = resp.resumen[0].importe_total.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                                                        this.resumen.push(resp.resumen[0]);
                                                                        // tslint:disable-next-line: forin
                                                                        for (const prop in resp.detalles) {
                                                                          resp.detalles[prop].importe = resp.detalles[prop].importe.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                                                          this.facturas.push(resp.detalles[prop]);
                                                                        }
                                                                      }
  }, (err) => {
    swal2.close();
    console.log(err);
    swal2.fire(
         'Ocurrio un error',
         '',
         'error'
      );
    this.ngOnInit();
   } );


}


  exportexcel() {
  /*   const element = document.getElementById('tablaFacturas');
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
    let header=['Fecha Registro', 'Fecha Aplicacion','Tipo Cuenta Abono', 'Cuenta Abono', 'Importe', 'Referencia', 'Descripcion','IVA'];
    worksheet.addRow(header);
    for (const prop in this.facturas) {
      /*let fechaaplicacion = this.facturas[prop].fecha_aplicacion;
      console.log(fechaaplicacion)
      let fecapli = fechaaplicacion.split('/');
      console.log(fecapli) */
      worksheet.addRow([this.facturas[prop].fecha_registro,this.facturas[prop].fecha_aplicacion,this.facturas[prop].tipo_cuenta_abono,(this.facturas[prop].cuenta_abono).toString(),
        this.facturas[prop].importe,this.facturas[prop].referencia,this.facturas[prop].descripcion,this.facturas[prop].iva]);
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

/*   import('jspdf').then( jsPDF => {
    import('jspdf-autotable').then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportColumns, this.facturas);
        doc.save('ListaFacturas.pdf');
    }); 
}); */

  }

}
