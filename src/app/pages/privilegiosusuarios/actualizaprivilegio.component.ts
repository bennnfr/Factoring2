import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService, PrivilegiosUsuariosService } from '../../services/service.index';
import { Privilegio, Usuario2 } from '../../models/usuario.model';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

declare function init_plugins();

@Component({
  selector: 'app-actualizaprivilegio',
  templateUrl: './actualizaprivilegio.component.html',
  styles: []
})
export class ActualizaPrivilegioComponent implements OnInit {

  forma: FormGroup;
  idu: string;
  idp: string;
  privilegio: any[] = [];

  constructor(
    public _usuarioService: UsuarioService,
    private route: ActivatedRoute,
    public _privilegiosusuarios: PrivilegiosUsuariosService,
    public router: Router
  ) { }


  ngOnInit() {

      this.idu = this.route.snapshot.paramMap.get('idu');
      this.idp = this.route.snapshot.paramMap.get('idp');

      this.forma = new FormGroup({
        Descripcion: new FormControl( null , Validators.required ),
        Key: new FormControl( null , Validators.required ),
        Valor: new FormControl( null , Validators.required ),
        Documentacion: new FormControl( null , Validators.required )

      } );

      this._privilegiosusuarios.getPrivilegio( this.idu, this.idp ).subscribe( resp => { this.privilegio = resp; } );

  }


  actualizaPrivilegio() {

    // Obtener el elemento por el id
    const Descripcion: any = document.getElementById('Descripcion');
    const Key: any = document.getElementById('Key');
    const Valor: any = document.getElementById('Valor');
    const Documentacion: any = document.getElementById('Documentacion');
    const puesto: any = document.getElementById('pues');

// Obtener el valor de la opción seleccionada

    const valorDescripcion = Descripcion.value;
    const valorKey = Key.value;
    const valorValor = Valor.value;
    const valorDocumentacion = Documentacion.value;

    const privilegio = new Privilegio(
      valorDescripcion,
      valorKey,
      valorValor,
      valorDocumentacion
    );
  //  console.log(privilegio);

    this._privilegiosusuarios.actualizaPrivilegio( this.idu, this.idp, privilegio ).subscribe( resp => {this.router.navigate(['/privilegiosusuarios/privilegiousuario/', this.idu]),
    Swal.fire(
      'Modificacion de Privilegio',
      'Exitosa',
      'success'
   ); }, (err) => {
                            Swal.fire(
                              'Error al modificar Privilegio',
                              'Error',
                              'error'
                           );
                        } );

  }


}
