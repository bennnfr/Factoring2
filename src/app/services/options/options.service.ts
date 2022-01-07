import { Injectable } from '@angular/core';
import { Usuario, Usuario2, Usuario3 } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';


@Injectable()
export class OptionsService {

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


  crearOption( name: string, desc: string, group: string, urlo: string ) {

    const url = `${ environment.URL_SERVICIOS }/options?option[name]=${ name }&option[description]=${ desc }&option[group]=${ group }&option[url]=${ urlo }&token=${ this.token }&secret_key=${ environment.SECRET_KEY }`;


    return this.http.post( url, null ).pipe(
              map( (resp: any) => {
                return resp;
              }));
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

   // console.log(resul);

    return resul;

}

getOption( id: string ) {

  const url = `${environment.URL_SERVICIOS}/options/${id}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get( url ).pipe(
    map ( (resp: any) => { return this.crearArregloOption(resp);
    } ));

}

crearArregloOption( optionObj: any) {

  const option: any[] = [];
  const resul: any[] = [];
 // console.log(usuariosObj);
  if ( optionObj === null ) { return []; }
  Object.keys ( optionObj ).forEach( key => {
    const r: any = optionObj[key];
    option.push( r );
  });
  // tslint:disable-next-line: forin
//  console.log( usuarios[0][prop].attributes );
  resul.push( optionObj.data.attributes );

  return resul;

}

actualizaOption(ido: string, nombre: string, desc: string, group: string, urlo: string) {

const url = `${environment.URL_SERVICIOS}/options/${ido}?token=${this.token}&secret_key=${environment.SECRET_KEY}&option[name]=${nombre}&option[description]=${desc}&option[group]=${group}&option[url]=${urlo}`;

return this.http.patch( url, null ).pipe(
  map( (resp: any) => { return resp;
  } ));
}

borrarOption(id: string) {

  const url = `${ environment.URL_SERVICIOS }/options/${ id }?token=${ this.token }&secret_key=${ environment.SECRET_KEY }`;

  return this.http.delete( url ).pipe(
    map( (resp: any) => { return resp;
     } ));

}

getOptionsxUsuario( id ) {

  const url = `${environment.URL_SERVICIOS}/reports/user_id/${id}/user_options?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get( url ).pipe(
    map ( (resp: any) => { return resp;
    } ));

}

}
