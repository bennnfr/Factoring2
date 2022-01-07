import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContribuyentesService, FundersService } from '../../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Key } from 'readline';
import { runInThisContext } from 'vm';

declare function init_plugins();

@Component({
  selector: 'app-actualizafunder',
  templateUrl: './actualizafunder.component.html',
  styles: []
})
export class ActualizaFunderComponent implements OnInit {

  forma: FormGroup;
  idl: string;
  funder: any[] = [];
  comanysector: any[] = [];
  constructor(
    private route: ActivatedRoute,
    public _contribuyentesService: ContribuyentesService,
    public _fundersService: FundersService,
    public router: Router
  ) { }


  ngOnInit() {

      this.idl = this.route.snapshot.paramMap.get('id');
    //  console.log(this.idl);
      this._fundersService.getFunderxContribuyente(this.idl).subscribe(resp => { this.funder = resp; });
      this.forma = new FormGroup({
        name: new FormControl( null , Validators.required ),
        financial_entity_key: new FormControl( null , Validators.required ),
      } );

    //  this._contribuyentesService.getCadenaxcontribuyente( this.idl ).subscribe( resp => { this.cadena = resp; console.log(this.cadena) } );

  }


  actualizaFunder() {

    const payment_type: any = document.getElementById('payment_type');
    const valorpayment_type = payment_type.options[payment_type.selectedIndex].value;

    const d = new Date((document.getElementById('contract_date')as HTMLInputElement).value);
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
    contributor_id: this.idl,
    funder_type: 'BANCO',
    name: (document.getElementById('name') as HTMLInputElement).value,
    payment_type: (document.getElementById('payment_type') as HTMLInputElement).value,
    status: (document.getElementById('status') as HTMLInputElement).value,
    financial_entity_key: (document.getElementById('financial_entity_key') as HTMLInputElement).value,
    attached: (document.getElementById('attached') as HTMLInputElement).value,
    contract_date: startdate,
    use_layout: (document.getElementById('use_layout') as HTMLInputElement).value,
    layout_key: (document.getElementById('layout_key') as HTMLInputElement).value,
    notify_company: (document.getElementById('notify_company') as HTMLInputElement).value,
    assignment_format_key: (document.getElementById('assignment_format_key') as HTMLInputElement).value,
    use_cfdi: (document.getElementById('use_cfdi') as HTMLInputElement).value,
    extra1: (document.getElementById('epo') as HTMLInputElement).value,
    extra2: (document.getElementById('usuariodecaptura') as HTMLInputElement).value,
    extra3: (document.getElementById('sirac') as HTMLInputElement).value,
  };
  //  console.log(params);
    this._fundersService.actualizaFunder( this.idl, this.funder[0].id, params).subscribe( () => {
    Swal.fire(
      'Actualizacion de Funder',
      'Exitosa',
      'success'
   ); }, (err) => {         console.log(err);
                            Swal.fire(
                              'Error al actualizar Funder',
                              'Error',
                              'error'
                           );
                        } );
    this.router.navigate(['/contribuyentesfunders']);
  }

  borrafunder() {
    Swal.fire({
      title: 'Desea eliminar al fondeador?',
        text: '(no debe tener lineas de credito)',
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        allowOutsideClick: false
    }). then ( res => {
      if ( res.value ) {
        this._fundersService.borraFunder(this.idl, this.funder[0].id).subscribe( resp => { Swal.fire({
            title: 'El fondeador se elimino',
            text: 'Con exito',
            icon: 'success',
            showConfirmButton: true,
            showCancelButton: false,
            allowOutsideClick: false
          }). then ( res2 => {
            if ( res2.value ) {
              this.router.navigate(['/contribuyentesfunders']);
            }
          } ); }, (err) => {
            console.log(err);
            Swal.fire({
              title: 'Ocurrio un error',
              text: '',
              icon: 'error',
              showConfirmButton: true,
              showCancelButton: false,
              allowOutsideClick: false
            }). then ( res1 => {
              if ( res1.value ) {
                this.router.navigate(['/contribuyentesfunders']);
              }
            } );
           } );
      }
    });
  }


}
