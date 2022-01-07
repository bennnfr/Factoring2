import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContribuyentesService } from '../../services/service.index';
import { Privilegio, Usuario2 } from '../../models/usuario.model';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Key } from 'readline';

declare function init_plugins();

@Component({
  selector: 'app-creacadena',
  templateUrl: './creacadena.component.html',
  styles: []
})
export class CreaCadenaComponent implements OnInit {

  forma: FormGroup;
  idl: string;
  cadena: any[] = [];
  comanysector: any[] = [];
  comanydigitalsign: any[] = [];
  constructor(
    private route: ActivatedRoute,
    public _contribuyentesService: ContribuyentesService,
    public router: Router
  ) { }


  ngOnInit() {

      this.idl = this.route.snapshot.paramMap.get('id');
      this._contribuyentesService.getCompanySector().subscribe( resp => { this.comanysector = resp; } );
      this._contribuyentesService.getCompanyDigitalSign().subscribe( resp => { this.comanydigitalsign = resp; } );

      this.forma = new FormGroup({
        business_name: new FormControl( null , Validators.required ),
        start_date: new FormControl( null , Validators.required ),
        credit_limit: new FormControl( null , Validators.required ),
        credit_available: new FormControl( null , Validators.required )
      } );

    //  this._contribuyentesService.getCadenaxcontribuyente( this.idl ).subscribe( resp => { this.cadena = resp; console.log(this.cadena) } );

  }


  creaCadena() {

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
    digital_sign: (document.getElementById('digital_sign') as HTMLInputElement).value
  };

    this._contribuyentesService.creaCadenaxContribuyente( this.idl, params).subscribe( () => {this.router.navigate(['/altacyp']),
    Swal.fire(
      'Creacion de Cadena',
      'Exitosa',
      'success'
   ); }, (err) => {
                            Swal.fire(
                              'Error al crear Cadena',
                              'Error',
                              'error'
                           );
                        } );

  } 


}
