import { Component, OnInit } from '@angular/core';
import { UsuarioService, OptionsService } from '../../services/service.index';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import swal2 from 'sweetalert2';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
declare var $;


@Component({
  selector: 'app-verusuarios',
  templateUrl: './verusuarios.component.html',
  styles: []
})
export class VerUsuariosComponent implements OnInit {

  constructor( public _usuarioservice: UsuarioService,
               public _optionsservice: OptionsService,
               public router: Router,
               public http: HttpClient) { }

  doc = new jsPDF();
  usuarios: any[] = [];
  usuario: string;
  cols: any[];
  colspdf: any[];
  selectedFac: any[];
  fileName = 'ListaDeUsuarios.xlsx';
  selectedColumns: any[];
  exportColumns: any[];

  ngOnInit() {
    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
    swal2.showLoading();
  //  this.getAcceso('/verusuarios');
    this._usuarioservice.getUsuarios().subscribe(resp => {this.usuarios = resp; swal2.close(); } 
    , (err) => {swal2.fire({title: 'Ocurrio un error al cargar la informacion', allowOutsideClick: false })});

    this.cols = [

      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Nombre' },
      { field: 'email', header: 'Correo' },
      { field: 'job', header: 'Puesto' },
      { field: 'gender', header: 'Genero' },
      { field: 'status', header: 'Estatus' },
      { field: 'herramientas', header: 'Herramientas' }
  ];
    this.colspdf = [

    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Nombre' },
    { field: 'email', header: 'Correo' },
    { field: 'job', header: 'Puesto' },
    { field: 'gender', header: 'Genero' },
    { field: 'status', header: 'Estatus' }
];
    this.selectedColumns = this.cols;
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

  borraUsuario( user: any ) {

    swal2.fire({
      title: 'Desea Eliminar al usuario',
      text: user.name + '?',
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      allowOutsideClick: false
    }). then ( resp => {
      if ( resp.value) {

        this._usuarioservice.borrarUsuario( user ).subscribe( () => {

          swal2.fire({
            title: 'El usuario' + user.name,
            text: 'fue eliminado con exito',
            icon: 'success',
            showConfirmButton: true,
            showCancelButton: false,
            allowOutsideClick: false
          }). then ( res => {

            if ( res.value ) {
              this.ngOnInit();
            }

          } );

        }, (err) => {
        //  console.log(err);
          console.clear();
          swal2.fire({
            title: 'Ocurrio un error',
            text: '',
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
    });

  }

  exportexcel() {
     /* table id is passed over here */
     const element = document.getElementById('tablausuarios');
     const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
     /* generate workbook and add the worksheet */
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

     /* save to file */
     XLSX.writeFile(wb, this.fileName);
  }


  exportpdf() {

   // doc.autoTable({ html: document.getElementById('tablausuarios') });
   // doc.save('ListaDeUsuarios.pdf');

   import('jspdf').then( jsPDF => {
    import('jspdf-autotable').then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportColumns, this.usuarios);
        doc.save('ListaUsuarios.pdf');
    });
});

  }

  buscarNombre() {
    // Declaracion de variables
    // tslint:disable-next-line: one-variable-per-declaration
    let input, filter, table, tr, td, i, txtValue;
    input = document.getElementById('NombreUsuarios');
    filter = input.value.toUpperCase();
    table = document.getElementById('tablausuarios');
    tr = table.getElementsByTagName('tr');

    // Loop de todos los rows y ocultar los que no concuerdan
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName('td')[1];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = '';
        } else {
          tr[i].style.display = 'none';
        }
      }
    }
  }

}
