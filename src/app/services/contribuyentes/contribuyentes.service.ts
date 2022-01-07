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
export class ContribuyentesService {

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


  crearPersonaFisica( params ) {

    params.token = this.token;
    params.secret_key = environment.SECRET_KEY;

    const url = `${environment.URL_SERVICIOS}/people/`;


    return this.http.post( url, params ).pipe(
              map( (resp: any) => {
                return this.crearArregloPersonaFisica(resp);
              }));
  }

  crearArregloPersonaFisica( usuariosObj: any) {

    const usuarios: any[] = [];
    const resul: any[] = [];

    if ( usuariosObj === null ) { return []; }
    Object.keys ( usuariosObj ).forEach( key => {
      const usuario: any = usuariosObj[key];
      usuarios.push( usuario );
    });
    // tslint:disable-next-line: forin
    resul.push( usuarios[0].attributes );

    return resul;

}

  crearContribuyenteFisica( contribuyentefisica: ContribuyenteFisica, idf: any ) {

    const url = `${environment.URL_SERVICIOS}/contributors?contributor[contributor_type]=${contribuyentefisica.tipo}&contributor[bank]=${contribuyentefisica.banco}
                &contributor[account_number]=${contribuyentefisica.ncuentafisica}&contributor[clabe]=${contribuyentefisica.clabefisica}
                &contributor[extra1]=${contribuyentefisica.cbfisica}&contributor[person_id]=${idf}&token=${this.token}&secret_key=${environment.SECRET_KEY}`;


    return this.http.post( url, null ).pipe(
              map( (resp: any) => {
                return resp.data.attributes.id;
              }));
  }

  crearPersonaMoral( params ) {

    params.token = this.token;
    params.secret_key = environment.SECRET_KEY;

    const url = `${environment.URL_SERVICIOS}/legal_entities/`;


    return this.http.post( url, params ).pipe(
              map( (resp: any) => {
                return this.crearArregloPersonaMoral(resp);
              }));
  }

  crearArregloPersonaMoral( usuariosObj: any) {

    const usuarios: any[] = [];
    const resul: any[] = [];

    if ( usuariosObj === null ) { return []; }
    Object.keys ( usuariosObj ).forEach( key => {
      const usuario: any = usuariosObj[key];
      usuarios.push( usuario );
    });
    // tslint:disable-next-line: forin
  //  console.log( usuarios[0][prop].attributes );
    resul.push( usuarios[0].attributes );

    return resul;

}

crearContribuyenteMoral( contribuyentemoral: ContribuyenteMoral, idm: any ) { 

  const url = `${environment.URL_SERVICIOS}/contributors?contributor[contributor_type]=${contribuyentemoral.tipo}&contributor[bank]=${contribuyentemoral.banco}
              &contributor[account_number]=${contribuyentemoral.ncuentamoral}&contributor[clabe]=${contribuyentemoral.clabemoral}
              &contributor[extra1]=${contribuyentemoral.cbmoral}&contributor[legal_entity_id]=${idm}&token=${this.token}&secret_key=${environment.SECRET_KEY}`;


  return this.http.post( url, null ).pipe(
            map( (resp: any) => {
              return resp.data.attributes.id;
            }));
}

getContribuyentes() {

  const url = `${environment.URL_SERVICIOS}/contributors?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloContribuyente(resp);
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

getPersonaFisica( idf: string ) {

  const url = `${environment.URL_SERVICIOS}/people/${idf}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

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

crearDP( id, params ) {

params.token = this.token;
params.secret_key = environment.SECRET_KEY;

const url = `${environment.URL_SERVICIOS}/contributors/${id}/property_documents`;

return this.http.post( url, params ).pipe(
              map( (resp: any) => {
                return resp.data.attributes.id;
              }));
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

getCompanySegmentsCurrency() {

  const url = `${environment.URL_SERVICIOS}/lists/domain/COMPANY_SEGMENTS_CURRENCY?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

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

getPersonFiscalRegime() {

  const url = `${environment.URL_SERVICIOS}/lists/domain/PEOPLE_FISCAL_REGIME?token=${this.token}&secret_key=${environment.SECRET_KEY};`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloList(resp);
    } )
  );

}

getLegalEntityFiscalRegime() {

  const url = `${environment.URL_SERVICIOS}/lists/domain/LEGAL_ENTITIES_FISCAL_REGIME?token=${this.token}&secret_key=${environment.SECRET_KEY};`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloList(resp);
    } )
  );

}

getCompanySector() {

  const url = `${environment.URL_SERVICIOS}/lists/domain/COMPANY_SECTOR?token=${this.token}&secret_key=${environment.SECRET_KEY};`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloList(resp);
    } )
  );

}

getCompanyDigitalSign() {

  const url = `${environment.URL_SERVICIOS}/lists/domain/COMPANY_DIGITAL_SIGN?token=${this.token}&secret_key=${environment.SECRET_KEY};`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloList(resp);
    } )
  );

}

getCompanySubSector() {

  const url = `${environment.URL_SERVICIOS}/lists/domain/COMPANY_SUBSECTOR?token=${this.token}&secret_key=${environment.SECRET_KEY};`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloList(resp);
    } )
  );

}

getSupplierSector() {

  const url = `${environment.URL_SERVICIOS}/lists/domain/SUPPLIER_SECTOR?token=${this.token}&secret_key=${environment.SECRET_KEY};`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloList(resp);
    } )
  );

}

getSupplierSubSector() {

  const url = `${environment.URL_SERVICIOS}/lists/domain/SUPPLIER_SUBSECTOR?token=${this.token}&secret_key=${environment.SECRET_KEY};`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloList(resp);
    } )
  );

}

getSupplierDigitalSign() {

  const url = `${environment.URL_SERVICIOS}/lists/domain/SUPPLIER_DIGITAL_SIGN?token=${this.token}&secret_key=${environment.SECRET_KEY};`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloList(resp);
    } )
  );

}

getSupplierdebt_type() {

  const url = `${environment.URL_SERVICIOS}/lists/domain/SUPPLIER_SEGMENT_DEBT_TYPE?token=${this.token}&secret_key=${environment.SECRET_KEY};`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloList(resp);
    } )
  );

}

getMaritalStatusFisica() {

  const url = `${environment.URL_SERVICIOS}/lists/domain/PEOPLE_MARTIAL_STATUS?token=${this.token}&secret_key=${environment.SECRET_KEY};`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloList(resp);
    } )
  );

}

getTipoIdentificacionFisica() {

  const url = `${environment.URL_SERVICIOS}/lists/domain/PEOPLE_ID_TYPE?token=${this.token}&secret_key=${environment.SECRET_KEY};`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloList(resp);
    } )
  );

}

getParentezco() {

  const url = `${environment.URL_SERVICIOS}/lists/domain/SIGNATORIES_PARTNERSHIP?token=${this.token}&secret_key=${environment.SECRET_KEY};`;

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

getFirmantes() {

  const url = `${environment.URL_SERVICIOS}/reports/signatories?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return resp;
    } )
  );

}

