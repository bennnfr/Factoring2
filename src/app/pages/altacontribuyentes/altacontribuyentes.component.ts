import { Component, OnInit } from '@angular/core';
import { OptionsService, ContribuyentesService } from '../../services/service.index';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { PerMoral, ContribuyenteFisica, ContribuyenteMoral } from '../../models/personas.model';
import { Subscription } from 'rxjs';
import swal2 from 'sweetalert2';

declare var $;

@Component({
  selector: 'app-altacontribuyentes',
  templateUrl: './altacontribuyentes.component.html',
  styles: []
})
export class AltacontribuyentesComponent implements OnInit {

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  muestrafielmoral = false;
  muestrafielfisica = false;
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

  subscription: Subscription;

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

  regimenfiscalfisica: any[] = [];
  regimenfiscalmoral: any[] = [];
  maritalestatus: any[] = [];
  tipoidentificacion: any[] = [];

  constructor(private _formBuilder: FormBuilder,
              public _optionsservice: OptionsService,
              public router: Router,
              public _contribuyentesservice: ContribuyentesService) {}

  ngOnInit() {
   // this.getAcceso('/altacontribuyentes');
    this.muestrafielmoral = false;
    this.muestrafielfisica = false;
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    this._contribuyentesservice.getFiscalRegime().subscribe( resp => {this.tpersona = resp; } );
    this._contribuyentesservice.getPersonGender().subscribe( resp => this.tgenero = resp );
    this._contribuyentesservice.getStates().subscribe( resp => { this.estados = resp; } );
    this._contribuyentesservice.getAdresstype().subscribe( resp => { this.addresstype = resp; } );
    this._contribuyentesservice.getAsentamientotype().subscribe( resp => { this.suburbtype = resp; } );
    this._contribuyentesservice.getPersonFiscalRegime().subscribe( resp => { this.regimenfiscalfisica = resp; } );
    this._contribuyentesservice.getLegalEntityFiscalRegime().subscribe( resp => { this.regimenfiscalmoral = resp; } );
    this._contribuyentesservice.getMaritalStatusFisica().subscribe( resp => { this.maritalestatus = resp; } );
    this._contribuyentesservice.getTipoIdentificacionFisica().subscribe( resp => { this.tipoidentificacion = resp; } );
  }

  getAcceso(url) {
    let tieneacceso = false;
    this._optionsservice.getOptionsxUsuario(localStorage.getItem('id')).subscribe(resp2 => {
      // tslint:disable-next-line: forin
      for (const j in resp2 ) {
          if ( resp2[j].url === url ) {
            tieneacceso = true;
            break;
          }
        }
      if (!tieneacceso) {
        this.router.navigate(['/accesodenegado']);
      }
    });
  }

  LimpiarFisica() {

    (document.getElementById('rfiscalfisica') as HTMLInputElement).value = '';

  }

  capturarnuevo() {
    window.location.reload();
  }

  render() {

    // Obtener el elemento por el id
    const persona: any = document.getElementById('tipopersona');

    // Obtener el valor de la opción seleccionada
    const valorPersona = persona.options[persona.selectedIndex].value;

    if (valorPersona === 'PERSONA FÍSICA') {
    this.fisica = true;
    this.moral = false;
    } else if (valorPersona === 'PERSONA MORAL') {
      this.fisica = false;
      this.moral = true;
    } else {
      this.fisica = false;
      this.moral = false;
    }
  }

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

