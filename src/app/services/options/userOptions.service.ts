import { Injectable } from '@angular/core';
import { Usuario, Usuario2, Usuario3 } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';


@Injectable()
export class UserOptionsService {

  usuario: Usuario;
  token: string;
  usuario2: Usuario2;
  idUsuario: string;

  constructor(
    public http: HttpClient,
    public router: Router,
  ) {
    this.cargarStorage();
  }

  cargarStorage() {

    if ( localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse( localStorage.getItem('usuario') );
    } else {
      this.token = '';
      this.usuario = null;
    }

  }

  getOptions() {

    const url = `${ environment.URL_SERVICIOS }/options?token=${ this.token }&secret_key=${ environment.SECRET_KEY }`;

    return this.http.get( url ).pipe(
    map( (resp: any) => {return this.crearArregloOptions(resp);
    }));

    }
  crearArregloOptions( optionsObj: any) {

    const options: any[] = [];
    const resul: any[] = [];

    if ( optionsObj === null ) { return []; }
    Object.keys ( optionsObj ).forEach( key => {
      const rol: any = optionsObj[key];
      options.push( rol );
    });
    // tslint:disable-next-line: forin
    for (const prop in options[0]) {
  //  console.log( usuarios[0][prop].attributes );
    resul.push( options[0][prop].attributes );
    }

    return resul;
}

getUsuario( id: string ) {

  const url = `${environment.URL_SERVICIOS}/users/${id}?secret_key=${environment.SECRET_KEY}&token=${this.token}`;

  return this.http.get( url ).pipe(
    map ( (resp: any) => { return this.crearArregloUsuario(resp);
    } ));

}

crearArregloUsuario( usuariosObj: any) {

  const usuarios: any[] = [];
  let resul: string;
 // console.log(usuariosObj);
  if ( usuariosObj === null ) { return []; }
  Object.keys ( usuariosObj ).forEach( key => {
    const usuario: any = usuariosObj[key];
    usuarios.push( usuario );
  });
  // tslint:disable-next-line: forin
//  console.log( usuarios[0][prop].attributes );
  resul =  usuariosObj.data.attributes.name;

 // console.log(resul);

  return resul;

}

  agregaOption( idu: string, ido: string ) {

    const url = `${environment.URL_SERVICIOS}/user_options?user_id=${idu}&option_id=${ido}&token=${this.token}&secret_key=${environment.SECRET_KEY}`;

    return this.http.post(url, null).pipe(
      map( (resp: any) => resp )
    );

  }

  quitarOption( idq: string ) {

    const url = `${environment.URL_SERVICIOS}/user_options/${idq}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

    return this.http.delete(url).pipe(
      map( (resp: any) => resp )
    );
  }

}
