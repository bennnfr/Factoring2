import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ContribuyentesService, MantenimientoContribuyentesService } from '../../services/service.index';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Perfisica, PerMoral, ContribuyenteFisica, ContribuyenteMoral, DocumentoPropiedad } from '../../models/personas.model';
import swal2 from 'sweetalert2';
declare var $;

@Component({
  selector: 'app-contribuyentemant',
  templateUrl: './contribuyentemant.component.html',
  styles: []
})
export class ContribuyenteMantComponent implements OnInit {

  // POPUP ///////////
  title = 'angularpopup';
  showModal: boolean;
  showModaldir: boolean;
  showModalfir: boolean;
  registerForm: FormGroup;
  submitted = false;
  // POPUP //////////
  muestrafielmoral: boolean;
  muestrafielfisica: boolean;
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  
  fisica = false;
  moral = false;
  correoFisica = false;
  correoMoral = false;
  correoMoralEmpresa = false;
  RFCFisica = false;
  RFCMoral = false;
  CURP = false;
  /************* */
  btncontribuyente = false;
  /****************** */
  noaguardado = true;
  seleccionfom = false;
  capturanuevofisica = true;
  capturanuevomoral = true;

  resppersonafisica: any[];
  resppersonamoral: any[];
  respcontribmoral: string;

  idcontr = '';
  iddp = '';

  tpersona: any[] = [];
  tgenero: any[] = [];

  estados: any[] = [];
  municipios: any[] = [];
  addresstype: any[] = [];
  suburbtype: any[] = [];
  suburb: any[] = [];
  contribuyenteslist: any[] = [];
  idestado = '';
  ide = '';
  idm = '';
  idc: string;

  // ESCRITURAS //
  escrituras: any[] = [];
  escritura: any[] = [];
  parentesco: any[] = [];
  // DIRECCIONES //
  direcciones: any[] = [];
  direccion: any[] = [];
  nombreestado = '';
  nombremunicipio = '';
  tipodomicilio = '';
  calle = '';
  numeroexterior = '';
  numerointerior = '';
  tipoasentamiento = '';
  codigopostal = '';
  colonia = '';
  referencia = '';
  muestradirecciones = false;
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  contribuyentes: any[];
  firmantes: any[] = [];
  firmante: any[] = [];

  contribuyente: any[] = [];
  personamoral: any[] = [];
  personafisica: any[] = [];

  cols: any[] = [];
  firmantesfisicas: any[] = [];
  nombrepersona = '';

  regimenfiscalfisica: any[] = [];
  regimenfiscalmoral: any[] = [];
  maritalestatus: any[] = [];
  tipoidentificacion: any[] = [];

  constructor(private _formBuilder: FormBuilder,
              public _contribuyentesservice: ContribuyentesService,
              public route: ActivatedRoute,
              public _mantenimientocontservice: MantenimientoContribuyentesService) {}

  // POPUP /////////
  show() {
    this.showModal = true; // Show-Hide Modal Check
  }
  hide() {
    this.showModal = false;
  }
  showdir() {
    this.showModaldir = true; // Show-Hide Modal Check
  }
  hidedir() {
    this.showModaldir = false;
  }
  showfir() {
    this.showModalfir = true; // Show-Hide Modal Check
  }
  hidefir() {
    this.showModalfir = false;
  }
  // POPUP ////////