  registrarcontribuyentefisica() {
    swal2.showLoading();
    let extra1s = '';
    let extra2s = '';
    let extra3s = '';

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

    const contribuyentefisica = new ContribuyenteFisica(

      'PERSONA FISICA',
      (document.getElementById('bancofisica') as HTMLInputElement).value,
      (document.getElementById('cuentabancariafisica')as HTMLInputElement).value,
      (document.getElementById('CLABEfisica')as HTMLInputElement).value,
      (document.getElementById('clavelineafisica')as HTMLInputElement).value,
    );

    this.subscription = this._contribuyentesservice.crearPersonaFisica( paramspf ).subscribe( resp => { this.resppersonafisica = resp;

                                                                                                        this._contribuyentesservice.crearContribuyenteFisica( contribuyentefisica, this.resppersonafisica[0].id )
                                                                                                             .subscribe( respm => {this.respcontribmoral = respm; this.idcontr = this.respcontribmoral; } );
                                                                                                        swal2.close();
                                                                                                        swal2.fire({
                                                                                                              title: 'Los datos fueron guardados',
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
      swal2.fire(
           'Error al guardar los datos',
           err.error.errors[0],
           'error'
        );
     } );

  }

  registrarcontribuyentemoral() {
    swal2.showLoading();
    let extra1s = '';
    let extra2s = '';
    let extra3s = '';

   // if (this.noaguardado) {
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

    const personamoral = new PerMoral (
     (document.getElementById('rfiscalmoral')as HTMLInputElement).value,
     (document.getElementById('rfcmoral')as HTMLInputElement).value,
     (document.getElementById('nombremoral')as HTMLInputElement).value,
     (document.getElementById('rug')as HTMLInputElement).value,
     (document.getElementById('telfijomoral')as HTMLInputElement).value,
     (document.getElementById('telmovilmoral')as HTMLInputElement).value,
     (document.getElementById('correomoral')as HTMLInputElement).value,
     (document.getElementById('correomoralempresa')as HTMLInputElement).value,
     (document.getElementById('actividadprincipal')as HTMLInputElement).value,
     valorfielmoral,
    );

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


    const contribuyentemoral = new ContribuyenteMoral(

      'PERSONA MORAL',
      (document.getElementById('bancomoral') as HTMLInputElement).value,
      (document.getElementById('cuentabancariamoral')as HTMLInputElement).value,
      (document.getElementById('CLABEmoral')as HTMLInputElement).value,
      (document.getElementById('clavelineamoral')as HTMLInputElement).value,
    );


  /*  if ( document.getElementById('btnguardamoral').click ) {
      console.log('hola');
      this.noaguardado = false;
      this.btncontribuyente = false;
      this.seleccionfom = true;
      this.capturanuevomoral = false;
    } */

    this._contribuyentesservice.crearPersonaMoral(datapm).subscribe( resp => {this.resppersonamoral = resp;
                                                                              this._contribuyentesservice.crearContribuyenteMoral( contribuyentemoral, this.resppersonamoral[0].id )
                                                                                    .subscribe( respm => {this.respcontribmoral = respm;  this.idcontr = this.respcontribmoral; } );
                                                                              swal2.close();
                                                                              swal2.fire({
                                                                                      title: 'El contribuyente se guardo con',
                                                                                      text: 'Exito',
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
      swal2.fire(
           'Error al guardar los datos',
           err.error.errors[0],
           'error'
        );
     } );
/*  } else {
    swal2.fire(
      'Los Datos ya fueron guardados',
      '',
      'error'
   ); } */
  }

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

  /***************************************************************************************************************************************************/

  registrardp() {

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

    this._contribuyentesservice.crearDP(this.idcontr, params).subscribe( resp => {
                                                                                   this.iddp = resp;
                                                                                   swal2.fire(
                                                                    'Los datos se guardaron con exito',
                                                                    '',
                                                                    'success'
                                                                     );
    }, (err) => {
      console.log(err);
      swal2.fire(
           'Error al guardar los datos',
           '',
           'error'
        );
     });
  }

  /***************************************************************************************************************************************************************************** */

  registraSignatory() {

    const params = {
    token: '',
    secret_key: '',
    contributor_signatory_id: this.idcontr,
    property_document_id: this.iddp,
    partnership: (document.getElementById('fpartnership')as HTMLInputElement).value
  };

    this._contribuyentesservice.creaFirmantexContribuyente(this.idcontr, params).subscribe( resp => {
                                                                                                      swal2.fire(
'Los datos se guardaron con exito',
'',
'success'
);
}, (err) => {
console.log(err);
swal2.fire(
'Error al guardar los datos',
'',
'error'
);
});

  }
  /**************************************************************************************************************************************** */

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

  registrardireccion() {

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

    const params = {

      token: '',
      secret_key: '',
      municipality_id: this.idm,
      state_id: this.ide,
      address_type: valoradresstype,
      street: (document.getElementById('street')as HTMLInputElement).value,
      external_number: (document.getElementById('external_number')as HTMLInputElement).value,
      apartment_number: (document.getElementById('apartment_number')as HTMLInputElement).value,
      suburb_type: valorsuburbtype,
      suburb: valorsuburb,
      postal_code: (document.getElementById('postal_code')as HTMLInputElement).value,
      address_reference: (document.getElementById('address_reference')as HTMLInputElement).value

    };



    this._contribuyentesservice.creaDireccionxContribuyente(this.idcontr, params).subscribe( resp => { 
                                                                                                       swal2.fire(
'Los datos se guardaron con exito',
'',
'success'
);
}, (err) => {
console.log(err);
swal2.fire(
'Error al guardar los datos',
'',
'error'
);
});

  }

}