getContribuyentesMain() {

  const url = `${environment.URL_SERVICIOS}/reports/contributors_main?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return resp;
    } )
  );

}

// CYP

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
  if ( contribuObj === null ) { return []; }
  Object.keys ( contribuObj ).forEach( key => {
    const rol: any = contribuObj[key];
    rr.push( rol );
  });
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
  if ( contribuObj === null ) { return []; }
  Object.keys ( contribuObj ).forEach( key => {
    const rol: any = contribuObj[key];
    rr.push( rol );
  });
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

getCompanySegments( idc ) {

  const url = `${environment.URL_SERVICIOS}/companies/${idc}/company_segments?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloContribuyente(resp);
    } )
  );

}

getCompanySegment( idc, ids ) {

  const url = `${environment.URL_SERVICIOS}/companies/${idc}/company_segments/${ids}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloSegment(resp);
    } )
  );

}

crearArregloSegment( contribuObj: any) {
  const contribuyentes: any[] = [];
  const resul: any[] = [];
  if ( contribuObj === null ) { return []; }
  resul.push( contribuObj.data.attributes );
  return resul;

}

guardaSegmento( idc, params ) {
  params.token = this.token;
  params.secret_key = environment.SECRET_KEY;
  const url = `${environment.URL_SERVICIOS}/companies/${idc}/company_segments`;
  return this.http.post( url, params ).pipe(
    map( (resp: any) => {
      return resp;
    }));
}

borraSegmento( idc, ids ) {
  const url = `${environment.URL_SERVICIOS}/companies/${idc}/company_segments/${ids}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  return this.http.delete( url ).pipe(
    map( (resp: any) => {
      return resp;
    }));
}

actualizaSegmento( idc, ids, params ) {
  params.token = this.token;
  params.secret_key = environment.SECRET_KEY;
  const url = `${environment.URL_SERVICIOS}/companies/${idc}/company_segments/${ids}`;
  return this.http.patch( url, params ).pipe(
    map( (resp: any) => {
      return resp;
    }));
}

creaUsdSegment( id, params ) {

  params.token = this.token;
  params.secret_key = environment.SECRET_KEY;

  const url = `${environment.URL_SERVICIOS}/suppliers/${id}/usd_supplier_segments`;

  return this.http.post( url, params ).pipe(
    map( (resp: any) => {
      return resp;
    }));

}

creaSegment( id, params ) {

  params.token = this.token;
  params.secret_key = environment.SECRET_KEY;

  const url = `${environment.URL_SERVICIOS}/suppliers/${id}/supplier_segments`;

  return this.http.post( url, params ).pipe(
    map( (resp: any) => {
      return resp;
    }));

}

getUsdSegment( ids ) {
  const url = `${environment.URL_SERVICIOS}/suppliers/${ids}/usd_supplier_segments?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloContribuyente(resp);
    } )
  );
}

getSegment( ids ) {
  const url = `${environment.URL_SERVICIOS}/suppliers/${ids}/supplier_segments?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloContribuyente(resp);
    } )
  );
}