  ngOnInit() {
    swal2.showLoading();
    this.idc = this.route.snapshot.paramMap.get('id');

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this._contribuyentesservice.getParentezco().subscribe( resp => this.parentesco = resp );
    this._contribuyentesservice.getPersonFiscalRegime().subscribe( resp => { this.regimenfiscalfisica = resp; } );
    this._contribuyentesservice.getLegalEntityFiscalRegime().subscribe( resp => { this.regimenfiscalmoral = resp; } );
    this._contribuyentesservice.getMaritalStatusFisica().subscribe( resp => { this.maritalestatus = resp; } );
    this._contribuyentesservice.getTipoIdentificacionFisica().subscribe( resp => { this.tipoidentificacion = resp; } );
    this._contribuyentesservice.getFirmantes().subscribe( resp => {this.firmantesfisicas = resp; });
    this._contribuyentesservice.getContribuyentesMain().subscribe( resp => {this.contribuyentes = resp;
                                                                   // tslint:disable-next-line: align
                                                                   for (const prop in this.contribuyentes) {
                                                                              if (this.contribuyentes[prop].id_contribuyente == this.idc) {
                                                                                this.nombrepersona = this.contribuyentes[prop].nombre;
                                                                                break;
                                                                              }
                                                                            }
                                                                            } );
    this._contribuyentesservice.getStates().subscribe( resp => { this.estados = resp; } );
    this._contribuyentesservice.getAdresstype().subscribe( resp => { this.addresstype = resp; } );
    this._contribuyentesservice.getAsentamientotype().subscribe( resp => { this.suburbtype = resp; } );

    this._mantenimientocontservice.getDirecciones(this.idc).subscribe( resp => {this.direcciones = resp; } );
    this._mantenimientocontservice.getEscrituras( this.idc ).subscribe( resp => {this.escrituras = resp; } );
    this._mantenimientocontservice.getFirmantes(this.idc).subscribe( resp => {this.firmantes = resp;
                                                                              // tslint:disable-next-line: forin
                                                                              for (const prop in this.escrituras) {
                                                                                for (const prep in this.firmantes) {
                                                                                  if ( this.escrituras[prop].id == this.firmantes[prep].property_document_id ) {
                                                                                    this.firmantes[prep].nambre = this.escrituras[prop].document_type;
                                                                                  }
                                                                                }
                                                                              }
                                                                              // tslint:disable-next-line: forin
                                                                              for (const prop in this.contribuyentes) {
                                                                                for (const prep in this.firmantes) {
                                                                                  if (this.contribuyentes[prop].id_contribuyente == this.firmantes[prep].contributor_signatory_id) {
                                                                                    this.firmantes[prep].nambrecontribuyente = this.contribuyentes[prop].nombre;
                                                                                  }

                                                                                }
                                                                              }
    } );
    this._mantenimientocontservice.getContribuyente( this.idc )
    .subscribe
    ( resp => {this.contribuyente = resp; console.log(resp);
              // console.log(this.contribuyente);
               if ( this.contribuyente[0].legal_entity_id === null ) {
                this.moral = false;
                this.fisica = true;
                this._mantenimientocontservice.getPersonaFisica(this.contribuyente[0].person_id).subscribe( resp3 => { this.personafisica = resp3; console.log(resp3);
                                                                                                                       if (this.personafisica[0].fiel === true) {
                    this.muestrafielfisica = true;
                  } else {
                    this.muestrafielfisica = false;
                  }
                                                                                                                        } );
              } else if ( this.contribuyente[0].person_id === null ) {
               this.moral = true;
               this.fisica = false;
               this._mantenimientocontservice.getPersonaMoral(this.contribuyente[0].legal_entity_id).subscribe( resp2 => {this.personamoral = resp2;
                                                                                                                          if (this.personamoral[0].fiel === true) {
                                                                                                                            this.muestrafielmoral = true;
                                                                                                                          } else {
                                                                                                                            this.muestrafielmoral = false;
                                                                                                                          }
                                                                                                                           } );
              }
               swal2.close();
    } );

    this.cols = [

      { field: 'partnership', header: 'partnership' },
      { field: 'property_document_id', header: 'property_document_id' },
      { field: 'nambre', header: 'Escritura' },
      { field: 'contributor_signatory_id', header: 'contributor_signatory_id' },
      { field: 'cont', header: 'nambrecontribuyente' }

  ];
  }

// DOMICILIOS ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  filtramunicipios() {

    const estado: any = document.getElementById('estado');

    const valorestado = estado.options[estado.selectedIndex].value;

    for (const prop in this.estados) {
      if ( this.estados[prop].name === valorestado ) {
        this.idestado = this.estados[prop].id;
        break;
      }
    }

