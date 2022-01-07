import { Injectable } from '@angular/core';
import { Usuario, Usuario2, Usuario3 } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';


@Injectable()
export class RolesOptionsService {

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

  getRolesOptions( id: string ) {

    const url = `${environment.URL_SERVICIOS}/roles/${id}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

    return this.http.get( url ).pipe(
    map( (resp: any) => {return this.crearArregloRolesOptions(resp);
    }));

    }
  crearArregloRolesOptions( optionsObj: any) {

    const roles: any[] = [];
    const resul: any[] = [];
    const resul2: any[] = [];

    if ( optionsObj === null ) { return []; }
    Object.keys ( optionsObj ).forEach( key => {
      const rol: any = optionsObj[key];
      roles.push( rol );
    });
  //  console.log(roles[0].relations);
    // tslint:disable-next-line: forin
    for (const prop in roles[0].relations.role_options) {
   // console.log( roles[0].relations.role_options[prop].attributes );
    resul.push( roles[0].relations.role_options[prop].attributes );
    resul2.push(roles[0].relations.options[prop].attributes );
    }
  //  console.log(resul);
  //  console.log(resul2);

    // tslint:disable-next-line: forin
    for ( const prop in resul ) {

    const idro = resul[prop].option_id;

    // tslint:disable-next-line: forin
    for ( const prep in resul2 ) {

    const id = resul2[prep].id;

    if ( idro === id ) {

    resul[prop].name = resul2[prep].name;

    }

    }

    }
// console.log(resul);
    return resul;
}

getRol( id: string ) {

  const url = `${ environment.URL_SERVICIOS }/roles/${ id }?token=${ this.token }&secret_key=${ environment.SECRET_KEY }`;

  return this.http.get( url ).pipe(
    map ( (resp: string) => { return this.crearArregloRol(resp);
    } ));

}

crearArregloRol( rolObj: any) {

  const rol: any[] = [];
  let resul: string;
 // console.log(usuariosObj);
  if ( rolObj === null ) { return []; }
  Object.keys ( rolObj ).forEach( key => {
    const r: any = rolObj[key];
    rol.push( r );
  });
  // tslint:disable-next-line: forin
 // console.log( rolObj.data.attributes.name );
 // resul.push( rolObj.data.attributes.name );
  resul = rolObj.data.attributes.name;
 // console.log(resul);

  return resul;

}

  agregaRol( idu: string, ido: string ) {

    const url = `${environment.URL_SERVICIOS}/role_options?role_id=${idu}&option_id=${ido}&token=${this.token}&secret_key=${environment.SECRET_KEY}`;

    return this.http.post(url, null).pipe(
      map( (resp: any) => resp )
    );

  }

  quitarRol( idq: string ) {

    const url = `${environment.URL_SERVICIOS}/role_options/${idq}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

    return this.http.delete(url).pipe(
      map( (resp: any) => resp )
    );
  }

}
