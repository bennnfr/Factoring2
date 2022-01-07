import { Component, OnInit, Input } from '@angular/core';
import { ContribuyentesService, OptionsService } from '../../services/service.index';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import swal2 from 'sweetalert2';

@Component({
  selector: 'app-suplierprojects',
  templateUrl: './suplierprojects.component.html',
  styles: []
})
export class SuplierProjectsComponent implements OnInit {

  constructor(
               public _contribuyentesService: ContribuyentesService,
               public _optionsservice: OptionsService,
               public router: Router,
               public http: HttpClient ) { }

  parametros: any[] = [];
  cols: any[];
  selectedFac: any[];
 // router: Router;
  contribuyentestodos: any[];
  contribuyentes: any[] = [];
  fileName = 'ReporteContribuyentes.xlsx';
  _selectedColumns: any[];

  ngOnInit() {
    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
    swal2.showLoading();
   // this.getAcceso('/proyectosproveedores');
    this._contribuyentesService.getContribuyentesMain().subscribe( resp => {this.contribuyentestodos = resp; // console.log(this.contribuyentestodos);
                                                                            for (const prop in this.contribuyentestodos) {
                                                                              if (this.contribuyentestodos[prop].es_proveedor === 'TRUE') {
                                                                                this.contribuyentes.push(this.contribuyentestodos[prop]);
                                                                              }
                                                                            }
                                                                            swal2.close();
    }, (err) => {swal2.fire({title: 'Ocurrio un error al cargar la informacion', allowOutsideClick: false })} );

    this.cols = [

      { field: 'rfc_contribuyente', header: 'RFC' },
     // { field: 'nombrecadena', header: 'Cadena' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'correo', header: 'Correo' },
      { field: 'ver', header: 'Ver' }

  ];

    this._selectedColumns = this.cols;

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


}
