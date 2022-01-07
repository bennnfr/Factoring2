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
export class MantenimientoContribuyentesService {

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


getContribuyentes() {

  const url = `${environment.URL_SERVICIOS}/contributors?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloContribuyente(resp);
    } )
  );

}

getContribuyente( id ) {

  const url = `${environment.URL_SERVICIOS}/contributors/${id}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloContribuyentemant(resp);
    } )
  );

}

crearArregloContribuyente( contribuObj: any) {

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

 

  return resul;

}

crearArregloContribuyentemant( contribuObj: any) {

  const contribuyentes: any[] = [];
  const resul: any[] = [];
 // console.log(contribuObj.data);
  if ( contribuObj === null ) { return []; }

  
  resul.push( contribuObj.data.attributes );


 

  return resul;

}

getPersonaFisica( idf: string ) {

  const url = `${environment.URL_SERVICIOS}/people/${idf}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArreglopf(resp);
    } )
  );

}

getPersonaMoral( idf: string ) {

  const url = `${environment.URL_SERVICIOS}/legal_entities/${idf}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArreglopf(resp);
    } )
  );

}

crearArreglopf( contribuObj: any) {

  const contribuyentes: any[] = [];
  const resul: any[] = [];

  if ( contribuObj === null ) { return []; }
  Object.keys ( contribuObj ).forEach( key => {
    const rol: any = contribuObj[key];
    contribuyentes.push( rol );
  });
  // tslint:disable-next-line: forin

//  console.log( usuarios[0][prop].attributes );
  resul.push( contribuyentes[0].attributes );


 // console.log(resul);

  return resul;

}

actualizaLegalEntity(idm, params) {
  params.token = this.token;
  params.secret_key = environment.SECRET_KEY;
  const url = `${environment.URL_SERVICIOS}/legal_entities/${idm}`;
  return this.http.patch(url, params).pipe(
    map( (resp: any) => {
      return (resp);
    } ));
}

actualizaPerson(idf, params) {
  params.token = this.token;
  params.secret_key = environment.SECRET_KEY;
  const url = `${environment.URL_SERVICIOS}/people/${idf}`;
  return this.http.patch(url, params).pipe(
    map( (resp: any) => {
      return (resp);
    } ));
}

actualizaContribuyente(idc, params) {
  params.token = this.token;
  params.secret_key = environment.SECRET_KEY;
  const url = `${environment.URL_SERVICIOS}/contributors/${idc}`;
  return this.http.patch(url, params).pipe(
    map( (resp: any) => {
      return (resp);
    } ));
}

// LISTAS

getFiscalRegime() {

  const url = `${environment.URL_SERVICIOS}/lists/domain/PERSON_FISCAL_REGIME?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloList(resp);
    } )
  );

}

getAdresstype() {

  const url = `${environment.URL_SERVICIOS}/lists/domain/CONTRIBUTOR_ADDRESS_ADDRESS_TYPE?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloList(resp);
    } )
  );

}

getAsentamientotype() {

  const url = `${environment.URL_SERVICIOS}/lists/domain/CONTRIBUTOR_ADDRESS_SUBURB_TYPE?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloList(resp);
    } )
  );

}

getPersonGender() {

  const url = `${environment.URL_SERVICIOS}/lists/domain/PERSON_GENDER?token=${this.token}&secret_key=${environment.SECRET_KEY};`;

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

getContribuyentesMain() {

  const url = `${environment.URL_SERVICIOS}/reports/contributors_main?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return resp;
    } )
  );

}

// CYP /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

