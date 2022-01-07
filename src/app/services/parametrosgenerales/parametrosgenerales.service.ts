import { Injectable } from '@angular/core';
import { Usuario, Usuario2, Usuario3 } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';


@Injectable()
export class ParametrosGeneralesService {

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


  crearParametro( Description: string, Key: string, Value: string, Table: string, Idtable: string, Usedvalues: string, Documentation: string ) {

    const url = `${environment.URL_SERVICIOS}/general_parameters?general_parameter[description]=${Description}&general_parameter[key]=${Key}&general_parameter[value]=${Value}&general_parameter[table]=${Table}&general_parameter[id_table]=${Idtable}&general_parameter[used_values]=${Usedvalues}&general_parameter[documentation]=${Documentation}&token=${this.token}&secret_key=${environment.SECRET_KEY}`;


    return this.http.post( url, null ).pipe(
              map( (resp: any) => {
                return resp;
              }));
  }

  getParametros() {

    const url = `${ environment.URL_SERVICIOS }/general_parameters?token=${ this.token }&secret_key=${ environment.SECRET_KEY }`;

    return this.http.get( url ).pipe(
    map( (resp: any) => {return this.crearArregloParametros(resp);
    }));

    }
  crearArregloParametros( rolesObj: any) {

    const roles: any[] = [];
    const resul: any[] = [];

    if ( rolesObj === null ) { return []; }
    Object.keys ( rolesObj ).forEach( key => {
      const rol: any = rolesObj[key];
      roles.push( rol );
    });
    // tslint:disable-next-line: forin
    for (const prop in roles[0]) {
  //  console.log( usuarios[0][prop].attributes );
    resul.push( roles[0][prop].attributes );
    }

   // console.log(resul);

    return resul;

}

getParametro( id: string ) {

  const url = `${environment.URL_SERVICIOS}/general_parameters/${id}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get( url ).pipe(
    map ( (resp: any) => { return this.crearArregloParametro(resp);
    } ));

}

crearArregloParametro( rolObj: any) {

  const rol: any[] = [];
  const resul: any[] = [];
 // console.log(usuariosObj);
  if ( rolObj === null ) { return []; }
  Object.keys ( rolObj ).forEach( key => {
    const r: any = rolObj[key];
    rol.push( r );
  });
  // tslint:disable-next-line: forin
//  console.log( usuarios[0][prop].attributes );
  resul.push( rolObj.data.attributes );

 // console.log(resul);

  return resul;

}

actualizaParametro( idp: string, Descripcion: string, Key: string, Valor: string, Tabla: string, IdTabla: string, UsedValues: string, Documentacion: string) {

const url = `${environment.URL_SERVICIOS}/general_parameters/${idp}?token=${this.token}&secret_key=${environment.SECRET_KEY}&general_parameter[description]=${Descripcion}&general_parameter[key]=${Key}&general_parameter[value]=${Valor}&general_parameter[table]=${Tabla}&general_parameter[id_table]=${IdTabla}&general_parameter[used_values]=${UsedValues}&general_parameter[documentation]=${Documentacion}`;

return this.http.patch( url, null ).pipe(
  map( (resp: any) => { return resp;
  } ));
}

borrarParametro(id: string) {

  const url = `${environment.URL_SERVICIOS}/general_parameters/${id}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.delete( url ).pipe(
    map( (resp: any) => { return resp;
     } ));

}

}