patchUsdSegment( ids, idsegment, params ) {
  params.token = this.token;
  params.secret_key = environment.SECRET_KEY;
  const url = `${environment.URL_SERVICIOS}/suppliers/${ids}/usd_supplier_segments/${idsegment}/`;
  return this.http.patch( url, params ).pipe(
    map( (resp: any) => {
      return resp;
    }));
}

patchSegment( ids, idsegment, params ) {
  params.token = this.token;
  params.secret_key = environment.SECRET_KEY;
  const url = `${environment.URL_SERVICIOS}/suppliers/${ids}/supplier_segments/${idsegment}/`;
  return this.http.patch( url, params ).pipe(
    map( (resp: any) => {
      return resp;
    }));
}

borraSegmentoSeg( idc, ids ) {
  const url = `${environment.URL_SERVICIOS}/suppliers/${idc}/supplier_segments/${ids}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  return this.http.delete( url ).pipe(
    map( (resp: any) => {
      return resp;
    }));
}

borraSegmentoUsd( idc, ids ) {
  const url = `${environment.URL_SERVICIOS}/suppliers/${idc}/usd_supplier_segments/${ids}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  return this.http.delete( url ).pipe(
    map( (resp: any) => {
      return resp;
    }));
}

// DIRECCIONES

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
  if ( contribuObj === null ) { return []; }
  Object.keys ( contribuObj ).forEach( key => {
    const rol: any = contribuObj[key];
    rr.push( rol );
  });
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

getCompanySuplierProjects( ids ) {

  const url = `${environment.URL_SERVICIOS}/suppliers/${ids}/supplier_projects?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloContribuyente(resp);
    } )
  );

}

// SUPLIER PROYECTOS //////////////////////////////////////////////////////////
getCompanyProject(idcompany, idcompanyproject) {
  const url = `${environment.URL_SERVICIOS}/companies/${idcompany}/company_projects/${idcompanyproject}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  return this.http.get(url).pipe(
    map( (resp: any) => {
      return (resp);
    } )
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

getCompanyProjects(idcompany) {
  const url = `${environment.URL_SERVICIOS}/companies/${idcompany}/company_projects?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloContribuyente(resp);
    } )
  );
}

guardaProyecto(params) {
  params.token = this.token;
  params.secret_key = environment.SECRET_KEY;
  const url = `${environment.URL_SERVICIOS}/suppliers/${params.suplier_id}/supplier_projects`;
  return this.http.post( url, params ).pipe(
    map( (resp: any) => {
      return resp;
    }));
}

actualizaProyecto(params) {
  params.token = this.token;
  params.secret_key = environment.SECRET_KEY;

  const url = `${environment.URL_SERVICIOS}/suppliers/${params.suplier_id}/supplier_projects/${params.id}`;

  return this.http.patch( url, params ).pipe(
    map( (resp: any) => { return resp;
    } ));
}

borraProyecto( idc, ids ) {
  const url = `${environment.URL_SERVICIOS}/suppliers/${idc}/supplier_projects/${ids}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  return this.http.delete( url ).pipe(
    map( (resp: any) => {
      return resp;
    }));
}

getProjectName( idp ) {
  const url = `${environment.URL_SERVICIOS}/company_projects/${idp}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  return this.http.get(url).pipe(
    map( (resp: any) => {
      return (resp);
    } )
  );
}

getcompany(idc) {
const url = `${environment.URL_SERVICIOS}/companies/${idc}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
return this.http.get(url).pipe(
  map( (resp: any) => {
    return (resp);
  } )
);
}
///////////////////////////////////////////////////////////////////////////////


// CLIENTES //////////

creaClienteCadena( id, params ) {

  params.token = this.token;
  params.secret_key = environment.SECRET_KEY;

  const url = `${environment.URL_SERVICIOS}/companies/${id}/company_customers`;

  return this.http.post( url, params ).pipe(
    map( (resp: any) => {
      return resp;
    }));

}

getclientescadena(idc) {
  const url = `${environment.URL_SERVICIOS}/companies/${idc}/company_customers?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloContribuyente(resp);
    } )
  );
  }

  borraCliente( idc, idcliente ) {
    const url = `${environment.URL_SERVICIOS}/companies/${idc}/company_customers/${idcliente}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
    return this.http.delete( url ).pipe(
      map( (resp: any) => {
        return resp;
      }));
  }

  getCompanyCliente( idc, idcliente ) {

    const url = `${environment.URL_SERVICIOS}/companies/${idc}/company_customers/${idcliente}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  
    return this.http.get(url).pipe(
      map( (resp: any) => {
        return this.crearArregloSegment(resp);
      } )
    );
  
  }

  actualizaCliente( idc, ids, params ) {
    params.token = this.token;
    params.secret_key = environment.SECRET_KEY;
    const url = `${environment.URL_SERVICIOS}/companies/${idc}/company_customers/${ids}`;
    return this.http.patch( url, params ).pipe(
      map( (resp: any) => {
        return resp;
      }));
  }

}
