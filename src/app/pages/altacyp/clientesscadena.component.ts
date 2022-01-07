import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContribuyentesService } from '../../services/service.index';
import { Privilegio, Usuario2 } from '../../models/usuario.model';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Key } from 'readline';
import swal2 from 'sweetalert2';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
declare function init_plugins();

@Component({
  selector: 'app-clientesscadena',
  templateUrl: './clientesscadena.component.html',
  styles: []
})
export class ClientesCadenaComponent implements OnInit {

  forma: FormGroup;
  idl: string;
  cadena: any[] = [];
  idcadena = '';
  nombrenegocio = '';
  cols: any[];
  clientes: any[] = [];
  currency: any[] = [];
  displayDialognuevo: boolean;
  RFCFisica = false;
  correo = false;
  constructor(
    private route: ActivatedRoute,
    public _contribuyentesService: ContribuyentesService,
    public router: Router
  ) { }


  ngOnInit() {
    (document.getElementById('name') as HTMLInputElement).value = '';
    (document.getElementById('rfc') as HTMLInputElement).value = '';
    (document.getElementById('email') as HTMLInputElement).value = '';
    (document.getElementById('phone') as HTMLInputElement).value = '';
    (document.getElementById('address') as HTMLInputElement).value = '';
      this.idcadena = this.route.snapshot.paramMap.get('idc');
      this.nombrenegocio = this.route.snapshot.paramMap.get('nombre');
      this._contribuyentesService.getclientescadena(this.idcadena).subscribe( resp => {
        this.clientes = resp

      } )
      this.cols = [
            { field: 'name', header: 'Nombre' },
            { field: 'rfc', header: 'RFC' },
            { field: 'status', header: 'Estatus' },
            { field: 'email', header: 'Correo' },
            { field: 'phone', header: 'Telefono' },
            { field: 'address', header: 'Direccion' },
            
        ];
  }

creaClienteCadena() {
  const data = {
    name: (document.getElementById('name') as HTMLInputElement).value,
    rfc: (document.getElementById('rfc') as HTMLInputElement).value,
    status: (document.getElementById('status') as HTMLInputElement).value,
    email: (document.getElementById('email') as HTMLInputElement).value,
    phone: (document.getElementById('phone') as HTMLInputElement).value,
    address: (document.getElementById('address') as HTMLInputElement).value,
    token: '',
    secret_key: ''
  }
  if (data.name.length > 0 && data.rfc.length > 0 ) {
  this._contribuyentesService.creaClienteCadena( this.idcadena, data ).subscribe( resp => {
    swal2.fire({
      title: 'Los datos fueron guardados',
      text: 'Con exito',
      icon: 'success',
      showConfirmButton: true,
      showCancelButton: false,
      allowOutsideClick: false
    }). then ( res => {

      if ( res.value ) {
       // window.location.reload();
       this.ngOnInit()
      }

    } );
  }, (err) => {
    console.log(err);
    swal2.fire(
         'Error al guardar los datos',
         '',
         'error'
      );
   } );
  } else {
    swal2.fire(
      'Los datos marcados con * son requeridos'
   );
  }
}  

delete(seg) {
  swal2.fire({
    title: 'Desea Eliminar el cliente',
    text: '',
    icon: 'question',
    showConfirmButton: true,
    showCancelButton: true,
    allowOutsideClick: false
  }). then ( resp => {
    if ( resp.value) {

  this._contribuyentesService.borraCliente(seg.company_id, seg.id).subscribe(resp => {

    swal2.fire({
      title: 'Los datos fueron borrados',
      text: 'Con exito',
      icon: 'success',
      showConfirmButton: true,
      showCancelButton: false,
      allowOutsideClick: false
    }). then ( res => {

      if ( res.value ) {
       // window.location.reload();
       this.ngOnInit();
      }

    } );
  }, (err) => {
    console.log(err);
    swal2.fire(
         'Error al borrar los datos',
         err.error.errors[0],
         'error'
      );
   } );

}
});
}

validaRFC() {

    
    const RFC = (document.getElementById('rfc') as HTMLInputElement).value;
    if (RFC.length === 13) {
    const regex = /^[A-Z]{4}[0-9]{6}[A-Z0-9]{3}/;
    const resultado = regex.test(RFC);
    if ( resultado === false ) {
      document.getElementById('rfc').focus();
      this.RFCFisica = true;
    } else {
      this.RFCFisica = false;
    }
    } 
    else if (RFC.length === 12) {
      const regex = /^[A-Z]{3}[0-9]{6}[A-Z0-9]{3}/;
      const resultado = regex.test(RFC);
      if ( resultado === false ) {
        document.getElementById('rfc').focus();
        this.RFCFisica = true;
      } else {
        this.RFCFisica = false;
      }
    } 
    else {
      document.getElementById('rfc').focus();
      this.RFCFisica = true;
    }

}

validaEmail() {
  const regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  const correoFisica = (document.getElementById('email') as HTMLInputElement).value;
  const resultado = regex.test(correoFisica);

  if ( correoFisica.length > 0 ) {
  if ( resultado === false ) {
    document.getElementById('email').focus();
    this.correo = true;
  } else {
    this.correo = false;
  }
  } else {
    this.correo = false;
  }

  }

}
