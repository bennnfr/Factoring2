import { Component, OnInit, Input } from '@angular/core';
import { ReportesService, OptionsService } from '../../services/service.index';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import swal2 from 'sweetalert2';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
declare var $;


@Component({
  selector: 'app-directorreport',
  templateUrl: './directorreport.component.html',
  styles: []
})
export class DirectorReportComponent implements OnInit {

  constructor( public _reportesservice: ReportesService,
               public router: Router,
               public _optionsservice: OptionsService,
               public http: HttpClient) { }

  token = localStorage.getItem('token');
  doc = new jsPDF();
  facturas: any[] = [];
  usuario: string;
  cols: any[];
  colsp: any[];
  colspdf: any[];
  selectedFac: any[];
  // router: Router;
  fileName = 'Resumen.xlsx';
  fileNamed = 'Descuentos.xlsx';
  fileNamep = 'Pagos.xlsx';
  selectedColumnsp: any[];
  selectedColumnspdf: any[];
  exportColumns: any[];
  pagos: any[] = [];
  descuentos: any[] = [];
  _selectedColumns: any[];

  ngOnInit() {

    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
    swal2.showLoading();
  //  this.getAcceso('/directorreport');
    this._reportesservice.getDirectorReportResume().subscribe(resp => {this.facturas = resp;
                                                                       swal2.close();
    } );

    this._reportesservice.getDirectorDetailPayments().subscribe(resp => {this.pagos = resp;
      swal2.close();
} );

    this._reportesservice.getDirectorDetailDiscounts().subscribe(resp => {this.descuentos = resp;
      swal2.close();
} );
swal2.close();
    this.cols = [

    //  { field:  'id_factura', header: 'ID'},
    { field: 'folio_factura', header: 'Folio factura'},
    { field: 'folio_solicitud', header: 'Folio Solicitud'},
    { field: 'descuento', header: 'Descuento'},
    { field: 'emisor', header: 'Emisor'},
    { field: 'receptor', header: 'Receptor'},
    { field: 'moneda', header: 'Moneda'},
    { field: 'fecha_operacion', header: 'Fecha operacion'},
    { field: 'fecha_vencimiento', header: 'Fecha vencimiento'},
    { field: 'fecha_emision', header: 'Fecha emision'},
    { field: 'fecha_carga', header: 'Fecha carga'},
    { field: 'estatus', header: 'Estatus'},
    { field: 'intereses', header: 'Intereses'}
  ];

    this.colsp = [

    //  { field:  'id_factura', header: 'ID'},
    { field: 'folio_factura', header: 'Folio factura'},
    { field: 'folio_solicitud', header: 'Folio Solicitud'},
    { field: 'pago', header: 'Pago'},
    { field: 'emisor', header: 'Emisor'},
    { field: 'receptor', header: 'Receptor'},
    { field: 'moneda', header: 'Moneda'},
    { field: 'fecha_operacion', header: 'Fecha operacion'},
    { field: 'fecha_vencimiento', header: 'Fecha vencimiento'},
    { field: 'fecha_emision', header: 'Fecha emision'},
    { field: 'fecha_carga', header: 'Fecha carga'},
    { field: 'estatus', header: 'Estatus'},
    { field: 'intereses', header: 'Intereses'}
  ];

    this._selectedColumns = this.cols;
    this.selectedColumnsp = this.cols;

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

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
}

set selectedColumns(val: any[]) {
  // restore original order
  this._selectedColumns = this.cols.filter(col => val.includes(col));
}


  exportexcel() {
     /* table id is passed over here */
     const element = document.getElementById('tablaFacturas');
     const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
     /* generate workbook and add the worksheet */
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
     /* save to file */
     XLSX.writeFile(wb, this.fileName);
  }

  exportexceldescuentos() {
    /* table id is passed over here */
    const element = document.getElementById('tabladescuentos');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, this.fileNamed);
 }

 exportexcelpagos() {
  /* table id is passed over here */
  const element = document.getElementById('tablapagos');
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
  /* generate workbook and add the worksheet */
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  /* save to file */
  XLSX.writeFile(wb, this.fileNamep);
}


}
