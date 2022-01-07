import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OptionsService } from '../../services/service.index';
import { Privilegio, Usuario2 } from '../../models/usuario.model';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

declare function init_plugins();

@Component({
  selector: 'app-creaoption',
  templateUrl: './creaoption.component.html',
  styles: []
})
export class CreaOptionComponent implements OnInit {

  forma: FormGroup;

  constructor(
    private route: ActivatedRoute,
    public _optionsservice: OptionsService,
    public router: Router
  ) { }


  ngOnInit() {


      this.forma = new FormGroup({
        name: new FormControl( null , Validators.required ),
        description: new FormControl( null , Validators.required ),
        group: new FormControl( null , Validators.required ),
        url: new FormControl( null , Validators.required )

      } );

  }


  registrarOpcion() {

    const valorName = this.forma.value.name;
    const valorDescripcion = this.forma.value.description;
    const valorGrupo = this.forma.value.group;
    const valorUrl = this.forma.value.url;

    this._optionsservice.crearOption(valorName, valorDescripcion, valorGrupo, valorUrl).subscribe( () => {
    Swal.fire({
      title: 'Creacion de opcion exitosa',
      text: '',
      icon: 'success',
      showConfirmButton: true,
      showCancelButton: false,
      allowOutsideClick: false
    }). then ( res => {
      if ( res.value ) {
        this.router.navigate(['/options']);
      }

    } );

  }, (err) => {             console.log(err);
                            Swal.fire(
                              'Error al crear Opcion',
                              'Error',
                              'error'
                           );
                        } ); 

  }


}
