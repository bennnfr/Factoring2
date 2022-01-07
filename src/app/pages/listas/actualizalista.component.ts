import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ListasService } from '../../services/service.index';
import { Privilegio, Usuario2 } from '../../models/usuario.model';
import { Router, ActivatedRoute } from '@angular/router';
import Swal2 from 'sweetalert2';

declare function init_plugins();

@Component({
  selector: 'app-actualizalista',
  templateUrl: './actualizalista.component.html',
  styles: []
})
export class ActualizaListaComponent implements OnInit {

  forma: FormGroup;
  idl: string;
  lista: any[] = [];

  constructor(
    private route: ActivatedRoute,
    public _optionsservice: ListasService,
    public router: Router
  ) { }


  ngOnInit() {

      this.idl = this.route.snapshot.paramMap.get('id');

      this.forma = new FormGroup({
        Name: new FormControl( null , Validators.required ),
        Descripcion: new FormControl( null , Validators.required )
      } );

      this._optionsservice.getLista( this.idl ).subscribe( resp => { this.lista = resp; } );

  }


  actualizaLista() {
    Swal2.showLoading();
    // Obtener el elemento por el id
    const Dominio: any = document.getElementById('Dominio');
    const Key: any = document.getElementById('Key');
    const Valor: any = document.getElementById('Valor');
    const Descripcion: any = document.getElementById('Descripcion');
// Obtener el valor de la opción seleccionada

    const valorDominio = Dominio.value;
    const valorKey = Key.value;
    const valorValor = Valor.value;
    const valorDescripcion = Descripcion.value;

    this._optionsservice.actualizaLista( this.idl, valorValor, valorDescripcion, valorDominio, valorKey).subscribe( () => {
      Swal2.close();
      Swal2.fire({
      title: 'Modificacion de lista exitosa',
      text: '',
      icon: 'success',
      showConfirmButton: true,
      showCancelButton: false,
      allowOutsideClick: false
    }). then ( res => {

      if ( res.value ) {
        this.router.navigate(['/listas']);
      }

    } );

  }, (err) => {             Swal2.close();
                            console.log(err);
                            Swal2.fire(
                              'Error al modificar Lista',
                              'Error',
                              'error'
                           );
                        } );

  }


}
