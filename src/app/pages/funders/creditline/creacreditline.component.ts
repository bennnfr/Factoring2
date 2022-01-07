import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContribuyentesService, FundersService } from '../../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Key } from 'readline';

declare function init_plugins();

@Component({
  selector: 'app-creacreditline',
  templateUrl: './creacreditline.component.html',
  styles: []
})
export class CreaCreditlineComponent implements OnInit {

  forma: FormGroup;
  idl: string;
  cadena: any[] = [];
  comanysector: any[] = [];
  lineaPesos: any [] = [];
  lineaDolares: any[] = [];
  nuevopesos = true;
  nuevodolares = true;
  respvacio = {credit_available: '', credit_limit: '', rate: '' };
  constructor(
    private route: ActivatedRoute,
    public _contribuyentesService: ContribuyentesService,
    public _fundersService: FundersService,
    public router: Router
  ) { }


  ngOnInit() {
      Swal.showLoading();
      this.lineaPesos = [];
      this.lineaDolares = [];
      this.nuevopesos = true;
      this.nuevodolares = true;
      this.idl = this.route.snapshot.paramMap.get('id');
      this._fundersService.getCreditLinexFunder(this.idl).subscribe( resp => {
       // console.log(resp);
        if (resp.length > 0) {
        for (const prop in resp) {
          if (resp[prop].currency === 'PESOS') {
            this.lineaPesos.push(resp[prop]);
            this.nuevopesos = false;
          } else if (resp[prop].currency === 'DOLARES') {
            this.lineaDolares.push(resp[prop]);
            this.nuevodolares = false;
          }
        }
      }
        if (this.lineaPesos.length === 0) {
          this.lineaPesos.push(this.respvacio);
      }
        if (this.lineaDolares.length === 0) {
        this.lineaDolares.push(this.respvacio);
    }
        Swal.close();
      } );
      this.forma = new FormGroup({
        credit_limit: new FormControl( null , Validators.required ),
        credit_available: new FormControl( null , Validators.required ),
        rate: new FormControl( null , Validators.required ),
        credit_limitd: new FormControl( null , Validators.required ),
        credit_availabled: new FormControl( null , Validators.required ),
        rated: new FormControl( null , Validators.required ),
      } );

    //  this._contribuyentesService.getCadenaxcontribuyente( this.idl ).subscribe( resp => { this.cadena = resp; console.log(this.cadena) } );

  }


  guardaPesos() {

    const params = {
    token: '',
    secret_key: '',
    funder_id: this.idl,
    currency: 'PESOS',
    credit_limit: (document.getElementById('credit_limit') as HTMLInputElement).value,
    credit_available: (document.getElementById('credit_available') as HTMLInputElement).value,
    rate: (document.getElementById('rate') as HTMLInputElement).value,
  };
    console.log(params);
    this._fundersService.creaCreditLinePesosDolares( this.idl, params).subscribe( () => {
    Swal.fire(
      'Creacion de Linea de credito',
      'Exitosa',
      'success'
   ); window.location.reload(); }, (err) => {         console.log(err);
                                                      Swal.fire(
                              'Error al crear La linea de credito',
                              'Error',
                              'error'
                           );
                        } );
  }

  guardaDolares() {

    const params = {
    token: '',
    secret_key: '',
    funder_id: this.idl,
    currency: 'DOLARES',
    credit_limit: (document.getElementById('credit_limitd') as HTMLInputElement).value,
    credit_available: (document.getElementById('credit_availabled') as HTMLInputElement).value,
    rate: (document.getElementById('rated') as HTMLInputElement).value,
  };
    console.log(params);
    this._fundersService.creaCreditLinePesosDolares( this.idl, params).subscribe( () => {
    Swal.fire(
      'Creacion de Linea de credito',
      'Exitosa',
      'success'
   ); window.location.reload();
      }, (err) => {         console.log(err);
                            Swal.fire(
                              'Error al crear La linea de credito',
                              'Error',
                              'error'
                           );
                        } );
  }

  modificapesos(idll) {
    const params = {
      token: '',
      secret_key: '',
      currency: 'PESOS',
      credit_limit: (document.getElementById('credit_limit') as HTMLInputElement).value,
      credit_available: (document.getElementById('credit_available') as HTMLInputElement).value,
      rate: (document.getElementById('rate') as HTMLInputElement).value,
    };
    this._fundersService.modificaCreditLinePesosDolares( this.idl, idll, params).subscribe( () => {
        Swal.fire(
          'Modificacion de Linea de credito',
          'Exitosa',
          'success'
       ); this.ngOnInit(); }, (err) => {         console.log(err);
                                Swal.fire(
                                  'Error al modificar La linea de credito',
                                  'Error',
                                  'error'
                               );
                            } );
  }

  modificadolares(idll) {
    const params = {
      token: '',
      secret_key: '',
      currency: 'DOLARES',
      credit_limit: (document.getElementById('credit_limitd') as HTMLInputElement).value,
      credit_available: (document.getElementById('credit_availabled') as HTMLInputElement).value,
      rate: (document.getElementById('rated') as HTMLInputElement).value,
    };
    console.log(params);
    console.log(this.idl);
    console.log(idll);
    this._fundersService.modificaCreditLinePesosDolares( this.idl, idll, params).subscribe( () => {
        Swal.fire(
          'Modificacion de Linea de credito',
          'Exitosa',
          'success'
       ); this.ngOnInit(); }, (err) => {         console.log(err);
                                Swal.fire(
                                  'Error al modificar La linea de credito',
                                  'Error',
                                  'error'
                               );
                            } );
  }

  borrapesos(idll) {
    Swal.fire({
      title: 'Desea eliminar la linea de credito?',
        text: '',
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        allowOutsideClick: false
    }). then ( res => {
      if ( res.value ) {
        this._fundersService.borraCeditLinePesosDolares(this.idl, idll).subscribe( resp => { Swal.fire({
            title: 'La linea de credito se elimino',
            text: 'Con exito',
            icon: 'success',
            showConfirmButton: true,
            showCancelButton: false,
            allowOutsideClick: false
          }). then ( res2 => {
            if ( res2.value ) {
              this.ngOnInit();
            }
          } ); }, (err) => {
            console.log(err);
            Swal.fire({
              title: 'Ocurrio un error',
              text: err.error.errors[0],
              icon: 'error',
              showConfirmButton: true,
              showCancelButton: false,
              allowOutsideClick: false
            }). then ( res1 => {
              if ( res1.value ) {
                this.ngOnInit();
              }
            } );
           } );
      }
    });
  }

}
