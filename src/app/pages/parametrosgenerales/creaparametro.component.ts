import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ParametrosGeneralesService } from '../../services/service.index';
import { Privilegio, Usuario2 } from '../../models/usuario.model';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

declare function init_plugins();

@Component({
  selector: 'app-creaparametro',
  templateUrl: './creaparametro.component.html',
  styles: []
})
export class CreaParametroComponent implements OnInit {

  forma: FormGroup;

  constructor(
    private route: ActivatedRoute,
    public _parametroService: ParametrosGeneralesService,
    public router: Router
  ) { }


  ngOnInit() {


      this.forma = new FormGroup({
        Description: new FormControl( null , Validators.required ),
        Key: new FormControl( null , Validators.required ),
        Value: new FormControl( null , Validators.required ),
       // Table: new FormControl( null , Validators.required ),
       // Id_table: new FormControl( null , Validators.required ),
       // Used_values: new FormControl( null , Validators.required ),
       // Documentation: new FormControl( null , Validators.required )

      } );

  }


  registrarParametro() {
    Swal.showLoading();
    const valorDescripcion = this.forma.value.Description;
    const valorKey = this.forma.value.Key;
    const valorValue = this.forma.value.Value;
    const valorTable =  (document.getElementById('Tabla') as HTMLInputElement).value;
    const valorIdTable =  (document.getElementById('Id_tabla') as HTMLInputElement).value;
    const valorUdesValues =  (document.getElementById('UsedValues') as HTMLInputElement).value;
    const valorDocumentation =  (document.getElementById('Doc') as HTMLInputElement).value;



    // console.log(privilegio);
    this._parametroService.crearParametro(valorDescripcion, valorKey, valorValue, valorTable, valorIdTable, valorUdesValues, valorDocumentation).subscribe( () => {
        Swal.close();
        Swal.fire({
          title: 'Creacion de parametro exitosa',
          text: '',
          icon: 'success',
          showConfirmButton: true,
          showCancelButton: false,
          allowOutsideClick: false
        }). then ( res => {

          if ( res.value ) {
            this.router.navigate(['/parametros']);
          }

        } );

      }, (err) => {
                            Swal.fire(
                              'Error al crear Parametro',
                              'Error',
                              'error'
                           );
                        } ); 

  }


}
