import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ParametrosGeneralesService } from '../../services/service.index';
import { Privilegio, Usuario2 } from '../../models/usuario.model';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

declare function init_plugins();

@Component({
  selector: 'app-actualizaparametro',
  templateUrl: './actualizaparametro.component.html',
  styles: []
})
export class ActualizaParametroComponent implements OnInit {

  forma: FormGroup;
  idp: string;
  parametro: any[] = [];

  constructor(
    private route: ActivatedRoute,
    public _parametrosService: ParametrosGeneralesService,
    public router: Router
  ) { }


  ngOnInit() {

      this.idp = this.route.snapshot.paramMap.get('id');

      this.forma = new FormGroup({
        Name: new FormControl( null , Validators.required ),
        Descripcion: new FormControl( null , Validators.required )
      } );

      this._parametrosService.getParametro( this.idp ).subscribe( resp => { this.parametro = resp; } );

  }


  actualizaParametro() {
    Swal.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
    Swal.showLoading();
    // Obtener el elemento por el id
    const Descripcion: any = document.getElementById('Descripcion');
    const Key: any = document.getElementById('Key');
    const Valor: any = document.getElementById('Valor');
    const Tabla: any = document.getElementById('Tabla');
    const IdTabla: any = document.getElementById('Id_Tabla');
    const UsedValues: any = document.getElementById('Used_Values');
    const Documentacion: any = document.getElementById('Documentacion');
// Obtener el valor de la opción seleccionada

    const valorDescripcion = Descripcion.value;
    const valorKey = Key.value;
    const valorValor = Valor.value;
    const valorTabla = Tabla.value;
    const valorIdTabla = IdTabla.value;
    const valorUsedValues = UsedValues.value;
    const valorDocumentacion = Documentacion.value;
    this._parametrosService.actualizaParametro( this.idp, valorDescripcion, valorKey, valorValor, valorTabla, valorIdTabla, valorUsedValues, valorDocumentacion ).subscribe( () => {
        Swal.close();
        Swal.fire({
          title: 'Modificacion de parametro exitosa',
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

      }, (err) => { console.clear();
                            Swal.fire(
                              'Error al modificar Parametro',
                              'Error',
                              'error'
                           );
                        } );

  }


}
