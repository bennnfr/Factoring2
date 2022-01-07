import { Injectable } from '@angular/core';
import { Usuario, Usuario2 } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';


@Injectable()
export class ReportesService {

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

  getReporteFacturas() {

  const url = `${environment.URL_SERVICIOS}/reports/general_report_invoices?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return resp;
    } )
  );

  }

  getReporteSolicitudesFondeo() {
    const url = `${environment.URL_SERVICIOS}/reports/general_report_funding_requests?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return resp;
    } )
  );
  }

  getReporteDetalleFactura( id ) {

    const url = `${environment.URL_SERVICIOS}/invoices/${id}/invoice_details?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

    return this.http.get(url).pipe(
      map( (resp: any) => {return this.crearArregloDetalleFactura(resp);
      } )
    );

  }

  crearArregloDetalleFactura( optionsObj: any) {

    const detalles: any[] = [];
    const resul: any[] = [];

    if ( optionsObj === null ) { return []; }
    Object.keys ( optionsObj ).forEach( key => {
      const detalle: any = optionsObj[key];
      detalles.push( detalle );
    });
    // tslint:disable-next-line: forin
    for (const prop in detalles[0]) {
  //  console.log( usuarios[0][prop].attributes );
    resul.push( detalles[0][prop].attributes );
    }

    return resul;
}

  getReporteDetalleSolicitud( id ) {

  const url = `${environment.URL_SERVICIOS}/requests/${id}/request_details?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {return this.crearArregloDetalleSolicitud(resp);
    } )
  );

}

  crearArregloDetalleSolicitud( optionsObj: any) {

  const detalles: any[] = [];
  const resul: any[] = [];

  if ( optionsObj === null ) { return []; }
  Object.keys ( optionsObj ).forEach( key => {
    const detalle: any = optionsObj[key];
    detalles.push( detalle );
  });
  // tslint:disable-next-line: forin
  for (const prop in detalles[0]) {
//  console.log( usuarios[0][prop].attributes );
  resul.push( detalles[0][prop].attributes );
  }

  return resul;
}

  getReporteSolicitudes() {

    const url = `${environment.URL_SERVICIOS}/reports/general_report_requests?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

    return this.http.get(url).pipe(
      map( (resp: any) => {
        return resp;
      } )
    );

  }

  getReporteDaily( date ) {

    const url = `${environment.URL_SERVICIOS}/reports/used_date/${date}/daily_operations?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

    return this.http.get(url).pipe(
      map( (resp: any) => {
        return resp;
      } )
    );

  }

  getBanorte( date, type ) {

    const url = `${environment.URL_SERVICIOS}/reports/used_date/${date}/layout_banorte/${type}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

    return this.http.get(url).pipe(
      map( (resp: any) => {
        return resp;
      } )
    );

  }

  getBanregio( date, type ) {

    const url = `${environment.URL_SERVICIOS}/reports/used_date/${date}/layout_banregio/${type}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

    return this.http.get(url).pipe(
      map( (resp: any) => {
        return resp;
      } )
    );

  }

  getBase( date, currency, type ) {

    const url = `https://dev.devfactorgfc.com/api/v1/reports/used_date/${date}/currency/${currency}/layout_base/${type}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

    return this.http.get(url).pipe(
      map( (resp: any) => {
        return resp;
      } )
    );

  }

  getBancrea( date, type ) {
    const url = `${environment.URL_SERVICIOS}/reports/used_date/${date}/layout_bancrea/${type}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
    return this.http.get(url).pipe(
      map( (resp: any) => {
        return resp;
      } )
    );
  }

  getCompanyPayments( date, idc ) {

    const url = `${environment.URL_SERVICIOS}/reports/report_date/${date}/company_id/${idc}/company_payments?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

    return this.http.get( url ).pipe(
      map ( (resp: any) => {
        return resp;
      }
      )
    );

  }

  getCompanyPaymentsw( date, idc ) {

    const url = `${environment.URL_SERVICIOS}/reports/report_date/${date}/supplier_id/${idc}/company_payments?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

    return this.http.get( url ).pipe(
      map ( (resp: any) => {
        return resp;
      }
      )
    );

  }

  getCompapanyes() {

    const url = `${environment.URL_SERVICIOS}/reports/payment_companies?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

    return this.http.get(url).pipe(
      map( (resp: any) => {
        return resp;
      } )
    );

  }

  getCompapanyesw() {

    const url = `${environment.URL_SERVICIOS}/reports/payment_deleg_suppliers?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

    return this.http.get(url).pipe(
      map( (resp: any) => {
        return resp;
      } )
    );

  }

  getCFDIS() {
    const url = `${environment.URL_SERVICIOS}/reports/invoice_cfdis?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
    return this.http.get(url).pipe(
      map( (resp: any) => {
        return resp;
      } )
    );
  }

  getDirectorReportResume() {
    const url = `${environment.URL_SERVICIOS}/reports/director_report_resume?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
    return this.http.get(url).pipe(
      map( (resp: any) => {
        return resp;
      } )
    );
  }

  getDirectorDetailPayments() {
    const url = `${environment.URL_SERVICIOS}/reports/director_report_detail_payments?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
    return this.http.get(url).pipe(
      map( (resp: any) => {
        return resp;
      } )
    );
  }

  getDirectorDetailDiscounts() {
    const url = `${environment.URL_SERVICIOS}/reports/director_report_detail_discounts?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
    return this.http.get(url).pipe(
      map( (resp: any) => {
        return resp;
      } )
    );
  }

}
