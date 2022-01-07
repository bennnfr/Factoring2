import { Component, OnInit } from '@angular/core';
import { SettingsService, UsuarioService } from '../../services/service.index';
import { Usuario } from '../../models/usuario.model';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  // usuario: Usuario;
   checked1: boolean;
   ajustes = {
    temaUrl: 'assets/css/colors/blue.css',
    tema: 'blue'
  };
   usuario = localStorage.getItem('usuario');
   email = localStorage.getItem('emailuser');
   usuariof = '';

  constructor( public _usuarioService: UsuarioService,
               public _ajustes: SettingsService) {
                if ( localStorage.getItem('ajustes') ) {
                  this.ajustes = JSON.parse( localStorage.getItem('ajustes') );
                  if ( this.ajustes.tema === 'blue' ) {
                   // console.log('es false');
                    this.checked1 = false;
                  } else if ( this.ajustes.tema === 'blue-dark' ) {
                    this.checked1 = true;

                  }
                }
               }

  ngOnInit() {

  this.usuariof = this.usuario.slice(1, -1);
  let  email = this.email;
  }

  cambiarColor( tema: string) {  // , link: any ) {

    this.checked1 = !this.checked1;
    if (this.checked1) {
      tema = 'blue';
      this.checked1 = false;
    } else {
      tema = 'blue-dark';
      this.checked1 = true;
    }
    this._ajustes.aplicarTema( tema );

  }

}
