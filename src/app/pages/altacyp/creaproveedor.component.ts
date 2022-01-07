import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContribuyentesService } from '../../services/service.index';
import { Privilegio, Usuario2 } from '../../models/usuario.model';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Key } from 'readline';

declare function init_plugins();

@Component({
  selector: 'app-creaproveedor',
  templateUrl: './creaproveedor.component.html',
  styles: []
})
export class CreaProveedorComponent implements OnInit {

  forma: FormGroup;
  idl: string;
  cadena: any[] = [];
  suppliersector: any[] = [];
  supplierdigitalsign: any = [];
  constructor(
    private route: ActivatedRoute,
    public _contribuyentesService: ContribuyentesService,
    public router: Router
  ) { }


  ngOnInit() {

      this.idl = this.route.snapshot.paramMap.get('id');
      this._contribuyentesService.getSupplierSector().subscribe( resp => { this.suppliersector = resp; } );
      this._contribuyentesService.getSupplierDigitalSign().subscribe( resp => { this.supplierdigitalsign = resp; } );
      this.forma = new FormGroup({
        business_name: new FormControl( null , Validators.required ),
        start_date: new FormControl( null , Validators.required ),
        credit_limit: new FormControl( null , Validators.required ),
        credit_available: new FormControl( null , Validators.required )
      } );

    //  this._contribuyentesService.getCadenaxcontribuyente( this.idl ).subscribe( resp => { this.cadena = resp; console.log(this.cadena) } );

  }


  creaProveedor() {

    const d = new Date((document.getElementById('start_date')as HTMLInputElement).value);
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

    const startdate = [year, month, day].join('-');

    const params = {
    token: '',
    secret_key: '',
    business_name: (document.getElementById('business_name') as HTMLInputElement).value,
    start_date: startdate,
    credit_limit: (document.getElementById('credit_limit') as HTMLInputElement).value,
    credit_available: (document.getElementById('credit_available') as HTMLInputElement).value,
    sector: (document.getElementById('sector') as HTMLInputElement).value,
    subsector:  (document.getElementById('subsector') as HTMLInputElement).value,
    document:    (document.getElementById('document') as HTMLInputElement).value,
    digital_sign: (document.getElementById('digital_sign') as HTMLInputElement).value,
  };

    this._contribuyentesService.creaProveedorxContribuyente( this.idl, params).subscribe( () => {this.router.navigate(['/altacyp']),
    Swal.fire(
      'Creacion de Proveedor',
      'Exitosa',
      'success'
   ); }, (err) => {
                            Swal.fire(
                              'Error al crear Proveedor',
                              'Error',
                              'error'
                           );
                        } );

  } 


}
