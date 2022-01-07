import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TarifasService } from '../../services/service.index';
import { Privilegio, Usuario2 } from '../../models/usuario.model';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

declare function init_plugins();

@Component({
  selector: 'app-creatarifa',
  templateUrl: './creatarifa.component.html',
  styles: []
})
export class CreaTarifaComponent implements OnInit {

  forma: FormGroup;
  key: any[] = [];

  constructor(
    private route: ActivatedRoute,
    public _tarifasservice: TarifasService,
    public router: Router
  ) { }


  ngOnInit() {

      this._tarifasservice.getRatetype().subscribe( resp => { this.key = resp; } );


      this.forma = new FormGroup({
        key: new FormControl( null , Validators.required ),
        Fecha_inicio: new FormControl( null , Validators.required ),
        Valor: new FormControl( null , Validators.required ),
        Tipo: new FormControl( null , Validators.required ),
        Descripcion: new FormControl( null , Validators.required )

      } );

  }


  guardaTarifa() {

    const key: any = document.getElementById('Key');

    // Obtener el valor de la opción seleccionada
    const valorkey = key.options[key.selectedIndex].value;

    const d = new Date((document.getElementById('Fecha_inicio')as HTMLInputElement).value);
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

    const finicio = [year, month, day].join('-');

    const da = new Date((document.getElementById('Fecha_fin')as HTMLInputElement).value);
    da.setMinutes( da.getMinutes() + da.getTimezoneOffset() );
    let montha = '' + (da.getMonth() + 1);
    let daya = '' + da.getDate();
    const yeara = da.getFullYear();

    if (montha.length < 2) {
        montha = '0' + montha;
    }
    if (daya.length < 2) {
        daya = '0' + daya;
    }

    const ffin = [yeara, montha, daya].join('-');

    const params = {
      token: '',
      secret_key: '',
      key: valorkey,
      description: (document.getElementById('Descripcion') as HTMLInputElement).value,
      start_date:  finicio,
      end_date:    ffin,
      value:       (document.getElementById('Valor') as HTMLInputElement).value,
      rate_type:   (document.getElementById('Tipo') as HTMLInputElement).value
    };


    // console.log(privilegio);
    this._tarifasservice.guardaTarifa(params).subscribe( () => {this.router.navigate(['/tarifas']),
    Swal.fire(
      'Creacion de Tarifa',
      'Exitosa',
      'success'
   ); }, (err) => {
                            Swal.fire(
                              'Error al crear Tarifa',
                              'Error',
                              'error'
                           );
                        } );

  }


}
