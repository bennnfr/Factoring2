import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Privilegio } from '../../models/usuario.model';
import { map } from 'rxjs/operators';

@Injectable()
export class TarifasService {

    token: string;

    constructor(public http: HttpClient,
                public router: Router) {
                  this.cargarStorage();
                }


    cargarStorage() {

    if ( localStorage.getItem('token')) {
         this.token = localStorage.getItem('token');
       } else {
         this.token = '';
        }
    }

    getTarifas() {

      const url = `${environment.URL_SERVICIOS}/rates?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

      return this.http.get(url).pipe(
        map( (resp: any) => {
          return this.crearArreglotarifas(resp);
        } )
      );

    }

    crearArreglotarifas( contribuObj: any) {

      const tarifas: any[] = [];
      const resul: any[] = [];

      if ( contribuObj === null ) { return []; }

     // console.log(contribuObj);

      // tslint:disable-next-line: forin
      for ( const prop in contribuObj.data ) {
        resul.push( contribuObj.data[prop].attributes );
      }

      return resul;

    }

    modificaTarifa( id ) {

      const url = `${environment.URL_SERVICIOS}/rates/${id}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

      return this.http.get(url).pipe(
        map( (resp: any) => {
          return this.crearArreglotarifa(resp);
        } )
      );

    }

    crearArreglotarifa( contribuObj: any) {

      const tarifas: any[] = [];
      const resul: any[] = [];

      if ( contribuObj === null ) { return []; }

     // console.log(contribuObj);

      // tslint:disable-next-line: forin

      resul.push( contribuObj.data.attributes );
    //  console.log(resul);

      return resul;

    }

    actualizaTarifa( id, params ) {

    params.token = this.token;
    params.secret_key = environment.SECRET_KEY;

    const url = `${environment.URL_SERVICIOS}/rates/${id}`;

    return this.http.patch( url, params ).pipe(
      map( (resp: any) => { return resp;
      } ));

    }

    guardaTarifa(params) {

    params.token = this.token;
    params.secret_key = environment.SECRET_KEY;

    const url = `${environment.URL_SERVICIOS}/rates`;

    return this.http.post(url, params);

    }

    borraTarifa(id) {

      const url = `${environment.URL_SERVICIOS}/rates/${id}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

      return this.http.delete( url ).pipe(
        map( (resp: any) => { return resp;
         } ));

    }

    // LISTAS

    getRatetype() {

      const url = `${environment.URL_SERVICIOS}/lists/domain/RATE_TYPE?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  
  
  
      return this.http.get(url).pipe(
        map( (resp: any) => {
          return this.crearArregloRate(resp);
        } )
      );
  
    }
  
    crearArregloRate( contribuObj: any) {
  
      const rr: any[] = [];
      const resul: any[] = [];
  
      if ( contribuObj === null ) { return []; }
      Object.keys ( contribuObj ).forEach( key => {
        const rol: any = contribuObj[key];
        rr.push( rol );
      });
      // tslint:disable-next-line: forin
      for ( const prop in rr[0] ) {
  
        resul.push( rr[0][prop].attributes.value );
  
      }
  
      return resul;
  
    }

}
