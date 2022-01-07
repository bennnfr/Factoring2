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
  selector: 'app-facturasdetalles',
  templateUrl: './facturasdetalles.component.html',
  styles: []
})
export class FacturasDetallesComponent implements OnInit {

  constructor( public _reportesservice: ReportesService,
               public router: Router,
               public _optionsservice: OptionsService,
               public http: HttpClient) { }

  token = localStorage.getItem('token');
  doc = new jsPDF();
  facturas: any[] = [];
  usuario: string;
  cols: any[];
  colspdf: any[];
  selectedFac: any[];
  // router: Router;
  fileName = 'ListaDeFacturas.xlsx';
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
  //  this.getAcceso('/facturasdetalles');
    this._reportesservice.getReporteFacturas().subscribe(resp => {this.facturas = resp;
                                                                  swal2.close();
    } );

    this.cols = [

    //  { field:  'id_factura', header: 'ID'},
      { field:  'ver', header: 'Detalles'},
      { field:  'folio_solicitud', header: 'Folio Solicitud'},
      { field:  'folio_solicitud_fondeo', header: 'Folio Solicitud Fondeo'},
      { field:  'uuid_factura_descontada', header: 'UUID'},
      { field:  'emisor', header: 'Emisor'},
      { field:  'receptor', header: 'Receptor'},
      { field:  'moneda', header: 'Moneda'},
      { field:  'monto_operado', header: 'Monto Operado'},
      { field:  'disponible', header: 'Disponible'},
      { field:  'fecha_operacion', header: 'Fecha Operacion'},
      { field:  'fecha_vencimiento', header: 'Fecha Vencimiento'},
      { field:  'fecha_emision', header: 'Fecha Emision'},
      { field:  'estatus', header: 'Estatus'},
  ];

    this._selectedColumns = this.cols;
    this.colspdf = [
];
    this.selectedColumnsp = this.cols;
    this.exportColumns = this.colspdf.map(col => ({title: col.header, dataKey: col.field}));

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

}
