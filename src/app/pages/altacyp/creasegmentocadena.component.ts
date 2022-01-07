import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContribuyentesService } from '../../services/service.index';
import { Privilegio, Usuario2 } from '../../models/usuario.model';
import { Router, ActivatedRoute } from '@angular/router';
import swal2 from 'sweetalert2';
import { Key } from 'readline';

declare function init_plugins();

@Component({
  selector: 'app-creasegmentocadena',
  templateUrl: './creasegmentocadena.component.html',
  styles: []
})
export class CreaSegmentoCadenaComponent implements OnInit {

  forma: FormGroup;
  idl: string;
  cadena: any[] = [];
  comanysector: any[] = [];
  comanydigitalsign: any[] = [];
  idcadena = '';
  nombrenegocio = '';
  currency: any[] = [];
  constructor(
    private route: ActivatedRoute,
    public _contribuyentesService: ContribuyentesService,
    public router: Router
  ) { }


  ngOnInit() {

    this.idcadena = this.route.snapshot.paramMap.get('id');
    this.nombrenegocio = this.route.snapshot.paramMap.get('nombre');
    this._contribuyentesService.getCompanySegmentsCurrency().subscribe( resp => this.currency = resp );
      this.forma = new FormGroup({
        business_name: new FormControl( null , Validators.required ),
        start_date: new FormControl( null , Validators.required ),
        credit_limit: new FormControl( null , Validators.required ),
        credit_available: new FormControl( null , Validators.required )
      } );

  }


  creaSegmentoCadena() {

    const d = new Date((document.getElementById('start_daten')as HTMLInputElement).value);
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

    const startdaten = [year, month, day].join('-');

    const e = new Date((document.getElementById('end_daten')as HTMLInputElement).value);
    e.setMinutes( e.getMinutes() + e.getTimezoneOffset() );
    let monthe = '' + (e.getMonth() + 1);
    let daye = '' + e.getDate();
    const yeare = e.getFullYear();

    if (monthe.length < 2) {
        monthe = '0' + monthe;
    }
    if (daye.length < 2) {
        daye = '0' + daye;
    }

    const enddaten = [yeare, monthe, daye].join('-');

       const data = {company_id: this.idcadena, id: '',
       key: (document.getElementById('keyn') as HTMLInputElement).value,
       name: (document.getElementById('namen') as HTMLInputElement).value,
       start_date: startdaten,
       end_date: enddaten,
       rate: (document.getElementById('raten') as HTMLInputElement).value,
       fee: (document.getElementById('feen') as HTMLInputElement).value,
       capacity: (document.getElementById('capacityn') as HTMLInputElement).value,
       limit_days: (document.getElementById('limit_daysn') as HTMLInputElement).value,
       currency: (document.getElementById('currencyn') as HTMLInputElement).value,
       expiration_day: (document.getElementById('expiration_dayn') as HTMLInputElement).value,
       expiration_type: (document.getElementById('expiration_typen') as HTMLInputElement).value,
       status: (document.getElementById('statusn') as HTMLInputElement).value,
       with_recourse: (document.querySelector('input[name = "with_recoursen"]:checked') as HTMLInputElement).value,
       token: '',
       secret_key: ''};
      // console.log(this.car);
    
    this._contribuyentesService.guardaSegmento( this.idcadena, data ).subscribe( resp => {
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
         this.router.navigate([`/altacyp/actualizacadena/segmentoscadena/${this.nombrenegocio}/${this.idcadena}`]);
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

  } 


}