    this._contribuyentesservice.getMunicipios( this.idestado ).subscribe(resp => {this.municipios = resp; });

  }

  buscacp() {

    const cp = (document.getElementById('postal_code') as HTMLInputElement).value;

    this._contribuyentesservice.getColoniasxcp( cp ).subscribe( resp => { this.suburb = resp; } );

  }

  modificardireccion() {
    swal2.showLoading();

    this.idm = '';

    const direccion: any = document.getElementById('direccion');
    const valordireccion = direccion.options[direccion.selectedIndex].value;

    const estado: any = document.getElementById('estado');
    const municipio: any = document.getElementById('municipio');
    const adresstype: any = document.getElementById('adress_type');
    const suburbtype: any = document.getElementById('suburb_type');
    const suburbb: any = document.getElementById('suburb');

    const valorestado = estado.options[estado.selectedIndex].value;
    const valormunicipio = municipio.options[municipio.selectedIndex].value;
    const valoradresstype = adresstype.options[adresstype.selectedIndex].value;
    const valorsuburbtype = suburbtype.options[suburbtype.selectedIndex].value;
    const valorsuburb = suburbb.options[suburbb.selectedIndex].value;

    for (const prop in this.estados) {
      if ( this.estados[prop].name === valorestado ) {
        this.ide = this.estados[prop].id;
        break;
      }
    }

    for (const prop in this.municipios) {
      if ( this.municipios[prop].name === valormunicipio ) {
        this.idm = this.municipios[prop].id;
        break;
      }

  }
    if (this.municipios.length == 0) {
    for (const prop in this.direcciones) {
      if ( this.direcciones[prop].id == valordireccion ) {
        this.idm = this.direcciones[prop].municipality_id;
        break;
      }
    }
  }

    const params = {

      municipality_id: this.idm,
      state_id: this.ide,
      address_type: valoradresstype,
      street: (document.getElementById('street')as HTMLInputElement).value,
      external_number: (document.getElementById('external_number')as HTMLInputElement).value,
      apartment_number: (document.getElementById('apartment_number')as HTMLInputElement).value,
      suburb_type: valorsuburbtype,
      suburb: valorsuburb,
      postal_code: (document.getElementById('postal_code')as HTMLInputElement).value,
      address_reference: (document.getElementById('address_reference')as HTMLInputElement).value,
      token: '',
      secret_key: ''

    };

   // console.log(params);

    this._mantenimientocontservice.modificaDireccion(this.idc, valordireccion , params).subscribe( resp => { swal2.close();
                                                                                                             swal2.fire({
title: 'Los datos se modificaron',
text: 'Con exito',
icon: 'success',
showConfirmButton: true,
showCancelButton: false,
allowOutsideClick: false
}). then ( res => {

if ( res.value ) {
window.location.reload();
}

} );

}, (err) => {
  swal2.close();
  console.log(err);
  swal2.fire({
    title: 'Ocurrio un error',
    text: '',
    icon: 'error',
    showConfirmButton: true,
    showCancelButton: false,
    allowOutsideClick: false
  }). then ( res => {
    if ( res.value ) {
      window.location.reload();
    }
  } );
 });

  }

  filtramunicipiosp() {

    const estado: any = document.getElementById('estadop');

    const valorestado = estado.options[estado.selectedIndex].value;

    for (const prop in this.estados) {
      if ( this.estados[prop].name === valorestado ) {
        this.idestado = this.estados[prop].id;
        break;
      }
    }

    this._contribuyentesservice.getMunicipios( this.idestado ).subscribe(resp => {this.municipios = resp; });

  }

  buscacpp() {

    const cp = (document.getElementById('postal_codep') as HTMLInputElement).value;

    this._contribuyentesservice.getColoniasxcp( cp ).subscribe( resp => { this.suburb = resp; } );

  }

  registrardireccionp() {
    swal2.showLoading();
    const estado: any = document.getElementById('estadop');
    const municipio: any = document.getElementById('municipiop');
    const adresstype: any = document.getElementById('adress_typep');
    const suburbtype: any = document.getElementById('suburb_typep');
    const suburbb: any = document.getElementById('suburbp');

    const valorestado = estado.options[estado.selectedIndex].value;
    const valormunicipio = municipio.options[municipio.selectedIndex].value;
    const valoradresstype = adresstype.options[adresstype.selectedIndex].value;
    const valorsuburbtype = suburbtype.options[suburbtype.selectedIndex].value;
    const valorsuburb = suburbb.options[suburbb.selectedIndex].value;

    for (const prop in this.estados) {
      if ( this.estados[prop].name === valorestado ) {
        this.ide = this.estados[prop].id;
        break;
      }
    }

    for (const prop in this.municipios) {
      if ( this.municipios[prop].name === valormunicipio ) {
        this.idm = this.municipios[prop].id;
        break;
      }
    }

    const params = {

      municipality_id: this.idm,
      state_id: this.ide,
      address_type: valoradresstype,
      street: (document.getElementById('streetp')as HTMLInputElement).value,
      external_number: (document.getElementById('external_numberp')as HTMLInputElement).value,
      apartment_number: (document.getElementById('apartment_numberp')as HTMLInputElement).value,
      suburb_type: valorsuburbtype,
      suburb: valorsuburb,
      postal_code: (document.getElementById('postal_codep')as HTMLInputElement).value,
      address_reference: (document.getElementById('address_referencep')as HTMLInputElement).value

    };


    this._contribuyentesservice.creaDireccionxContribuyente(this.idc, params).subscribe( resp => {
      swal2.close();
      swal2.fire({
        title: 'Los datos se guardaron',
        text: 'Con exito',
        icon: 'success',
        showConfirmButton: true,
        showCancelButton: false,
        allowOutsideClick: false
        }). then ( res => {
        if ( res.value ) {
        window.location.reload();
        }
        } );
        }, (err) => {
          swal2.close();
          console.log(err);
          swal2.fire({
            title: 'Ocurrio un error',
            text: '',
            icon: 'error',
            showConfirmButton: true,
            showCancelButton: false,
            allowOutsideClick: false
          }). then ( res => {
            if ( res.value ) {
              window.location.reload();
            }
          } );
         });

  }

  getDireccion() {
    const direccion: any = document.getElementById('direccion');
    const valordireccion = direccion.options[direccion.selectedIndex].value;
    if (valordireccion !== 'novalor') {
      this.muestradirecciones = true;
    } else {
      this.muestradirecciones = false;
    }
    // tslint:disable-next-line: forin
    for ( const prop in this.direcciones ) {
      if (this.direcciones[prop].id == valordireccion) {
        this._mantenimientocontservice.getNombreState(this.direcciones[prop].state_id).subscribe( resp => this.nombreestado = resp[0].name );
        this._mantenimientocontservice.getNombreMunicipality(this.direcciones[prop].municipality_id).subscribe( resp => this.nombremunicipio = resp[0].name );
        this.tipodomicilio = this.direcciones[prop].address_type;
        this.calle = this.direcciones[prop].street;
        this.numeroexterior = this.direcciones[prop].external_number;
        this.numerointerior = this.direcciones[prop].apartment_number;
        this.tipoasentamiento = this.direcciones[prop].suburb_type;
        this.codigopostal = this.direcciones[prop].postal_code;
        this.colonia = this.direcciones[prop].suburb;
        this.referencia = this.direcciones[prop].address_reference;
        break;
      }
    }

  }

  borraDireccion() {
    const direccion: any = document.getElementById('direccion');
    const valordireccion = direccion.options[direccion.selectedIndex].value;

    swal2.fire({
      title: 'Desea elminiar la direccion seleccionada',
      text: '?',
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      allowOutsideClick: false
    }). then ( resp => {
      if ( resp.value) {

        this._mantenimientocontservice.borraDireccion( this.idc, valordireccion ).subscribe( () => {

          swal2.fire({
            title: 'La direccion se elimino',
            text: 'Con exito',
            icon: 'success',
            showConfirmButton: true,
            showCancelButton: false,
            allowOutsideClick: false
            }). then ( res => {
            if ( res.value ) {
            window.location.reload();
            }
            } );
            }, (err) => {
              console.log(err);
              swal2.fire({
                title: 'Ocurrio un error',
                text: '',
                icon: 'error',
                showConfirmButton: true,
                showCancelButton: false,
                allowOutsideClick: false
              }). then ( res => {
                if ( res.value ) {
                  window.location.reload();
                }
              } );
             });

      }
    });
  }
