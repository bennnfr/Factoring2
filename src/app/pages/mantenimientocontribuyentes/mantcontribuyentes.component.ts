import { Component, OnInit, Input } from '@angular/core';
import { ContribuyentesService, OptionsService } from '../../services/service.index';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import swal2 from 'sweetalert2';

@Component({
  selector: 'app-mantcontribuyentes',
  templateUrl: './mantcontribuyentes.component.html',
  styles: []
})
export class MantcontribuyentesComponent implements OnInit {

  constructor(
               public _contribuyentesService: ContribuyentesService,
               public http: HttpClient ) { }

  parametros: any[] = [];
  cols: any[];
  selectedFac: any[];
  contribuyentes: any[];
  fileName = 'ReporteContribuyentes.xlsx';
  _selectedColumns: any[];

  ngOnInit() {
    swal2.showLoading();
    
    this._contribuyentesService.getContribuyentesMain().subscribe( resp => {this.contribuyentes = resp; swal2.close(); } );

    this.cols = [

      { field: 'rfc_contribuyente', header: 'RFC' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'correo', header: 'Correo' },
      { field: 'tipo', header: 'Tipo' },
      { field: 'banco', header: 'Banco' },
      { field: 'numero_cuenta', header: 'No Cuenta' },
      { field: 'clave_interbancaria', header: 'Clave Interbancaria' },
      { field: 'clave_portal_banco', header: 'Clave Portal Banco' },
      { field: 'limite_credito', header: 'Limite de Credito' },
      { field: 'credito_disponible', header: 'Credito Disponible' },
      { field: 'saldo', header: 'Saldo' },
      { field: 'es_cadena', header: 'Cadena' },
      { field: 'es_proveedor', header: 'Proveedor' },
      { field: 'telefono', header: 'Tel Fijo' },
      { field: 'celular', header: 'Tel Movil' },
      { field: 'tasa', header: 'Tasa' },
      { field: 'dias_espera', header: 'Dias Espera' },
      { field: 'dia_semana_vencimiento', header: 'Dias Semana Vencimiento' }

  ];

    this._selectedColumns = this.cols;

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


}
