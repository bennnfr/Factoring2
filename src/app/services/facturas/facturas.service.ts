import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Privilegio } from '../../models/usuario.model';
import { map } from 'rxjs/operators';

@Injectable()
export class FacturasService {

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


    ////////////////////////////////////////
    xml(xmlData) {

      const XmlReader = require('xml-reader');
      const reader = XmlReader.create();
      const xhr = new XMLHttpRequest();
      // xhr.open('GET', '../../../assets/xml/1.xml');
      xhr.responseType = 'text';
      xhr.onload = function () {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
  
  
                const xml = xmlData; // xhr.response;
                reader.on('done', data => {console.log(data); return data; });
                reader.parse(xml);
                console.log(reader.parse(xml));
  
            }
        }
    };
  
      xhr.send(null);
  
    }
    ///////////////////////////////////////



    guardaFactura(data) {

    data.token = this.token;
    data.secret_key = environment.SECRET_KEY;

    const url = `${environment.URL_SERVICIOS}/invoices`;

    return this.http.post(url, data);

    }

    // LISTAS

    getInvoiceCurrency() {

      const url = `${environment.URL_SERVICIOS}/lists/domain/INVOICE_CURRENCY?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
      return this.http.get(url).pipe(
        map( (resp: any) => {
          return this.crearArregloCurrency(resp);
        } )
      );
    }

    getInvoiceStatus() {

      const url = `${environment.URL_SERVICIOS}/lists/domain/INVOICE_STATUS?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
      return this.http.get(url).pipe(
        map( (resp: any) => {
          return this.crearArregloCurrency(resp);
        } )
      );
    }
    crearArregloCurrency( contribuObj: any) {

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
