import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContribuyentesService, PagosService } from '../../services/service.index';
import { Privilegio, Usuario2 } from '../../models/usuario.model';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Key } from 'readline';

declare function init_plugins();

@Component({
  selector: 'app-actualizaproveedor',
  templateUrl: './actualizaproveedor.component.html',
  styles: []
})
export class ActualizaProveedorComponent implements OnInit {

  forma: FormGroup;
  idl: string;
  cadena: any[] = [];
  suplierid: string;
  cadenas: any[];
  cadenaso: any[] = [];
  usdsegments: any[] = [];
  usdsegment: any[] = [];
  segments: any[] = [];
  segment: any[] = [];
  mostrarnuevousd: boolean;
  hayerror: boolean;
  nambre: string;
  nambresegment: string;
  mostrarnuevosegmento: boolean = true;
  suppliersector: any[] = [];
  supplierdigitalsign: any[] = [];
  debt_type: any[] = [];
 // suppliersubsector: any[] = [];
  constructor(
    private route: ActivatedRoute,
    public _contribuyentesService: ContribuyentesService,
    public _pagosservice: PagosService,
    public router: Router
  ) { }


  ngOnInit() {

      this.hayerror = false;

      this.idl = this.route.snapshot.paramMap.get('id');

      this.forma = new FormGroup({
        Key: new FormControl( null , Validators.required )
      } );

      this._pagosservice.getCadenas().subscribe( resp => {this.cadenas = resp; } );
      this._contribuyentesService.getSupplierSector().subscribe( resp => { this.suppliersector = resp; } );
      this._contribuyentesService.getSupplierDigitalSign().subscribe( resp => { this.supplierdigitalsign = resp; } );
      this._contribuyentesService.getSupplierdebt_type().subscribe( resp => { this.debt_type = resp; } );
    //  this._contribuyentesService.getSupplierSubSector().subscribe( resp => { this.suppliersubsector = resp; } );
      this._contribuyentesService.getProveedorxContribuyente( this.idl ).subscribe( resp => { this.cadena = resp; this.suplierid = this.cadena[0].id;
                                                                                              this._contribuyentesService.getUsdSegment( this.suplierid).subscribe( resp2 => { this.usdsegments = resp2;
                                                                                                                                                                               if (this.usdsegments.length === 1) {
                                                                                                                                                                                 this.mostrarnuevousd = false;
                                                                                                                                                                                 this.usdsegment = this.usdsegments;
                                                                                                                                                                                 this._pagosservice.getCadenas().subscribe( resp3 => {
                                                                                                                                                                                                                                      for ( const prop in resp3 ) {
                                                                                                                                                                                    if ( resp3[prop].id_cadena === this.usdsegments[0].company_id ) {
                                                                                                                                                                                      this.nambre = resp3[prop].nombre_cadena;
                                                                                                                                                                                      break;
                                                                                                                                                                                    }
                                                                                                                                                                                  }
                                                                                                                                                                                } );
                                                                                                                                                                               } else if ( this.usdsegments.length === 0 ) {
                                                                                                                                                                                 this.mostrarnuevousd = true;
                                                                                                                                                                               } else {
                                                                                                                                                                                 this.hayerror = true;
                                                                                                                                                                               }
                                                                                              } );

                                                                                              this._contribuyentesService.getSegment( this.suplierid).subscribe( resp2 => { this.segments = resp2;
                                                                                                                                                                            if (this.segments.length === 1) {
                                                                                                                                                                                   this.mostrarnuevosegmento = false;
                                                                                                                                                                                   this.segment = this.segments;
                                                                                                                                                                                   this._pagosservice.getCadenas().subscribe( resp3 => {
                                                                                                                                                                                                                                        for ( const prop in resp3 ) {
                                                                                                     if ( resp3[prop].id_cadena === this.segments[0].company_id ) {
                                                                                                       this.nambresegment = resp3[prop].nombre_cadena;
                                                                                                       break;
                                                                                                     }
                                                                                                   }
                                                                                                 } );
                                                                                                } else if ( this.segments.length === 0 ) {
                                                                                                  this.mostrarnuevosegmento = true;
                                                                                                } else {
                                                                                                  this.hayerror = true;
                                                                                                }
               } );
      } );

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
    digital_sign: (document.getElementById('digital_sign') as HTMLInputElement).value
  };

