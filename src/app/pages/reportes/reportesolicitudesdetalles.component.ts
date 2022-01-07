import { Component, OnInit, Input } from '@angular/core';
import { ReportesService } from '../../services/service.index';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import swal2 from 'sweetalert2';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
declare var $;


@Component({
  selector: 'app-reportesolicitudesdetalles',
  templateUrl: './reportesolicitudesdetalles.component.html',
  styles: []
})
export class ReporteSolicitudesDetallesComponent implements OnInit {

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
  fileName = 'ListaDeSolicitudes.xlsx';
  selectedColumnsp: any[];
  selectedColumnspdf: any[];
  exportColumns: any[];

  _selectedColumns: any[];

  ngOnInit() {

    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
    swal2.showLoading();

    this._reportesservice.getReporteSolicitudes().subscribe(resp => {this.facturas = resp;
                                                                     swal2.close();
    } );

    this.cols = [

    //  { field:  'id_factura', header: 'ID'},
      { field:  'detalles', header: 'Detalles'},
      { field:  'folio_solicitud', header: 'Folio Solicitud'},
      { field:  'cadena', header: 'Cadena' },
      { field:  'proveedor', header: 'Proveedor'},
      { field:  'estatus', header: 'Estatus'},
      { field:  'fecha_solicitud', header: 'Fecha Solicitud'},
      { field:  'fecha_operacion', header: 'Fecha Operacion'},
      { field:  'fecha_vencimiento', header: 'Fecha Vencimiento'},
      { field:  'moneda', header: 'Moneda'},
      { field:  'total', header: 'Total'},
      { field:  'porcentaje_operacion', header: '% Operacion'},
      { field:  'total_operado', header: 'Total Operado'},
      { field:  'saldo', header: 'Saldo'},
      { field:  'intereses', header: 'Intereses'},
      { field:  'usuario', header: 'Usuario'}
  ];

    this._selectedColumns = this.cols;
    this.colspdf = [

    //  { field:  'id_factura', header: 'ID'},
    { field:  'folio_solicitud', header: 'Folio Solicitud'},
    { field:  'cadena', header: 'Cadena' },
    { field:  'proveedor', header: 'Proveedor'},
    { field:  'estatus', header: 'Estatus'},
    { field:  'fecha_solicitud', header: 'Fecha Solicitud'},
    { field:  'fecha_operacion', header: 'Fecha Operacion'},
    { field:  'fecha_vencimiento', header: 'Fecha Vencimiento'},
    { field:  'moneda', header: 'Moneda'},
    { field:  'total', header: 'Total'},
    { field:  'porcentaje_operacion', header: '% Operacion'},
    { field:  'total_operado', header: 'Total Operado'},
    { field:  'saldo', header: 'Saldo'},
    { field:  'intereses', header: 'Intereses'},
    { field:  'monto_neto', header: 'Monto Neto'},
    { field:  'costo_financiero', header: 'Costo Financiero'},
    { field:  'usuario', header: 'Usuario'},
    { field:  'fecha_creacion', header: 'Fecha Creacion'},
    { field:  'fecha_modificacion', header: 'Fecha Modificacion'}
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