getCadenaxcontribuyente(id) {

  const url = `${environment.URL_SERVICIOS}/contributors/${id}/companies?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloCadena(resp);
    } )
  );

}

crearArregloCadena( contribuObj: any) {

  const rr: any[] = [];
  const resul: any[] = [];
 // console.log(contribuObj);
  if ( contribuObj === null ) { return []; }
  Object.keys ( contribuObj ).forEach( key => {
    const rol: any = contribuObj[key];
    rr.push( rol );
  });
 // console.log(rr);
  // tslint:disable-next-line: forin
  for ( const prop in rr[0] ) {

    resul.push( rr[0][prop].attributes );

  }

  return resul;

}

actualizaCadenaxContributente( idcont, idcompany, params ) {

  params.token = this.token;
  params.secret_key = environment.SECRET_KEY;

  const url = `${environment.URL_SERVICIOS}/contributors/${idcont}/companies/${idcompany}`;

  return this.http.patch( url, params ).pipe(
    map( (resp: any) => { return resp;
    } ));

}


creaCadenaxContribuyente( id, params ) {

  params.token = this.token;
  params.secret_key = environment.SECRET_KEY;

  const url = `${environment.URL_SERVICIOS}/contributors/${id}/companies`;

  return this.http.post( url, params ).pipe(
    map( (resp: any) => {
      return resp;
    }));

}

creaProveedorxContribuyente( id, params ) {

  params.token = this.token;
  params.secret_key = environment.SECRET_KEY;

  const url = `${environment.URL_SERVICIOS}/contributors/${id}/suppliers`;

  return this.http.post( url, params ).pipe(
    map( (resp: any) => {
      return resp;
    }));

}

getProveedorxContribuyente(id) {

  const url = `${environment.URL_SERVICIOS}/contributors/${id}/suppliers?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloProveedor(resp);
    } )
  );

}

crearArregloProveedor( contribuObj: any) {

  const rr: any[] = [];
  const resul: any[] = [];
//  console.log(contribuObj);
  if ( contribuObj === null ) { return []; }
  Object.keys ( contribuObj ).forEach( key => {
    const rol: any = contribuObj[key];
    rr.push( rol );
  });
 // console.log(rr);
  // tslint:disable-next-line: forin
  for ( const prop in rr[0] ) {

    resul.push( rr[0][prop].attributes );

  }

  return resul;

}

actualizaProveedorxContributente( idcont, idcompany, params ) {

  params.token = this.token;
  params.secret_key = environment.SECRET_KEY;

  const url = `${environment.URL_SERVICIOS}/contributors/${idcont}/suppliers/${idcompany}`;

  return this.http.patch( url, params ).pipe(
    map( (resp: any) => { return resp;
    } ));

}

// DIRECCIONES ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

getStates() {

  const url = `${environment.URL_SERVICIOS}/countries/1/states?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloStates(resp);
    } )
  );

}

getMunicipios( idm ) {

  const url = `${environment.URL_SERVICIOS}/states/${idm}/municipalities?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloStates(resp);
    } )
  );

}

getColoniasxcp( cp ) {

  const url = `${environment.URL_SERVICIOS}/postal_codes/pc/${cp}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloStates(resp);
    } )
  );

}

crearArregloStates( contribuObj: any) {

  const rr: any[] = [];
  const resul: any[] = [];
//  console.log(contribuObj);
  if ( contribuObj === null ) { return []; }
  Object.keys ( contribuObj ).forEach( key => {
    const rol: any = contribuObj[key];
    rr.push( rol );
  });
 // console.log(rr);
  // tslint:disable-next-line: forin
  for ( const prop in rr[0] ) {

    resul.push( rr[0][prop].attributes );

  }

  return resul;

}

creaFirmantexContribuyente( idc , params ) {

  params.token = this.token;
  params.secret_key = environment.SECRET_KEY;

  const url = `${environment.URL_SERVICIOS}/contributors/${idc}/signatories`;

  return this.http.post( url, params ).pipe(
    map( (resp: any) => {
      return resp;
    }));

}

creaDireccionxContribuyente( idc , params ) {

  params.token = this.token;
  params.secret_key = environment.SECRET_KEY;

  const url = `${environment.URL_SERVICIOS}/contributors/${idc}/contributor_addresses`;

  return this.http.post( url, params ).pipe(
    map( (resp: any) => {
      return resp;
    }));

}

getDireccion(){

  const url = `${environment.URL_SERVICIOS}/contributors/76/contributor_addresses/3?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloEscritura(resp);
    } )
  );

}

getDirecciones( idc ) {
  const url = `${environment.URL_SERVICIOS}/contributors/${idc}/contributor_addresses?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloEscrituras(resp);
    } )
  );
}

getDireccionesTipoFiscal( idc ) {
  const url = `${environment.URL_SERVICIOS}/contributors/${idc}/contributor_addresses?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloDireccionesTipoFiscal(resp);
    } )
  );
}

