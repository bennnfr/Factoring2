import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Privilegio } from '../../models/usuario.model';
import { map } from 'rxjs/operators';
@Injectable()
export class MiFielService {

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

    getDoc(iddoc) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Basic ' + btoa(`${environment.APP_ID}:${environment.APP_SECRET}`)
        })
      };
        const url = `${environment.URL_MIFIEL}/documents/${iddoc}`;
        return this.http.get(url, httpOptions).pipe(
          map( (resp: any) => {
            return (resp);
          } )
        );
        
        
      }

      getDocs() {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': 'Basic ' + btoa(`${environment.APP_ID}:${environment.APP_SECRET}`)
          })
        };
          const url = `${environment.URL_MIFIEL}/documents`;
          return this.http.get(url, httpOptions).pipe(
            map( (resp: any) => {
              return (resp);
            } )
          );
          
          
        }

        CreaDoc( body ) {
          const httpOptions = {
            headers: new HttpHeaders({
            //  'Content-Type':  'multipart/form-data',
              'Authorization': 'Basic ' + btoa(`${environment.APP_ID}:${environment.APP_SECRET}`)
            })
          };
            const url = `${environment.URL_MIFIEL}/documents`;
            return this.http.post(url, body, httpOptions).pipe(
              map( (resp: any) => {
                return (resp);
              } )
            );
            
            
          }
          
          SolicitaFirma( iddoc ) {
            const httpOptions = {
              headers: new HttpHeaders({
              //  'Content-Type':  'multipart/form-data',
                'Authorization': 'Basic ' + btoa(`${environment.APP_ID}:${environment.APP_SECRET}`)
              })
            };
            const body = {
              email : 'benjamin.flores.r@gmail.com'
            }
              const url = `${environment.URL_MIFIEL}/documents/${iddoc}/request_signature`;
              return this.http.post(url, body, httpOptions).pipe(
                map( (resp: any) => {
                  return (resp);
                } )
              );
              
              
            } 

}
