import { Injectable } from '@angular/core';
import { Usuario, Usuario2, Usuario3, UserOptions } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
import { Perfisica, PerMoral, ContribuyenteFisica, ContribuyenteMoral, DocumentoPropiedad } from '../../models/personas.model';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';


@Injectable()
export class FundersService {

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


getFunderxContribuyente(idc) {

  const url = `${environment.URL_SERVICIOS}/contributors/${idc}/funders?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloFunder(resp);
    } )
  );

}

getCreditLinexFunder(idc) {

  const url = `${environment.URL_SERVICIOS}/funders/${idc}/credit_lines?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloFunder(resp);
    } )
  );

}

crearArregloFunder( contribuObj: any) {

  const contribuyentes: any[] = [];
  const resul: any[] = [];
  if ( contribuObj === null ) { return []; }
 /* Object.keys ( contribuObj ).forEach( key => {
    const rol: any = contribuObj[key];
    contribuyentes.push( rol );
  }); */
  // tslint:disable-next-line: forin
  for (const prop in contribuObj.data) {
  resul.push( contribuObj.data[prop].attributes );
  }
  // console.log(resul);
  return resul;

}

creaFunder( idc, params ) {
  params.token = this.token;
  params.secret_key = environment.SECRET_KEY;
  const url = `${environment.URL_SERVICIOS}/contributors/${idc}/funders`;
  return this.http.post( url, params ).pipe(
    map( (resp: any) => {
      return resp;
    }));
}

actualizaFunder( idc, idf, params ) {
  params.token = this.token;
  params.secret_key = environment.SECRET_KEY;
  const url = `${environment.URL_SERVICIOS}/contributors/${idc}/funders/${idf}`;
  return this.http.patch( url, params ).pipe(
    map( (resp: any) => {
      return resp;
    }));
}

borraFunder( idc, idf ) {
  const url = `${environment.URL_SERVICIOS}/contributors/${idc}/funders/${idf}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  return this.http.delete( url ).pipe(
    map( (resp: any) => {
      return resp;
    }));
}

creaCreditLinePesosDolares( idf, params ) {
  params.token = this.token;
  params.secret_key = environment.SECRET_KEY;
  const url = `${environment.URL_SERVICIOS}/funders/${idf}/credit_lines`;
  return this.http.post( url, params ).pipe(
    map( (resp: any) => {
      return resp;
    }));
}

modificaCreditLinePesosDolares(idf, idl, params) {
  params.token = this.token;
  params.secret_key = environment.SECRET_KEY;
  const url = `${environment.URL_SERVICIOS}/funders/${idf}/credit_lines/${idl}`;
  return this.http.patch( url, params ).pipe(
    map( (resp: any) => {
      return resp;
    }));
}

borraCeditLinePesosDolares( idf, idl ) {
  const url = `${environment.URL_SERVICIOS}/funders/${idf}/credit_lines/${idl}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  return this.http.delete( url ).pipe(
    map( (resp: any) => {
      return resp;
    }));
}

// SOLICITUDES ////////
getFacturasxcadena( idc, moneda ) {
  const url = `${environment.URL_SERVICIOS}/funding_requests/company_id/${idc}/currency/${moneda}/funding_invoices?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  return this.http.get(url).pipe(
    map( (resp: any) => {
      return resp;
    } )
  );
}

getSimulacion( params ) {
  params.token = this.token;
  params.secret_key = environment.SECRET_KEY;

  const url = `${environment.URL_SERVICIOS}/funding_requests?`;

  return this.http.post( url, params ).pipe(
              map( (resp: any) => {
                return this.crearArreglosimul(resp);
              }));

}

crearArreglosimul( contribuObj: any) {

  const facturas: any[] = [];
  const resul: any[] = [];

  if ( contribuObj === null ) { return []; }
  resul.push( contribuObj.data.attributes );

  return resul;

}

getBaseLayout( ids ) {
  const url = `${environment.URL_SERVICIOS}/funding_requests/layout_base/${ids}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  return this.http.get(url).pipe(
    map( (resp: any) => {
      return resp;
    } )
  );
}

getEnviaMail( ids ) {
  const url = `${environment.URL_SERVICIOS}/funding_request_mailer/${ids}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  return this.http.get(url).pipe(
    map( (resp: any) => {
      return resp;
    } )
  );
}


agregaattached( ids, params ) {
  params.secret_key = environment.SECRET_KEY;
  params.token = this.token;
  const url = `${environment.URL_SERVICIOS}/funding_requests/${ids}`;
  return this.http.patch(url, params).pipe(
    map( (resp: any) => {
      return resp;
    } )
  );
}

getfundersfinancial() {
  const url = `${environment.URL_SERVICIOS}/reports/payment_funder_financial?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  return this.http.get(url).pipe(
    map( (resp: any) => {
      return resp;
    } )
  );
}
//////////////////////

getcompanyfacturas( idc, moneda ) {
  const url = `${environment.URL_SERVICIOS}/reports/company_id/${idc}/currency/${moneda}/get_funding_invoices?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  return this.http.get(url).pipe(
    map( (resp: any) => {
      return resp;
    } )
  );
}

getcompanyfacturaspayment( idc, moneda ) {
  const url = `${environment.URL_SERVICIOS}/reports/company_id/${idc}/currency/${moneda}/payment_funding_invoices?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  return this.http.get(url).pipe(
    map( (resp: any) => {
      return resp;
    } )
  );
}
}

