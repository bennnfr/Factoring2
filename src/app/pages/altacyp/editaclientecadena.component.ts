import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContribuyentesService } from '../../services/service.index';
import { Privilegio, Usuario2 } from '../../models/usuario.model';
import { Router, ActivatedRoute } from '@angular/router';
import swal2 from 'sweetalert2';
import { Key } from 'readline';

declare function init_plugins();

@Component({
  selector: 'app-editaclientecadena',
  templateUrl: './editaclientecadena.component.html',
  styles: []
})
export class EditaClienteCadenaComponent implements OnInit {

  forma: FormGroup;
  idl: string;
  cadena: any[] = [];
  cliente: any[] = [];
  comanysector: any[] = [];
  comanydigitalsign: any[] = [];
  idcadena = '';
  idcliente = '';
  nombrenegocio = '';
  currency: any[] = [];
  constructor(
    private route: ActivatedRoute,
    public _contribuyentesService: ContribuyentesService,
    public router: Router
  ) { }


  ngOnInit() {

    this.idcadena = this.route.snapshot.paramMap.get('idcadena');
    this.idcliente = this.route.snapshot.paramMap.get('idcliente');
    this.nombrenegocio = this.route.snapshot.paramMap.get('nombre');
    this._contribuyentesService.getCompanyCliente(this.idcadena, this.idcliente).subscribe( resp => {
      this.cliente = resp;
      console.log(this.cliente);
    } )
      this.forma = new FormGroup({
        business_name: new FormControl( null , Validators.required ),
        start_date: new FormControl( null , Validators.required ),
        credit_limit: new FormControl( null , Validators.required ),
        credit_available: new FormControl( null , Validators.required )
      } );

  }

  editaClienteCadena() {
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
    console.log(data);
    this._contribuyentesService.actualizaCliente(this.idcadena, this.idcliente , data).subscribe( resp => {
      swal2.fire({
        title: 'Los datos fueron actualizados',
        text: 'Con exito',
        icon: 'success',
        showConfirmButton: true,
        showCancelButton: false,
        allowOutsideClick: false
      }). then ( res => {
  
        if ( res.value ) {
         // window.location.reload();
         this.router.navigate([`/altacyp/actualizacadena/segmentoscadena/${this.nombrenegocio}/${this.idcadena}`]);
        }
  
      });
    }, (err) => {
      console.log(err);
      swal2.fire(
           'Error al actualizar los datos',
           '',
           'error'
        );
     } );
  }


}
