import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContribuyentesService } from '../../services/service.index';
import { Privilegio, Usuario2 } from '../../models/usuario.model';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Key } from 'readline';

declare function init_plugins();

@Component({
  selector: 'app-actualizacadena',
  templateUrl: './actualizacadena.component.html',
  styles: []
})
export class ActualizaCadenaComponent implements OnInit {

  forma: FormGroup;
  idl: string;
  cadena: any[] = [];
  idcadena = '';
  nombrenegocio = '';
  comanysector: any[] = [];
  comanysubsector: any[] = [];
  comanydigitalsign: any[] = [];
  constructor(
    private route: ActivatedRoute,
    public _contribuyentesService: ContribuyentesService,
    public router: Router
  ) { }


  ngOnInit() {

      this.idl = this.route.snapshot.paramMap.get('id');

      this.forma = new FormGroup({
        Key: new FormControl( null , Validators.required )
      } );

      this._contribuyentesService.getCadenaxcontribuyente( this.idl ).subscribe( resp => { this.cadena = resp; this.idcadena = this.cadena[0].id; this.nombrenegocio = this.cadena[0].business_name; } );
      this._contribuyentesService.getCompanySector().subscribe( resp => { this.comanysector = resp; } );
      this._contribuyentesService.getCompanyDigitalSign().subscribe( resp => { this.comanydigitalsign = resp; } );

  }


  actualizaCadena() {

    const params = {
    token: '',
    secret_key: '',
    business_name: (document.getElementById('business_name') as HTMLInputElement).value,
    sector: (document.getElementById('sector') as HTMLInputElement).value,
    subsector:  (document.getElementById('subsector') as HTMLInputElement).value,
    document:    (document.getElementById('document') as HTMLInputElement).value,
    credit_available:       (document.getElementById('credit_available') as HTMLInputElement).value,
    balance:   (document.getElementById('balance') as HTMLInputElement).value,
    digital_sign: (document.getElementById('digital_sign') as HTMLInputElement).value,
  };
    console.log(params);
    this._contribuyentesService.actualizaCadenaxContributente( this.idl, this.cadena[0].id , params).subscribe( () => {this.router.navigate(['/altacyp']),
    Swal.fire(
      'Modificacion de Cadena',
      'Exitosa',
      'success'
   ); }, (err) => {
                            Swal.fire(
                              'Error al modificar Cadena',
                              'Error',
                              'error'
                           );
                        } );

  }


}
