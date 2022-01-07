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
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styles: []
})
export class FacturasComponent implements OnInit {

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
   // this.getAcceso('/reportefacturas');
    this._reportesservice.getReporteFacturas().subscribe(resp => {this.facturas = resp; // console.log(this.facturas);
                                                                  swal2.close();
    } , (err) => {swal2.fire({title: 'Ocurrio un error al cargar la informacion', allowOutsideClick: false })} );

    this.cols = [

      { field:  'id_factura', header: 'ID'},
      { field:  'folio_factura', header: 'Folio factura' },
      { field:  'folio_solicitud', header: 'Folio solicitud'},
      { field:  'folio_solicitud_fondeo', header: 'Folio Solicitud Fondeo'},
      { field:  'uuid_factura_descontada', header: 'UUID'},
      { field:  'emisor', header: 'Proveedor'},
      { field:  'receptor', header: 'Cadena'},
      { field:  'moneda', header: 'Moneda'},
      { field:  'fecha_operacion', header: 'Fecha operacion'},
      { field:  'fecha_vencimiento', header: 'Fecha vencimiento'},
      { field:  'fecha_emision', header: 'Fecha emision'},
      { field:  'fecha_carga', header: 'Fecha carga'},
      { field:  'estatus', header: 'Estatus'},
      { field:  'total_factura', header: 'Total factura' },
      { field:  'porcentaje_operado', header: 'Porcentaje operado' },
      { field:  'monto_operado', header: 'Total'},
      { field:  'disponible', header: 'Disponible' },
      { field:  'intereses', header: 'Intereses'},
      { field:  'tasa_interbancaria', header: 'Tasa interbancaria' },
      { field:  'sobretasa', header: 'Sobretasa' },
      { field:  'tasa_total', header: 'Tasa total' },
      { field:  'costo_financiero', header: 'Costo financiero' },
      { field:  'dias_descuento', header: 'Dias descuento' },
      { field:  'monto_neto', header: 'Monto neto' },
      { field:  'comision_cadena', header: 'Comision cadena' },
      { field:  'dia_pago_cadena', header: 'Dia pago cadena' },
      { field:  'monto_pago', header: 'Monto pago'},
      { field:  'dias_al_vencimiento', header: 'Dias al Vencimiento'}
  ];

    this._selectedColumns = this.cols;
    this.colspdf = [

    //  { field:  'id_factura', header: 'ID'},
      { field:  'folio_solicitud', header: 'Folio Solicitud'},
      { field:  'folio_solicitud_fondeo', header: 'Folio Solicitud Fondeo'},
      { field:  'folio_factura', header: 'Folio Factura' },
      { field:  'uuid_factura_descontada', header: 'UUID'},
      { field:  'estatus', header: 'Estatus'},
      { field:  'fecha_emision', header: 'Fecha Emision'},
      { field:  'fecha_carga', header: 'Fecha Carga'},
      { field:  'fecha_operacion', header: 'Fecha Operacion'},
      { field:  'fecha_vencimiento', header: 'Fecha Vencimiento'},
      { field:  'moneda', header: 'Moneda'},
      { field:  'monto_operado', header: 'Total'},
      { field:  'intereses', header: 'Intereses'},
      { field:  'receptor', header: 'Cadena'},
      { field:  'emisor', header: 'Proveedor'},
      { field:  'comision_cadena', header: 'Comision Cadena'},
      { field:  'dia_pago_cadena', header: 'Dia Pago Cadena'},
      { field:  'dias_al_vencimiento', header: 'Dias al Vencimiento'}
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
