import { Component, OnInit, Input } from '@angular/core';
import { ReportesService } from '../../services/service.index';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import swal2 from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


@Component({
  selector: 'app-facturadetalle',
  templateUrl: './facturadetalle.component.html',
  styles: []
})
export class FacturaDetalleComponent implements OnInit {

  constructor( public _reportesservice: ReportesService,
               private route: ActivatedRoute,
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
  id: string;

  _selectedColumns: any[];

  ngOnInit() {

    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
    swal2.showLoading();

    this.id = this.route.snapshot.paramMap.get('id');

    this._reportesservice.getReporteDetalleFactura(this.id).subscribe(resp => {this.facturas = resp;
                                                                               swal2.close();
    } );

    this.cols = [

    //  { field:  'id_factura', header: 'ID'},
      { field:  'created_at', header: 'Fecha Modificacion'},
      { field:  'notes', header: 'Notas'},
      { field:  'status', header: 'Estatus'},
      { field:  'ip', header: 'IP'},
      { field:  'host', header: 'HOST'}
  ];

    this._selectedColumns = this.cols;
    this.colspdf = [
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

}
