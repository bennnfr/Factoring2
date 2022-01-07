import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TarifasService } from '../../services/service.index';
import { Privilegio, Usuario2 } from '../../models/usuario.model';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Key } from 'readline';

declare function init_plugins();

@Component({
  selector: 'app-actualizatarifa',
  templateUrl: './actualizatarifa.component.html',
  styles: []
})
export class ActualizaTarifaComponent implements OnInit {

  forma: FormGroup;
  idl: string;
  tarifa: any[] = [];

  constructor(
    private route: ActivatedRoute,
    public _tarifasservice: TarifasService,
    public router: Router
  ) { }


  ngOnInit() {

      this.idl = this.route.snapshot.paramMap.get('id');

      this.forma = new FormGroup({
        Key: new FormControl( null , Validators.required )
      } );

      this._tarifasservice.modificaTarifa( this.idl ).subscribe( resp => { this.tarifa = resp; } );

  }


  actualizaTarifa() {

    const params = {
    token: '',
    secret_key: '',
    key: (document.getElementById('Key') as HTMLInputElement).value,
    description: (document.getElementById('Descripcion') as HTMLInputElement).value,
    start_date:  (document.getElementById('Fecha_inicio') as HTMLInputElement).value,
    end_date:    (document.getElementById('Fecha_fin') as HTMLInputElement).value,
    value:       (document.getElementById('Valor') as HTMLInputElement).value,
    rate_type:   (document.getElementById('Tipo') as HTMLInputElement).value
  };

  //  console.log(params);

    this._tarifasservice.actualizaTarifa( this.idl, params).subscribe( () => {
        Swal.close();
        Swal.fire({
          title: 'Modificacion de tarifa exitosa',
          text: '',
          icon: 'success',
          showConfirmButton: true,
          showCancelButton: false,
          allowOutsideClick: false
        }). then ( res => {

          if ( res.value ) {
            this.router.navigate(['/tarifas']);
          }

        } );

      }, (err) => {
                            Swal.fire(
                              'Error al modificar Tarifa',
                              'Error',
                              'error'
                           );
                        } );

  } 


}
