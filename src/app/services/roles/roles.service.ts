import { Injectable } from '@angular/core';
import { Usuario, Usuario2, Usuario3 } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';


@Injectable()
export class RolesService {

  usuario: Usuario;
  token: string;
  usuario2: Usuario2;
  idUsuario: string;

  constructor(
    public http: HttpClient,
    public router: Router
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


  crearRol( name: string, desc: string ) {

    const url = `${ environment.URL_SERVICIOS }/roles?role[name]=${ name }&role[description]=${ desc }&token=${ this.token }&secret_key=${ environment.SECRET_KEY }`;


    return this.http.post( url, null ).pipe(
              map( (resp: any) => {
                return resp;
              }));
  }

  getRoles() {

    const url = `${ environment.URL_SERVICIOS }/roles?token=${ this.token }&secret_key=${ environment.SECRET_KEY }`;

    return this.http.get( url ).pipe(
    map( (resp: any) => {return this.crearArregloRoles(resp);
    }));

    }
  crearArregloRoles( rolesObj: any) {

    const roles: any[] = [];
    const resul: any[] = [];

    if ( rolesObj === null ) { return []; }
    Object.keys ( rolesObj ).forEach( key => {
      const rol: any = rolesObj[key];
      roles.push( rol );
    });
    // tslint:disable-next-line: forin
    for (const prop in roles[0]) {
  //  console.log( usuarios[0][prop].attributes );
    resul.push( roles[0][prop].attributes );
    }

   // console.log(resul);

    return resul;

}

getRol( id: string ) {

  const url = `${ environment.URL_SERVICIOS }/roles/${ id }?token=${ this.token }&secret_key=${ environment.SECRET_KEY }`;

  return this.http.get( url ).pipe(
    map ( (resp: any) => { return this.crearArregloRol(resp);
    } ));

}

crearArregloRol( rolObj: any) {

  const rol: any[] = [];
  const resul: any[] = [];
 // console.log(usuariosObj);
  if ( rolObj === null ) { return []; }
  Object.keys ( rolObj ).forEach( key => {
    const r: any = rolObj[key];
    rol.push( r );
  });
  // tslint:disable-next-line: forin
//  console.log( usuarios[0][prop].attributes );
  resul.push( rolObj.data.attributes );

 // console.log(resul);

  return resul;

}

actualizaRol(idr: string, nombre: string, desc: string) {

const url = `${ environment.URL_SERVICIOS }/roles/${idr}?token=${ this.token }&secret_key=${ environment.SECRET_KEY }&role[name]=${ nombre }&role[description]=${ desc }`;

return this.http.patch( url, null ).pipe(
  map( (resp: any) => { return resp;
  } ));
}

borrarRol(id: string) {

  const url = `${ environment.URL_SERVICIOS }/roles/${ id }?token=${ this.token }&secret_key=${ environment.SECRET_KEY }`;

  return this.http.delete( url ).pipe(
    map( (resp: any) => { return resp;
     } ));

}

prueba() {
  const url = `${environment.URL_SERVICIOS}/lists/domain/usuario.estatus?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get( url ).pipe(
    map ( (resp: any) => { return resp;
    } ));
}

}
