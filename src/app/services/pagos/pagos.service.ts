import { Injectable } from '@angular/core';
import { Usuario, Usuario2, Usuario3, UserOptions } from '../../models/usuario.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';


@Injectable()
export class PagosService {

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

  getProveedores() {

    const url = `${environment.URL_SERVICIOS}/reports/payment_suppliers?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

    return this.http.get( url ).pipe(
      map ( (resp: any) => {
        return resp;
      }
      )
    );

  }

  getpayment_with_recourse_companies() {

    const url = `${environment.URL_SERVICIOS}/reports/payment_with_recourse_companies?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

    return this.http.get( url ).pipe(
      map ( (resp: any) => {
        return resp;
      }
      )
    );

  }

  getCadenas() {

    const url = `${environment.URL_SERVICIOS}/reports/payment_companies?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

    return this.http.get( url ).pipe(
      map ( (resp: any) => {
        return resp;
      }
      )
    );

  }

  getCadenasw() {

    const url = `${environment.URL_SERVICIOS}/reports/payment_deleg_suppliers?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

    return this.http.get( url ).pipe(
      map ( (resp: any) => {
        return resp;
      }
      )
    );

  }

  getFacturasPagoProveedor( idp, tpago ) {

    const url = `${environment.URL_SERVICIOS}/reports/supplier_id/${idp}/currency/${tpago}/payment_supplier_invoices?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

    return this.http.get( url ).pipe(
      map ( (resp: any) => {
        return resp;
      }
      )
    );

  }

  getFacturasPagoProveedorw( idp, tpago ) {

    const url = `${environment.URL_SERVICIOS}/reports/company_id/${idp}/currency/${tpago}/payment_with_recourse_comp_invoices?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

    return this.http.get( url ).pipe(
      map ( (resp: any) => {
        return resp;
      }
      )
    );

  }

  getFacturasPagoCadena( idp, tpago ) {

    const url = `${environment.URL_SERVICIOS}/reports/company_id/${idp}/currency/${tpago}/payment_company_invoices?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

    return this.http.get( url ).pipe(
      map ( (resp: any) => {
        return resp;
      }
      )
    );

  }

  getFacturasPagoCadenaw( idp, tpago ) {

    const url = `${environment.URL_SERVICIOS}/reports/supplier_id/${idp}/currency/${tpago}/payment_deleg_suppliers_invoices?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

    return this.http.get( url ).pipe(
      map ( (resp: any) => {
        return resp;
      }
      )
    );

  }

  aplicarPago( params ) {

    const url = `${environment.URL_SERVICIOS}/payments`;

    params.token = this.token;
    params.secret_key = environment.SECRET_KEY;

    return this.http.post( url, params ).pipe(
      map ( (resp: string) => {
        return this.crearArregloid(resp);
      }
      )
    );

  }

  aplicarPagoRAWproveedor(params) {
    params.token = this.token;
    params.secret_key = environment.SECRET_KEY;
    const url = `${environment.URL_SERVICIOS}/payments`;
    return this.http.post( url, params ).pipe(
      map ( (resp: string) => {
        return resp;
      }
      )
    );
  }

  crearArregloid( contribuObj: any) {

    const facturas: any[] = [];
    let resul: string;

    if ( contribuObj === null ) { return []; }
    // tslint:disable-next-line: forin

    resul = contribuObj.data.attributes.id;

  //  console.log( usuarios[0][prop].attributes );

    return resul;
  }

  patchFacturas( idf, spid ) {

    const params = {
      token: this.token,
      secret_key: environment.SECRET_KEY,
      status: 'EJECUTADA',
      supplier_payment_id: spid
    };

    const url = `${environment.URL_SERVICIOS}/invoices/${idf}`;

    return this.http.patch( url, params ).pipe(
      map( (resp: any) => { return resp;
      } ));
  }

  patchFacturascadena( idf, spid ) {

    const params = {
      token: this.token,
      secret_key: environment.SECRET_KEY,
      status: 'LIQUIDADA',
      company_payment_id: spid
    };

    const url = `${environment.URL_SERVICIOS}/invoices/${idf}`;

    return this.http.patch( url, params ).pipe(
      map( (resp: any) => { return resp;
      } ));
  }

  // EXTRA EXTRA //////

  postUsuarioProveedor(params) {
    params.token = this.token;
    params.secret_key = environment.SECRET_KEY;

    const url = `${environment.URL_SERVICIOS}/supplier_users`;
    return this.http.post( url, params ).pipe(
      map ( (resp: string) => {
        return resp;
      }
      )
    );
  }

  postUsuarioCadena(params) {
    params.token = this.token;
    params.secret_key = environment.SECRET_KEY;
    const url = `${environment.URL_SERVICIOS}/company_users`;
    return this.http.post( url, params ).pipe(
      map ( (resp: string) => {
        return resp;
      }
      )
    );
  }

  getSuplierUser(idu) {
  const url = `${environment.URL_SERVICIOS}/reports/user_id/${idu}/supplier_user_association?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  return this.http.get( url ).pipe(
    map ( (resp: any) => {
      return resp;
    }
    )
  );
  }

  getCompanyUser(idu) {
    const url = `${environment.URL_SERVICIOS}/reports/user_id/${idu}/company_user_association?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
    return this.http.get( url ).pipe(
      map ( (resp: any) => {
        return resp;
      }
      )
    );
    }

  borraSuplierUser(ids) {
    const url = `${environment.URL_SERVICIOS}/supplier_users/${ids}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
    return this.http.delete( url ).pipe(
      map ( (resp: any) => {
        return resp;
      }
      )
    );
  }

  borraCompanyUser(ids) {
    const url = `${environment.URL_SERVICIOS}/company_users/${ids}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
    return this.http.delete( url ).pipe(
      map ( (resp: any) => {
        return resp;
      }
      )
    );
  }

  ////////////////////

}