// DOMICILIOS ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  // CONTRIBUYENTES ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Funcion para validar la CURP
validaCurp() {
  const regex = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/;

  const curp = (document.getElementById('CURP') as HTMLInputElement).value;
  const resultado = regex.test(curp);

  if ( curp.length > 0 ) {
    if ( resultado === false ) {
      document.getElementById('CURP').focus();
      this.CURP = true;
    } else {
      this.CURP = false;
    }
    } else {
      this.CURP = false;
    }

  }

  // Funcion para validar el correo electronico persona fisica
  validaEmail() {
  const regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  const correoFisica = (document.getElementById('correofisica') as HTMLInputElement).value;
  const resultado = regex.test(correoFisica);

  if ( correoFisica.length > 0 ) {
  if ( resultado === false ) {
    document.getElementById('correofisica').focus();
    this.correoFisica = true;
  } else {
    this.correoFisica = false;
  }
  } else {
    this.correoFisica = false;
  }

  }

  // Funcion para validar el correo electronico persona moral
  validaEmailmoral() {
    const regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    const correoMoral = (document.getElementById('correomoral') as HTMLInputElement).value;
    const resultado = regex.test(correoMoral);

    if ( correoMoral.length > 0 ) {
    if ( resultado === false ) {
      document.getElementById('correomoral').focus();
      this.correoMoral = true;
    } else {
      this.correoMoral = false;
    }
    } else {
      this.correoMoral = false;
    }

    }

    // Funcion para validar el correo electronico persona moral empresa
  validaEmailmoralEmpresa() {
    const regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    const correoMoral = (document.getElementById('correomoralempresa') as HTMLInputElement).value;
    const resultado = regex.test(correoMoral);

    if ( correoMoral.length > 0 ) {
    if ( resultado === false ) {
      document.getElementById('correomoralempresa').focus();
      this.correoMoralEmpresa = true;
    } else {
      this.correoMoralEmpresa = false;
    }
    } else {
      this.correoMoralEmpresa = false;
    }

    }

  // Funcion para validar el RFC, recibe fisica o moral dependiendo de la persona
  validaRFC(persona: string) {


    if (persona === 'fisica') {
      const regex = /^[A-Z]{4}[0-9]{6}[A-Z0-9]{3}/;
      const RFCFisica = (document.getElementById('rfcFisica') as HTMLInputElement).value;
      const resultado = regex.test(RFCFisica);

      if (RFCFisica.length > 0) {
        if ( resultado === false ) {
          document.getElementById('rfcFisica').focus();
          this.RFCFisica = true;
        } else {
          this.RFCFisica = false;
        }
    } else {
      this.RFCFisica = false;
    }
    }

    if (persona === 'moral') {
      const regex = /^[A-Z]{3}[0-9]{6}[A-Z0-9]{3}/;
      const RFCMoral = (document.getElementById('rfcmoral') as HTMLInputElement).value;
      const resultado = regex.test(RFCMoral);

      if (RFCMoral.length > 0) {
        if ( resultado === false ) {
          document.getElementById('rfcmoral').focus();
          this.RFCMoral = true;
        } else {
          this.RFCMoral = false;
        }
    } else {
      this.RFCMoral = false;
    }
    }

  }

  registrarcontribuyentemoral() {
    swal2.showLoading();
    let extra1s = '';
    let extra2s = '';
    let extra3s = '';
    const idm = this.personamoral[0].id;

    // Obtener el elemento por el id
    const fielmoral: any = document.getElementById('fielmoral');


    // Obtener el valor de la opción seleccionada
    let valorfielmoral = fielmoral.options[fielmoral.selectedIndex].value;

    if (valorfielmoral === 'SI') {
      valorfielmoral = true;
    } else if (valorfielmoral === 'NO') {
      valorfielmoral = false;
    } else {
      valorfielmoral = '';
    }

    if (valorfielmoral === true) {
      extra1s = (document.getElementById('apikeymoral')as HTMLInputElement).value;
      extra2s = (document.getElementById('tokenmoral')as HTMLInputElement).value;
    //  extra3s = (document.getElementById('authorizationmoral')as HTMLInputElement).value;
    } else {
      extra1s = '';
      extra2s = '';
      extra3s = '';
    }

    const datapm = {
      token: '',
      secret_key: '',
      fiscal_regime: (document.getElementById('rfiscalmoral')as HTMLInputElement).value,
      rfc: (document.getElementById('rfcmoral')as HTMLInputElement).value.trim(),
      rug: (document.getElementById('rug')as HTMLInputElement).value,
      business_name: (document.getElementById('nombremoral')as HTMLInputElement).value,
      phone: (document.getElementById('telfijomoral')as HTMLInputElement).value.trim(),
      mobile: (document.getElementById('telmovilmoral')as HTMLInputElement).value.trim(),
      email: (document.getElementById('correomoral')as HTMLInputElement).value.trim(),
      business_email: (document.getElementById('correomoralempresa')as HTMLInputElement).value.trim(),
      main_activity: (document.getElementById('actividadprincipal')as HTMLInputElement).value,
      fiel: valorfielmoral,
      extra1: extra1s,
      extra2: extra2s,
    //  extra3: extra3s
    };

    console.log(this.contribuyente[0].extra3);
    let fxp = null;
    if (this.contribuyente[0].extra3 != null) {
      fxp = (document.getElementById('fxpmoral')as HTMLInputElement).value;
    }

    const contribuyentepm = {
      token: '',
      secret_key: '',
      contributor_type: 'PERSONA MORAL',
      bank: (document.getElementById('bancomoral') as HTMLInputElement).value.trim(),
      account_number: (document.getElementById('cuentabancariamoral')as HTMLInputElement).value,
      clabe: (document.getElementById('CLABEmoral')as HTMLInputElement).value,
      extra1: (document.getElementById('clavelineamoral')as HTMLInputElement).value,
      extra3: fxp
    };

    this._mantenimientocontservice.actualizaLegalEntity(idm, datapm).subscribe( resp => { swal2.close();
                                                                                          this._mantenimientocontservice.actualizaContribuyente(this.idc, contribuyentepm).subscribe( () => {
                                                                                            swal2.fire({
                                                                                              title: 'Los datos se modificaron',
                                                                                              text: 'Con exito',
                                                                                              icon: 'success',
                                                                                              showConfirmButton: true,
                                                                                              showCancelButton: false,
                                                                                              allowOutsideClick: false
                                                                                            }). then ( res => {
                                                                                              if ( res.value ) {
                                                                                                window.location.reload();
                                                                                              }
                                                                                            } );
                                                                                          }, (err) => {
                                                                                            swal2.close();
                                                                                            console.log(err);
                                                                                            swal2.fire({
                                                                                              title: 'Ocurrio un error',
                                                                                              text: '',
                                                                                              icon: 'error',
                                                                                              showConfirmButton: true,
                                                                                              showCancelButton: false,
                                                                                              allowOutsideClick: false
                                                                                            }). then ( res => {
                                                                                              if ( res.value ) {
                                                                                                window.location.reload();
                                                                                              }
                                                                                            } );
                                                                                           } );
      } );

  }

  registrarcontribuyentefisica() {
    swal2.showLoading();
    let extra1s = '';
    let extra2s = '';
    let extra3s = '';
    const idm = this.personafisica[0].id;
    // Obtener el elemento por el id
    const fielfisica: any = document.getElementById('fielfisica');
    const generofisica: any = document.getElementById('generofisica');

    // Obtener el valor de la opción seleccionada
    let valorfielfisica = fielfisica.options[fielfisica.selectedIndex].value;
    const valorgenerofisica = generofisica.options[generofisica.selectedIndex].value;

    if (valorfielfisica === 'SI') {
      valorfielfisica = true;
    } else if (valorfielfisica === 'NO') {
      valorfielfisica = false;
    } else {
      valorfielfisica = '';
    }

    const d = new Date((document.getElementById('fnacimiento')as HTMLInputElement).value);
    d.setMinutes( d.getMinutes() + d.getTimezoneOffset() );
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }

    const fechanac = [year, month, day].join('-');

    if (valorfielfisica === true) {
      extra1s = (document.getElementById('apikeyfisica')as HTMLInputElement).value;
      extra2s = (document.getElementById('tokenfisica')as HTMLInputElement).value;
    //  extra3s = (document.getElementById('authorizationfisica')as HTMLInputElement).value;
    } else {
      extra1s = '';
      extra2s = '';
      extra3s = '';
    }

    const paramspf = {
      token: '',
      secret_key: '',
      fiscal_regime: (document.getElementById('rfiscalfisica') as HTMLInputElement).value,
      rfc: (document.getElementById('rfcFisica')as HTMLInputElement).value,
      curp: (document.getElementById('CURP')as HTMLInputElement).value.trim(),
      imss: (document.getElementById('IMSS')as HTMLInputElement).value,
      first_name: (document.getElementById('nombrefisica')as HTMLInputElement).value,
      last_name: (document.getElementById('apellidop')as HTMLInputElement).value.trim(),
      second_last_name: (document.getElementById('apellidom')as HTMLInputElement).value,
      gender: valorgenerofisica,
      nationality: (document.getElementById('nacionalidad')as HTMLInputElement).value.trim(),
      birth_country: (document.getElementById('pnacimiento')as HTMLInputElement).value,
      birthplace: (document.getElementById('lnacimiento')as HTMLInputElement).value,
      birthdate: fechanac,
      martial_status: (document.getElementById('estadocivil')as HTMLInputElement).value,
      id_type: (document.getElementById('tidentificacion')as HTMLInputElement).value,
      identification: (document.getElementById('nidentificacion')as HTMLInputElement).value,
      phone: (document.getElementById('telfijofisica')as HTMLInputElement).value,
      mobile: (document.getElementById('telmovilfisica')as HTMLInputElement).value,
      email: (document.getElementById('correofisica')as HTMLInputElement).value.trim(),
      fiel: valorfielfisica,
      extra1: extra1s,
      extra2: extra2s,
    //  extra3: extra3s
    };

    console.log(this.contribuyente[0].extra3);
    let fxp = null;
    if (this.contribuyente[0].extra3 != null) {
      fxp = (document.getElementById('fxpfisica')as HTMLInputElement).value;
    }

    const contribuyentepf = {
      token: '',
      secret_key: '',
      contributor_type: 'PERSONA FISICA',
      bank: (document.getElementById('bancofisica') as HTMLInputElement).value.trim(),
      account_number: (document.getElementById('cuentabancariafisica')as HTMLInputElement).value,
      clabe: (document.getElementById('CLABEfisica')as HTMLInputElement).value,
      extra1: (document.getElementById('clavelineafisica')as HTMLInputElement).value,
      extra3: fxp
    };

    console.log(contribuyentepf);

    this._mantenimientocontservice.actualizaPerson(idm, paramspf).subscribe( resp => { swal2.close();
                                                                                       this._mantenimientocontservice.actualizaContribuyente(this.idc, contribuyentepf).subscribe( resp2 => {
                                                                                                                                                                                              swal2.fire({
                                                                                          title: 'Los datos se modificaron',
                                                                                          text: 'Con exito',
                                                                                          icon: 'success',
                                                                                          showConfirmButton: true,
                                                                                          showCancelButton: false,
                                                                                          allowOutsideClick: false
                                                                                        }). then ( res => {
                                                                                          if ( res.value ) {
                                                                                            window.location.reload();
                                                                                          }
                                                                                        } );
                                                                                            // window.location.reload();
      }, (err) => {
        swal2.close();
        console.log(err);
        swal2.fire({
          title: 'Ocurrio un error',
          text: '',
          icon: 'error',
          showConfirmButton: true,
          showCancelButton: false,
          allowOutsideClick: false
        }). then ( res => {
          if ( res.value ) {
            window.location.reload();
          }
        } );
       } );
} );

  }
  // CONTRIBUYENTES ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // ESCRITURAS ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  getescritura() {
    const escritura: any = document.getElementById('escritura');
    const valorescritura = escritura.options[escritura.selectedIndex].value;
    if (valorescritura !== 'novalor') {
    let ide = '';
    for ( const prop in this.escrituras ) {
      if (this.escrituras[prop].document_type.trim() === valorescritura.trim()) {
        ide = this.escrituras[prop].id;
      }
    }
    this._mantenimientocontservice.getEscritura( this.idc, ide ).subscribe( resp => {this.escritura = resp; } );
  } else {
    this.escritura = [];
  }
  }

  borraescritura( ide ) {
    swal2.showLoading();
    swal2.fire({
      title: 'Desea elminiar la escritura seleccionada',
      text: '?',
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      allowOutsideClick: false
    }). then ( resp => {
      if ( resp.value) {

        this._mantenimientocontservice.borraEscritura( this.idc, ide ).subscribe( () => {
          swal2.close();
          swal2.fire({
            title: 'La escritura se elimino',
            text: 'Con exito',
            icon: 'success',
            showConfirmButton: true,
            showCancelButton: false,
            allowOutsideClick: false
          }). then ( res => {
            if ( res.value ) {
              window.location.reload();
            }
          } );
              // window.location.reload();
}, (err) => {
  swal2.close();
  console.log(err);
  swal2.fire({
    title: 'Ocurrio un error',
    text: '',
    icon: 'error',
    showConfirmButton: true,
    showCancelButton: false,
    allowOutsideClick: false
  }). then ( res => {
    if ( res.value ) {
      window.location.reload();
    }
  } );
 });

      }
    });

  }

  guardaEscritura() {
    swal2.showLoading();
    const d = new Date((document.getElementById('dppd_datep')as HTMLInputElement).value);
    d.setMinutes( d.getMinutes() + d.getTimezoneOffset() );
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }

    const fechaesc = [year, month, day].join('-');

    const params = {

    document_type: (document.getElementById('dpdocument_typep')as HTMLInputElement).value,
    description: (document.getElementById('dpdescriptionp')as HTMLInputElement).value,
    pd_number: (document.getElementById('dppd_numberp')as HTMLInputElement).value,
    pd_book: (document.getElementById('dppd_bookp')as HTMLInputElement).value,
    pd_date: fechaesc,
    rug: (document.getElementById('dprugp')as HTMLInputElement).value,
    document: (document.getElementById('dpdocumentp')as HTMLInputElement).value,
    token: '',
    secret_key: ''

    };

    this._contribuyentesservice.crearDP(this.idc, params).subscribe( resp => { swal2.close();
                                                                               this.iddp = resp;
                                                                               swal2.fire({
                                                                                title: 'Los datos se guardaron',
                                                                                text: 'Con exito',
                                                                                icon: 'success',
                                                                                showConfirmButton: true,
                                                                                showCancelButton: false,
                                                                                allowOutsideClick: false
                                                                                }). then ( res => {
                                                                                if ( res.value ) {
                                                                                window.location.reload();
                                                                                }
                                                                                } );
                                                                                }, (err) => {
                                                                                  swal2.close();
                                                                                  console.log(err);
                                                                                  swal2.fire({
                                                                                    title: 'Ocurrio un error',
                                                                                    text: '',
                                                                                    icon: 'error',
                                                                                    showConfirmButton: true,
                                                                                    showCancelButton: false,
                                                                                    allowOutsideClick: false
                                                                                  }). then ( res => {
                                                                                    if ( res.value ) {
                                                                                      window.location.reload();
                                                                                    }
                                                                                  } );
                                                                                 });
  }

  modificaEscritura( ide ) {
    swal2.showLoading();
    const d = new Date((document.getElementById('dppd_date')as HTMLInputElement).value);
    d.setMinutes( d.getMinutes() + d.getTimezoneOffset() );
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }

    const fechaesc = [year, month, day].join('-');

    const params = {

    document_type: (document.getElementById('dpdocument_type')as HTMLInputElement).value,
    description: (document.getElementById('dpdescription')as HTMLInputElement).value,
    pd_number: (document.getElementById('dppd_number')as HTMLInputElement).value,
    pd_book: (document.getElementById('dppd_book')as HTMLInputElement).value,
    pd_date: fechaesc,
    rug: (document.getElementById('dprug')as HTMLInputElement).value,
    document: (document.getElementById('dpdocument')as HTMLInputElement).value,
    token: '',
    secret_key: ''

    };

    this._mantenimientocontservice.modificaEscritura(this.idc, ide , params).subscribe( resp => { swal2.close();
                                                                                                  swal2.fire({
        title: 'Los datos se modificaron',
        text: 'Con exito',
        icon: 'success',
        showConfirmButton: true,
        showCancelButton: false,
        allowOutsideClick: false
      }). then ( res => {

        if ( res.value ) {
          window.location.reload();
        }

      } );

}, (err) => {
  swal2.close();
  console.log(err);
  swal2.fire({
    title: 'Ocurrio un error',
    text: '',
    icon: 'error',
    showConfirmButton: true,
    showCancelButton: false,
    allowOutsideClick: false
  }). then ( res => {
    if ( res.value ) {
      window.location.reload();
    }
  } );
 });

  }

  // ESCRITURAS ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // FIRMANTES ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  agregaFirmante() {
    swal2.showLoading();
    const escritura: any = document.getElementById('escriturafirmantep');

    const valorescritura = escritura.options[escritura.selectedIndex].value;

    const parentesco: any = document.getElementById('fpartnershipp');

    const valorparentesco = parentesco.options[parentesco.selectedIndex].value;

    const contribuyente: any = document.getElementById('firmantep');

    const valorcontribuyente = contribuyente.options[contribuyente.selectedIndex].value;

    const params = {
    token: '',
    secret_key: '',
    contributor_signatory_id: valorcontribuyente,
    property_document_id: valorescritura,
    partnership: valorparentesco
  };

    this._contribuyentesservice.creaFirmantexContribuyente(this.idc, params).subscribe( resp => {
      swal2.close();
      swal2.fire({
        title: 'Los datos se guardaron',
        text: 'Con exito',
        icon: 'success',
        showConfirmButton: true,
        showCancelButton: false,
        allowOutsideClick: false
      }). then ( res => {

        if ( res.value ) {
          window.location.reload();
        }

      } );

}, (err) => {
  swal2.close();
  console.log(err);
  swal2.fire({
    title: 'Ocurrio un error',
    text: '',
    icon: 'error',
    showConfirmButton: true,
    showCancelButton: false,
    allowOutsideClick: false
  }). then ( res => {
    if ( res.value ) {
      window.location.reload();
    }
  } );
 });
  }

  getFirmante() {
    const firmante: any = document.getElementById('firmantes');
    const valorfirmante = firmante.options[firmante.selectedIndex].value;
    if (valorfirmante !== 'novalor') {
    for (const prop in this.firmantes) {
      if (this.firmantes[prop].id == valorfirmante) {
      this.firmante[0] = this.firmantes[prop];
      break;
      }
    }
  } else {
    this.firmante = [];
  }
  }

  modificaFirmante() {
    swal2.showLoading();
    const escritura: any = document.getElementById('escriturafirmante');

    const valorescritura = escritura.options[escritura.selectedIndex].value;

    const contribuyente: any = document.getElementById('firmante');

    const valorcontribuyente = contribuyente.options[contribuyente.selectedIndex].value;

    const parentesco: any = document.getElementById('fpartnership');

    const valorparentesco = parentesco.options[parentesco.selectedIndex].value;

    const firmantes: any = document.getElementById('firmantes');

    const valorfirmantes = firmantes.options[firmantes.selectedIndex].value;

    const params = {
      token: '',
      secret_key: '',
      contributor_signatory_id: valorcontribuyente,
      property_document_id: valorescritura,
      partnership: valorparentesco
    };

    if (valorescritura === 'null') {
      delete params.property_document_id;
    }

    this._mantenimientocontservice.actualizaFirmante( this.idc, valorfirmantes, params ).subscribe( resp => {
      swal2.close();
      swal2.fire({
        title: 'Los datos se guardaron',
        text: 'Con exito',
        icon: 'success',
        showConfirmButton: true,
        showCancelButton: false,
        allowOutsideClick: false
      }). then ( res => {

        if ( res.value ) {
          window.location.reload();
        }

      } );

}, (err) => {
  swal2.close();
  console.log(err);
  swal2.fire({
    title: 'Ocurrio un error',
    text: '',
    icon: 'error',
    showConfirmButton: true,
    showCancelButton: false,
    allowOutsideClick: false
  }). then ( res => {
    if ( res.value ) {
      window.location.reload();
    }
  } );
 });
  }