    this._contribuyentesService.actualizaProveedorxContributente( this.idl, this.cadena[0].id , params).subscribe( () => {this.router.navigate(['/altacyp']),
    Swal.fire(
      'Modificacion de Proveedor',
      'Exitosa',
      'success'
   ); }, (err) => {
                            Swal.fire(
                              'Error al modificar Proveedor',
                              'Error',
                              'error'
                           );
                        } );

  }

  guardadolar() {

    

    const params = {
      company_id: (document.getElementById('cadenan') as HTMLInputElement).value,
      rate: (document.getElementById('raten') as HTMLInputElement).value,
      fee: (document.getElementById('feen') as HTMLInputElement).value,
      capacity: (document.getElementById('capacityn') as HTMLInputElement).value,
      limit_days: (document.getElementById('limit_daysn') as HTMLInputElement).value,
      expiration_day: (document.getElementById('expiration_dayn') as HTMLInputElement).value,
      expiration_type: (document.getElementById('expiration_typen') as HTMLInputElement).value,
      status: (document.getElementById('statusn') as HTMLInputElement).value,
      token: '',
      secret_key: ''
    };

    

    this._contribuyentesService.creaUsdSegment( this.suplierid, params).subscribe( () => {this.router.navigate(['/altacyp']),
    Swal.fire(
      'Creacion',
      'Exitosa',
      'success'
   ); }, (err) => { console.log(err)
                    Swal.fire(
                              'Error al guardar',
                              'Error',
                              'error'
                           );
                        } );

  }

  guardasegmento() {

    const params = {
      company_id: (document.getElementById('cadenans') as HTMLInputElement).value,
      rate: (document.getElementById('ratens') as HTMLInputElement).value,
      fee: (document.getElementById('feens') as HTMLInputElement).value,
      capacity: (document.getElementById('capacityns') as HTMLInputElement).value,
      limit_days: (document.getElementById('limit_daysns') as HTMLInputElement).value,
      expiration_day: (document.getElementById('expiration_dayns') as HTMLInputElement).value,
      expiration_type: (document.getElementById('expiration_typens') as HTMLInputElement).value,
      status: (document.getElementById('statusns') as HTMLInputElement).value,
      debt_type: (document.getElementById('debt_typens') as HTMLInputElement).value,
      interest_company: (document.querySelector('input[name = "interest_companyns"]:checked') as HTMLInputElement).value,
      token: '',
      secret_key: ''
    };

    console.log(params)

    this._contribuyentesService.creaSegment( this.suplierid, params).subscribe( () => {this.router.navigate(['/altacyp']),
    Swal.fire(
      'Creacion',
      'Exitosa',
      'success'
   ); }, (err) => { console.log(err)
                    Swal.fire(
                              'Error al guardar',
                              'Error',
                              'error'
                           );
                        } );

  }

  modificadadolar() {
   
    const params = {
      company_id: (document.getElementById('cadena') as HTMLInputElement).value,
      rate: (document.getElementById('rate') as HTMLInputElement).value,
      fee: (document.getElementById('fee') as HTMLInputElement).value,
      capacity: (document.getElementById('capacity') as HTMLInputElement).value,
      limit_days: (document.getElementById('limit_days') as HTMLInputElement).value,
      expiration_day: (document.getElementById('expiration_day') as HTMLInputElement).value,
      expiration_type: (document.getElementById('expiration_type') as HTMLInputElement).value,
      status: (document.getElementById('status') as HTMLInputElement).value,
      token: '',
      secret_key: ''
    };

   
    this._contribuyentesService.patchUsdSegment( this.suplierid, this.usdsegment[0].id, params).subscribe( () => {this.router.navigate(['/altacyp']),
    Swal.fire(
      'Modificacion',
      'Exitosa',
      'success'
   ); }, (err) => { console.log(err);
                    Swal.fire(
                              'Error al modificar',
                              'Error',
                              'error'
                           );
                        } );
  }

  modificadasegmento() {
    
    const params = {
      company_id: (document.getElementById('cadenass') as HTMLInputElement).value,
      rate: (document.getElementById('ratess') as HTMLInputElement).value,
      fee: (document.getElementById('feess') as HTMLInputElement).value,
      capacity: (document.getElementById('capacityss') as HTMLInputElement).value,
      limit_days: (document.getElementById('limit_daysss') as HTMLInputElement).value,
      expiration_day: (document.getElementById('expiration_dayss') as HTMLInputElement).value,
      expiration_type: (document.getElementById('expiration_typess') as HTMLInputElement).value,
      status: (document.getElementById('statusss') as HTMLInputElement).value,
      debt_type: (document.getElementById('debt_type') as HTMLInputElement).value,
      interest_company: (document.querySelector('input[name = "interest_company"]:checked') as HTMLInputElement).value,
      token: '',
      secret_key: ''
    };

    console.log(params);
    this._contribuyentesService.patchSegment( this.suplierid, this.segment[0].id, params).subscribe( () => {this.router.navigate(['/altacyp']),
    Swal.fire(
      'Modificacion',
      'Exitosa',
      'success'
   ); }, (err) => { console.log(err);
                    Swal.fire(
                              'Error al modificar',
                              'Error',
                              'error'
                           );
                        } );
  }

  borraSegmento() {
    this._contribuyentesService.borraSegmentoSeg( this.suplierid, this.segment[0].id).subscribe( () => {this.router.navigate(['/altacyp']),
    Swal.fire(
      'Se borro el segmento',
      '',
      'success'
   ); }, (err) => { console.log(err);
                    Swal.fire(
                              'Error al borrar el segmento',
                              'Error',
                              'error'
                           );
                        } );
  }

  borraSegmentoUsd() {
    this._contribuyentesService.borraSegmentoUsd( this.suplierid, this.usdsegment[0].id).subscribe( () => {this.router.navigate(['/altacyp']),
    Swal.fire(
      'Se borro el segmento',
      '',
      'success'
   ); }, (err) => { console.log(err);
                    Swal.fire(
                              'Error al borrar el segmento',
                              'Error',
                              'error'
                           );
                        } );
  }


}
