import { Injectable } from '@angular/core';
// import { URL_SERVICIOS, SECRET_KEY } from '../../config/config';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Privilegio } from '../../models/usuario.model';
import { map } from 'rxjs/operators';

@Injectable()
export class PrivilegiosUsuariosService {

    token: string;

    constructor(public http: HttpClient,
                public router: Router) {}


    getPrivilegiosUsuario( id: string ) {

        if ( localStorage.getItem('token')) {
            this.token = localStorage.getItem('token');
          } else {
            this.token = '';
          }

        const url = `${environment.URL_SERVICIOS}/users/${id}/user_privileges?secret_key=${environment.SECRET_KEY}&token=${this.token}`;

        return this.http.get( url ).pipe(
            map ( (resp: any) => { return this.crearArregloPrivilegios(resp);
            } ));

    }

    crearArregloPrivilegios( privilegiosObj: any ) {

        const privilegios: any[] = [];
        const resul: any[] = [];
 // console.log(usuariosObj);
        if ( privilegiosObj === null ) { return []; }
        Object.keys ( privilegiosObj ).forEach( key => {
    const usuario: any = privilegiosObj[key];
    privilegios.push( usuario );
  });

        // tslint:disable-next-line: forin
        for (const prop in privilegios[0]) {
          //  console.log( usuarios[0][prop].attributes );
            resul.push( privilegios[0][prop].attributes );
            }

        // console.log(resul);

        return resul;

    }

    guardarPrivilegio( id: string, forma: Privilegio ) {

      if ( localStorage.getItem('token')) {
        this.token = localStorage.getItem('token');
      } else {
        this.token = '';
      }

      const url = `${environment.URL_SERVICIOS}/users/${id}/user_privileges?user_privilege[description]=${ forma.descripcion }&user_privilege[key]=${ forma.key }&user_privilege[value]=${ forma.valor }&user_privilege[documentation]=${ forma.documentacion }&secret_key=${ environment.SECRET_KEY }&token=${ this.token }`;

      return this.http.post( url, null ).pipe(
        map( (resp: any) => {
          return resp;
        }));

    }

    borraPrivilegio(privilegioid: string, usuarioid: string) {

      if ( localStorage.getItem('token')) {
        this.token = localStorage.getItem('token');
      } else {
        this.token = '';
      }

      const url = `${environment.URL_SERVICIOS}/users/${ usuarioid }/user_privileges/${ privilegioid }?secret_key=${ environment.SECRET_KEY }&token=${ this.token }`;
      return this.http.delete( url ).pipe(
        map( (resp: any) => {
          return resp;
        }));
    }

    getPrivilegio( idu: string, idp: string ) {

      if ( localStorage.getItem('token')) {
        this.token = localStorage.getItem('token');
      } else {
        this.token = '';
      }

      const url = `${ environment.URL_SERVICIOS }/users/${ idu }/user_privileges/${ idp }?secret_key=${ environment.SECRET_KEY }&token=${ this.token }`;

      return this.http.get( url ).pipe(
        map ( (resp: any) => { return this.crearArregloPrivilegio(resp);
        } ));

    }

    crearArregloPrivilegio( privilegiosObj: any ) {

      const privilegio: any[] = [];
      const resul: any[] = [];
// console.log(usuariosObj);
      if ( privilegiosObj === null ) { return []; }
      Object.keys ( privilegiosObj ).forEach( key => {
  const usuario: any = privilegiosObj[key];
  privilegio.push( usuario );
});

     // console.log(privilegio[0].attributes);
      resul.push( privilegio[0].attributes );
     // console.log(resul);

      return resul;

  }

  actualizaPrivilegio(idu: string, idp: string,  pri: Privilegio) {

    if ( localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
    } else {
      this.token = '';
    }

    const url = `${ environment.URL_SERVICIOS }/users/${ idu }/user_privileges/${ idp }?secret_key=${ environment.SECRET_KEY }&token=${ this.token }&user_privilege[description]=${ pri.descripcion }&user_privilege[key]=${ pri.key }&user_privilege[value]=${ pri.valor }&user_privilege[documentation]=${ pri.documentacion }`;

    return this.http.patch( url, null ).pipe(
      map( (resp: any) => { return resp;
      } ));
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

}