borraFirmante() {
  const firmantes: any = document.getElementById('firmantes');

  const valorfirmantes = firmantes.options[firmantes.selectedIndex].value;

  swal2.fire({
    title: 'Desea elminiar el firmante seleccionado',
    text: '?',
    icon: 'question',
    showConfirmButton: true,
    showCancelButton: true,
    allowOutsideClick: false
  }). then ( resp => {
    if ( resp.value) {

      this._mantenimientocontservice.borraFirmante( this.idc, valorfirmantes ).subscribe( () => {

        swal2.fire({
          title: 'El firmante se elimino',
          text: 'Con exito',
          icon: 'success',
          showConfirmButton: true,
          showCancelButton: false,
          allowOutsideClick: false
        }). then ( res => {
          if ( res.value ) {
            window.location.reload();
          }
        } );
  }, (err) => {
    console.log(err);
    swal2.fire({
      title: 'Ocurrio un error',
      text: '',
      icon: 'error',
      showConfirmButton: true,
      showCancelButton: false,
      allowOutsideClick: false
    }). then ( res => {
      if ( res.value ) {
        window.location.reload();
      }
    } );
   });

    }
  });
}

  // FIRMANTES ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  getFielMoral() {
    const fielmoral: any = document.getElementById('fielmoral');
    // Obtener el valor de la opción seleccionada
    const valorfielmoral = fielmoral.options[fielmoral.selectedIndex].value;
    if(valorfielmoral === 'SI') {
      this.muestrafielmoral = true;
    } else {
      this.muestrafielmoral = false;
    }
  }

  getFielFisica() {
    const fielfisica: any = document.getElementById('fielfisica');
    // Obtener el valor de la opción seleccionada
    const valorfielfisica = fielfisica.options[fielfisica.selectedIndex].value;

    if(valorfielfisica === 'SI') {
      this.muestrafielfisica = true;
    } else {
      this.muestrafielfisica = false;
    }
  }

}







