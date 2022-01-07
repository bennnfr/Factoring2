import { Injectable } from '@angular/core';
import { Usuario, Usuario2, Usuario3 } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';


@Injectable()
export class ListasService {

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


  crearLista( dominio: string, key: string, valor: string, descripcion: string ) {

    const url = `${environment.URL_SERVICIOS}/lists?list[domain]=${dominio}&list[key]=${key}&list[value]=${valor}&token=${this.token}&secret_key=${environment.SECRET_KEY}&list[description]=${descripcion}`;


    return this.http.post( url, null ).pipe(
              map( (resp: any) => {
                return resp;
              }));
  }

  getListas() {

    const url = `${environment.URL_SERVICIOS}/lists?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

    return this.http.get( url ).pipe(
    map( (resp: any) => {return this.crearArregloListas(resp);
    }));

    }
  crearArregloListas( listasObj: any) {

    const listas: any[] = [];
    const resul: any[] = [];

    if ( listasObj === null ) { return []; }
    Object.keys ( listasObj ).forEach( key => {
      const rol: any = listasObj[key];
      listas.push( rol );
    });
    // tslint:disable-next-line: forin
    for (const prop in listas[0]) {
  //  console.log( usuarios[0][prop].attributes );
    resul.push( listas[0][prop].attributes );
    }

   // console.log(resul);

    return resul;

}

getLista( id: string ) {

  const url = `${environment.URL_SERVICIOS}/lists/${id}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get( url ).pipe(
  map( (resp: any) => {return this.crearArregloLista(resp);
  }));

  }
crearArregloLista( listasObj: any) {

  const listas: any[] = [];
  const resul: any[] = [];
  if ( listasObj === null ) { return []; }
  // tslint:disable-next-line: forin

//  console.log( usuarios[0][prop].attributes );
  resul.push( listasObj.data.attributes );

  return resul;

}

borrarLista(id: string) {

  const url = `${environment.URL_SERVICIOS}/lists/${id}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.delete( url ).pipe(
    map( (resp: any) => { return resp;
     } ));

}


actualizaLista(idl: string, valor: string, desc: string, domain: string, key: string) {

  const url = `${environment.URL_SERVICIOS}/lists/${idl}?token=${this.token}&secret_key=${environment.SECRET_KEY}&list[description]=${desc}&list[value]=${valor}&list[domain]=${domain}&list[key]=${key}`;

  return this.http.patch( url, null ).pipe(
    map( (resp: any) => { return resp;
    } ));
  }

  getListaDominio() {

    const url = `${environment.URL_SERVICIOS}/lists/domain/USER_STATUS?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

    return this.http.get( url ).pipe(
      map( (resp: any) => { return this.crearArregloListaDominio(resp);
      } ));

  }

  crearArregloListaDominio( listasObj: any) {

    const listas: any[] = [];
    const resul: any[] = [];


    if ( listasObj === null ) { return []; }
    Object.keys ( listasObj ).forEach( key => {
      const rol: any = listasObj[key];
      listas.push( rol );
    });

    // tslint:disable-next-line: forin
    for (const prop in listas[0]) {
  //  console.log( usuarios[0][prop].attributes );
    resul.push( listas[0][prop].attributes.value );
    }

    return resul;

  }


}
