import { Injectable } from '@angular/core';
import { Usuario, Usuario2, Usuario3 } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';


@Injectable()
export class GuardService {
  oxu: any[];
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


  getAcceso(url) {
   
  }

getOptionsxUsuario( id ) {

  const url = `${environment.URL_SERVICIOS}/reports/user_id/${id}/user_options?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  /* return this.http.get( url ).pipe(
    map ( (resp: any) => { return resp;
    } )); */

    return this.http.get( url ).pipe(
    map ( (resp: any) => { return  resp;
    } ));

}

}
