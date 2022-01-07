import { Injectable } from '@angular/core';
import { Usuario, Usuario2, Usuario3, UserOptions } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';


@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;
  usuario2: Usuario2;
  idUsuario: string;
  options: any[] = [];
  constructor(
    public http: HttpClient,
    public router: Router
  ) {
    this.cargarStorage();
  }

  estaLogueado() {
   // return ( this.token.length > 5 ) ? true : false;
   if ( this.token.length > 5 ) {
   let stringExpiraToken = localStorage.getItem('expiratoken');
   stringExpiraToken = stringExpiraToken.substring(0, 10);


   const fechaExpiraToken = Date.parse(stringExpiraToken);
   const fechaHoy = new Date();
   const fechaHoyA = fechaHoy.getFullYear().toString();
   let fechaHoyM = (fechaHoy.getMonth() + 1).toString();
   let fechaHoyD = fechaHoy.getDate().toString();

   if ( fechaHoyM.length === 1 ) {
    fechaHoyM = ( '0' + fechaHoyM );
   }

   if ( fechaHoyD.length === 1 ) {
    fechaHoyD = ( '0' + fechaHoyD );
   }

   const fechaHoyC = Date.parse(fechaHoyA + '-' + fechaHoyM + '-' + fechaHoyD);

   

    if ( fechaExpiraToken > fechaHoyC ) {
      return true;
    } else {
      this.logoutsinboton();
      return false;
    }
  } else {
      this.logoutsinboton();
      return false;
  }
}

