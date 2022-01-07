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
  selector: 'app-dailyoperations',
  templateUrl: './dailyoperations.component.html',
  styles: []
})
export class DailyoperationsComponent implements OnInit {

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
  fileName = 'ReporteDiario.xlsx';
  selectedColumnsp: any[];
  selectedColumnspdf: any[];
  exportColumns: any[];

  _selectedColumns: any[];

  ngOnInit() {
   // this.getAcceso('/reportediario');
    this.cols = [

    //  { field:  'id_factura', header: 'ID'},
      { field:  'folio_solicitud', header: 'Folio Solicitud'},
      { field:  'folio_factura', header: 'Folio Factura'},
      { field:  'proveedor', header: 'Proveedor'},
      { field:  'deudor', header: 'Deudor'},
      { field:  'fecha_operacion', header: 'Fecha Operacion'},
      { field:  'fecha_vencimiento', header: 'Fecha Vencimiento'},
      { field:  'dias', header: 'Dias'},
      { field:  'importe', header: 'Importe'},
      { field:  'moneda', header: 'Moneda'},
      { field:  'tasa_interbancaria', header: 'Tasa Interbancaria'},
      { field:  'sobre_tasa', header: 'Sobre Tasa'},
      { field:  'tasa_factor', header: 'Tasa Factor'},
      { field:  'intereses_factor', header: 'Intereses Factor'},
      { field:  'importe_sin_intereses', header: 'Importe sin Intereses'},
      { field:  'por_disposicion_solicitud', header: 'Por Dispocision Solicitud'},
      { field:  'id_solicitud', header: 'Id Solicitud'}
  ];

    this._selectedColumns = this.cols;
    this.colspdf = [

    //  { field:  'id_factura', header: 'ID'},
    { field:  'folio_solicitud', header: 'Folio Solicitud'},
    { field:  'folio_factura', header: 'Folio Factura'},
    { field:  'proveedor', header: 'Proveedor'},
    { field:  'deudor', header: 'Deudor'},
    { field:  'fecha_operacion', header: 'Fecha Operacion'},
    { field:  'fecha_vencimiento', header: 'Fecha Vencimiento'},
    { field:  'dias', header: 'Dias'},
    { field:  'importe', header: 'Importe'},
    { field:  'moneda', header: 'Moneda'},
    { field:  'tasa_interbancaria', header: 'Tasa Interbancaria'},
    { field:  'sobre_tasa', header: 'Sobre Tasa'},
    { field:  'tasa_factor', header: 'Tasa Factor'},
    { field:  'intereses_factor', header: 'Intereses Factor'},
    { field:  'importe_sin_intereses', header: 'Importe sin Intereses'},
    { field:  'por_disposicion_solicitud', header: 'Por Dispocision Solicitud'},
    { field:  'id_solicitud', header: 'Id Solicitud'}
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

  this._reportesservice.getReporteDaily(fecharepor).subscribe(resp => {this.facturas = resp;
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
    swal2.fire({
      title: 'Ocurrio un error',
      text: err.error.errors[0],
      icon: 'error',
      showConfirmButton: true,
      showCancelButton: false,
      allowOutsideClick: false
    }). then ( res => {
      if ( res.value ) {
        this.ngOnInit();
      }
    } );
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