crearArregloDireccionesTipoFiscal( contribuObj: any) {

  const contribuyentes: any[] = [];
  const resul: any[] = [];
  if ( contribuObj === null ) { return []; }
  // tslint:disable-next-line: forin
  for (const prop in contribuObj.data) {
    if ( contribuObj.data[prop].attributes.address_type == 'FISCAL' ) {
      resul.push( contribuObj.data[prop].attributes );
      break;
    }
  }
  return resul;
}

getNombreState ( ids ) {
  const url = `${environment.URL_SERVICIOS}/countries/1/states/${ids}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloNombre(resp);
    } )
  );
}

getNombreMunicipality( idm ) {
  const url = `${environment.URL_SERVICIOS}/states/1/municipalities/${idm}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloNombre(resp);
    } )
  );
}

crearArregloNombre( contribuObj: any) {
  const resul: any[] = [];
  if ( contribuObj === null ) { return []; }
  resul.push( contribuObj.data.attributes );
  return resul;
}

borraDireccion( idc, idd ) {
  const url = `${environment.URL_SERVICIOS}/contributors/${idc}/contributor_addresses/${idd}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  return this.http.delete(url).pipe(
    map( (resp: any) => {
      return (resp);
    } ));
}

modificaDireccion( idc, idd, params ) {

  params.token = this.token;
  params.secret_key = environment.SECRET_KEY;

  const url = `${environment.URL_SERVICIOS}/contributors/${idc}/contributor_addresses/${idd}`;

  return this.http.patch(url, params).pipe(
    map( (resp: any) => {
      return resp;
    } )
  );

}
// DIRECCIONES ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ESCRITURAS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

getEscrituras( idc ) {

  const url = `${environment.URL_SERVICIOS}/contributors/${idc}/property_documents?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloEscrituras(resp);
    } )
  );

}

crearArregloEscrituras( contribuObj: any) {

  const contribuyentes: any[] = [];
  const resul: any[] = [];
  if ( contribuObj === null ) { return []; }
  // tslint:disable-next-line: forin
  for (const prop in contribuObj.data) {
  resul.push( contribuObj.data[prop].attributes );
  }
  return resul;
}

getEscritura( idc, ide ) {

  const url = `${environment.URL_SERVICIOS}/contributors/${idc}/property_documents/${ide}?secret_key=${environment.SECRET_KEY}&token=${this.token}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloEscritura(resp);
    } )
  );

}

crearArregloEscritura( contribuObj: any) {
  const resul: any[] = [];
  if ( contribuObj === null ) { return []; }
  resul.push( contribuObj.data.attributes );
  return resul;
}

borraEscritura( idc, ide ) {

  const url = `${environment.URL_SERVICIOS}/contributors/${idc}/property_documents/${ide}?secret_key=${environment.SECRET_KEY}&token=${this.token}`;

  return this.http.delete(url).pipe(
    map( (resp: any) => {
      return resp;
    } )
  );

}

modificaEscritura( idc, ide, params ) {

  params.token = this.token;
  params.secret_key = environment.SECRET_KEY;

  const url = `${environment.URL_SERVICIOS}/contributors/${idc}/property_documents/${ide}`;

  return this.http.patch(url, params).pipe(
    map( (resp: any) => {
      return resp;
    } )
  );

}

// ESCRITURAS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// FIRMANTES ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

getFirmantes( idc ) {
  const url = `${environment.URL_SERVICIOS}/contributors/${idc}/signatories?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloEscrituras(resp);
    } )
  );
}

actualizaFirmante( idc, idf, params ) {
  params.token = this.token;
  params.secret_key = environment.SECRET_KEY;
  const url = `${environment.URL_SERVICIOS}/contributors/${idc}/signatories/${idf}`;
  return this.http.patch(url, params).pipe(
    map( (resp: any) => {
      return resp;
    } )
  );
}

borraFirmante( idc, idf ) {
  const url = `${environment.URL_SERVICIOS}/contributors/${idc}/signatories/${idf}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  return this.http.delete(url).pipe(
    map( (resp: any) => {
      return resp;
    } )
  );
}

// FIRMANTES ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


}