estaLogueador() {
  // return ( this.token.length > 5 ) ? true : false;
  if ( this.token.length > 5 ) {
  let stringExpiraToken = localStorage.getItem('expiratoken');
  stringExpiraToken = stringExpiraToken.substring(0, 10);


  const fechaExpiraToken = Date.parse(stringExpiraToken);
  const fechaHoy = new Date();
  const fechaHoyA = fechaHoy.getFullYear().toString();
  let fechaHoyM = (fechaHoy.getMonth() + 1).toString();
  let fechaHoyD = fechaHoy.getDate().toString();

  if ( fechaHoyM.length === 1 ) {
   fechaHoyM = ( '0' + fechaHoyM );
  }

  if ( fechaHoyD.length === 1 ) {
   fechaHoyD = ( '0' + fechaHoyD );
  }

  const fechaHoyC = Date.parse(fechaHoyA + '-' + fechaHoyM + '-' + fechaHoyD);

  

   if ( fechaExpiraToken > fechaHoyC ) {
     return true;
   } else {
     this.logoutsinboton();
     return false;
   }
 } else {
     this.logoutsinboton();
     return false;
 }
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

  guardarStoragelogin( id: string, token: string, usuario: Usuario, email: string, expiratoken: string, relations: any ) {

    localStorage.setItem('id', id );
    localStorage.setItem('token', token );
    localStorage.setItem('usuario', JSON.stringify(usuario) );
    localStorage.setItem('emailuser', email );
    localStorage.setItem('expiratoken', expiratoken);
    localStorage.setItem('user_options', JSON.stringify(relations));

    this.usuario = usuario;
    this.token = token;
  }

  logout() {

    Swal.fire({
      title: 'Cerrar Sesion?',
      text: `Se cerrara la sesion actual`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
    }). then ( resp => {
      if ( resp.value) {

        this.usuario = null;
        this.token = '';
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('id');
        localStorage.removeItem('emailuser');
        localStorage.removeItem('expiratoken');
        localStorage.removeItem('usuarioPrivilegio');
        localStorage.removeItem('user_options');
        localStorage.removeItem('dataacc');
        this.router.navigate(['/login']);
        Swal.fire(
    'Terminó la sesion',
    'Correctamente',
    'info'
  );
      }
    });


  }

  logoutsinboton() {
    this.usuario = null;
        this.token = '';
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('id');
        localStorage.removeItem('emailuser');
        localStorage.removeItem('expiratoken');
        localStorage.removeItem('usuarioPrivilegio');
        localStorage.removeItem('user_options');
        localStorage.removeItem('dataacc');
        this.router.navigate(['/login']);
  }

  login( usuario: any, recordar: boolean = false ) {

    if ( recordar ) {
      localStorage.setItem('email', usuario.email );
    } else {
      localStorage.removeItem('email');
    }

    const url = `${environment.URL_SERVICIOS}/authenticate?auth[email]=${usuario.email}&auth[password]=${usuario.password}&secret_key=${environment.SECRET_KEY}`;


    return this.http.get( url )
                .map( (resp: any) => {
                 // console.log(resp);
                  this.guardarStoragelogin( resp.data.attributes.id,
                                            resp.data.token,
                                            resp.data.attributes.name,
                                            resp.data.attributes.email,
                                            resp.data.expires_at,
                                            resp.data.relations.user_options );
                                            this.getOptionsxUsuario(resp.data.attributes.id).subscribe(resp2 => {
                                              // tslint:disable-next-line: forin
                                              for (const j in resp2 ) {
                                                  this.options.push(btoa(resp2[j].url));
                                                }
                                                localStorage.setItem('dataacc', JSON.stringify(this.options));  
                                            });
                  return true;
                });


  }


  crearUsuario( usuario: Usuario2 ) {

    const url = `${environment.URL_SERVICIOS}/users?auth[email]=${usuario.email}&auth[password]=${usuario.password}&auth[name]=${usuario.nombre}&auth[job]=${usuario.puesto}&auth[gender]=${usuario.genero}&auth[status]=${usuario.estatus}&token=${this.token}&secret_key=${environment.SECRET_KEY}`;


    return this.http.post( url, null ).pipe(
              map( (resp: any) => {
                return resp;
              }));
  }

  getUsuarios() {

    const url = `${environment.URL_SERVICIOS}/users?secret_key=${environment.SECRET_KEY}&token=${this.token}`;

    return this.http.get( url ).pipe(
    map( (resp: any) => {return this.crearArregloUsuarios(resp);
    }));

    }

    getUsuariosRc( totoken ) {

      const url = `${environment.URL_SERVICIOS}/users?secret_key=${environment.SECRET_KEY}&token=${totoken}`;

      return this.http.get( url ).pipe(
      map( (resp: any) => {return this.crearArregloUsuarios(resp);
      }));

      }
  crearArregloUsuarios( usuariosObj: any) {

    const usuarios: any[] = [];
    const resul: any[] = [];

    if ( usuariosObj === null ) { return []; }
    Object.keys ( usuariosObj ).forEach( key => {
      const usuario: any = usuariosObj[key];
      usuarios.push( usuario );
    });
    // tslint:disable-next-line: forin
    for (const prop in usuarios[0]) {
  //  console.log( usuarios[0][prop].attributes );
    resul.push( usuarios[0][prop].attributes );
    }

  //  console.log(resul);

    return resul;

}

getUsuario( id: string ) {

  const url = `${environment.URL_SERVICIOS}/users/${id}?secret_key=${environment.SECRET_KEY}&token=${this.token}`;

  return this.http.get( url ).pipe(
    map ( (resp: any) => { return this.crearArregloUsuario(resp);
    } ));

}

crearArregloUsuario( usuariosObj: any) {

  const usuarios: any[] = [];
  const resul: any[] = [];
 // console.log(usuariosObj);
  if ( usuariosObj === null ) { return []; }
  Object.keys ( usuariosObj ).forEach( key => {
    const usuario: any = usuariosObj[key];
    usuarios.push( usuario );
  });
  // tslint:disable-next-line: forin
//  console.log( usuarios[0][prop].attributes );
  resul.push( usuariosObj.data.attributes );

 // console.log(resul);

  return resul;

}

getUsuarioOptions( id: string ) {

  const url = `${environment.URL_SERVICIOS}/users/${id}?secret_key=${environment.SECRET_KEY}&token=${this.token}`;

  return this.http.get( url ).pipe(
    map ( (resp: any) => { return this.crearArregloUsuarioOptions(resp);
    } ));

}

crearArregloUsuarioOptions( usuariosObj: any) {

  const usuarios: any[] = [];
  const resul1: any[] = [];
  const resul2: any[] = [];
  if ( usuariosObj === null ) { return []; }

  // tslint:disable-next-line: forin
  for (const prop in usuariosObj.data.relations.options) {
  //    por el ID de la opcion
    //  resul.push( usuariosObj.data.relations.options[prop].attributes );
    resul1.push (usuariosObj.data.relations.options[prop].attributes);
    resul2.push (usuariosObj.data.relations.user_options[prop].attributes);

      }
 // console.log(resul2);
 // console.log(resul1);
  // tslint:disable-next-line: forin
  for (const prop in resul2) {

    const iduo = resul2[prop].option_id;

      // tslint:disable-next-line: forin
    for (const prap in resul1) {

      const ido = resul1[prap].id;

      if ( iduo === ido ) {

        resul2[prop].name = resul1[prap].name;

      }


      }

  }
 // console.log(resul2);
  return resul2;

}

actualizaUsuario(usuario: Usuario3) {

const url = `${environment.URL_SERVICIOS}/users/${usuario.id}?token=${this.token}&secret_key=${environment.SECRET_KEY}&auth[job]=${usuario.puesto}&auth[status]=${usuario.estatus}&auth[gender]=${usuario.genero}&auth[email]=${usuario.email}&auth[name]=${usuario.nombre}`;

return this.http.patch( url, null ).pipe(
  map( (resp: any) => { return resp;
  } ));
}

actualizaUsuarioRc(idu, params) {

  params.secret_key = environment.SECRET_KEY;

  const url = `${environment.URL_SERVICIOS}/users/${idu}?token=${params.token}&secret_key=${environment.SECRET_KEY}&auth[password]=${params.password}`;

  return this.http.patch( url, null ).pipe(
    map( (resp: any) => { return resp;
    } ));
  }

  actualizaUsuarioRcPc(idu, params) {
    params.token = this.token;
    params.secret_key = environment.SECRET_KEY;

    const url = `${environment.URL_SERVICIOS}/users/${idu}?token=${params.token}&secret_key=${environment.SECRET_KEY}&auth[password]=${params.password}`;

    return this.http.patch( url, null ).pipe(
      map( (resp: any) => { return resp;
      } ));
    }

borrarUsuario(usuario: any) {

  const url = `${environment.URL_SERVICIOS}/users/${usuario.id}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.delete( url ).pipe(
    map( (resp: any) => { return resp;
     } ));

}

getResetPaswword(email) {
  const url = `${environment.URL_SERVICIOS}/reset_password?email=${email}&secret_key=${environment.SECRET_KEY}`;
  return this.http.get( url ).pipe(
    map ( (resp: any) => { return (resp);
    } ));
}

getResetPasswordToken(rtoken) {
  const url = `${environment.URL_SERVICIOS}/get_reset_token?reset_password_token=${rtoken}&secret_key=${environment.SECRET_KEY}`;
  return this.http.get( url ).pipe(
    map ( (resp: any) => { return this.crearArregloUsuario(resp);
    } ));
}

// LISTAS

getUserGender() {

  const url = `${environment.URL_SERVICIOS}/lists/domain/USER_GENDER?token=${this.token}&secret_key=${environment.SECRET_KEY}`;



  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloList(resp);
    } )
  );

}

getUserStatus() {

  const url = `${environment.URL_SERVICIOS}/lists/domain/USER_STATUS?token=${this.token}&secret_key=${environment.SECRET_KEY}`;



  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloList(resp);
    } )
  );

}

crearArregloList( contribuObj: any) {

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
