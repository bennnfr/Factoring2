import { Injectable } from '@angular/core';
import { Usuario, Usuario2 } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as jsPDF from 'jspdf';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { AltaSolicitudesService } from '../altasolicitudes/altasolicitudes.service';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Injectable()
export class ReportesPDFService {

  usuario: Usuario;
  token: string;
  usuario2: Usuario2;
  idUsuario: string;
  uploadURL: Observable<string>;
  num = '2847-425-033751/01-03751-1120';

   externalDataRetrievedFromServer = [
    { EMISOR_O_DEUDOR : 'UN NOMBRE', DOCTO_No: 34, TIPO_DOCTO: 'legal', FECHA_DE_ENTREGA_MERCANCIA: '01/10/2021', FECHA_VENCIMIENTO: '03/12/2022', IMPORTE_FACTURA_100: '8000', O_IMPORTE_A_OPERAR: '5000' },
    { EMISOR_O_DEUDOR : 'UN NOMBRE', DOCTO_No: 34, TIPO_DOCTO: 'legal', FECHA_DE_ENTREGA_MERCANCIA: '01/10/2021', FECHA_VENCIMIENTO: '03/12/2022', IMPORTE_FACTURA_100: '8000', O_IMPORTE_A_OPERAR: '5000' },
    { EMISOR_O_DEUDOR : 'UN NOMBRE', DOCTO_No: 34, TIPO_DOCTO: 'legal', FECHA_DE_ENTREGA_MERCANCIA: '01/10/2021', FECHA_VENCIMIENTO: '03/12/2022', IMPORTE_FACTURA_100: '8000', O_IMPORTE_A_OPERAR: '5000' },
];
   losdocs = [];
   monto_toal = 0;
   importe_facturas_100: string;
   importe_operar = 0;
   importe_operarstr: string;
   datosrep;
  constructor(
    public http: HttpClient,
    public router: Router,
    private _firestorage: AngularFireStorage,
    public _solicitudesservice: AltaSolicitudesService,
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

  getdatosrep(ids) {

    const url = `${environment.URL_SERVICIOS}/mzcd_report?request_id=${ids}&token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  
    return this.http.get(url).pipe(
      map( (resp: any) => {
        return resp;
      } )
    );
  
    }

  reporte_recurso(ids, folio) {
    
  this.getdatosrep(ids).subscribe( resp => { this.datosrep = resp
   // console.log(this.datosrep);
    if (this.datosrep.client_pf.length === 0) {
  //  console.log('llamar pm');
    this.CONTRATO_MIZFACTURAS_CON_RESURSO_PM(ids, folio, this.datosrep);
    } else if (this.datosrep.client_pm.length === 0) {
  //  console.log('llamar pf');
    this.CONTRATO_MIZFACTURAS_CON_RESURSO_PF(ids, folio, this.datosrep);
    }
  } )
  }

  ////////////////////////
   buildTableBody(data, columns) {
    var body = [];

    //body.push(columns);

    data.forEach(function(row) {
        var dataRow = [];

        columns.forEach(function(column) {
            dataRow.push(row[column].toString());
        })

        body.push(dataRow);
    });

    return body;
}

 table(data, columns) {
    return {
      style: 'tabla',
        table: {
          widths: [64,65,65,64,64,65,64],
            headerRows: 1,
            body: this.buildTableBody(data, columns)
        }
    };
}
  ///////////////////////

  reporte_mizfacturas_sin_recurso(ids, folio) {
    this.losdocs = [];
    this.monto_toal= 0;
    this.importe_facturas_100 = '';
    this.importe_operar = 0;
    this.importe_operarstr = '';
    this.getdatosrep(ids).subscribe(resp => {
      // VALIDACIONES DE LOS DATOS
      let req = {
        cat: '',
        comisiones: '',
        fecha_limite_pago: '',
        linea_factoraje: '',
        plazo: '',
        tasa_anual: '',
        total_apagar: '',
        vigencia_contrato: ''
      }
      let fin = {
        denominacion_social: '',
        domicilio: '',
        colonia: '',
        municipio: '',
        estado: '',
        entidad_federativa: '',
        codigo_postal: '',
        representante_legal: '',
        escritura: '',
        fecha_escritura: '',
        antefe_notario: '',
        titular_notaria: '',
        folio_inscripcion: '',
        lugar_inscripcion: '',
        fecha_inscripcion: ''
      }
      let client_pf = {
        nombre_completo: '',
        domicilio: '',
        colonia: '',
        municipio: '',
        estado: '',
        entidad_federativa: '',
        codigo_postal: '',
        curp: '',
        rfc: '',
        martial_status: '',
        id_type: '',
        identification: '',
        phone: '',
        email: ''
      }
      let client_pm = {
        denominacion_social: '',
        domicilio: '',
        colonia: '',
        municipio: '',
        estado: '',
        entidad_federativa: '',
        codigo_postal: '',
        rfc: '',
        phone: '',
        email: ''
      }
      let legal_reppf = {
        nombre_completo: '',
        domicilio: '',
        colonia: '',
        municipio: '',
        estado: '',
        entidad_federativa: '',
        codigo_postal: '',
        curp: '',
        rfc: '',
        martial_status: '',
        id_type: '',
        identification: '',
        phone: '',
        email: ''
      }
      let legal_reppm = {
        nombre_completo: '',
        domicilio: '',
        colonia: '',
        municipio: '',
        estado: '',
        entidad_federativa: '',
        codigo_postal: '',
        curp: '',
        rfc: '',
        martial_status: '',
        id_type: '',
        identification: '',
        phone: '',
        email: ''
      }
      let garantepf = {
        nombre_completo: '',
        domicilio: '',
        colonia: '',
        municipio: '',
        estado: '',
        entidad_federativa: '',
        codigo_postal: '',
        curp: '',
        rfc: '',
        martial_status: '',
        id_type: '',
        identification: '',
        phone: '',
        email: ''
      }
      if (resp.request.length > 0) {
          req = {
          cat: resp.request[0].cat,//
          comisiones: resp.request[0].comisiones,//
          fecha_limite_pago: resp.request[0].fecha_limite_pago,//
          linea_factoraje: resp.request[0].linea_factoraje,//
          plazo: resp.request[0].plazo,
          tasa_anual: resp.request[0].tasa_anual,//
          total_apagar: resp.request[0].total_apagar,
          vigencia_contrato: resp.request[0].vigencia_contrato//
        }
      }
      if (resp.fin.length > 0) {
        fin = {
          denominacion_social: resp.fin[0].denominacion_social,//
          domicilio: resp.fin[0].domicilio,//
          colonia: resp.fin[0].colonia,//
          municipio: resp.fin[0].municipio,//
          estado: resp.fin[0].estado,
          entidad_federativa: resp.fin[0].entidad_federativa,//
          codigo_postal: resp.fin[0].codigo_postal,//
          representante_legal: resp.fin[0].representante_legal,//
          escritura: resp.fin[0].escritura,//
          fecha_escritura: resp.fin[0].fecha_escritura,//
          antefe_notario: resp.fin[0].antefe_notario,//
          titular_notaria: resp.fin[0].titular_notaria,//
          folio_inscripcion: resp.fin[0].folio_inscripcion,//
          lugar_inscripcion: resp.fin[0].lugar_inscripcion,//
          fecha_inscripcion: resp.fin[0].fecha_inscripcion//
        }
      }
      if (resp.client_pf.length > 0) {
          client_pf = {
          nombre_completo: resp.client_pf[0].nombre_completo,
          domicilio: resp.client_pf[0].dimicilio,
          colonia: resp.client_pf[0].colonia,
          municipio: resp.client_pf[0].municipio,
          estado: resp.client_pf[0].estado,
          entidad_federativa: resp.client_pf[0].entidad_federativa,
          codigo_postal: resp.client_pf[0].codigo_postal,
          curp: resp.client_pf[0].curp,
          rfc: resp.client_pf[0].rfc,
          martial_status: resp.client_pf[0].martial_status,
          id_type: resp.client_pf[0].id_type,
          identification: resp.client_pf[0].identification,
          phone: resp.client_pf[0].phone,
          email: resp.client_pf[0].email
        }
          if (resp.legal_rep.length > 0) {
            legal_reppf = {
              nombre_completo: resp.legal_rep[0].nombre_completo,
              domicilio: resp.legal_rep[0].domicilio,
              colonia: resp.legal_rep[0].colonia,
              municipio: resp.legal_rep[0].municipio,
              estado: resp.legal_rep[0].estado,
              entidad_federativa: resp.legal_rep[0].entidad_federativa,
              codigo_postal: resp.legal_rep[0].codigo_postal,
              curp: resp.legal_rep[0].curp,
              rfc: resp.legal_rep[0].rfc,
              martial_status: resp.legal_rep[0].martial_status,
              id_type: resp.legal_rep[0].id_type,
              identification: resp.legal_rep[0].identification,
              phone: resp.legal_rep[0].phone,
              email: resp.legal_rep[0].email
              }
          }
          
      }
      if (resp.client_pm.length > 0) {
        client_pm = {
          denominacion_social: resp.client_pm[0].denominacion_social,
          domicilio: resp.client_pm[0].domicilio,
          colonia: resp.client_pm[0].colonia,
          municipio: resp.client_pm[0].municipio,
          estado: resp.client_pm[0].estado,
          entidad_federativa: resp.client_pm[0].entidad_federativa,
          codigo_postal: resp.client_pm[0].codigo_postal,
          rfc: resp.client_pm[0].rfc,
          phone: resp.client_pm[0].phone,
          email: resp.client_pm[0].email
      }
        if (resp.legal_rep.length > 0) {
          legal_reppm = {
            nombre_completo: resp.legal_rep[0].nombre_completo,
            domicilio: resp.legal_rep[0].domicilio,
            colonia: resp.legal_rep[0].colonia,
            municipio: resp.legal_rep[0].municipio,
            estado: resp.legal_rep[0].estado,
            entidad_federativa: resp.legal_rep[0].entidad_federativa,
            codigo_postal: resp.legal_rep[0].codigo_postal,
            curp: resp.legal_rep[0].curp,
            rfc: resp.legal_rep[0].rfc,
            martial_status: resp.legal_rep[0].martial_status,
            id_type: resp.legal_rep[0].id_type,
            identification: resp.legal_rep[0].identification,
            phone: resp.legal_rep[0].phone,
            email: resp.legal_rep[0].email
            }
        }
        
    }
      if (resp.garante.length > 0) {
        garantepf = {
          nombre_completo: resp.garante[0].nombre_completo,
          domicilio: resp.garante[0].domicilio,
          colonia: resp.garante[0].colonia,
          municipio: resp.garante[0].municipio,
          estado: resp.garante[0].estado,
          entidad_federativa: resp.garante[0].entidad_federativa,
          codigo_postal: resp.garante[0].codigo_postal,
          curp: resp.garante[0].curp,
          rfc: resp.garante[0].rfc,
          martial_status: resp.garante[0].martial_status,
          id_type: resp.garante[0].id_type,
          identification: resp.garante[0].identification,
          phone: resp.garante[0].phone,
          email: resp.garante[0].email
        }
      }
      
      if (resp.docs.length > 0) {
        for (let i in resp.docs) {
          this.losdocs[i] = { EMISOR_O_DEUDOR : resp.docs[i].emisor, DOCTO_No: resp.docs[i].docto_no, TIPO_DOCTO: resp.docs[i].tipo_docto, FECHA_DE_ENTREGA_MERCANCIA: resp.docs[i].fecha_entrega, FECHA_VENCIMIENTO: resp.docs[i].fecha_vencimiento, IMPORTE_FACTURA_100: resp.docs[i].factura_100, O_IMPORTE_A_OPERAR: resp.docs[i].importe_operar }
          this.monto_toal = this.monto_toal +  parseInt(resp.docs[i].factura_100.replace(/,/g, ''), 10);
          this.importe_operar = this.importe_operar +  parseInt(resp.docs[i].importe_operar.replace(/,/g, ''), 10);
        }
        this.importe_facturas_100 = this.monto_toal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        this.importe_operarstr = this.importe_operar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      // FIN VALIDACIONES DE LOS DATOS
    
    var dd = {
        pageMargins: [ 40, 60, 40, 60 ],
        header: {
          columns: [
            {
              image: `data:image/png;base64,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`,
              width: 150,
              height: 50,
            },
          {text: `RECA: ${this.num}\nNo de contrato`, alignment: 'right'},
          ]
                 },
        
      
                 footer: function(currentPage, pageCount) {
                  return {
                      margin:10,
                      columns: [
                      {
                          fontSize: 9,
                          text:[
                          {
                          text: currentPage.toString() + ' de ' + pageCount,
                          }
                          ],
                          alignment: 'right'
                      }
                      ]
                  };
            
              },
        content: [
          {text: 'CARATULA DE CONTRATO NORMATIVO DE FACTORAJE SIN RECURSO', alignment: 'center', bold: true, italic: true},
          {style: 'tabla',
            table: {
            widths: ['*','*','*','*'],
                    body: [
                        [{text:'1)	NOMBRE COMERCIAL DEL PRODUCTO: MIZFACTURAS\nTipo de Producto: FACTORAJE FINANCIERO ', colSpan: 4}, {}, {}, {}],
              [{text:'2)	DESTINO Y APLICACIÓN: ', colSpan: 4},{},{},{}],
              [{text: `3) CAT (Costo Anual Total), A la fecha de contratación y para efectos informativos es del ${req.cat}% anual.` }, 
                {text: `4) TASA DE INTERÉS, ANUAL, ORDINARIA Y MORATORIA:\n${req.tasa_anual}`}, 
                {text: `5) MONTO O LÍNEA DE FACTORAJE SIN RECURSO:\n${req.linea_factoraje}`},
                {text: '6) MONTO TOTAL A PAGAR:\nDe Acuerdo al Anexo A del presente contrato, referido a los Contratos de Cesión de Derechos'}],
              [{text: `7)	VIGENCIA DEL CONTRATO:\n ${req.vigencia_contrato}`, colSpan: 2}, {},{text:`8)	Fecha Límite de pago: ${req.fecha_limite_pago}\n Fecha de Corte para los Estados de Cuenta: `, colSpan: 2},{}],
              [{text:'9)	FORMA DE PAGO: \nDe Acuerdo al Anexo A del presente contrato, referido a los Contratos de Cesión de Derechos ', colSpan: 4}, {}, {}, {}],
              [{text:`10)	COMISIONES: ${req.comisiones}\nComisión por Operación`, colSpan: 4}, {}, {}, {}],
              [{text:'11)	ADVERTENCIAS \n•	“Incumplir tus obligaciones te puede generar Comisiones e intereses moratorios”;\n•	“Contratar créditos que excedan tu capacidad de pago afecta tu historial crediticio” ;', colSpan: 4 }, {}, {}, {}],
              [{text:'12)	SEGUROS:\n Seguro:         NA                                    Aseguradora:          NA                                           Cláusula:       NA     \n(opcional u obligatoria)', colSpan: 4}, {}, {}, {}],
              [{text:'13)	ESTADO DE CUENTA\n- Vía Correo Electrónico                     Si                          - Domicilio                        No                        - Internet   No', colSpan: 4}, {}, {}, {}],
              [{text:'14)	ACLARACIONES Y RECLAMACIONES\nUnidad Especializada de Atención a Usuarios: Av. Circuito de la Industria Oriente 36 y 38, Parque Industrial Lerma, Municipio Lerma de Villada, Código Postal 52000, Estado de México.\nTeléfono (728) 282 72 72 ext. 134Fax (728) 282 72 98\nE-mail: atencion_¬usuario@mirzrafin.com', colSpan: 4}, {}, {}, {}],
              [{text:`15) Registro de Contratos de Adhesión Núm: ${this.num} \nComisión Nacional para la Protección y Defensa de los Usuarios de Servicios Financieros (CONDUSEF) Teléfono:01 800 999 8080 y 53400999. Página de Internet www.condusef.gob.mx  `, colSpan: 4}, {}, {}, {}],
              [{
                style: 'tabla',
                
                table: {
                  widths: ['*','*'],
                  body: [
                    [{text: '\n'}, {}],
                    [{text: '\n'}, {}],
                    [{text: ` “MIZRAFIN”\n_________________________________\nMIZRAFIN, SAPI DE C.V., SOFOM ENR\nChemaya Mizrahi Fernández`, alignment: 'center'}, {text: ` “EL CLIENTE”\n_________________________________\n(Nombre y Firma)`, alignment: 'center'}],
                    [{text: '\n'}, {}],
                    [{text: '\n'}, {}],
                    [{text: '\n'}, {}],
                    [{text: ` ““OBLIGADOS SOLIDARIOS Y AVALISTAS””\n_________________________________\nMIZRAFIN, SAPI DE C.V., SOFOM ENR\nChemaya Mizrahi Fernández`,alignment: 'center', colSpan: 2}, {} ],
                  ]
                },
                layout: 'noBorders'
                , colSpan: 4},{},{},{}] 
                    ]
                }},
          {text: 'CONTRATO NORMATIVO DE FACTORAJE FINANCIERO SIN RECURSO QUE CELEBRAN POR UNA PARTE MIZRAFIN, SOCIEDAD ANÓNIMA PROMOTORA DE INVERSION DE CAPITAL VARIABLE, SOCIEDAD FINANCIERA DE OBJETO MÚLTIPLE, ENTIDAD NO REGULADA, A QUIEN EN LO SUCESIVO SE DENOMINARÁ “MIZRAFIN”, POR LA OTRA, LA PERSONA FÍSICA O MORAL CUYO NOMBRE, RAZÓN O DENOMINACIÓN SOCIAL APARECE EN LA HOJA DE IDENTIFICACIÓN DEL PRESENTE CONTRATO A QUIEN EN LO SUCESIVO SE LE DENOMINARÁ COMO EL “CLIENTE”, DE CONFORMIDAD CON LAS SIGUIENTES DECLARACIONES Y CLÁUSULAS:', pageBreak: 'before', fontSize: 9, bold: true, alignment: 'justify'},
          {style: 'tabla',
            table: {
            widths: ['*','*','*','*','*'],
                    body: [
                        [{text:'HOJA DE IDENTIFICACIÓN', colSpan: 5, alignment: 'center'}, {}, {}, {}, {}],
              [{text:'DATOS DE MIZRAFIN', colSpan: 5, aligment: 'left', fillColor: '#000000', color: '#FFFFFF'}, {}, {}, {}, {}],
              [{text:`Denominación Social:\n${fin.denominacion_social}`, colSpan: 5, aligment: 'center'}, {}, {}, {}, {}],
              [{text:`DOMICILIO:\n${fin.domicilio}`}, {text:`COLONIA O POBLACION:\n${fin.colonia}`}, {text:`DELEGACION O MUNICIPIO:\n${fin.municipio}`}, {text:`ENTIDAD FEDERATIVA:\n${fin.estado}`}, {text:`C.P.:\n${fin.codigo_postal}`}],
              [{text:`Nombre del representante legal: ${fin.representante_legal}`, colSpan: 5, aligment: 'left'}, {}, {}, {}, {}],
              [{text:'ACTA CONSTITUTIVA:', colSpan: 5, aligment: 'left', bold: true}, {}, {}, {}, {}],
              [{text:`ESCRITURA O PÓLIZA PÚBLICA NÚMERO:\n${fin.escritura} `, aligment: 'left'}, {text:`FECHA DE LA ESCRITURA O PÓLIZA PÚBLICA:\n${fin.fecha_escritura}  `, aligment: 'left'}, {text:`ANTE FE DEL NOTARIO/CORREDOR PÚBLICO:\n${fin.antefe_notario}  `, aligment: 'left'}, {text:`TITULAR DE LA NOTARIA/CORREDURIA No.\n${fin.titular_notaria} `, aligment: 'left', colSpan: 2}, {}],
              [{text:`FOLIO DE INSCRIPCIÓN:\n${fin.folio_inscripcion}  `, aligment: 'left'}, {text:`LUGAR DE INSCRIPCIÓN\n${fin.lugar_inscripcion}  `, aligment: 'left', colSpan: 2}, {}, {text:`FECHA DE INSCRIPCIÓN:\n${fin.fecha_inscripcion} `, aligment: 'left', colSpan: 2}, {}],
                    ]
                }},
          {text: '\n'},
          {style: 'tabla',
            table: {
            widths: ['*','*','*','*','*'],
                    body: [
                        [{text:`DATOS DEL CLIENTE (EN CASO DE SER PERSONA FISICA)`, colSpan: 5, aligment: 'left', bold: true, fillColor: '#000000', color: '#FFFFFF'}, {}, {}, {}, {}],
              [{text:`NOMBRE COMPLETO:\n${client_pf.nombre_completo}`, colSpan: 2, aligment: 'left'}, {}, {text:`DOMICILIO:\n${client_pf.domicilio}`, colSpan: 2, aligment: 'left'}, {}, {text:`COLONIA O POBLACION:\n${client_pf.colonia}`, aligment: 'left'}],
              [{text:`DELEGACIÓN O MUNICIPIO:\n${client_pf.municipio}`, aligment: 'left'}, {text:`ENTIDAD FEDERATIVA:\n${client_pf.entidad_federativa}`, aligment: 'left'}, {text:`C.P.\n${client_pf.codigo_postal}`, aligment: 'left'}, {text:`FECHA DE NACIMIENTO:\n`, aligment: 'left'}, {text:`LUGAR DE NACIMIENTO:`, aligment: 'left'}],
              [{text:`NACIONALIDAD:`, aligment: 'left'}, {text:`OCUPACIÓN O PROFESIÓN:`, aligment: 'left'}, {text:`CURP:${client_pf.curp}`, aligment: 'left', colSpan: 2}, {}, {text:`RFC:\n${client_pf.rfc}`, aligment: 'left'}],
              [{text:`ESTADO CIVIL:\n${client_pf.martial_status}`, aligment: 'left'}, {text:`RÉGIMEN MATRIMONIAL:`, aligment: 'left'}, {text:`ENTIDAD DE CONTRACCIÓN NUPCIAL:`, aligment: 'left', colSpan: 3}, {}, {}],
              [{text:`TIPO DE IDENTIFICACIÓN OFICIAL VIGENTE:\n${client_pf.id_type}`, aligment: 'left'}, {text:`EMITIDA POR:`, aligment: 'left'}, {text:`FOLIO No.:${client_pf.identification}`, aligment: 'left'}, {text:`TELÉFONO:\n${client_pf.phone}`, aligment: 'left'}, {text:`CORREO ELECTRÓNICO:\n${client_pf.email}`, aligment: 'left'}],
              [{text:`REPRESENTANTE LEGAL DEL CLIENTE`, colSpan: 5, aligment: 'left', bold: true}, {}, {}, {}, {}],
              [{text:`NOMBRE COMPLETO:\n${legal_reppf.nombre_completo}`, colSpan: 2, aligment: 'left'}, {}, {text:`DOMICILIO:\n${legal_reppf.domicilio}`, colSpan: 2, aligment: 'left'}, {}, {text:`COLONIA O POBLACION:\n${legal_reppf.colonia}`, aligment: 'left'}],
              [{text:`DELEGACIÓN O MUNICIPIO:\n${legal_reppf.municipio}`, aligment: 'left'}, {text:`ENTIDAD FEDERATIVA:\n${legal_reppf.entidad_federativa}`, aligment: 'left'}, {text:`C.P.\n${legal_reppf.codigo_postal}`, aligment: 'left'}, {text:`FECHA DE NACIMIENTO:`, aligment: 'left'}, {text:`LUGAR DE NACIMIENTO:`, aligment: 'left'}],
              [{text:`NACIONALIDAD:`, aligment: 'left'}, {text:`OCUPACIÓN O PROFESIÓN:`, aligment: 'left'}, {text:`CURP\n${legal_reppf.curp}`, aligment: 'left', colSpan: 2}, {}, {text:`RFC\n${legal_reppf.rfc}`, aligment: 'left'}],
              [{text:`TIPO DE IDENTIFICACIÓN OFICIAL VIGENTE:\n${legal_reppf.id_type}`, aligment: 'left'}, {text:`EMITIDA POR:`, aligment: 'left'}, {text:`FOLIO No.:\n${legal_reppf.identification}`, aligment: 'left'}, {text:`TELÉFONO:${legal_reppf.phone}`, aligment: 'left'}, {text:`CORREO ELECTRÓNICO:\n${legal_reppf.email}`, aligment: 'left'}],
              [{text:`ESCRITURA PÚBLICA NÚMERO:`, aligment: 'left'}, {text:`FECHA DE LA ESCRITURA PÚBLICA:`, aligment: 'left'}, {text:`ANTE FE DEL NOTARIO PÚBLICO:`, aligment: 'left'}, {text:`TITULAR DE LA NOTARIA No.`, aligment: 'left', colSpan: 2}, {}],
                    ]
                }},
          {text: '\n'},
          {style: 'tabla',
            table: {
            widths: ['*','*','*','*','*'],
                    body: [
                        [{text:`DATOS DEL CLIENTE (EN CASO DE SER PERSONA MORAL)`, colSpan: 5, aligment: 'left', bold: true, fillColor: '#000000', color: '#FFFFFF'}, {}, {}, {}, {}],
              [{text:`DENOMINACIÓN SOCIAL:\n${client_pm.denominacion_social}`, colSpan: 5, aligment: 'left', bold: true}, {}, {}, {}, {}],
              [{text:`DOMICILIO:\n${client_pm.domicilio}`, aligment: 'left'}, {text:`COLONIA O POBLACION:${client_pm.colonia}`, aligment: 'left'}, {text:`DELEGACIÓN O MUNICIPIO:\n${client_pm.municipio}`, aligment: 'left'}, {text:`ENTIDAD FEDERATIVA:\n${client_pm.entidad_federativa}`, aligment: 'left'}, {text:`CP:\n${client_pm.codigo_postal}`, aligment: 'left'}],
              [{text:`NACIONALIDAD:`, aligment: 'left'}, {text:`RFC:\n:${client_pm.rfc}`, aligment: 'left'}, {text:`TELÉFONO:\n${client_pm.phone}`, aligment: 'left'}, {text:`CORREO ELECTRÓNICO:\n${client_pm.email}`, aligment: 'left', colSpan: 2}, {}],
              [{text:`ACTA CONSTITUTIVA`, colSpan: 5, aligment: 'left', bold: true}, {}, {}, {}, {}],
              [{text:`ESCRITURA O PÓLIZA PÚBLICA NÚMERO:`, aligment: 'left'}, {text:`FECHA DE LA ESCRITURA O PÓLIZA PÚBLICA:`, aligment: 'left'}, {text:`ANTE FE DEL NOTARIO/CORREDOR PÚBLICO:`, aligment: 'left', colSpan: 3}, {}, {}],
              [{text:`TITULAR DE LA NOTARIA/CORREDURIA No`, aligment: 'left'}, {text:`FOLIO DE INSCRIPCIÓN:`, aligment: 'left'}, {text:`LUGAR DE INSCRIPCIÓN:`, aligment: 'left'}, {text:`FECHA DE INSCRIPCIÓN:`, aligment: 'left', colSpan: 2}, {}],
              [{text:`REPRESENTANTE LEGAL`, colSpan: 5, aligment: 'left', bold: true}, {}, {}, {}, {}],
              [{text:`NOMBRE COMPLETO:\n${legal_reppm.nombre_completo}`, colSpan: 2, aligment: 'left'}, {}, {text:`DOMICILIO:\n${legal_reppm.domicilio}`, colSpan: 2, aligment: 'left'}, {}, {text:`COLONIA O POBLACION:\n${legal_reppm.colonia}`, aligment: 'left'}],
              [{text:`DELEGACIÓN O MUNICIPIO:\n${legal_reppm.municipio}`, aligment: 'left'}, {text:`ENTIDAD FEDERATIVA:\n${legal_reppm.entidad_federativa}`, aligment: 'left'}, {text:`C.P.\n${legal_reppm.codigo_postal}`, aligment: 'left'}, {text:`FECHA DE NACIMIENTO:`, aligment: 'left'}, {text:`LUGAR DE NACIMIENTO:`, aligment: 'left'}],
              [{text:`NACIONALIDAD:`, aligment: 'left'}, {text:`OCUPACIÓN O PROFESIÓN:`, aligment: 'left'}, {text:`CURP\n${legal_reppm.curp}`, aligment: 'left', colSpan: 2}, {}, {text:`RFC\n${legal_reppm.rfc}`, aligment: 'left'}],
              [{text:`TIPO DE IDENTIFICACIÓN OFICIAL VIGENTE:\n${legal_reppm.id_type}`, aligment: 'left'}, {text:`EMITIDA POR:`, aligment: 'left'}, {text:`FOLIO No.:\n${legal_reppm.identification}`, aligment: 'left'}, {text:`TELÉFONO:\n${legal_reppm.phone}`, aligment: 'left'}, {text:`CORREO ELECTRÓNICO:\n${legal_reppm.email}`, aligment: 'left'}],
              [{text:`ESCRITURA PÚBLICA NÚMERO:`, aligment: 'left'}, {text:`FECHA DE LA ESCRITURA PÚBLICA:`, aligment: 'left'}, {text:`ANTE FE DEL NOTARIO PÚBLICO:`, aligment: 'left'}, {text:`TITULAR DE LA NOTARIA No.`, aligment: 'left', colSpan: 2}, {}],
              [{text:`TITULAR DE LA NOTARIA/CORREDURIA No`, aligment: 'left'}, {text:`FOLIO DE INSCRIPCIÓN:`, aligment: 'left'}, {text:`LUGAR DE INSCRIPCIÓN:`, aligment: 'left'}, {text:`FECHA DE INSCRIPCIÓN:`, aligment: 'left', colSpan: 2}, {}],
                    ]
                }},
          {text: '\n'},
          {style: 'tabla',
            table: {
            widths: ['*','*','*','*','*'],
                    body: [
                        [{text:`DATOS DEL GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL (PERSONA MORAL)`, colSpan: 5, aligment: 'left', bold: true, fillColor: '#000000', color: '#FFFFFF'}, {}, {}, {}, {}],
              [{text:`DENOMINACIÓN SOCIAL:`, colSpan: 5, aligment: 'left', bold: true}, {}, {}, {}, {}],
              [{text:`DOMICILIO:`, aligment: 'left'}, {text:`COLONIA O POBLACION:`, aligment: 'left'}, {text:`DELEGACIÓN O MUNICIPIO:`, aligment: 'left'}, {text:`ENTIDAD FEDERATIVA:`, aligment: 'left'}, {text:`CP:`, aligment: 'left'}],
              [{text:`NACIONALIDAD:`, aligment: 'left'}, {text:`RFC:`, aligment: 'left'}, {text:`TELÉFONO:`, aligment: 'left'}, {text:`CORREO ELECTRÓNICO:`, aligment: 'left', colSpan: 2}, {}],
              [{text:`ACTA CONSTITUTIVA`, colSpan: 5, aligment: 'left', bold: true}, {}, {}, {}, {}],
              [{text:`ESCRITURA O PÓLIZA PÚBLICA NÚMERO:`, aligment: 'left'}, {text:`FECHA DE LA ESCRITURA O PÓLIZA PÚBLICA:`, aligment: 'left'}, {text:`ANTE FE DEL NOTARIO/CORREDOR PÚBLICO:`, aligment: 'left', colSpan: 3}, {}, {}],
              [{text:`TITULAR DE LA NOTARIA/CORREDURIA No`, aligment: 'left'}, {text:`FOLIO DE INSCRIPCIÓN:`, aligment: 'left'}, {text:`LUGAR DE INSCRIPCIÓN:`, aligment: 'left'}, {text:`FECHA DE INSCRIPCIÓN:`, aligment: 'left', colSpan: 2}, {}],
              [{text:`REPRESENTANTE LEGAL`, colSpan: 5, aligment: 'left', bold: true}, {}, {}, {}, {}],
              [{text:`NOMBRE COMPLETO:`, colSpan: 2, aligment: 'left'}, {}, {text:`DOMICILIO:`, colSpan: 2, aligment: 'left'}, {}, {text:`COLONIA O POBLACION:`, aligment: 'left'}],
              [{text:`DELEGACIÓN O MUNICIPIO:`, aligment: 'left'}, {text:`ENTIDAD FEDERATIVA:`, aligment: 'left'}, {text:`C.P.`, aligment: 'left'}, {text:`FECHA DE NACIMIENTO:`, aligment: 'left'}, {text:`LUGAR DE NACIMIENTO:`, aligment: 'left'}],
              [{text:`NACIONALIDAD:`, aligment: 'left'}, {text:`OCUPACIÓN O PROFESIÓN:`, aligment: 'left'}, {text:`CURP`, aligment: 'left', colSpan: 2}, {}, {text:`RFC`, aligment: 'left'}],
              [{text:`TIPO DE IDENTIFICACIÓN OFICIAL VIGENTE:`, aligment: 'left'}, {text:`EMITIDA POR:`, aligment: 'left'}, {text:`FOLIO No.:`, aligment: 'left'}, {text:`TELÉFONO:`, aligment: 'left'}, {text:`CORREO ELECTRÓNICO:`, aligment: 'left'}],
              [{text:`ESCRITURA PÚBLICA NÚMERO:`, aligment: 'left'}, {text:`FECHA DE LA ESCRITURA PÚBLICA:`, aligment: 'left'}, {text:`ANTE FE DEL NOTARIO PÚBLICO:`, aligment: 'left'}, {text:`TITULAR DE LA NOTARIA No.`, aligment: 'left', colSpan: 2}, {}],
              [{text:`TITULAR DE LA NOTARIA/CORREDURIA No`, aligment: 'left'}, {text:`FOLIO DE INSCRIPCIÓN:`, aligment: 'left'}, {text:`LUGAR DE INSCRIPCIÓN:`, aligment: 'left'}, {text:`FECHA DE INSCRIPCIÓN:`, aligment: 'left', colSpan: 2}, {}],
                    ]
                }},
          {style: 'tabla',
            table: {
            widths: ['*','*','*','*','*'],
                    body: [
              
              [{text:`DATOS DEL GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL (PERSONA FISICA)`, colSpan: 5, aligment: 'left', bold: true, fillColor: '#000000', color: '#FFFFFF'}, {}, {}, {}, {}],
              [{text:`NOMBRE COMPLETO:\n${garantepf.nombre_completo}`, colSpan: 2, aligment: 'left'}, {}, {text:`DOMICILIO:\n${garantepf.domicilio}`, colSpan: 2, aligment: 'left'}, {}, {text:`COLONIA O POBLACION:\n${garantepf.colonia}`, aligment: 'left'}],
              [{text:`DELEGACIÓN O MUNICIPIO:\n${garantepf.municipio}`, aligment: 'left'}, {text:`ENTIDAD FEDERATIVA:\n${garantepf.entidad_federativa}`, aligment: 'left'}, {text:`C.P.\n${garantepf.codigo_postal}`, aligment: 'left'}, {text:`FECHA DE NACIMIENTO:`, aligment: 'left'}, {text:`LUGAR DE NACIMIENTO:`, aligment: 'left'}],
              [{text:`NACIONALIDAD:`, aligment: 'left'}, {text:`OCUPACIÓN O PROFESIÓN:`, aligment: 'left'}, {text:`CURP\n${garantepf.curp}`, aligment: 'left', colSpan: 2}, {}, {text:`RFC\n${garantepf.rfc}`, aligment: 'left'}],
              [{text:`ESTADO CIVIL:\n${garantepf.martial_status}`, aligment: 'left'}, {text:`RÉGIMEN MATRIMONIAL:`, aligment: 'left'}, {text:`ENTIDAD DE CONTRACCIÓN NUPCIAL:`, aligment: 'left', colSpan: 3}, {}, {}],
              [{text:`TIPO DE IDENTIFICACIÓN OFICIAL VIGENTE:\n${garantepf.id_type}`, aligment: 'left'}, {text:`EMITIDA POR:`, aligment: 'left'}, {text:`FOLIO No.:\n${garantepf.identification}`, aligment: 'left'}, {text:`TELÉFONO:\n${garantepf.phone}`, aligment: 'left'}, {text:`CORREO ELECTRÓNICO:\n${garantepf.email}`, aligment: 'left'}],
              [{text:`SECCIÓN DE FIRMAS`, colSpan: 5, aligment: 'center', bold: true, fillColor: '#000000', color: '#FFFFFF'}, {}, {}, {}, {}],
              [{
                style: 'tabla',
                
                table: {
                  widths: ['*','*'],
                  body: [
                    [{text: '\n'}, {}],
                    [{text: '\n'}, {}],
                    [{text: ` “MIZRAFIN”\n_________________________________\nMIZRAFIN, SAPI DE C.V., SOFOM ENR\nChemaya Mizrahi Fernández`, alignment: 'center'}, {text: ` “EL CLIENTE”\n_________________________________\n(Nombre y Firma)`, alignment: 'center'}],
                    [{text: '\n'}, {}],
                    [{text: '\n'}, {}],
                    [{text: '\n'}, {}],
                    [{text: ` ““OBLIGADOS SOLIDARIOS Y AVALISTAS””\n_________________________________\nMIZRAFIN, SAPI DE C.V., SOFOM ENR\nChemaya Mizrahi Fernández`,alignment: 'center', colSpan: 2}, {} ],
                  ]
                },
                layout: 'noBorders'
                , colSpan: 5},{},{},{},{}]
              
                    ]
                }},
          {text: `D E C L A R A C I O N E S`, bold: true, alignment: 'center', pageBreak: 'before'},
          {text: '\n'},
          {text: 'I.- Declara el CLIENTE que: ', bold: true, aligment: 'left', fontSize: 8},
          {text: '\n'},
          {text: `a) EN CASO DE SER PERSONA MORAL, es una sociedad legalmente constituida de conformidad con la legislación mexicana e inscrita en el Registro Público correspondiente, así como que su(s) representante(s) se encuentra(n) debidamente facultado(s) para celebrar el presente Contrato, acreditando todo ello con los documentos que se detallan en la hoja de identificación del presente contrato y cuyo contenido para efectos del presente Contrato se considera reproducido como si a la letra se insertase. El (Los) representante(s) manifiesta(n) bajo protesta de decir verdad que las facultades con las que comparece(n) a la firma del presente Contrato no le(s) han sido revocadas, ni limitadas, ni modificadas en forma alguna. `, alignment: 'justify', fontSize: 8},
          {text: '\n'},
          {text: `EN CASO DE SER PERSONA FÍSICA, es su voluntad celebrar el presente Contrato, que cuenta con la capacidad jurídica necesaria para ello, así como que su nacionalidad, régimen matrimonial y actividad empresarial, en su caso, corresponden a lo señalado en la hoja de identificación del presente Contrato. De comparecer por conducto de representante(s), éste(estos) manifiesta(n) bajo protesta de decir verdad que las facultades con las que cuenta(n) no le(s) ha(n) sido revocadas o modificadas en forma alguna.  `, alignment: 'justify', fontSize: 8},
          {text: '\n'},
          {text: `b) Con motivo de las operaciones que realiza en cumplimiento de su objeto social, se originan constantemente a su favor Derechos de Crédito a cargo de sus clientes y que a efecto de contar en el corto plazo con el importe de dichos Derechos de Crédito y no esperar necesariamente hasta la fecha de su vencimiento para hacerlos efectivos, desea convenir con MIZRAFIN la transmisión de dichos Derechos de Crédito, así como los términos y condiciones conforme a los cuales se efectuará su adquisición. `, alignment: 'justify', fontSize: 8},
          {text: '\n'},
          {text: `c) Los recursos objeto de este contrato, proceden de las actividades propias del objeto social de su representada, por ende son lícitas; Además su representada ha establecido medidas y procedimientos para prevenir y detectar actos, omisiones u operaciones que pudieran favorecer, prestar ayuda, auxilio o cooperación de cualquier especie para la comisión de los delitos previstos en el Código Penal Federal.  `, alignment: 'justify', fontSize: 8},
          {text: '\n'},
          {text: `d) Es proveedor de bienes o servicios de Empresas Emisoras (como dicho término se define más adelante).   `, alignment: 'justify', fontSize: 8},
          {text: '\n'},
          {text: `e) El Cliente conoce que el presente financiamiento podrá ser fondeado con recursos provenientes de la misma institución financiera y/o de cualquier institución financiera del país o del extranjero, Banca de Desarrollo, Banca Comercial o cualquier otra fuente de fondeo con Nacional Financiera, la acreditada declara conocer que el crédito se otorga con el apoyo de Nacional Financiera, exclusivamente para fines de desarrollo nacional.  `, alignment: 'justify', fontSize: 8},
          {text: '\n'},
          {text: '\n'},
          {text: `II. Declara MIZRAFIN, por conducto de su(s) representante(s) legal(es) que: `, alignment: 'justify', fontSize: 8},
          {text: '\n'},
          {text: `a) Es una sociedad mercantil legalmente constituida de conformidad con la legislación mexicana. `, alignment: 'justify', fontSize: 8},
          {text: '\n'},
          {text: `b) No requiere de autorización por parte de la Secretaría de Hacienda y Crédito Público para su constitución y operación como Sociedad Financiera de Objeto Múltiple. `, alignment: 'justify', fontSize: 8},
          {text: '\n'},
          {text: `c) Para la realización de operaciones de factoraje financiero no está sujeta a la supervisión y vigilancia de la Comisión Nacional Bancaria y de Valores. `, alignment: 'justify', fontSize: 8},
          {text: '\n'},
          {text: `d) Sus representantes cuentan con las facultades necesarias para celebrar el presente Contrato, las cuales no les han sido revocadas ni modificadas en forma alguna. `, alignment: 'justify', fontSize: 8},
          {text: '\n'},
          {text: `e) Está dispuesto a adquirir los Derechos de Crédito derivados de los Documentos a los cuales se ha hecho referencia en la Declaración I, inciso d, del CLIENTE para lo cual desea establecer las bases que regirán dichas operaciones. `, alignment: 'justify', fontSize: 8},
          {text: '\n'},
          {text: `f) El presente contrato se encuentra inscrito en el Registro de Contratos de Adhesión perteneciente a la CONDUSEF, con el número 2847-425-033751/01-03751-1120, con fecha 03 de noviembre 2020.`, alignment: 'justify', fontSize: 8},
          {text: '\n'},
          {text: `g) Los recursos objeto de este contrato, proceden de las actividades propias del objeto social de su representada, por ende, son lícitas; Además su representada ha establecido medidas y procedimientos para prevenir y detectar actos, omisiones u operaciones que pudieran favorecer, prestar ayuda, auxilio o cooperación de cualquier especie para la comisión de los delitos previstos en el Código Penal Federal.`, alignment: 'justify', fontSize: 8},
          {text: '\n'},
          {text: `En virtud de las Declaraciones anteriores, las partes celebran el presente Contrato que se contiene en las siguientes: `, alignment: 'justify', fontSize: 8},
          {text: '\n'},
          {text: '\n'},
          {text: 'C L A U S U L A S', bold: true, alignment: 'center'},
          {text: '\n'},
          {text: [{text: `PRIMERA`,bold:true, decoration:'underline' },{text:`. - DEFINICIONES.`,bold:true}, `Las definiciones utilizadas en el presente Contrato, identificadas con mayúscula inicial tendrán el significado que a continuación se señala, que serán igualmente aplicables ya sea en singular o plural: 
          “Aforo”.- Es la cantidad o porcentaje que el CLIENTE acepta que se deduzca del Valor Nominal de los Derechos de Crédito, que queda en poder de MIZRAFIN para cubrir en forma total cualquier diferencia cuyo monto se encuentre pendiente de pago a favor de MIZRAFIN y que será reembolsado al CLIENTE una vez que MIZRAFIN efectivamente cobre los Derechos de Crédito adquiridos, previa aplicación de las diferencias a cargo del CLIENTE. Los saldos que existan a favor del CLIENTE no causarán intereses a cargo de MIZRAFIN. `,
          {text: '\n'},
          {text:`“Carátula”`, bold:true},`. - Documento que contiene las características particulares del presente contrato y que forma parte del mismo.\n`,
          {text: '\n'},
          {text:`Cargas Financieras`, bold:true},`. - Los honorarios, intereses y comisiones que MIZRAFIN cobra al CLIENTE con motivo de la celebración de operaciones de Factoraje Financiero.\n`, 
          {text: '\n'},
          {text:`CAT`, bold:true},`. - Entiéndase por El Costo Anual Total de financiamiento expresado en términos porcentuales anuales que, para fines informativos y de comparación, incorpora la totalidad de los costos y gastos inherentes a los créditos"\n`,
          {text: '\n'},
          {text:`“Cobranza Directa”`,bold:true},`. - Los actos y gestiones que realice MIZRAFIN en nombre propio o a través de tercero facultado para la administración y cobranza de los Derechos de Crédito que el propio MIZRAFIN haya adquirido.\n`,
          {text: '\n'},
          {text:`“Contrato de Cesión de Derechos”`, bold:true},`. - Es el acuerdo de voluntades, celebrado entre MIZRAFIN y el CLIENTE mediante el cual las partes formalizan cada transmisión de Derechos de Crédito de acuerdo a un formato sustancialmente similar al Anexo “A”.\n`, 
          {text: '\n'},
          {text:`“Derecho de Crédito”`,bold:true},`. - Son las cantidades que tiene el CLIENTE para exigir la cantidad de dinero de una Empresa Emisora, como resultado de la proveeduría de bienes, de servicios o de ambos, proporcionados a la Empresa Emisora por el propio CLIENTE, evidenciados en Documentos que podrán estar denominados en moneda nacional.\n`, 
          {text: '\n'},
          {text:`“Derechos de Crédito Adquiridos”`,bold:true},`. - Son aquellos Derechos de Crédito transmitidos por el CLIENTE a MIZRAFIN, mediante las operaciones que al amparo de este Contrato se celebran.\n`, 
          {text: '\n'},
          {text:`“Descuento”`,bold:true},`. - Es la cantidad que resulte de aplicar la siguiente fórmula, al momento de efectuar las operaciones:\n\n`], alignment: 'justify', fontSize: 8},
          {
            image: `data:image/png;base64,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`,
            width: 120,
            height: 40,
            alignment: 'center'
          },
          {text: 'Donde:', fontSize: 8},
          {text: `             “D” significa Descuento 
                    “P” significa Precio Base 
                    “C” significa comisión
                    “TD” significa La Tasa de Descuento expresada en por ciento anual 
                    “ND” significa El número de días que resulten entre los días naturales desde e inclusive la fecha que se entregue al CLIENTE el Precio Base,          respecto de un Derecho de Crédito Adquirido, hasta e inclusive la fecha de vencimiento de dicho Derecho de Crédito.
          `,italics:true, fontSize: 8},
          {text:[
          {text: '\n'},
          {text:`“Detrimento de los derechos de crédito”`,bold:true},` significa la disminución o pérdida del valor de los derechos de crédito transmitidos a MIZRAFIN al amparo de este contrato y corresponderá al monto que resulte de la diferencia entre lo que el MIZRAFIN pague a el CLIENTE por las operaciones efectuadas al amparo de este contrato, contra las cantidades que el La Empresa Emisora del o los del Documentos transmitidos bajo este contrato, pague a Mizrafin, en la inteligencia de que la pérdida del valor del o los documento transmitidos a MIZRAFIN, se considera que derivan y son consecuencia del Contrato que dio origen a los derechos de crédito CLIENTEs. Se considerará que se dio un detrimento cuando se dé, entre otros, alguno de los siguientes eventos o similares: por el descuento por falta de entrega del producto, la aplicación de penas, castigos, sanciones, retenciones, compensaciones, reclamos, descuentos o rescisiones que La Empresa Emisora aplique a el CLIENTE en términos pactadas en el del Contrato Principal o deriven o se apliquen por virtud de disposición de la ley o normativa aplicable.\n`,
          {text: '\n'},
          {text:`“Día Hábil”`,bold:true},`. - Significa cualquier día, salvo sábados y domingos, en que las instituciones de crédito en los Estados Unidos Mexicanos estén abiertas al público para la realización de operaciones bancarias.\n`,
          {text: '\n'},
          {text:`“Documentos”`,bold:true},`. - Son títulos de crédito, facturas, contra-recibos, u otros documentos que se encuentren vigentes, no vencidos, denominados en moneda nacional o extranjera en los que se consignen las relaciones jurídicas derivadas de la proveeduría de bienes y/o servicios, por virtud de los cuales el CLIENTE es acreedor de uno o más Derechos de Crédito.\n`,
          {text: '\n'},
          {text:`“Empresa Emisora”`,bold:true},`. - Es (Son) la(s) persona(s) física(s) o moral(es) que emiten Documentos que contienen Derechos de Crédito a favor del CLIENTE.\n`,
          {text: '\n'},
          {text:`“Existencia y legitimidad de los derechos de crédito”`,bold:true},` son aquellos derechos de crédito que tiene el CLIENTE a su favor derivados de contratos o pedidos y se adeudan por servicios, bienes o trabajos contemplados en tales documentos, son válidos y derivan de servicios reconocidos, efectivamente prestados o corresponden a bienes entregados u obra ejecutada en los términos del contrato respectivo y por tanto, procede su pago.\n`,
          {text: '\n'},
          {text:`“Factoraje Financiero”`,bold:true},`. - Es aquella actividad en la que mediante Contrato que celebre MIZRAFIN con sus clientes, personas morales o personas físicas que realicen actividades empresariales, la primera adquiere de los segundos derechos de crédito relacionados con la proveeduría de bienes o servicios de ambos.\n`, 
          {text: '\n'},
          {text:`“Factoraje sin Recurso”`,bold:true},`. - Es la modalidad del Contrato de Factoraje Financiero, en la que el CLIENTE no queda obligado solidariamente con MIZRAFIN a responder del pago puntual y oportuno de los Derechos de Crédito, transmitidos a MIZRAFIN.\n`, 
          {text: '\n'},
          {text:`“Ley”`,bold:true},`. - Significa la Ley General de Títulos y Operaciones de Crédito.\n`,
          {text: '\n'},
          {text:`“Peso o Moneda Nacional”`,bold:true},`. - Es la moneda de curso legal en los Estados Unidos Mexicanos.\n`,
          {text: '\n'},
          {text:`“Precio”`,bold:true},`. - Significa el Valor Nominal del Derecho de Crédito Adquirido menos el Descuento.\n`,
          {text: '\n'},
          {text:`“Precio Base”`,bold:true},`. - Significa la cantidad que resulte de restar el Aforo al Valor Nominal del Derecho de Crédito Adquirido.\n`,
          {text: '\n'},
          {text:`“Precio de Factoraje”`,bold:true},`. - Significa el Precio Base menos el Descuento de intereses y comisiones o tratándose de dos o más pagos parciales, la suma de los Descuentos.\n`,
          {text: '\n'}, 
          {text:`“Tasa de Descuento”`,bold:true},`. - Es aquella que convengan MIZRAFIN y el CLIENTE para determinar el Descuento, la cual será fijada en la fecha de celebración, de cada una de las operaciones de Factoraje Financiero que se realicen al amparo de este Contrato.\n`, 
          {text: '\n'},
          {text:`“Valor Nominal”`,bold:true},`. - El importe principal por el cual fue emitido el Derecho de Crédito respectivo, al momento de celebración de cada una de las operaciones que se realicen al amparo de este Contrato.\n`, 
          {text: '\n'},
          {text:`SEGUNDA`,bold:true, decoration:'underline'},{text:`. - OBJETO.`,bold:true},` En virtud del presente el CLIENTE está de acuerdo en transmitir a MIZRAFIN, mediante la celebración de operaciones de Factoraje Financiero sin Recurso, y este último en adquirir Derechos de Crédito derivados de Documentos a cargo de la(s) Empresa(s) Emisora(s) y a favor del CLIENTE.\n`, 
          {text: '\n'},
          {text:`TERCERA`,bold:true, decoration:'underline'},{text:`. - DESTINO Y APLICACIÓN DEL CRÉDITO`,bold:true},`. - 	"EL CLIENTE”, se obliga a destinar el Monto del Crédito a la actividad descrita en el punto número 2) de la Carátula de este contrato.\n`,
          {text: '\n'},
          {text:`"EL CLIENTE"`},` se compromete y obliga a otorgar a “MIZRAFIN”, las facilidades necesarias para que verifique la exacta aplicación del Monto del Crédito, incluyendo, sin limitación, la facultad de realizar visitas de inspección, ya sea de escritorio o de campo, a las instalaciones, oficinas o propiedades de "EL CLIENTE” y de sus subsidiarias o afiliadas, así como para revisar su contabilidad y demás registros comerciales, financieros u operativos, para lo cual “EL CLIENTE” dará las facilidades necesarias.\n`,
          {text: '\n'},
          {text:`CUARTA`,bold:true, decoration:'underline'},{text:`. -  FONDEO.`,bold:true},` Cuando alguna disposición sujeta al presente contrato sea fondeada con recursos provenientes de cualquier institución financiera del país o del extranjero, Banca de Desarrollo, Banca Comercial o cualquier otra fuente de fondeo con Nacional Financiera y/o Financiera Nacional, “EL CLIENTE” deberá proporcionar toda la información que estos le requieran, respecto de los créditos descontados; así mismo otorgar todas la facilidades al personal de dichas entidades o a quien estas designen, para la supervisión y evaluación de sus actividades, registros y documentos relacionados con los créditos descontados conforme al programa de inversiones contratado.
          Cuando una parte o la totalidad de la línea de crédito que ampara el presente contrato sea Fondeada con recursos del Banco Mundial, “MIZRAFIN” deberá informar a “EL CLIENTE” haciendo entrega de la Guía Anticorrupción que será proporcionada por la Institución correspondiente, obteniendo de “EL CLIENTE”:\n
            a.	Declaración donde manifieste que recibió la Guía señalada en el párrafo anterior, y que está de acuerdo con su cumplimiento;
            b.	Compromiso de seguir prácticas comerciales lícitas para la adquisición de los bienes y/o servicios para los que contrato el crédito.\n`,
          {text: '\n'},
          {text:`QUINTA`, bold:true, decoration:'underline'},{text:`. - OPERACIONES A TRAVÉS DE LA CELEBRACIÓN DE CONTRATOS DE CESION DE DERECHOS`,bold:true},`. Las operaciones concretas e individuales que celebren las partes respecto de los Derechos de Crédito durante la vigencia del presente Contrato se documentarán mediante la suscripción de un Contrato de Cesión de Derechos para la transmisión de éstos, al que le serán aplicables, salvo por lo expresamente establecido en cada uno de ellos, los términos y estipulaciones del presente Contrato. 
          
          Las partes están de acuerdo en que el valor de la(s) transmisión(es) por virtud del presente Contrato se realice(n) será(n) hasta por la cantidad establecida como “Monto de la Línea” en la Carátula del presente Contrato, para que con carácter de revolvente se efectúen durante la vigencia del presente Contrato, un número indefinido de operaciones concretas e individuales. 
          
          En caso de que las operaciones sobrepasen el Monto de la Línea, el CLIENTE continuará obligado por el exceso conforme al presente Contrato. 
          
          El CLIENTE deberá notificar a MIZRAFIN con por lo menos 2 (dos) días hábiles de anticipación a la fecha en que se deseé celebrar cada Contrato de Cesión de Derechos, en dicha notificación el CLIENTE deberá proporcionar, respecto de los Derechos de Crédito que deseé transmitir, la siguiente información: 
          
          a) Valor nominal, fecha de vencimiento y lugar de pago; 
          b) Denominación o razón social de las Empresas Emisoras; 
          c) Los datos relativos a la forma en que se encuentren documentados, así como cualquier otra información que MIZRAFIN le requiera, de conformidad con lo previsto en el presente Contrato. 
          
          Los Derechos de Crédito sobre los cuales se efectuará la adquisición deberán reunir, por lo menos, los siguientes requisitos:
           
          1. No encontrarse vencidos, y que su fecha de vencimiento no sea superior a 180 días, salvo que MIZRAFIN acepte por escrito plazos mayores, dependiendo de la naturaleza de éstos. 
          
          2. Estar documentados en facturas, contra-recibos, títulos de crédito o cualquier otro documento que acredite a satisfacción de MIZRAFIN la existencia del Derecho de Crédito. 
          
          3. Originarse como resultado de la proveeduría de bienes y/o servicios, proporcionados por el CLIENTE, en el desarrollo normal de sus operaciones. 
          
          MIZRAFIN se reserva el derecho de adquirir los Derechos de Crédito que proponga el CLIENTE para la realización de operaciones de Factoraje Financiero, así como de aceptar la inclusión de nuevas Empresas Emisoras.\n`,
          {text: '\n'},
          {text:`SEXTA`, bold:true, decoration:'underline'},{text:`. - PRECIO DEL FACTORAJE.`,bold:true},` Las partes están de acuerdo en que el Precio de la operación de Factoraje Financiero sin Recurso será el obtenido de acuerdo a la aplicación de las fórmulas establecidas para tal efecto en el presente instrumento y cuya Tasa de Descuento se calculará en base a lo siguiente:\n`,
          {text: '\n'},
          {text:`TASA DE DESCUENTO`, bold:true},`, QUE SERÁ UNA TASA FIJA, la cual está establecida en la caratula perteneciente del contrato, dicha tasa se multiplicará por el monto de la operación real después de aforos, por el número de días que transcurran entre la fecha en que se lleve a cabo el descuento del DERECHO DE CRÉDITO y la fecha de vencimiento del mismo, entre 360 (Trescientos sesenta días), base anual financiera. El cálculo de descuento al factoraje se realiza de la manera siguiente: (IMPORTE REAL PARA FACTORAJE * TASA DE DESCUENTO ANUAL * DIAS DE PLAZO / BASE ANUAL DE DIAS 360).\n`,
          {text: '\n'},
          {text:`COMISIONES.`,bold:true},` Se realizará un cobro de comisión por cada operación. 
          La comisión se cobra utilizando como metodología de cálculo la cantidad resultante de multiplicar un porcentaje fijo (mismo que se señala en la caratula del presente contrato) por el monto total de cada uno de los DERECHOS DE CRÉDITO objeto de descuento, resultando de ello el cobro de la cantidad resultante, más el correspondiente Impuesto al Valor Agregado (IVA). Dicha comisión se cubrirá al momento de entregar a “MIZRAFIN” los DERECHOS DE CRÉDITO para su descuento, y su periodicidad es por operación (se cobran la comisión por cada operación). La comisión se cobrará sobre el monto total de la operación de factoraje efectivamente realizada (no sobre montos aforados). El cobro es independiente al plazo de vencimiento, y sólo es un porcentaje del valor de la suma de la cesión de derechos descontada en la operación. No podrá haber comisiones duplicadas bajo ninguna circunstancia, tampoco en reestructuras de crédito.\n`,
          {text: '\n'},
          {text:`SÉPTIMA`,bold:true, decoration:'underline'},{text:`. - TRANSMISIÓN.`,bold:true},` Ambas partes acuerdan que, en cada transmisión de los Derechos de Crédito, MIZRAFIN determinará conforme a las bases establecidas, el diferencial sobre la tasa base que se aplicará a cada operación concreta, lo cual el CLIENTE acepta expresamente.
     
          MIZRAFIN y el CLIENTE determinarán la Tasa de Descuento correspondiente a la operación respectiva, en el Contrato de Cesión de Derechos, en términos sustancialmente similares al Anexo “A” que suscriban.\n`,
          {text: '\n'},
          {text:`OCTAVA`,bold:true, decoration:'underline'},{text: `. - PAGO.`,bold:true},` El pago del Precio que como contraprestación de la transmisión de los Derechos de Crédito en las operaciones realizadas al amparo del presente Contrato, se realizará por MIZRAFIN al CLIENTE: (i) mediante depósito a la cuenta de cheques que indique el CLIENTE, o (ii) a través de transferencias electrónicas a otras cuentas del Cliente en otras instituciones de crédito distintas a MIZRAFIN, previo acuerdo con MIZRAFIN cuando menos con 2 (dos) días hábiles de anticipación, a que se verifique el pago respectivo; o (iii) a través de la expedición y entrega de cheque nominativo a favor del CLIENTE.\n`,
          {text: '\n'},
          {text:`NOVENA`,bold:true,decoration:'underline'},{text:`. - NOTIFICACIÓN.`,bold:true},` La transmisión de los Derechos de Crédito deberá ser notificada a la Empresa Emisora por MIZRAFIN, en cualquiera de las formas siguientes: 
    
          I. Comunicaciones en las que se exprese e identifiquen los documentos comprobatorios del Derecho de Crédito Adquirido en los que conste el sello o leyenda relativa a la transmisión que se indican en la cláusula Octava, con la mención de que la Empresa Emisora deberá liquidar el importe de los créditos a MIZRAFIN y que de no hacerlo así, no se liberará la Empresa Emisora de sus obligaciones de pago derivadas del crédito transmitido, debiendo tener la constancia del acuse de recibo por la Empresa Emisora mediante contraseña, acuse de recibo o cualquier otro signo inequívoco de recepción. 
    
          II. Comunicaciones con el texto referido, enviadas por correo certificado con acuse de recibo, télex o telefacsimil contraseñalados o cualquier otro medio donde se tenga evidencia de su recepción por parte de la Empresa Emisora. 
        
          III. Comunicaciones con el texto referido, notificadas a la Empresa Emisora por fedatario público. 
    
          IV. Mensaje de datos, en los términos del Título Segundo del Libro Segundo del Código de Comercio. 
    
          La notificación deberá ser hecha en el domicilio de la Empresa Emisora previsto en los Documentos y/o en la Carátula del presente Contrato y se tendrá por válida si se hace al representante legal o a cualquiera de sus dependientes o empleados. Asimismo, toda notificación personal, realizada con quien deba entenderse, será válida aun cuando no se efectúe en el domicilio respectivo. 
    
          MIZRAFIN podrá, asimismo, notificar a las Empresas Emisoras dicha transmisión, en cualquier momento y conforme convenga a sus intereses.\n`,
          {text: '\n'},
          {text:`DÉCIMA`,bold:true, decoration:'underline'},{text:`. - COBRANZA DIRECTA.`,bold:true},` Según se haya indicado en la Carátula de cada uno de los Contratos de Cesión de Derechos, si se marcó la opción de “Cobranza Directa”, y a solicitud de MIZRAFIN serán aplicables las siguientes disposiciones: 
    
          Como ha quedado establecido en la cláusula Tercera, el CLIENTE podrá transmitir a MIZRAFIN y este último adquirirá Derechos de Crédito derivados de Documentos que consten en títulos de crédito, facturas, contra-recibos u otros documentos a cargo de la Empresa Emisora, a través de la firma de un Contrato de Cesión de Derechos cuyo formato se acompaña al presente Contrato como Anexo “A”. Al Contrato de Cesión de Derechos, se deberán agregar los Documentos objeto de transmisión. 
    
          i) En caso de que el documento respectivo sea un título de crédito, se deberá agregar al título respectivo la siguiente leyenda de endoso:\n\n`,
          
          {text: `              Endoso en propiedad a MIZRAFIN SAPI DE CV SOFOM ENR\n              Razón social o denominación del CLIENTE endosante.\n              ______________________________\n              Nombre y Firma del Apoderado que endosa\n              APODERADO 
          `, italics:true, preserveLeadingSpaces: true},`
          ii) Si los Derechos de Crédito se documentan mediante facturas o contra-recibos u otros documentos, tales documentos, deberán ostentar la leyenda siguiente:\n\n`,
          {text: `              Los derechos de crédito que amparan este documento han sido transmitidos en propiedad a MIZRAFIN SAPI DE CV SOFOM ENR por lo que el deudor del mismo deberá pagar el importe de este crédito a dicha institución, en su domicilio ubicado en Av Circuito de la Industria Oriente 36 y 38, Lerma, Lerma de Villada, CP: 52000 o a la persona que éste designe para tal fin. Si el deudor realiza el pago a persona distinta de MIZRAFIN no quedará liberado de su obligación de pago”. \n\n              Razón Social o Denominación del CLIENTE \n\n              ______________________________\n              Nombre y Firma del Apoderado\n              APODERADO`, italics:true, preserveLeadingSpaces: true},`\n\n
          MIZRAFIN podrá modificar en cualquier momento la redacción y contenido de los referidos textos, dando aviso al CLIENTE con una anticipación de 5 (cinco) días hábiles a la fecha en que se realice el cambio. 
    
          La entrega de los Documentos a que se refieren los numerales (i) y (ii) anteriores la podrá realizar al CLIENTE en las oficinas de MIZRAFIN indicadas en la Carátula del presente Contrato, en un horario de 9:00 a 13:00 horas, en Días Hábiles.\n\n`,
    
          {text:`DÉCIMA PRIMERA`,bold:true, decoration:'underline'},{text:`. - PROHIBICIÓN AL CLIENTE.`,bold:true},` En la ejecución de los servicios que el CLIENTE preste a MIZRAFIN, le queda expresamente prohibido realizar cualquier acto o gestión tendiente a aceptar de las Empresas Emisoras pagos parciales, transigir en el pago de los Derechos de Crédito Adquiridos, iniciar por su propio derecho, o por cuenta de MIZRAFIN cualquier proceso judicial para su cobro, comprometer en árbitros cualquier diferencia en el pago de los mismos, y en general, el CLIENTE no podrá sin autorización expresa por escrito de MIZRAFIN, efectuar negociación alguna con las Empresas Emisoras, que de algún modo originen o puedan originar, el menoscabo de los Derechos de Crédito Adquiridos. 
    
          En caso de que el CLIENTE realice gestiones de administración y cobranza de los Derechos de Crédito Adquiridos sin previas instrucciones, lineamientos e indicaciones proporcionadas por MIZRAFIN, éste podrá, a su elección, ratificar dichas gestiones o bien, dejar que los efectos de éstas queden a cargo del CLIENTE, exigiendo, en cualquier caso, el pago de daños y perjuicios.\n\n`,
    
          {text:`DÉCIMA SEGUNDA`,bold:true, decoration:'underline'},{text:`. - FACTORAJE SIN RECURSO.`,bold:true},` Las partes están de acuerdo en que todas y cada una de las operaciones de factoraje celebradas al amparo del presente Contrato se celebran bajo la modalidad de la fracción I del artículo 419 de la Ley, por lo que el CLIENTE no queda obligado a responder por y a efectuar el pago total, puntual y oportuno de los Derechos de Cobro Adquiridos.\n\n`,
    
          {text:`DÉCIMA TERCERA`,bold:true, decoration:'underline'},{text:`. - CARACTERÍSTICAS DE LOS CONTRATOS DE CESION DE DERECHOS.`,bold:true},` En los Contratos de Cesión de Derechos que se celebren conforme al presente Contrato, se deberá especificar lo siguiente: 
    
          1. Que la transmisión de los Derechos de Crédito se celebra sin reserva ni limitación alguna y comprende todos los derechos accesorios a dichos Derechos de Crédito, incluyendo, sin limitar, el derecho de cobro de los intereses que en su caso hubiesen sido pactados y las garantías otorgadas en relación con los mismos, de conformidad con la Ley. 
    
          2. Que el CLIENTE garantiza a MIZRAFIN la existencia y legitimidad de los Derechos de Crédito en términos del artículo 422 de la Ley. 
    
          3. El Valor Nominal de cada uno de los Derechos de Crédito Adquiridos. 
    
          4. El Aforo que será retenido por MIZRAFIN a fin de garantizar las obligaciones contraídas por el CLIENTE, en virtud del presente Contrato, mismo que se determinará en cada caso al momento de celebrar la operación respectiva. Al importe que resulte de aplicar dicho porcentaje se denominará Aforo. 
          
          5. La Tasa de Descuento aplicable para la determinación del Descuento y por lo tanto del Precio del Factoraje. 
          
          6. Que se fije el Precio de Factoraje. 
    
          7. La determinación de las Cargas Financieras, que se obliga a cubrir el CLIENTE a MIZRAFIN. 
          
          8. Una relación de los Derechos de Crédito, en la que se indiquen nombres, denominaciones del CLIENTE y de las Empresas Emisoras, datos de identificación de los documentos que amparen los Derechos de Crédito, sus importes correspondientes y fechas de vencimiento. 
          
          En caso de que las partes convengan al momento de la celebración de cada operación que el Precio Base se pague en fechas diferentes, el Precio del Factoraje será la cantidad que resulte de restar al Valor Nominal, la suma de todos los Descuentos que se hubieran aplicado a cada uno de los pagos, en base a la fórmula para determinar el Descuento, prevista en las Definiciones de este Contrato.\n\n`, 
          
          {text:`DÉCIMA TERCERA`,bold:true, decoration:'underline'},{text:`. - SUSCRIPCIÓN DE PAGARÉ.`,bold:true},` A solicitud de MIZRAFIN, el CLIENTE se obliga además a suscribir uno o varios pagarés no negociables a la orden de MIZRAFIN por el monto total de los Derechos de Crédito materia de la(s) operación(es) de que se trate. La suscripción y entrega de dichos pagarés no se consideran como pago o dación en pago de las obligaciones que documenten.\n\n`, 
          
          {text:`DÉCIMA TERCERA`,bold:true, decoration:'underline'},{text:`. - AFORO.`},` El importe del Aforo que MIZRAFIN retenga para garantizar las obligaciones del CLIENTE previstas en el presente Contrato y en cada una de las operaciones que se documenten en los Contratos de Factoraje Financiero no será entregado al CLIENTE, si no hasta que las Empresa Emisora hubiere pagado a MIZRAFIN el importe total de los Derechos de Crédito Adquiridos, a satisfacción de éste. 
          
          El CLIENTE autoriza expresamente a MIZRAFIN a que el importe total del Aforo a que se refiere el párrafo anterior, así como cualquier cantidad que MIZRAFIN llegare a tener a favor del CLIENTE, se aplique el pago de aquellas cantidades que llegare a adeudar en virtud de las obligaciones contraídas conforme al presente Contrato y a los Contratos de Factoraje Financiero que al amparo de éste se celebren. 
          
          Los saldos a favor del CLIENTE no generan interés alguno.\n\n`,
          
          {text:`DÉCIMA SEXTA`,bold:true, decoration:'underline'},{text:`. - LUGAR Y FORMA DE PAGO DE LOS DERECHOS DE CRÉDITO.`,bold:true},` En caso de que el Derecho de Crédito se encuentre denominado en Moneda Nacional, su pago a MIZRAFIN deberá efectuarse en el domicilio señalado en la parte de firmas de este Contrato: (i) con cheque certificado dentro del horario de las 9:00 (nueve) a las 13:00 (trece) horas; o (ii) mediante transferencia electrónica de fondos a la cuenta que indique MIZRAFIN.
           
          Las cantidades que se reciban por concepto de pago de los Derechos de Crédito, serán aplicadas a satisfacer el importe de comisiones, intereses moratorios (en su caso), señalados en el presente Contrato, intereses ordinarios y el remanente a capital, en ese orden, derivados de las obligaciones de pago consignadas en los Derechos de Crédito. 
          
          Todos los pagos que realice el CLIENTE al amparo de este Contrato deberán efectuarse sin deducción y libres de cualesquiera impuestos, tributos, contribuciones, cargas, deducciones o retenciones de cualquier naturaleza que se impongan o graven en cualquier tiempo por cualquier autoridad. En el caso de que la ley aplicable obligue a efectuar cualquiera de las deducciones mencionadas en el párrafo inmediato anterior, entonces el CLIENTE pagará a MIZRAFIN las cantidades adicionadas que sean necesarias a fin de que las cantidades netas recibidas por MIZRAFIN sean iguales a las cantidades brutas pactadas.\n\n`, 
          
          {text:`DÉCIMA SÉPTIMA`,bold:true, decoration:'underline'},{text:`. - CARACTERÍSTICAS DE LOS DERECHOS DE CRÉDITO.`,bold:true},` EL CLIENTE garantiza que los Derechos de Crédito Adquiridos: 
          
          a) Son pagaderos en las fechas de vencimiento de cada uno de ellos. 
          
          b) Son de su exclusiva propiedad y que no han sido prometidos u otorgados en garantía, embargados, pignorados ni gravados de manera alguna. 
          
          c) Derivan de operaciones efectivas de ventas o proveedurías de bienes y/o servicios, realizadas dentro del desarrollo normal de sus operaciones. 
          
          d) Que los bienes y/o servicios que los originen hayan sido entregados y aceptados por las empresas emisoras a su entera satisfacción, por lo que no existirá ninguna reclamación o controversia con respecto a las obligaciones que consten en los documentos que comprueben la existencia de aquellos. 
          
          e) Que no adeuda nada a las empresas emisoras, por lo que éstas no podrán invocar compensación ni rehusarán al pago total de los mismos a MIZRAFIN ni tendrán ninguna excepción que oponer en contra de ésta al exigir el pago. 
          
          f) Que al momento de la transmisión y durante el plazo de vigencia de los Derechos de Crédito Adquiridos, los derechos y acciones derivados de ellos no habrán vencido, caducado ni prescrito. 
          
          g) Que no transmitirá a MIZRAFIN Derechos de Crédito derivados de ventas a consignación o comisión, o aquellos que se pueden considerar como tales.\n\n`,
          
          {text:`DÉCIMA OCTAVA`,bold:true, decoration:'underline'},{text:`. - OBLIGACIONES ADICIONALES DEL CLIENTE.`,bold:true},` EL CLIENTE se obliga frente a “MIZRAFIN”, durante el tiempo que esté vigente este contrato y hasta en tanto no se realice el pago total de las cantidades de principal, intereses y accesorios insolutos del Crédito, a cumplir con las siguientes obligaciones de dar, hacer:
    
    
    1.	Al saneamiento en caso de evicción por todos y cada uno de los Derechos de Crédito Adquiridos.
    2.	Notificar a MIZRAFIN cualquier modificación a sus estatutos sociales, revocación, modificación u otorgamiento de poderes así como el cambio de domicilio en el que lleve a cabo sus actividades sociales, aún cuando el nuevo domicilio de esta se localice en la misma plaza y no se haya hecho modificación formal a sus estatutos sociales.
    3.	Asegurar los bienes otorgados en garantía, así como los conceptos de inversión y/o los activos productivos que generen la fuente de pago, debiendo otorgar copia del documento soporte a “MIZRAFIN” 
    4.	Permitir al Supervisor de “MIZRAFIN” así como a  instituciones financieras del país o del extranjero, Banca de Desarrollo, Banca Comercial o cualquier otra fuente de fondeo y/o Entidades Fiscalizadoras, cuando aplique: i) realizar la supervisión y/o auditoria, ii) solicitar la información financiera y contable; y iii) en general proporcionarles cualquier documento y/o datos que les soliciten en relación con los créditos descontados, lo anterior previo aviso por escrito con 5 (cinco) días naturales de anticipación a la visita. 
    5.	Conservar y Mantener en condiciones eficientes de servicio la maquinaria, equipo y en general, los demás elementos de producción que generen la fuente de pago, así como los bienes otorgados en garantía de los créditos descontados. 
    6.	Dar aviso a “MIZRAFIN”, dentro de los siguientes 10 (diez) días naturales, de cualquier evento que pudiera implicar un Cambio Material Adverso, respecto a su negocio, su situación financiera o resultado de operaciones, así como cualquier procedimiento legal, judicial o administrativo que afecte a "LA ACREDITADA” o a cualquiera de sus propiedades o activos y que pueda afectar la obligación de pago del Crédito. 
    7.	Manejar racionalmente los recursos naturales y preservar el medio ambiente, acatando las medidas y acciones dictadas por las autoridades competentes, así como cumplir las orientaciones y recomendaciones técnicas del personal y/o el Supervisor de “MIZRAFIN”\n\n`, 
    
          {text:`DÉCIMA NOVENA`,bold:true, decoration:'underline'},{text:`. - INTEGRIDAD DE LOS DERECHOS DE CRÉDITO.`,bold:true},` Las partes están de acuerdo en que la transmisión comprende los Derechos de Crédito, así como con todo lo que le corresponda por derecho y se celebra sin reserva ni limitación alguna, incluyendo sin limitar, el derecho de cobro de los intereses, así como de la ejecución de las garantías que en su caso hubiesen sido pactados en los mismos, de conformidad con la Ley. 
          
          El CLIENTE por ninguna circunstancia podrá negociar en forma alguna los Derechos de Crédito ya transmitidos a MIZRAFIN.\n\n`,
          
          {text:`VIGÉSIMA`,bold:true, decoration:'underline'},{text:`. - EXISTENCIA Y LEGITIMIDAD DE LOS DERECHOS DE CRÉDITO.`,bold:true},` El CLIENTE se obliga a garantizar a MIZRAFIN la existencia y legitimidad de los Derechos de Crédito Adquiridos de conformidad con la Ley.
          Asimismo, el CLIENTE se obliga a responder del detrimento en el valor de los Derechos de Crédito Adquiridos, que sea consecuencia del acto jurídico que le dio origen.\n\n`, 
          
          {text:`VIGÉSIMA PRIMERA`,bold:true, decoration:'underline'},{text:`. - INFORMACIÓN.`,bold:true},` El CLIENTE se obliga a proporcionar a MIZRAFIN en forma trimestral su información financiera correspondiente al trimestre inmediato anterior, así como toda la información que MIZRAFIN le requiera en cualquier momento, respecto de el y de las Empresas Emisoras a efecto de conocer su situación financiera. 
          
          El cliente se obliga igualmente, a proporcionar, de manera oportuna y en un plazo no mayor a dos (2) Días Hábiles de efectuado el requerimiento, la información que MIZRAFIN le solicite sobre el origen, naturaleza, términos y condiciones de los Derechos de Crédito, así como a entregar toda la documentación que al efecto en cualquier momento le solicite MIZRAFIN, que compruebe la existencia de los Derechos de Crédito Adquiridos. 
          
          El CLIENTE se obliga a informar a MIZRAFIN, en ningún caso después de veinticuatro (24) horas a partir de su conocimiento, de cualquier evento que afecte o pueda afectar la situación financiera de las Empresas Emisoras o el cumplimiento de las obligaciones de éstas respecto al pago puntual y oportuno de los Derechos de Crédito Adquiridos, de la oposición de cualquier Empresa Emisora o algún tercero a la validez de la transmisión de dichos Derechos y si alguna Empresa Emisora rehúsa pagar total o parcialmente los mismos.\n\n`,
          
          {text:`VIGÉSIMA SEGUNDA`,bold:true, decoration:'underline'},{text:`. - DE LAS FIRMAS.`},` El CLIENTE en este acto se obliga a entregar a MIZRAFIN una tarjeta de registro de firmas, misma que contiene el nombre y registro de firmas de la(s) persona(s) legalmente facultada(s) para realizar actos de dominio y/o suscribir y endosar títulos de crédito en su representación, así como los documentos fehacientes que lo acreditan, lo que hace bajo protesta de decir verdad, certificando que las personas registradas tendrán las facultades referidas anteriormente. 
          
          El CLIENTE se obliga a comunicar por escrito a MIZRAFIN con una anticipación de cuando menos un Día Hábil cualquier cambio de las personas facultadas para realizar los actos antes mencionados, quedando obligado en los términos del presente instrumento por las personas a que se ha hecho referencia hasta la fecha de notificación inclusive, aún en el caso de que sus facultades para tal efecto les hubiera sido revocadas.
          
          El CLIENTE se obliga a verificar en todo momento que las operaciones de factoraje sean celebradas por personas que tengan las facultades necesarias para el efecto.\n\n`, 
          
          {text:`VIGÉSIMA TERCERA`,bold:true, decoration:'underline'},{text:`. - VISITAS DE INSPECCION.`,bold:true},` En tanto existan Derechos de Crédito Adquiridos pendientes de pago, el CLIENTE autoriza a MIZRAFIN para que, por sí o mediante el nombramiento de un supervisor vigile el exacto cumplimiento de las obligaciones, y realice visitas de inspección a sus oficinas bajo un previo aviso de 5 (cinco) días hábiles, en las que MIZRAFIN a través de su supervisor tendrá libre acceso a las oficinas, instalaciones, libros de contabilidad y documentos del negocio del CLIENTE, relacionados con el proyecto para el cual se destina el crédito y siempre y cuando no sean de carácter confidencial, con el objeto de verificar la existencia y vigencia de dichos derechos, así como que los mismos se encuentren libres de todo gravamen, en el entendido de que dicha revisión, se hará en horas y días hábiles, obligándose el CLIENTE a prestar la ayuda que para ese efecto se le requiera.
           
          EL CLIENTE manifiesta su conformidad en que, en dichas visitas, MIZRAFIN levante actas en las que se asentará el procedimiento utilizado durante las mismas y sus resultados.\n\n`, 
    
          {text:`VIGÉSIMA CUARTA`,bold:true, decoration:'underline'},{text:`. - VENCIMIENTO ANTICIPADO O RESCISIÓN.`,bold:true},` MIZRAFIN tendrá derecho, a su elección, a dar por vencido anticipadamente el presente Contrato o rescindirlo de pleno derecho, sin necesidad de declaración o resolución judicial, en los siguientes casos: 
          
          1.- Si el CLIENTE no cumple en tiempo con sus obligaciones fiscales, o es declarado en estado de quiebra, concurso o suspensión de pagos, resultase insolvente, fuesen intervenidos o embargados la totalidad o parte sustancial de sus activos, ceda la totalidad o parte de éstos en favor de terceros, sea emplazado a huelga, o si en cualquier forma o por cualquier causa se viese impedido de realizar sus actividades normales. 
          
          2.- Si el CLIENTE, sin consentimiento expreso o por escrito de MIZRAFIN, reduce su capital social, se fusiona o escinde, se transforma o cambia de objeto social, acuerda su disolución anticipada o entra en liquidación de derecho o de hecho, cambia de nacionalidad o por cualquier causa similar disminuye o menoscaba su solvencia o viabilidad económica. MIZRAFIN únicamente otorgará su consentimiento cuando, a su juicio, la solvencia o viabilidad económica del CLIENTE no se vea disminuida o menoscabada de tal forma que pueda afectar las posibilidades reales de cumplimiento del presente Contrato y de los Contratos de Factoraje Financiero que se hayan celebrado al amparo de éste. 
          
          3.- Por violación o incumplimiento por parte del CLIENTE de cualquiera de las obligaciones contraídas por él en este Contrato o en los Contratos de Cesión de Derechos, o en cualquier Contrato, convenio o acto jurídico que sea consecuencia de estos Contratos, incluyendo sin limitar, en caso de que el CLIENTE transmita a MIZRAFIN Derechos de Crédito cuyo importe esté sujeto a un descuento o ajuste de cualquier índole. 
          
          4.- Por encontrarse vencidos más del (veinte por ciento) 20% de los Derechos de Crédito a favor del CLIENTE, transmitidos o no a MIZRAFIN. 
          
          5.- Por no verificarse el pago oportuno de los Derechos de Crédito Adquiridos. 
          
          6.- Si por cualquier causa justificada o no, el CLIENTE modifica su tenencia o bien los socios que tienen a la firma del presente Contrato ceden, transfieren, venden o en cualquier forma transmiten sus títulos accionarios sin la previa autorización por escrito de MIZRAFIN. 
          
          7.- Por darse alguno de los supuestos a que se refiere la cláusula Vigésima Octava de este Contrato. 
    
          Si MIZRAFIN opta por dar por vencido anticipadamente el Contrato, lo hará de pleno derecho sin necesidad de declaración judicial, mediante aviso al CLIENTE por escrito con 3 (tres) días de anticipación a la fecha en que se dé por terminado, con lo cual está conforme el CLIENTE. El CLIENTE quedara obligado al cumplimiento de todos y cada uno de los Contratos de Cesión de Derechos en sus términos y condiciones.
    
          Si MIZRAFIN opta por la rescisión del Contrato, se estará a lo estipulado en la cláusula Vigésima Sexta del mismo y a las demás disposiciones aplicables de este Contrato y de la Ley y sus disposiciones supletorias.\n\n`,
          
          {text:`VIGÉSIMA QUINTA`,bold:true, decoration:'underline'},{text:`. - SUBSISTENCIA DE EFECTOS.`,bold:true},` En caso de terminación por cualquier causa, ya sea por rescisión o vencimiento anticipado o no, o cualquier otra, subsistirán todos los efectos ya producidos por este Contrato y las operaciones, Contratos, convenios o actos jurídicos realizados a su amparo o en ejecución del mismo, celebrados hasta el momento de su terminación.\n\n`,
          
          {text:`VIGÉSIMA SEXTA`,bold:true, decoration:'underline'},{text:`. - COMPENSACIÓN.`,bold:true},` El CLIENTE autoriza expresamente a MIZRAFIN para que el importe de cualquier cantidad que MIZRAFIN llegare a tener a favor del CLIENTE se aplique al pago de aquellas cantidades que le adeude en virtud de las obligaciones contraídas conforme al presente Contrato, 
          
          Los saldos a favor del CLIENTE no generarán interés alguno a cargo de MIZRAFIN.\n\n`,
          
          {text:`VIGÉSIMA SÉPTIMA`,bold:true, decoration:'underline'},{text:`. - DERECHO DE RETENCIÓN.`,bold:true},` MIZRAFIN tendrá el derecho de conservar y retener todas las cantidades adeudadas al CLIENTE si éste incumple con cualquiera de las disposiciones del presente Contrato, de la Ley, y/o de los Contratos de Factoraje Financiero y hasta en tanto cumpla a satisfacción de MIZRAFIN con lo estipulado en los mismos.\n\n`,
          
          {text:`VIGÉSIMA OCTAVA`,bold:true, decoration:'underline'},{text:`. - DAÑOS Y PERJUICIOS.`,bold:true},` En caso de rescisión de este Contrato el CLIENTE deberá de reembolsar las cantidades recibidas en pago del precio de los Derechos de Crédito Adquiridos aún vigentes.\n\n`,
          
          {text:`VIGÉSIMA NOVENA`,bold:true, decoration:'underline'},{text:`. - NO EJERCICIO DE LA RESCISIÓN O VENCIMIENTO ANTICIPADO.`,bold:true},` El hecho de que MIZRAFIN no ejercite su derecho de dar por vencido anticipadamente este Contrato o de rescindirlo, o no exija al CLIENTE el cumplimiento de cualquier obligación a su cargo establecida en el mismo, en el presente Contrato, los Contratos de factoraje financiero o en los Contratos, convenios o actos jurídicos que de éstos se deriven, no implicará en forma alguna la aceptación de dicho incumplimiento ni la renuncia de MIZRAFIN a ejercer sus derechos o a la modificación en cualquier forma de este Contrato.\n\n`,
          
          {text:`TRIGÉSIMA`,bold:true, decoration:'underline'},{text:`. - DISPUTA COMERCIAL.`,bold:true},` Sin perjuicio de lo estipulado en las cláusulas anteriores, MIZRAFIN tendrá derecho a lo siguiente: 
          
          1. Si alguna Empresa Emisora o algún tercero se opusiere a la validez de la transmisión de los Derechos de Crédito Adquiridos, el CLIENTE será responsable ante MIZRAFIN por el importe total de los mismos y a restituir de inmediato los documentos recibidos o hasta que el CLIENTE reintegre las cantidades recibidas en pago más sus respectivos intereses, gastos y accesorios. 
          
          2. Si alguna Empresa Emisora rehúsa pagar total o parcialmente los Derechos de Crédito Adquiridos por devoluciones de bienes o no aceptación de los servicios que los originaron por haber otorgado el CLIENTE algún descuento o bonificación o por alguna otra razón justificada, o no, éste se obliga a cubrir el día hábil inmediato siguiente a la fecha en que MIZRAFIN se lo requiera, el importe de los Derechos de Crédito Adquiridos y no pagados por las empresas emisoras. En el supuesto de que MIZRAFIN los hubiere liquidado, el CLIENTE reembolsará a MIZRAFIN el pago en exceso o, a su elección MIZRAFIN podrá afectar cualquier saldo que tenga a favor del CLIENTE, con autorización expresa de aplicar el importe de ese saldo al pago de cualquier adeudo a cargo del CLIENTE. En caso de que las cantidades antes mencionadas no se paguen en la fecha señalada anteriormente, el CLIENTE pagará intereses calculados en los términos establecidos en el presente contrato. 
          
          En caso de devolución de bienes, los mismos deberán ser entregados al CLIENTE en los términos que mencione la Ley. Sin embargo, si por cualquier circunstancia le son entregados a MIZRAFIN, podrá retenerlos en garantía del pago de las sumas a que se refiere el párrafo anterior, siendo todos los gastos que ello implique por cuenta del CLIENTE incluyendo sin limitar, los de transporte, acarreos y almacenaje y en su caso, entrega al CLIENTE.\n\n`,
           
          {text:`TRIGÉSIMA PRIMERA`,bold:true, decoration:'underline'},{text:`. - GASTOS.`,bold:true},` El CLIENTE manifiesta expresamente su conformidad en que los gastos y honorarios del Fedatario Público que se causen por el otorgamiento del presente Contrato y de las respectivas ratificaciones de los Contratos de Cesión de Derechos, serán a su exclusivo cargo.\n\n`,
          
          {text:`TRIGÉSIMA SEGUNDA`,bold:true, decoration:'underline'},{text:`. - IMPUESTOS.`,bold:true},` Todos los impuestos federales, locales y sus accesorios que se causen con motivo de este Contrato y demás actos jurídicos que de él se deriven, así como los que se causen como consecuencia de la proveeduría de bienes, servicios o de ambos y en su caso sobre cualquier contraprestación, serán a cargo exclusivo del CLIENTE, liberando de cualquier responsabilidad a MIZRAFIN. 
          
          En términos del Artículo 1 C de la Ley del Impuesto al Valor Agregado el cliente en este acto opta por pagar dicho impuesto al momento de realizar la transmisión de los Derechos de Crédito pendientes de cobro. En todo caso será responsabilidad del CLIENTE el entero de la totalidad del Impuesto al Valor Agregado.\n\n`,
          
          {text:`TRIGÉSIMA TERCERA`,bold:true, decoration:'underline'},{text:`. - NULIDAD E INVALIDEZ.`,bold:true},` La nulidad o invalidez de cualquiera de las cláusulas de este Contrato o de los Contratos de Factoraje Financiero y demás actos jurídicos que de él se deriven, no afectará la validez de las demás obligaciones que en ellos se pactan contenidas en el o derivadas del mismo.\n\n`, 
          
          {text:`TRIGÉSIMA CUARTA`,bold:true, decoration:'underline'},{text:`. - VIGENCIA.`,bold:true},` Este Contrato estará en vigor por un plazo de veinticuatro meses contados a partir de la fecha de su firma, renovándose automáticamente por periodos iguales, salvo cualquiera de las partes comunique a la otra, por escrito, su deseo de darlo por terminado con treinta días naturales de anticipación a la expiración del plazo que corresponda y habiendo liquidado todas las obligaciones.\n\n`,
    
          {text:`TRIGÉSIMA QUINTA`,bold:true, decoration:'underline'},{text:`. - ESTADO DE CUENTA.`,bold:true},` MIZRAFIN enviará mensualmente al CLIENTE un estado de cuenta, a través del correo electrónico indicado por el CLIENTE dentro de los 10 días siguientes a la fecha de corte, que contendrá información relativa a cargos, pagos, intereses y comisiones, entre otros rubros. El CLIENTE contará con un plazo de 30 (treinta) días naturales contados a partir de la fecha de corte del estado de cuenta para en si caso objetar el mismo, por lo que si no lo recibe oportunamente deberá solicitarlo a MIZRAFIN para en su caso poder inconformarse dentro del plazo señalado, transcurrido dicho plazo se entenderá que no tiene objeción alguna., dicho estado de cuenta hará prueba plena en el juicio respectivo. 
    
          Este Contrato acompañado del estado de cuenta certificado por funcionario autorizado de MIZRAFIN, constituirá sin mayor requisito título ejecutivo mercantil y las partes manifiestan su plena conformidad con ello, estableciendo la vía ejecutiva mercantil para dirimir cualquier controversia derivada del presente Contrato.\n\n`,
          
          {text:`TRIGÉSIMA SEXTA`,bold:true, decoration:'underline'},{text:`. - AUTORIZACIÓN.`,bold:true},` El CLIENTE autoriza a MIZRAFIN para que lleve a cabo investigaciones sobre su comportamiento crediticio, quien lo podrá hacer por si o a través de sociedades de información crediticia y demás personas físicas o morales que MIZRAFIN estime conveniente. En términos de lo anterior, el CLIENTE autoriza a MIZRAFIN a que proporcione a terceros que intervengan en el otorgamiento y manejo de las operaciones a que este Contrato se refiere, con la frecuencia que MIZRAFIN requiera, información sobre el CLIENTE y sobre todas aquellas operaciones de cualquier naturaleza que realice con MIZRAFIN. El CLIENTE declara conocer la naturaleza y alcance de las investigaciones cuya realización en este acto autoriza. El CLIENTE autoriza a MIZRAFIN y a cualesquiera entidades intercambien información sobre operaciones activas y pasivas realizadas por el CLIENTE.\n\n`,
          
          {text:`TRIGÉSIMA SÉPTIMA`,bold:true, decoration:'underline'},{text:`. - DOMICILIOS.`,bold:true},` Para los efectos del presente Contrato las partes señalan como sus domicilios los mencionados en la hoja de identificación que forma parte del presente contrato; hasta en tanto las partes no se notifiquen por escrito sus cambios de domicilio, todas las comunicaciones que se practiquen en los domicilios antes citados, surtirán plenamente sus efectos.\n\n`,
          
          {text:`TRIGÉSIMA OCTAVA`,bold:true, decoration:'underline'},{text:`. - LEYES Y TRIBUNALES COMPETENTES.`,bold:true},` Para todo lo relativo a la interpretación y cumplimiento de este Contrato. Las partes se someten a las leyes de los Estados Unidos Mexicanos y a la jurisdicción de los tribunales competentes de Lerma, Estado de México, o a lo correspondiente al domicilio de MIZRAFIN señalado en la Carátula de este Contrato, a la elección de MIZRAFIN, renunciando el CLIENTE desde ahora a cualquier fuero que por razón de sus domicilios presentes o futuros pudiera corresponderles.\n\n`,
          
          {text:`TRIGÉSIMA NOVENA`,bold:true, decoration:'underline'},{text:`. - CONDICIONES Y PROCEDIMIENTO PARA MODIFICAR ESTE CONTRATO.`,bold:true},` Las partes podrán modificar este contrato durante su vigencia, sujeto a lo siguiente: la parte que pretenda la modificación, lo notificará por escrito a la otra parte mediante fedatario público, indicando las cláusulas y alcances de las modificaciones propuestas. La otra parte analizará la propuesta y resolverá lo conducente. Si las partes se ponen de acuerdo, ello lo plasmarán en el convenio modificatorio respectivo que a partir de la fecha que se indique en él, será obligatorio para las partes, pero en caso contrario, continuará en vigor y términos este contrato.
          
          MIZRAFIN podrá modificar el contrato de acuerdo a lo siguiente:
          
          a) Con 30 (treinta) días naturales de anticipación a la entrada en vigor, deberá notificar al CLIENTE las modificaciones propuestas mediante aviso incluido en el estado de cuenta correspondiente o vía correo electrónico. El aviso deberá especificar de forma notoria la fecha en que las modificaciones surtirán efecto. 
          
          b) En el evento de que el CLIENTE no esté de acuerdo con las modificaciones propuestas, podrá solicitar la terminación del contrato hasta 30 días naturales posteriores al aviso, sin responsabilidad ni comisión alguna a su cargo, debiendo cubrir, en su caso, los adeudos que ya se hubieren generado a la fecha en que se solicite la terminación.\n\n`,
          
          {text:`CUADRAGÉSIMA`,bold:true, decoration:'underline'},{text:`. - ATENCION A USUARIO.`,bold:true},` La Comisión Nacional para la Protección y Defensa de los Usuarios de Servicios Financieros, brindará atención vía telefónica al número 53-400-999 o Lada sin costo 01-800-999-80-80, a través de su página de internet en www.condusef.gob.mx y por medio de su correo electrónico opinion@condusef.gob.mx 
          
          En el caso de modificaciones a los datos antes mencionados, la Comisión Nacional para la Protección y Defensa de los Usuarios de Servicios Financieros lo hará de conocimiento de las Sociedades Financieras de Objeto Múltiple, Entidades No Reguladas a través de su página web, con 30 (treinta) días naturales de anticipación.
          
          Para la atención a usuarios por parte de MIZRAFIN, La Unidad Especializada de Atención a Usuarios, UNE, será la ubicada en Av. Circuito de la Industria Ote, 36 y 38, Parque Industrial Lerma, Lerma de Villada Edo. De México., C.P. 52000 o a través de sus líneas telefónicas en los números (728) 282 7272. Asimismo, se tiene abierto el correo electrónico atencion_usuario@mizrafin.com .\n\n`,
          
          {text:`CUADRAGÉSIMA PRIMERA`,bold:true, decoration:'underline'},{text:`. - SOLICITUDES, CONSULTA, RECLAMACIÓNACLARACIONES, INCONFORMIDADES Y QUEJAS`,bold:true},` Además de lo establecido en el artículo 23 de la Ley para la Transparencia, el proceso y los requisitos para la presentación y seguimiento de las solicitudes, aclaraciones, inconformidades y quejas será el siguiente:
          
          1.- El CLIENTE deberá presentar por escrito mediante el cual se señale si es una solicitud, consulta, aclaración o reclamación, debidamente firmada por las personas autorizadas para ello, a través del correo electrónico a atencion_usuario@mizrafin.com en el que se detalle el asunto a tratar; proporcionándose así acuse de recibido, mismo que contará con un número de folio especifico proveído por MIZRAFIN. 
          
          2.- Después de la fecha de recepción del escrito señalado en el inciso inmediato anterior, y en caso de no requerir más información El usuario o cliente obtendrá una respuesta por escrito que tratará de resolver la cuestión en un plazo no mayor a 15 (quince) días. 
          
          3. Si la cuestión planteada por el usuario no fuera resuelta, el usuario podrá comunicarse al teléfono (728) 282 7272, refiriendo su caso mediante el número de folio que le fue proveído en la respuesta escrita a su queja y ser atendido por el personal de la unidad especializada de atención al usuario de MIZRAFIN.
    
          4. De no estar conforme con la atención y resolución que se haya dado vía telefónica, el usuario podrá acudir directamente a las oficinas ubicadas en Av. Circuito de la Industria Ote, 36 y 38, Parque Industrial Lerma, Lerma de Villada Edo. De México., C.P. 52000 y resolver así su cuestión directamente en la Unidad Especializada de atención al usuario.
    
          5. Como última instancia de ser fallidas las anteriores, el usuario podrá acudir directamente a la CONDUSEF en la página de internet www.condusef.gob.mx Sirviendo como oficina de enlace para atender los requerimientos las ubicadas en: Av. Circuito de la Industria Ote, 36 y 38, Parque Industrial Lerma de Villada Edo. De México., C.P. 52000 a través de sus líneas telefónicas en los números: (728) 282 7272.\n\n`,
          
          {text:`CUADRAGÉSIMA SEGUNDA`,bold:true, decoration:'underline'},{text:`. - COMPROBANTES DE OPERACIÓN.`,bold:true},` MIZRAFIN pondrá a disposición del CLIENTE los comprobantes que documentan las transacciones efectuadas, ya sea a través de su entrega física o a través de un medio electrónico o de telecomunicaciones, dependiendo el medio por el que se haya celebrado la operación.
          La información contenida en los mismos deberá ser veraz, precisa, clara, completa, objetiva, actualizada, oportuna y que MIZRAFIN pueda confirmar la operación llevada a cabo.
          
          Los comprobantes que MIZRAFIN emita en sus oficinas o sucursales deberán contar con la calidad suficiente para que no se borre ni se deterioren en un plazo mínimo de 90 (noventa) días naturales.\n\n`,
          
          {text:`CUADRAGÉSIMA TERCERA`,bold:true, decoration:'underline'},{text:`. - DE LA CANCELACION DEL CONTRATO.`,bold:true},` El CLIENTE podrá cancelar el presente contrato mediante una carta firmada y presentada en las oficinas de MIZRAFIN que se especifica dentro de la caratula de este contrato, en un lapso de 10 días posterior a la fecha de firma del presente contrato, sin responsabilidad para el mismo, siempre y cuando no haya celebrado Contratos de Cesión de Derechos, y en cuyo caso, MIZRAFIN no podrá cobrar comisión alguna.\n\n`,
          
          {text:`CUADRAGESIMA CUARTA`,bold:true, decoration:'underline'},{text:`. - DE LOS PAGOS ANTICIPADOS.`,bold:true},` El CLIENTE está de acuerdo en que en caso de que existan pagos anticipados o adelantados por parte de la empresa emisora, dichos importes se aplicaran a el correspondiente vencimiento y no existirá devolución por parte de MIZRAFIN de ningún tipo de interés, ni de otros accesorios al CLIENTE.\n\n`,
          
          {text:`CUADRAGESIMA QUINTA`,bold:true, decoration:'underline'},{text:`. ANEXO ÚNICO DE DISPOSICIONES LEGALES`,bold:true},`, Los preceptos legales a los que se hacen referencia en el presente contrato, podrán ser consultados por “EL CLIENTE” en el Anexo Único de Disposiciones Legales, el cual estará a disposición de este en las oficinas de “EL FACTORANTE” o su página de internet en www.mizrafin.com.
          
          Forma parte integral del presente contrato La Caratula de Contrato Normativo de Factoraje Sin Recurso.
          
          LUGAR Y FECHA DE SUSCRIPCIÓN:
          
          Lerma, Estado de México a __ de ___________ de ____ quedando una copia del mismo en poder de cada una de las partes contratantes.`], alignment: 'justify', fontSize: 8},
    
          {
            style: 'tabla',
            
            table: {
              widths: ['*','*'],
              body: [
                [{text: '\n'}, {}],
                [{text: '\n'}, {}],
                [{text: ` “MIZRAFIN”\n\n\n_________________________________\nMIZRAFIN, SAPI DE C.V., SOFOM ENR\nChemaya Mizrahi Fernández`, alignment: 'center'}, {text: ` “EL CLIENTE”\n\n\n_________________________________\n(Nombre del Representante Legal)`, alignment: 'center'}],
                [{text: '\n'}, {}],
                [{text: '\n'}, {}],
                [{text: '\n'}, {}],
                [{text: ` ““OBLIGADOS SOLIDARIOS Y AVALISTAS””\n\n\n_________________________________\n(nombre)`,alignment: 'center', colSpan: 2}, {} ],
              ]
            },
            layout: 'noBorders'
            },  
            {text:'', pageBreak: 'after'},
            {text: [
            {text: `ANEXO "A"\n\n`,bold:true, pageBreak: 'after', alignment: 'center', fontSize: 10}, 
            {text: `CONTRATO DE CESION DE DERECHOS\n`,bold:true, alignment: 'center', fontSize: 10}, 
            {text: `__________________________________________________________\n`,bold:true, alignment: 'center', fontSize: 10},
            {text: `“MIZRAFIN”, SAPI DE CV, SOFOM, E.N.R.\n`,bold:true, alignment: 'center', fontSize: 10},], alignment: 'justify', fontSize: 8},
            {
              style: 'tabla',
              
              table: {
                widths: ['*','*'],
                body: [
                  [{text: '\n'}, {}],
                  [{text: `Anexo que forma parte del\nCONTRATO NORMATIVO DE FACTORAJE FINANCIERO SIN RECURSO con Número:\nde fecha ____.`, alignment: 'left'}, {text: `Marque con una “x”\nCobranza directa___   Cobranza delegada___.\nCONTRATO DE CESIÓN DE DERECHOS Nº\nde fecha\nNº  de relaciones 1`, alignment: 'right'}],
                ]},layout: 'noBorders'},
        {text:'\n'},        
        {text: [
        {text: `CONTRATO DE CESIÓN DE DERECHOS que celebran por una primera parte ______________________________ (en lo sucesivo denominada “EL CEDENTE”); por una segunda parte “MIZRAFIN”, SAPI de CV, SOFOM, ENR., (en lo sucesivo denominada “CESIONARIO”), y por ultima parte _____________________________________ en su carácter de “GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL”.`,bold:true}, 
        {text:'\n'}, 
        {text:'\n'},
        {text: `DECLARACIONES`,bold:true,alignment: 'center',fontSize:10 },
        {text:'\n'},
        {text:'\n'},
        {text:`Las partes declaran:`,bold:true},
        {text:'\n'},
        {text:'\n'},
        {text:`I. Declara el “CESIONARIO” por conducto de su representante legal:`,bold:true},
        {text:'\n'},
        {text:'\n'},
        `a) Ser una Sociedad Anónima Promotora de Inversión de Capital Variable, constituida con la denominación “MIZRAFIN”, SAPI DE CV, SOFOM, ENR, bajo las leyes de la República Mexicana, mediante Escritura Número 106,219 libro 2,340 de fecha 18 de agosto de 2008, ante la fe del Notario Público Número 30 del Distrito Federal, Licenciado Francisco Villalón Igartua, e inscrita en el Registro Público de la Propiedad y de Comercio del Distrito Federal, bajo el folio mercantil número 394800, el día 17 de febrero de 2009.
        
        b) La sociedad es una Sociedad Financiera de Objeto Múltiple (SOFOM), Entidad No Regulada (E.N.R.), conforme al “DECRETO por el que se reforman, derogan y  dicionan diversas disposiciones de la Ley General de Títulos y Operaciones de Crédito, Ley General de Organizaciones y Actividades Auxiliares del Crédito, Ley de Instituciones de Crédito, Ley General de Instituciones y Sociedades Mutualistas de Seguros, Ley Federal de Instituciones de Fianzas, Ley para Regular las Agrupaciones Financieras, Ley de Ahorro y Crédito Popular, Ley de Inversión Extranjera, Ley del Impuesto sobre la Renta, Ley del Impuesto al Valor Agregado y del Código Fiscal de la Federación” publicado en el Diario Oficial de la Federación el día 18 de julio de 2006; 
        
        c) En cumplimiento al Artículo 87-J vigente a la fecha de la Ley General de Organizaciones y Actividades Auxiliares del Crédito, se indica lo siguiente: La Sociedad opera como SOFOM, ENR, y no requiere de la autorización de la Secretaría de Hacienda y Crédito Público, y no está sujeta a la supervisión y vigilancia de la Comisión Nacional Bancaria y de Valores.
        
        d) Personalidad: El C. Chemaya Mizrahi Fernández, acredita su personalidad como Apoderado de “MIZRAFIN”, SAPI DE CV, SOFOM, ENR, mediante Póliza Pública número 1,363 libro 2 de fecha 10 de octubre de 2011, ante la fe del Corredor Público Número 70, del Distrito Federal, Licenciado Carlos Porcel Sastrías, e inscrita en el Registro Público de la Propiedad y de Comercio de la Ciudad de Lerma, Estado de México. bajo el folio mercantil número 2277*11, el día 30 de Mayo del 2012 y manifiesta bajo protesta de decir verdad que su poder y facultades son las necesarias para suscribir el presente contrato, y que no le han sido revocadas ni modificadas en forma alguna.
        
        e) Que el Depositario legal conviene en constituirse como tal respecto de todos y cada uno de los Derechos de Crédito objeto de este Contrato. (En cobranza delegada)\n\n`,
    
        {text:`II. Declara “ELCEDENTE”: `,bold:true},
        {text:'\n'},
        {text:'\n'},
        `a)	Ser una Sociedad_______________________, constituida con la denominación _________________________________________            bajo las leyes de la República Mexicana, mediante Escritura Número ________ libro ______ de fecha ___ de ________ del año ________, ante la fe del Notario Público Número ___________, Lic. ________________, e inscrita en el Registro Público de la Propiedad y de Comercio de la Ciudad de ___________, Estado ____________bajo el folio mercantil número ________, el día _____ de ______ del año _________.
    
        b)	Personalidad: El C. __________________________, acredita su personalidad como Apoderado o representante legal de ______________________________ mediante Escritura Pública número _______, Libro ________ de fecha ____ de ______ del año ________, otorgada ante la fe del Notario Público No.______ Lic. __________________________, e inscrita en el Registro Público de la Propiedad y de Comercio de la Ciudad de México, Estado ____________bajo el folio mercantil número ____________, el día ____ de ____________ del año __________ y manifiesta bajo protesta de decir verdad que su poder y facultades son las necesarias para suscribir el presente contrato, y que no le han sido revocadas ni modificadas en forma alguna.
        c) Que su principal actividad es ___________________________________.\n\n`,
        {text: `III.- Declara el “GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL”:`, bold:true},
        {text:'\n'},
        {text:'\n'},
        `a) Que es su interés participar en el presente contrato como`, {text:`“GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL”`,bold:true}, `de`, {text:`“EL CEDENTE”`,bold:true}, `respecto de las obligaciones contraídas por este último, sin perjuicio de tener el patrimonio Suficiente para responder y, en su caso, cumplir con las obligaciones que asume.
    
        IV. Las partes declaran que en cumplimiento de dicho contrato desean celebrar el presente acto, de acuerdo al tenor de las siguientes:\n\n`,
        {text: `CLÁUSULAS`, bold:true},
        {text:'\n'},
        {text:'\n'},
        {text:`PRIMERA: “ELCEDENTE”`, bold:true}, `transmite en este acto a`, {text:`“EL CESIONARIO”`, bold:true}, `los Derechos de Crédito que se detallan en la (s) relación (es) (Tabla I) que se adjuntan a este documento, como parte integral del mismo, haciendo entrega de toda la documentación que comprueba su existencia.
        La transmisión que por virtud de este contrato se celebra, se lleva a cabo sin reserva ni limitación alguna e incluye todos los derechos accesorios tales como los intereses que en su caso hubieran sido pactados y las garantías otorgadas en relación con los mismos.
        En los términos del artículo 419, fracción II de la Ley General de Títulos y Operaciones de Crédito,`, {text:`“ELCEDENTE”`, bold:true}, `se obliga solidariamente con los Clientes al pago puntual y oportuno de los Derechos de Crédito transmitidos.\n\n`,
        
        {text:`SEGUNDA:`, bold:true}, `Las partes convienen en que para efectos de la transmisión de los Derechos de Crédito objeto de este Contrato el Plazo de Vigencia del Contrato será hasta que se liquiden a`, {text:`“EL CESIONARIO”`, bold:true},`, todos los derechos de crédito cedidos en el presente contrato.\n\n`,
        
        {text:`TERCERA:`, bold:true},` Las partes convienen expresamente que la Tasa de Interés y Comisiones aplicables a este Contrato de Cesión de Derechos será la tasa fija y comisiones pactadas dentro del marco del presente contrato, cuyas condiciones se resumen en el presente anexo.\n\n`,
        
        {text:`CUARTA:`, bold:true},` De acuerdo con lo señalado en el Contrato Normativo de Factoraje Financiero sin recurso,`, {text:`“ELCEDENTE”`, bold:true},` paga en este acto a`, {text:`“EL CESIONARIO”`, bold:true},`, o a quien este le indique, un __% aplicado al precio estipulado en la cláusula CUARTA como comisiones de operación y de cobranza.\n\n`,
          
        {text:`QUINTA: El “GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL”`, bold:true},` se comprometen a garantizar las obligaciones a cargo de`, {text:`“ELCEDENTE”`, bold:true},` en los términos del Contrato Normativo de Factoraje Financiero y en forma específica las contenidas en este Contrato.\n\n`,
        
        {text:`SEXTA: “ELCEDENTE”`, bold:true},` y el`, {text:`“GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL”`, bold:true},` manifiestan bajo protesta de decir verdad que su situación patrimonial a la fecha del presente Contrato es la misma que tenía al suscribir el Contrato Normativo de Factoraje Financiero.\n\n`,
        
        {text:`SEPTIMA:`, bold:true},` De conformidad con el artículo 87-F de la Ley General de Organizaciones y Actividades Auxiliares del Crédito, este Contrato es un título ejecutivo que trae aparejada ejecución.\n\n`,
        
        {text:`OCTAVA:`, bold:true},` Las partes convienen expresamente en dar por reproducido íntegramente el Contrato Normativo de Factoraje Financiero Sin Recurso como si a la letra se insertare para todos los efectos legales a que haya lugar.\n\n`,
        
        {text:`NOVENA:`, bold:true},` De conformidad con el Contrato Normativo de Factoraje Financiero Sin Recurso, las partes se someten a la jurisdicción de los Tribunales competentes señalados en el mismo.\n\n`,
    
        {text: `CUADRO INFORMATIVO DEL CONTRATO NORMATIVO DE FACTORAJE FINANCIERO SIN RECURSO\n\n`,bold:true, alignment: 'center'}, 
    
        {text: `Los rubros precisados en este resumen, se entenderán referidos a las cláusulas contenidas en el contrato de adhesión del que se desprenden\n\n`, alignment: 'center'}, 
    
        {text: `“MIZRAFIN”, SAPI DE C.V., SOFOM, E.N.R. \n\n`,bold:true, alignment: 'center'},], alignment: 'justify', fontSize: 8},
        
        {style: 'tabla',
            table: {
            widths: ['*','*'],
                    body: [
                        [{text:'CAT', aligment: 'left',bold:true}, {text:'', aligment: 'left'}],
              [{text:'MONTO O LÍMITE DE LA OPERACIÓN:', aligment: 'left',bold:true}, {text:'', aligment: 'left'}],
              [{text:'PLAZO', aligment: 'left',bold:true}, {text:'', aligment: 'left'}],
              [{text:'TASA DE INTERES', aligment: 'left',bold:true}, {text:'', aligment: 'left'}],
              [{text:'COMISIONES', aligment: 'left',bold:true}, {text:'___% aplicado al precio establecido en la cláusula QUINTA del contrato de factoraje financiero sin recurso', aligment: 'left'}],
              [{text:'MONTO Y NUMERO DE PAGOS', aligment: 'left',bold:true}, {text:'NO APLICA', aligment: 'left'}],
              [{text:'PERIODICIDAD DE PAGO O FECHA DE PAGO', aligment: 'left',bold:true}, {text:'NO APLICA', aligment: 'left'}],
              [{text:'FECHA DE CORTE', aligment: 'left',bold:true}, {text:'NO APLICA', aligment: 'left'}],
              [{text:'SEGUROS CON LOS QUE CUENTA LA OPERACIÓN O SERVICIO:', aligment: 'left',bold:true}, {text:'NO APLICA', aligment: 'left'}],
              [{text:'DATOS DE LA UNIDAD ESPECIALIZADA DE ATENCIÓN A USUARIOS:', aligment: 'left',bold:true}, {text:`Unidad Especializada de Atención a Usuarios:
              Avenida Circuito de la Industria Oriente 36 y 38, Parque Industrial Lerma, Municipio Lerma de Villada, código postal 52000, Estado de México.
              Teléfono (728) 282 72 72 ext. 134
              Fax (728) 282 72 98
              E-mail: atencion_¬usuario@mirzrafin.com
              `, aligment: 'left'}],
                    ]
                }},
        {text:`TABLA I\n\n`,bold:true, alignment: 'center',pageBreak: 'before',fontSize:10},
        {text:`RELACIÓN DE DOCUMENTOS CEDIDOS A FAVOR DE:\n“MIZRAFIN”, SAPI DE CV, SOFOM ENR\n\n`,bold:true, alignment: 'center',fontSize:10},
        {style: 'tabla',
            table: {
            widths: ['*','*'],
                    body: [
                        [{text:'FECHA', aligment: 'left',bold:true}, {text:`CONTRATO DE CESION Nº\nNº DE RELACIONES: UNA DE UNA`, aligment: 'left'}],
                    ]
                }},
          {style: 'tabla',
          table: {
          widths: ['*','*','*','*','*','*','*'],
          body: [
            [{text:`EMISOR O DEUDOR (Razones Sociales de los Deudores del CLIENTE)`, alignment: 'center',bold:true},{text:`DOCTO No`, alignment: 'center',bold:true},{text:`TIPO DOCTO. *`, alignment: 'center',bold:true},{text:`FECHA DE ENTREGA MERCANCIA`, alignment: 'center',bold:true},{text:`FECHA VENCIMIENTO`, alignment: 'center',bold:true,},{text:`IMPORTE FACTURA 100%`, alignment: 'center',bold:true},{text:`% O IMPORTE A OPERAR`, alignment: 'center', bold:true},],
           // [{text:``, aligment: 'left'},{text:``, aligment: 'left'},{text:``, aligment: 'left'},{text:``, aligment: 'left'},{text:``, aligment: 'left',},{text:``, aligment: 'left'},{text:``, aligment: 'left'},],
           // [{text:`MONTO TOTAL`, aligment: 'left',colSpan: 5},{},{},{},{},{text:`$`, aligment: 'left'},{text:``, aligment: 'left'},],
          ]
        }},
        this.table(this.losdocs, ['EMISOR_O_DEUDOR', 'DOCTO_No', 'TIPO_DOCTO', 'FECHA_DE_ENTREGA_MERCANCIA', 'FECHA_VENCIMIENTO', 'IMPORTE_FACTURA_100', 'O_IMPORTE_A_OPERAR']),
        {style: 'tabla',
          table: {
          widths: ['*','*','*','*','*','*','*'],
          body: [
           
            [{text:`MONTO TOTAL`, alignment: 'left',colSpan: 5},{},{},{},{},{text:`$ ${this.importe_facturas_100}`, alignment: 'left'},{text:`${this.importe_operarstr}`, alignment: 'left'},],
          ]
        }},
        {text:'\n'},
        {text:'\n'},
        {text:`* Tipos de documento             
        •	FS = Factura sellada  
        •	CR = Contrarrecibo 
        •	FE = Factura electrónica   
        •	PA = Pagaré   
        •	LC = Letra de cambio
        `, fontSize: 7},
        {
          style: 'tabla',
          
          table: {
            widths: ['*','*'],
            body: [
              [{text: '\n'}, {}],
              [{text: '\n'}, {}],
              [{text: ` “EL CESIONARIO”\nMIZRAFIN SAPI DE C.V. SOFOM ENR\n\n\n_________________________________\nREPRESENTADA POR\nChemaya Mizrahi Fernández`, alignment: 'center'}, {text: ` “EL CEDENTE”\nNOMBRE DEL CEDENTE\n\n\n_________________________________\nREPRESENTADA POR\n(Nombre del Representante Legal)`, alignment: 'center'}],
              [{text: '\n'}, {}],
              [{text: '\n'}, {}],
              [{text: '\n'}, {}],
              [{text: ` ““OBLIGADOS SOLIDARIOS Y AVALISTAS””\n\n\n_________________________________\n(nombre)`,alignment: 'center', colSpan: 2}, {} ],
            ]
          },
          layout: 'noBorders'
          },
          {text:`“P A G A R E”\n\n`,bold:true, alignment: 'center',pageBreak: 'before',fontSize:10},
          {text:`BUENO POR: $\n\n`,bold:true, alignment: 'right',fontSize:8},
          {text: [
            {text: `Debo y Pagaré incondicionalmente a la orden de “MIZRAFIN”, SOCIEDAD ANONIMA PROMOTORA DE INVERSION DE CAPITAL VARIABLE, SOCIEDAD FINANCIERA DE OBJETO MULTIPLE, ENTIDAD NO REGULADA, en sus oficinas ubicadas en Avenida Circuito de la Industria Oriente número 36 y 38, Colonia Parque Industrial Lerma, en Lerma de Villada Estado de México C.P. 52000, el día    de            de 20   , a la vista, la suma de $             . (                           Pesos 00/100 Moneda Nacional).
    
            La suma principal amparada por este Pagaré devengará intereses ordinarios a partir de esta fecha y hasta el pago total del mismo a una tasa de interés anual de  % (             por ciento), y una comisión de   % (            por ciento) del monto del pagaré, que serán cubiertos en términos del presente pagaré. 
            
            Ante el incumplimiento en el pago de la suma principal e intereses derivados de este Pagaré en lugar de la tasa de interés ordinaria referida anteriormente este pagaré devengara interés moratorios sobre su saldo insoluto a una tasa de interés igual a la tasa de interés anual ordinaria mencionada al principio de este párrafo multiplicada por 2(dos).    
            
            Tanto el importe del capital de este Título expresado en Moneda Nacional, así como los intereses que el mismo cause, serán cubiertos en un plazo no mayor a   meses.
            
            Este pagaré es un Título de Crédito sujeto a las disposiciones de los Artículos 4,114, 170 y demás aplicables a la Ley General de Títulos y Operaciones de Crédito.
            
            Para la ejecución y cumplimiento de este Pagaré y para el requerimiento judicial de pago de las cantidades adeudadas conforme al mismo, el Suscriptor y el Aval se someten expresa e irrevocablemente a la jurisdicción de los tribunales competentes en la Ciudad de Lerma de Villada, Estado de México. Mediante la suscripción y entrega de este Pagaré el Suscriptor y el Aval renuncian irrevocablemente a cualquier otro fuero al que tengan o lleguen a tener derecho, en virtud de su domicilio (presente o futuro) o por cualquier otra razón.
            
            El Suscriptor designa como su domicilio para requerimiento judicial de pago, el siguiente:
            
            El Aval designa como su domicilio para requerimiento judicial de pago, el siguiente:
            
            Por el presente Pagaré el Suscriptor y el Aval renuncian a cualquier diligencia de presentación, requerimiento o protesto. La omisión o retraso del tenedor del presente Pagaré en el ejercicio de cualquiera de sus derechos conforme a este Pagaré en ningún caso constituirá una renuncia a dichos derechos.
            
            El Suscriptor y el Aval prometen incondicional e irrevocablemente pagar los costos y gastos que impliquen el cobro de este Pagaré incluyendo, sin limitación alguna, los honorarios de los abogados que intervengan en el cobro, en caso de incumplimiento en el pago de este Pagaré. 
            
            El presente Pagaré se suscribe y entrega en la Ciudad de Lerma de Villada, Estado de México el día      de      de 20     .
            `}, 
            
            ,], alignment: 'justify', fontSize: 8},
    
            {
              style: 'tabla',
              
              table: {
                widths: ['*','*'],
                body: [
                  [{text: '\n'}, {}],
                  [{text: '\n'}, {}],
                  [{text: ` "SUSCRIPTOR"\n\n\n_________________________________\n(nombre y firma)`, alignment: 'center'}, {text: ` "AVAL"\n\n\n_________________________________\n(Nombre y firma)`, alignment: 'center'}],
        
                ]
              },
              layout: 'noBorders'
              },
        ],
        styles: {
          tabla: {
            bold: false,
            fontSize: 8.5,
            color: 'black'
          }
        },
        defaultStyle: {
          // alignment: 'justify'
        }
      };
      
    
    
    
    
    
     // pdfMake.createPdf(dd).open();
    
      const pdfDocGenerator = pdfMake.createPdf(dd);
      pdfDocGenerator.getBlob((blob) => {
    	this.subirdocMizrafin(blob,ids, folio);
    });
   
  })}

  CONTRATO_MIZFACTURAS_CON_RESURSO_PF(ids, folio, resp){
    this.losdocs = [];
    this.monto_toal= 0;
    this.importe_facturas_100 = '';
    this.importe_operar = 0;
    this.importe_operarstr = '';
    
      // VALIDACIONES DE LOS DATOS
      let req = {
        cat: '',
        comisiones: '',
        fecha_limite_pago: '',
        linea_factoraje: '',
        plazo: '',
        tasa_anual: '',
        total_apagar: '',
        vigencia_contrato: ''
      }
      let fin = {
        denominacion_social: '',
        domicilio: '',
        colonia: '',
        municipio: '',
        estado: '',
        entidad_federativa: '',
        codigo_postal: '',
        representante_legal: '',
        escritura: '',
        fecha_escritura: '',
        antefe_notario: '',
        titular_notaria: '',
        folio_inscripcion: '',
        lugar_inscripcion: '',
        fecha_inscripcion: ''
      }
      let client_pf = {
        nombre_completo: '',
        domicilio: '',
        colonia: '',
        municipio: '',
        estado: '',
        entidad_federativa: '',
        codigo_postal: '',
        curp: '',
        rfc: '',
        martial_status: '',
        id_type: '',
        identification: '',
        phone: '',
        email: ''
      } 
      /*let client_pm = {
        denominacion_social: '',
        domicilio: '',
        colonia: '',
        municipio: '',
        estado: '',
        entidad_federativa: '',
        codigo_postal: '',
        rfc: '',
        phone: '',
        email: ''
      } */
      let legal_reppf = {
        nombre_completo: '',
        domicilio: '',
        colonia: '',
        municipio: '',
        estado: '',
        entidad_federativa: '',
        codigo_postal: '',
        curp: '',
        rfc: '',
        martial_status: '',
        id_type: '',
        identification: '',
        phone: '',
        email: ''
      } 
     /* let legal_reppm = {
        nombre_completo: '',
        domicilio: '',
        colonia: '',
        municipio: '',
        estado: '',
        entidad_federativa: '',
        codigo_postal: '',
        curp: '',
        rfc: '',
        martial_status: '',
        id_type: '',
        identification: '',
        phone: '',
        email: ''
      } */
      let garantepf = {
        nombre_completo: '',
        domicilio: '',
        colonia: '',
        municipio: '',
        estado: '',
        entidad_federativa: '',
        codigo_postal: '',
        curp: '',
        rfc: '',
        martial_status: '',
        id_type: '',
        identification: '',
        phone: '',
        email: ''
      } 
     /* let garantepm = {
        nombre_completo: '',
        domicilio: '',
        colonia: '',
        municipio: '',
        estado: '',
        entidad_federativa: '',
        codigo_postal: '',
        curp: '',
        rfc: '',
        martial_status: '',
        id_type: '',
        identification: '',
        phone: '',
        email: ''
      } */
      if (resp.request.length > 0) {
          req = {
          cat: resp.request[0].cat,//
          comisiones: resp.request[0].comisiones,//
          fecha_limite_pago: resp.request[0].fecha_limite_pago,//
          linea_factoraje: resp.request[0].linea_factoraje,//
          plazo: resp.request[0].plazo,
          tasa_anual: resp.request[0].tasa_anual,//
          total_apagar: resp.request[0].total_apagar,
          vigencia_contrato: resp.request[0].vigencia_contrato//
        }
      }
      if (resp.fin.length > 0) {
        fin = {
          denominacion_social: resp.fin[0].denominacion_social,//
          domicilio: resp.fin[0].domicilio,//
          colonia: resp.fin[0].colonia,//
          municipio: resp.fin[0].municipio,//
          estado: resp.fin[0].estado,
          entidad_federativa: resp.fin[0].entidad_federativa,//
          codigo_postal: resp.fin[0].codigo_postal,//
          representante_legal: resp.fin[0].representante_legal,//
          escritura: resp.fin[0].escritura,//
          fecha_escritura: resp.fin[0].fecha_escritura,//
          antefe_notario: resp.fin[0].antefe_notario,//
          titular_notaria: resp.fin[0].titular_notaria,//
          folio_inscripcion: resp.fin[0].folio_inscripcion,//
          lugar_inscripcion: resp.fin[0].lugar_inscripcion,//
          fecha_inscripcion: resp.fin[0].fecha_inscripcion//
        }
      }
      if (resp.client_pf.length > 0) {
          client_pf = {
          nombre_completo: resp.client_pf[0].nombre_completo,
          domicilio: resp.client_pf[0].dimicilio,
          colonia: resp.client_pf[0].colonia,
          municipio: resp.client_pf[0].municipio,
          estado: resp.client_pf[0].estado,
          entidad_federativa: resp.client_pf[0].entidad_federativa,
          codigo_postal: resp.client_pf[0].codigo_postal,
          curp: resp.client_pf[0].curp,
          rfc: resp.client_pf[0].rfc,
          martial_status: resp.client_pf[0].martial_status,
          id_type: resp.client_pf[0].id_type,
          identification: resp.client_pf[0].identification,
          phone: resp.client_pf[0].phone,
          email: resp.client_pf[0].email
        }
          if (resp.legal_rep.length > 0) {
            legal_reppf = {
              nombre_completo: resp.legal_rep[0].nombre_completo,
              domicilio: resp.legal_rep[0].domicilio,
              colonia: resp.legal_rep[0].colonia,
              municipio: resp.legal_rep[0].municipio,
              estado: resp.legal_rep[0].estado,
              entidad_federativa: resp.legal_rep[0].entidad_federativa,
              codigo_postal: resp.legal_rep[0].codigo_postal,
              curp: resp.legal_rep[0].curp,
              rfc: resp.legal_rep[0].rfc,
              martial_status: resp.legal_rep[0].martial_status,
              id_type: resp.legal_rep[0].id_type,
              identification: resp.legal_rep[0].identification,
              phone: resp.legal_rep[0].phone,
              email: resp.legal_rep[0].email
              }
          }
          if (resp.garante.length > 0) {
            garantepf = {
              nombre_completo: resp.garante[0].nombre_completo,
              domicilio: resp.garante[0].domicilio,
              colonia: resp.garante[0].colonia,
              municipio: resp.garante[0].municipio,
              estado: resp.garante[0].estado,
              entidad_federativa: resp.garante[0].entidad_federativa,
              codigo_postal: resp.garante[0].codigo_postal,
              curp: resp.garante[0].curp,
              rfc: resp.garante[0].rfc,
              martial_status: resp.garante[0].martial_status,
              id_type: resp.garante[0].id_type,
              identification: resp.garante[0].identification,
              phone: resp.garante[0].phone,
              email: resp.garante[0].email
            }
          }
      }
    /*  if (resp.client_pm.length > 0) {
        client_pm = {
          denominacion_social: resp.client_pm[0].denominacion_social,
          domicilio: resp.client_pm[0].domicilio,
          colonia: resp.client_pm[0].colonia,
          municipio: resp.client_pm[0].municipio,
          estado: resp.client_pm[0].estado,
          entidad_federativa: resp.client_pm[0].entidad_federativa,
          codigo_postal: resp.client_pm[0].codigo_postal,
          rfc: resp.client_pm[0].rfc,
          phone: resp.client_pm[0].phone,
          email: resp.client_pm[0].email
      }
        if (resp.legal_rep.length > 0) {
          legal_reppm = {
            nombre_completo: resp.legal_rep[0].nombre_completo,
            domicilio: resp.legal_rep[0].domicilio,
            colonia: resp.legal_rep[0].colonia,
            municipio: resp.legal_rep[0].municipio,
            estado: resp.legal_rep[0].estado,
            entidad_federativa: resp.legal_rep[0].entidad_federativa,
            codigo_postal: resp.legal_rep[0].codigo_postal,
            curp: resp.legal_rep[0].curp,
            rfc: resp.legal_rep[0].rfc,
            martial_status: resp.legal_rep[0].martial_status,
            id_type: resp.legal_rep[0].id_type,
            identification: resp.legal_rep[0].identification,
            phone: resp.legal_rep[0].phone,
            email: resp.legal_rep[0].email
            }
        }
        if (resp.garante.length > 0) {
          garantepm = {
            nombre_completo: resp.garante[0].nombre_completo,
            domicilio: resp.garante[0].domicilio,
            colonia: resp.garante[0].colonia,
            municipio: resp.garante[0].municipio,
            estado: resp.garante[0].estado,
            entidad_federativa: resp.garante[0].entidad_federativa,
            codigo_postal: resp.garante[0].codigo_postal,
            curp: resp.garante[0].curp,
            rfc: resp.garante[0].rfc,
            martial_status: resp.garante[0].martial_status,
            id_type: resp.garante[0].id_type,
            identification: resp.garante[0].identification,
            phone: resp.garante[0].phone,
            email: resp.garante[0].email
          }
        }
    } */
      
      
      if (resp.docs.length > 0) {
        for (let i in resp.docs) {
          this.losdocs[i] = { EMISOR_O_DEUDOR : resp.docs[i].emisor, DOCTO_No: resp.docs[i].docto_no, TIPO_DOCTO: resp.docs[i].tipo_docto, FECHA_DE_ENTREGA_MERCANCIA: resp.docs[i].fecha_entrega, FECHA_VENCIMIENTO: resp.docs[i].fecha_vencimiento, IMPORTE_FACTURA_100: resp.docs[i].factura_100, O_IMPORTE_A_OPERAR: resp.docs[i].importe_operar }
          this.monto_toal = this.monto_toal +  parseInt(resp.docs[i].factura_100.replace(/,/g, ''), 10);
          this.importe_operar = this.importe_operar +  parseInt(resp.docs[i].importe_operar.replace(/,/g, ''), 10);
        }
        this.importe_facturas_100 = this.monto_toal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        this.importe_operarstr = this.importe_operar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    var dd = {
        pageMargins: [ 40, 60, 40, 60 ],
        header: {
          columns: [
            {
              image: `data:image/png;base64,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`,
              width: 150,
              height: 50,
            },
          {text: `RECA: ${this.num}\nNo de contrato`, alignment: 'right'},
          ]
                 },
        
      
                 footer: function(currentPage, pageCount) {
                  return {
                      margin:10,
                      columns: [
                      {
                          fontSize: 9,
                          text:[
                          {
                          text: currentPage.toString() + ' de ' + pageCount,
                          }
                          ],
                          alignment: 'right'
                      }
                      ]
                  };
            
              },
             
        content: [
          {text: 'CARATULA DE CONTRATO NORMATIVO DE FACTORAJE CON RECURSO', alignment: 'center', bold: true, italic: true},
          {style: 'tabla',
            table: {
            widths: ['*','*','*','*'],
                    body: [
                        [{text:`1)	NOMBRE COMERCIAL DEL PRODUCTO: MIZFACTURAS\nTipo de Crédito: FACTORAJE FINANCIERO`, colSpan: 4}, {}, {}, {}],
              [{text:'2)	DESTINO Y APLICACIÓN DEL CRÉDITO: ', colSpan: 4},{},{},{}],
              [{text: `3) CAT (Costo Anual Total), A la fecha de contratación y para efectos informativos es del ${req.cat}% anual.` }, 
                {text: `4) TASA DE INTERÉS ANUAL, ORDINARIA Y MORATORIA:\n${req.tasa_anual}`}, 
                {text: `5) MONTO O LÍNEA DE CRÉDITO: \nSin incluir accesorios`},
                {text: `6) MONTO TOTAL A PAGAR: \n${req.total_apagar}`}],
              [{text: `7)	VIGENCIA DEL CONTRATO:${req.vigencia_contrato}` , colSpan: 2}, {},{text:`8)	Fecha Límite de pago: ${req.fecha_limite_pago} \n Fecha de Corte para los Estados de Cuenta:` , colSpan: 2},{}],
              [{text:'9)	FORMA DE PAGO DEL CREDITO:', colSpan: 4}, {}, {}, {}],
              [{text:`10)	COMISIONES: ${req.comisiones}\n- Contratación o apertura: ___                         - Administración o manejo de cuenta: ___                         - Por operación: ___`, colSpan: 4, preserveLeadingSpaces: true}, {}, {}, {}],
              [{text:'11)	ADVERTENCIAS \n•	“Incumplir tus obligaciones te puede generar Comisiones e intereses moratorios”;\n•	“Contratar créditos que excedan tu capacidad de pago afecta tu historial crediticio”\n•	“El avalista, obligado solidario o coacreditado responderá como obligado principal por el total del pago frente a la Entidad Financiera” ;', colSpan: 4 }, {}, {}, {}],
              [{text:'12)	SEGUROS:\n Seguro:         NA                                    Aseguradora:          NA                                           Cláusula:       NA     \n(opcional u obligatoria)', colSpan: 4}, {}, {}, {}],
              [{text:'13)	ESTADO DE CUENTA\n- Vía Correo Electrónico                     Si                          - Domicilio                        No                        - Internet   No', colSpan: 4}, {}, {}, {}],
              [{text:'14)	ACLARACIONES Y RECLAMACIONES\nUnidad Especializada de Atención a Usuarios: Av. Circuito de la Industria Oriente 36 y 38, Parque Industrial Lerma, Municipio Lerma de Villada, Código Postal 52000, Estado de México.\nTeléfono (728) 282 72 72 ext. 134Fax (728) 282 72 98\nE-mail: atencion_usuario@mirzrafin.com', colSpan: 4}, {}, {}, {}],
              [{text:`15) Registro de Contratos de Adhesión Núm: ${this.num} \nComisión Nacional para la Protección y Defensa de los Usuarios de Servicios Financieros (CONDUSEF) Teléfono:01 800 999 8080 y 53400999. Página de Internet www.condusef.gob.mx  `, colSpan: 4}, {}, {}, {}],
              [{
                style: 'tabla',
                
                table: {
                  widths: ['*','*'],
                  body: [
                    [{text: '\n'}, {}],
                    [{text: '\n'}, {}],
                    [{text: ` “EL FACTORANTE”\n_________________________________\nMIZRAFIN, SAPI DE C.V., SOFOM ENR\nChemaya Mizrahi Fernández`, alignment: 'center'}, {text: ` “EL FACTORADO”\n_________________________________\n(Nombre del Representante Legal)`, alignment: 'center'}],
                    [{text: '\n'}, {}],
                    [{text: '\n'}, {}],
                    [{text: '\n'}, {}],
                    [{text: ` ““OBLIGADOS SOLIDARIOS Y AVALISTAS””\n_________________________________\n(Nombre)`,alignment: 'center', colSpan: 2}, {} ],
                  ]
                },
                layout: 'noBorders'
                , colSpan: 4},{},{},{}] 
                    ]
                }},
                
          {text: `CONTRATO NORMATIVO DE FACTORAJE FINANCIERO (PERSONA FÍSICA CON ACTIVIDAD EMPRESARIAL) QUE CELEBRAN POR UNA PARTE “MIZRAFIN”, SOCIEDAD ANONIMA PROMOTORA DE INVERSIÓN DE CAPITAL VARIABLE, SOCIEDAD FINANCIERA DE OBJETO MÚLTIPLE, ENTIDAD NO REGULADA, A QUIEN EN LO SUCESIVO SE LE DENOMINARA “EL FACTORANTE”, REPRESENTADA EN ESTE ACTO POR LA(S) PERSONA(S) IDENTIFICADA(S) EN LA HOJA DE IDENTIFICACIÓN DEL PRESENTE CONTRATO Y POR OTRA PARTE LA(S) PERSONA(S) IDENTIFICADA(S) EN LA HOJA DE IDENTIFICACIÓN DEL PRESENTE CONTRATO, A QUIENES EN LO SUCESIVO SE LE(S) DENOMINARA RESPECTIVAMENTE COMO “EL FACTORADO” Y EL “GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL”; AL TENOR DE LAS SIGUIENTES DECLARACIONES Y CLÁUSULAS: `, pageBreak: 'before', fontSize: 9, bold: true, alignment: 'justify'},
          {style: 'tabla',
            table: {
            widths: ['*','*','*','*','*'],
                    body: [
                        [{text:'HOJA DE IDENTIFICACIÓN', colSpan: 5, alignment: 'center'}, {}, {}, {}, {}],
              [{text:'DATOS DEL FACTORANTE', colSpan: 5, aligment: 'left', fillColor: '#000000', color: '#FFFFFF'}, {}, {}, {}, {}],
              [{text:`Denominación Social:\n${fin.denominacion_social}`, colSpan: 5, aligment: 'center'}, {}, {}, {}, {}],
              [{text:`DOMICILIO:\n ${fin.domicilio}`}, {text:`COLONIA O POBLACION:\n${fin.colonia}`}, {text:`DELEGACION O MUNICIPIO:\n${fin.municipio}`}, {text:`ENTIDAD FEDERATIVA:\n${fin.estado}`}, {text:`C.P.:\n${fin.codigo_postal}`}],
              [{text:`Nombre del representante legal:\n${fin.representante_legal}`, colSpan: 5, aligment: 'left'}, {}, {}, {}, {}],
                    ]
                }},
                
          {text: '\n'},
          {style: 'tabla',
            table: {
            widths: ['*','*','*','*','*'],
                    body: [
              [{text:`DATOS DEL FACTORADO`, colSpan: 5, aligment: 'left', bold: true, fillColor: '#000000', color: '#FFFFFF'}, {}, {}, {}, {}],
              [{text:`NOMBRE COMPLETO:\n${client_pf.nombre_completo}`, colSpan: 2, aligment: 'left'}, {}, {text:`DOMICILIO:\n${client_pf.domicilio}`, colSpan: 2, aligment: 'left'}, {}, {text:`COLONIA O POBLACION:\n${client_pf.colonia}`, aligment: 'left'}],
              [{text:`DELEGACIÓN O MUNICIPIO:\n${client_pf.municipio}`, aligment: 'left'}, {text:`ENTIDAD FEDERATIVA:\n${client_pf.estado}`, aligment: 'left'}, {text:`C.P.\n${client_pf.codigo_postal}`, aligment: 'left'}, {text:`FECHA DE NACIMIENTO:`, aligment: 'left'}, {text:`LUGAR DE NACIMIENTO:`, aligment: 'left'}],
              [{text:`NACIONALIDAD:`, aligment: 'left'}, {text:`OCUPACIÓN O PROFESIÓN:`, aligment: 'left'}, {text:`CURP:\n${client_pf.curp}`, aligment: 'left', colSpan: 2}, {}, {text:`RFC:\n${client_pf.rfc}`, aligment: 'left'}],
              [{text:`ESTADO CIVIL:\n${client_pf.martial_status}`, aligment: 'left'}, {text:`RÉGIMEN MATRIMONIAL:`, aligment: 'left'}, {text:`ENTIDAD DE CONTRACCIÓN NUPCIAL:`, aligment: 'left', colSpan: 3}, {}, {}],
              [{text:`TIPO DE IDENTIFICACIÓN OFICIAL VIGENTE:\n${client_pf.id_type}`, aligment: 'left'}, {text:`EMITIDA POR:`, aligment: 'left'}, {text:`FOLIO No.:\n${client_pf.identification}`, aligment: 'left'}, {text:`TELÉFONO:\n${client_pf.phone}`, aligment: 'left'}, {text:`CORREO ELECTRÓNICO:\n${client_pf.email}`, aligment: 'left'}],
              [{text:`REPRESENTANTE LEGAL DEL FACTORADO`, colSpan: 5, aligment: 'left', bold: true}, {}, {}, {}, {}],
              [{text:`NOMBRE COMPLETO:\n${legal_reppf.nombre_completo}`, colSpan: 2, aligment: 'left'}, {}, {text:`DOMICILIO:\n${legal_reppf.domicilio}`, colSpan: 2, aligment: 'left'}, {}, {text:`COLONIA O POBLACION:\n${legal_reppf.colonia}`, aligment: 'left'}],
              [{text:`DELEGACIÓN O MUNICIPIO:\n${legal_reppf.municipio}`, aligment: 'left'}, {text:`ENTIDAD FEDERATIVA:\n${legal_reppf.estado}`, aligment: 'left'}, {text:`C.P.\n${legal_reppf.codigo_postal}`, aligment: 'left'}, {text:`FECHA DE NACIMIENTO:`, aligment: 'left'}, {text:`LUGAR DE NACIMIENTO:`, aligment: 'left'}],
              [{text:`NACIONALIDAD:`, aligment: 'left'}, {text:`OCUPACIÓN O PROFESIÓN:`, aligment: 'left'}, {text:`CURP:\n${legal_reppf.curp}`, aligment: 'left', colSpan: 2}, {}, {text:`RFC:\n${legal_reppf.rfc}`, aligment: 'left'}],
              [{text:`TIPO DE IDENTIFICACIÓN OFICIAL VIGENTE:\n${legal_reppf.id_type}`, aligment: 'left'}, {text:`EMITIDA POR:`, aligment: 'left'}, {text:`FOLIO No.:\n${legal_reppf.identification}`, aligment: 'left'}, {text:`TELÉFONO:\n${legal_reppf.phone}`, aligment: 'left'}, {text:`CORREO ELECTRÓNICO:\n${legal_reppf.email}`, aligment: 'left'}],
              [{text:`ESCRITURA PÚBLICA NÚMERO:`, aligment: 'left'}, {text:`FECHA DE LA ESCRITURA PÚBLICA:`, aligment: 'left'}, {text:`ANTE FE DEL NOTARIO PÚBLICO:`, aligment: 'left'}, {text:`TITULAR DE LA NOTARIA No.`, aligment: 'left', colSpan: 2}, {}],
                    ]
                }},
          {text: '\n'},
          {style: 'tabla',
            table: {
            widths: ['*','*','*','*','*'],
                    body: [
                        [{text:`DATOS DEL GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL (PERSONA MORAL)`, colSpan: 5, aligment: 'left', bold: true, fillColor: '#000000', color: '#FFFFFF'}, {}, {}, {}, {}],
              [{text:`DENOMINACIÓN SOCIAL:`, colSpan: 5, aligment: 'left', bold: true}, {}, {}, {}, {}],
              [{text:`DOMICILIO:`, aligment: 'left'}, {text:`COLONIA O POBLACION:`, aligment: 'left'}, {text:`DELEGACIÓN O MUNICIPIO:`, aligment: 'left'}, {text:`ENTIDAD FEDERATIVA:`, aligment: 'left'}, {text:`CP:`, aligment: 'left'}],
              [{text:`NACIONALIDAD:`, aligment: 'left'}, {text:`RFC:`, aligment: 'left'}, {text:`TELÉFONO:`, aligment: 'left'}, {text:`CORREO ELECTRÓNICO:`, aligment: 'left', colSpan: 2}, {}],
              [{text:`ACTA CONSTITUTIVA`, colSpan: 5, aligment: 'left', bold: true}, {}, {}, {}, {}],
              [{text:`ESCRITURA O PÓLIZA PÚBLICA NÚMERO:`, aligment: 'left'}, {text:`FECHA DE LA ESCRITURA O PÓLIZA PÚBLICA:`, aligment: 'left'}, {text:`ANTE FE DEL NOTARIO/CORREDOR PÚBLICO:`, aligment: 'left', colSpan: 3}, {}, {}],
              [{text:`TITULAR DE LA NOTARIA/CORREDURIA No`, aligment: 'left'}, {text:`FOLIO DE INSCRIPCIÓN:`, aligment: 'left'}, {text:`LUGAR DE INSCRIPCIÓN:`, aligment: 'left'}, {text:`FECHA DE INSCRIPCIÓN:`, aligment: 'left', colSpan: 2}, {}],
              [{text:`REPRESENTANTE LEGAL`, colSpan: 5, aligment: 'left', bold: true}, {}, {}, {}, {}],
              [{text:`NOMBRE COMPLETO:`, colSpan: 2, aligment: 'left'}, {}, {text:`DOMICILIO:`, colSpan: 2, aligment: 'left'}, {}, {text:`COLONIA O POBLACION:`, aligment: 'left'}],
              [{text:`DELEGACIÓN O MUNICIPIO:`, aligment: 'left'}, {text:`ENTIDAD FEDERATIVA:`, aligment: 'left'}, {text:`C.P.`, aligment: 'left'}, {text:`FECHA DE NACIMIENTO:`, aligment: 'left'}, {text:`LUGAR DE NACIMIENTO:`, aligment: 'left'}],
              [{text:`NACIONALIDAD:`, aligment: 'left'}, {text:`OCUPACIÓN O PROFESIÓN:`, aligment: 'left'}, {text:`CURP`, aligment: 'left', colSpan: 2}, {}, {text:`RFC`, aligment: 'left'}],
              [{text:`TIPO DE IDENTIFICACIÓN OFICIAL VIGENTE:`, aligment: 'left'}, {text:`EMITIDA POR:`, aligment: 'left'}, {text:`FOLIO No.:`, aligment: 'left'}, {text:`TELÉFONO:`, aligment: 'left'}, {text:`CORREO ELECTRÓNICO:`, aligment: 'left'}],
              [{text:`ESCRITURA PÚBLICA NÚMERO:`, aligment: 'left'}, {text:`FECHA DE LA ESCRITURA PÚBLICA:`, aligment: 'left'}, {text:`ANTE FE DEL NOTARIO PÚBLICO:`, aligment: 'left'}, {text:`TITULAR DE LA NOTARIA No.`, aligment: 'left', colSpan: 2}, {}],
              [{text:`TITULAR DE LA NOTARIA/CORREDURIA No`, aligment: 'left'}, {text:`FOLIO DE INSCRIPCIÓN:`, aligment: 'left'}, {text:`LUGAR DE INSCRIPCIÓN:`, aligment: 'left'}, {text:`FECHA DE INSCRIPCIÓN:`, aligment: 'left', colSpan: 2}, {}],
                    ]
                }},
          {text: '\n'},
          {style: 'tabla',
            table: {
            widths: ['*','*','*','*','*'],
                    body: [
              
              [{text:`DATOS DEL GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL (PERSONA FISICA)`, colSpan: 5, aligment: 'left', bold: true, fillColor: '#000000', color: '#FFFFFF'}, {}, {}, {}, {}],
              [{text:`NOMBRE COMPLETO:\n${garantepf.nombre_completo}`, colSpan: 2, aligment: 'left'}, {}, {text:`DOMICILIO:\n${garantepf.domicilio}`, colSpan: 2, aligment: 'left'}, {}, {text:`COLONIA O POBLACION:\n${garantepf.colonia}`, aligment: 'left'}],
              [{text:`DELEGACIÓN O MUNICIPIO:\n${garantepf.municipio}`, aligment: 'left'}, {text:`ENTIDAD FEDERATIVA:\n${garantepf.estado}`, aligment: 'left'}, {text:`C.P.\n${garantepf.codigo_postal}`, aligment: 'left'}, {text:`FECHA DE NACIMIENTO:`, aligment: 'left'}, {text:`LUGAR DE NACIMIENTO:`, aligment: 'left'}],
              [{text:`NACIONALIDAD:`, aligment: 'left'}, {text:`OCUPACIÓN O PROFESIÓN:`, aligment: 'left'}, {text:`CURP:\n${garantepf.curp}`, aligment: 'left', colSpan: 2}, {}, {text:`RFC:\n${garantepf.rfc}`, aligment: 'left'}],
              [{text:`ESTADO CIVIL:\n${garantepf.martial_status}`, aligment: 'left'}, {text:`RÉGIMEN MATRIMONIAL:`, aligment: 'left'}, {text:`ENTIDAD DE CONTRACCIÓN NUPCIAL:`, aligment: 'left', colSpan: 3}, {}, {}],
              [{text:`TIPO DE IDENTIFICACIÓN OFICIAL VIGENTE:\n${garantepf.id_type}`, aligment: 'left'}, {text:`EMITIDA POR:`, aligment: 'left'}, {text:`FOLIO No.:\n${garantepf.identification}`, aligment: 'left'}, {text:`TELÉFONO:\n${garantepf.phone}`, aligment: 'left'}, {text:`CORREO ELECTRÓNICO:\n${garantepf.email}`, aligment: 'left'}],
              [{text:`SECCIÓN DE FIRMAS`, colSpan: 5, aligment: 'center', bold: true, fillColor: '#000000', color: '#FFFFFF'}, {}, {}, {}, {}],
              [{
                style: 'tabla',
                
                table: {
                  widths: ['*','*'],
                  body: [
                    [{text: '\n'}, {}],
                    [{text: '\n'}, {}],
                    [{text: '\n'}, {}],
                    [{text: '\n'}, {}],
                    [{text: ` “EL FACTORANTE”\n\n\nMIZRAFIN, SAPI DE C.V., SOFOM ENR\nRepresentada por \nChemaya Mizrahi Fernández`, alignment: 'center'}, {text: ` “EL FACTORADO\n\n\n(Nombre y Firma)`, alignment: 'center'}],
                    [{text: '\n'}, {}],
                    [{text: '\n'}, {}],
                    [{text: '\n'}, {}],
                    [{text: ` “EL GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL”\n\n\nNOMBRE Y FIRMA\n\nLUGAR Y FECHA DE SUSCRIPCIÓN: Lerma de Villada, Estado de México a _________ de _________________ de 20_____.`,alignment: 'center', colSpan: 2}, {} ],
                  ]
                },
                layout: 'noBorders'
                , colSpan: 5},{},{},{},{}]
              
                    ]
                }},
          {text: `D E C L A R A C I O N E S\n\n\n`, bold: true, alignment: 'center', pageBreak: 'before'},
          {
            alignment: 'justify',
            columns: [
                {
                    text: [
                        {text: `I. Declara “EL FACTORANTE” por conducto de su representante legal:\n\n`, bold:true},

                        `a) Ser una Sociedad Anónima Promotora de Inversión de Capital Variable, constituida con la denominación “MIZRAFIN”, SAPI DE CV, SOFOM, ENR, bajo las leyes de la República Mexicana, mediante Escritura Número 106,219 libro 2340 de fecha 18 de agosto de 2008, ante la fe del Notario Público Número 30 del Distrito Federal, Licenciado Francisco Villalón Igartua, e inscrita en el Registro Público de la Propiedad y de Comercio del Distrito Federal, bajo el folio mercantil número 394800, el día 17 de febrero de 2009.
                        
                        
                        b) La sociedad es una Sociedad Financiera de Objeto Múltiple (SOFOM), Entidad No Regulada (E.N.R.), conforme al “DECRETO por el que se reforman, derogan y adicionan diversas disposiciones de la Ley General de Títulos y Operaciones de Crédito, Ley General de Organizaciones y Actividades Auxiliares del Crédito, Ley de Instituciones de Crédito, Ley General de Instituciones y Sociedades Mutualistas de Seguros, Ley Federal de Instituciones de Fianzas, Ley para Regular las Agrupaciones Financieras, Ley de Ahorro y Crédito Popular, Ley de Inversión Extranjera, Ley del Impuesto sobre la Renta, Ley del Impuesto al Valor Agregado y del Código Fiscal de la Federación” publicado en el Diario Oficial de la Federación el día 18 de julio de 2006; 
                        
                        c) En cumplimiento al Artículo 87-J vigente a la fecha de la Ley General de Organizaciones y Actividades Auxiliares del Crédito, se indica lo siguiente: La Sociedad opera como SOFOM ENR, y no requiere de la autorización de la Secretaría de Hacienda y Crédito Público, y no está sujeta a la supervisión y vigilancia de la Comisión Nacional Bancaria y de Valores, sino solamente de la Comisión Nacional para la Protección y Defensa de los Usuarios de Servicios Financieros (CONDUSEF).
                        
                        d) Personalidad El C. Chemaya Mizrahi Fernández, acredita su personalidad como Apoderado de “MIZRAFIN”, SAPI DE CV, SOFOM, ENR, mediante Póliza Pública número 1,363 libro 2 de fecha 10 de octubre de 2011, ante la fe del Corredor Público Número 70, del Distrito Federal, Licenciado Carlos Porcel Sastrías, e inscrita en el Registro Público de la Propiedad y de Comercio de la Ciudad de Lerma, Estado de México. bajo el folio mercantil número 2277*11, el día 30 de Mayo del 2012 y manifiesta bajo protesta de decir verdad que su poder y facultades son las necesarias para suscribir el presente contrato, y que no le han sido revocadas ni modificadas en forma alguna.
                        
                        e) Que previo a la firma del presente contrato solicitó y obtuvo de “EL FACTORADO”, el “GARANTE Y/O “OBLIGADO SOLIDARIO Y AVAL” su autorización para realizar la investigación sobre su historial crediticio en los términos de lo previsto por la Ley para Regular las Sociedades de Información Crediticia, 
                        
                        f) Que de conformidad con las estipulaciones contenidas en el artículo 95 bis de la Ley General de Organizaciones y Actividades Auxiliares del Crédito y demás disposiciones aplicables, manifiesta bajo protesta de decir verdad que los recursos objeto de este contrato son recursos de procedencia lícita y de actividades propias de “EL FACTORANTE” y la utilización de dichos recursos no contraviene en forma alguna ninguna legislación vigente, obligándose a proporcionar a las autoridades competentes, la información que le sea requerida.
                        
                        g) Tiene conocimiento del contenido y alcance del artículo 95 bis de la Ley General de Organizaciones y Actividades Auxiliares del Crédito, y en virtud de ello manifiesta que todas las transacciones, `
                    ], fontSize: 8
                },
                {
                    text: [
                        `depósitos y demás actos que se llegaren a realizar al amparo de este instrumento, han sido y serán con dinero producto del desarrollo normal de sus actividades y que tales recursos en ningún caso han provenido y se compromete que en el futuro no provengan de actividades ilícitas que tengan o puedan representar la comisión de cualquier delito y en especial los previstos en los artículos 139 Quater y 400 bis del Código Penal Federal.\n\n`,

                        {text: `II. Declara “EL FACTORADO”:\n\n`,bold:true},
                        
                        `a) Que sus datos generales son los que ya han quedado relacionados en la Hoja de Identificación que forma parte integral del presente contrato. 
                        
                        b) Que es una persona física capacitada legalmente para la celebración del presente contrato y para asumir y dar cumplimiento a las obligaciones que en el mismo se establecen, las cuales son válidas y exigibles en su contra y exhibiendo identificación oficial vigente con fotografía y firma, cuyo emisor y número están señalados en la Hoja de Identificación del presente contrato.
                        
                        c) Que su principal actividad es la relacionada en la Hoja de Identificación perteneciente al contrato.     
                        
                        d) Que con objeto de contar con recursos oportunos cuando así lo requiera, desea celebrar con “EL FACTORANTE” el presente contrato ya que regularmente, para el desarrollo adecuado de sus actividades, presta bienes y/o servicios a diversas personas morales (en lo sucesivo el “CLIENTE” o los “CLIENTES”).
                        
                        e) Que toda la documentación e información que ha entregado a “EL FACTORANTE” para el análisis y estudio de otorgamiento de crédito es correcta y verdadera.
                        
                        f) Que previo a la celebración del presente contrato otorgó a “EL FACTORANTE” su autorización por escrito para que realizará la investigación sobre su historial crediticio en los términos de lo previsto en la Ley para Regular las Sociedades de Información Crediticia, 
                        
                        g) Que de conformidad con las estipulaciones contenidas en el artículo 95 bis de la Ley General de Organizaciones y Actividades Auxiliares del Crédito y demás disposiciones aplicables, manifiesta bajo protesta de decir verdad que los recursos objeto de este contrato son recursos de procedencia lícita y de actividades propias de “EL FACTORADO” y no provienen de ningún tercero y la utilización de dichos recursos no contraviene en forma alguna ninguna legislación vigente, obligándose a proporcionar a las autoridades competentes, la información que le sea requerida.
                        
                        h) Tiene conocimiento del contenido y alcance del artículo 95 bis de la Ley General de Organizaciones y Actividades Auxiliares del Crédito, y en virtud de ello manifiesta que todas las transacciones, depósitos y demás actos que se llegaren a realizar al amparo de este instrumento, han sido y serán con dinero producto del desarrollo normal de sus actividades y que tales recursos en ningún caso han provenido y se compromete que en el futuro no provengan de actividades ilícitas que tengan o puedan representar la comisión de cualquier delito y en especial los previstos en los artículos 139 Quáter y 400 bis del Código Penal Federal.
                        `
                    ], fontSize: 8
                }
            ], columnGap: 40
        },
        {
            alignment: 'justify',
            columns: [
                {
                    text: [
                        `i) El factorado conoce que el presente financiamiento podrá ser fondeado con recursos provenientes de la misma institución financiera y/o de cualquier institución financiera del país o del extranjero, Banca de Desarrollo, Banca Comercial o cualquier otra fuente de fondeo con Nacional Financiera, la acreditada declara conocer que el crédito se otorga con el apoyo de Nacional Financiera, exclusivamente para fines de desarrollo nacional.\n\n`,

                        {text: `III.- Declara el “GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL”, que:\n\n`,bold:true},
                        
                        `a) Que son auténticos los datos generales, así como el domicilio que se señalan en la hoja de Identificación del presente contrato.
                        b) Es su interés participar en el presente contrato como `, {text:`“GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL” de “EL FACTORADO”`,bold:true}, `, respecto de las obligaciones contraídas por este último, sin perjuicio de tener el patrimonio suficiente para responder y, en su caso, cumplir con las obligaciones que asume.
                        
                        c) Que de conformidad con las estipulaciones contenidas en el artículo 95 bisde la Ley General de Organizaciones y Actividades Auxiliares del Crédito y demás disposiciones aplicables, manifiesta bajo protesta de decir verdad que los recursos objeto de este contrato son recursos de procedencia lícita y de actividades propias del “GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL” y no provienen de ningún tercero y la utilización de dichos recursos no contraviene en forma alguna ninguna legislación vigente, obligándose a proporcionar a las autoridades competentes, la información que le sea requerida.
                        
                        d) Tiene conocimiento del contenido y alcance del artículo 95 bis de la Ley General de Organizaciones y Actividades Auxiliares del Crédito, y en virtud de ello manifiesta que todas las transacciones, depósitos y demás actos que se llegaren a realizar al amparo de este instrumento, han sido y serán con dinero producto del desarrollo normal de sus actividades y que tales recursos en ningún caso han provenido y se compromete que en el futuro no provengan de actividades ilícitas que tengan o puedan representar la comisión de cualquier delito y en especial los previstos en los artículos 139 Quáter y 400 bis del Código Penal Federal.\n\n`,
                        {text:`IV.- Declaraciones que derivan de la Disposición Única de la Comisión Nacional para la Protección y Defensa de los Usuarios de los Servicios Financieros.\n\n`,bold:true},
                        
                        {text:`a)`,bold:true}, `El presente contrato considerado como de Adhesión se encuentra debidamente inscrito en el `, {text:`“Registro de Contratos de Adhesión”`,italics:true}, ` perteneciente a la Comisión Nacional para la Protección y Defensa de los Usuarios de los Servicios Financieros, bajo número `, {text:`2847-425-033753/01-03782-1120`,bold:true,decoration:'underline'},`,con fecha 5 de noviembre de 2020.\n\n`,
                        
                        {text:`V.-`,bold:true},` Atentas las partes a las declaraciones que anteceden, manifiestan su conformidad en otorgar el presente `, {text:`CONTRATO`,bold:true},`, al tenor de las siguientes:\n\n`,
                        
                        
                        {text:`CLÁUSULAS\n\n`,bold:true, alignment: 'center'},
                        
                        {text:`PRIMERA. DEFINICIÓN DE TÉRMINOS.`,bold:true},` Para los efectos del presente Contrato, los siguientes términos deben entenderse y tendrán el significado que se expresa a continuación y que serán igualmente aplicables tanto para el singular como para el plural de los mismos:
                        
                        CARÁTULA.- Documento que contiene las características particulares del presente contrato y que forma parte del mismo
                        `
                    ], fontSize: 8
                },
                {
                    text: [
                        `CONTRATO NORMATIVO DE FACTORAJE FINANCIERO: Es aquél mediante el cual las partes formalizan cada transmisión y adquisición de Derechos de Crédito.

                        DERECHOS DE CRÉDITO: Son las cantidades a favor del FACTORADO a cargo del Cliente que tengan su origen en el suministro de bienes o en la prestación de servicios que son motivo del presente Contrato, documentados en facturas, contra recibos, títulos de crédito u otros documentos denominados en Moneda Nacional o Extranjera, que acrediten la existencia de dichos Derechos.
                        FACTORANTE: Tiene el significado atribuido a dicho término en la hoja de identificación del presente contrato.
                        
                        FACTORADO: Tiene el significado atribuido a dicho término en la hoja de identificación del presente contrato.
                        
                        PAGARÉ DE LINEA: Documento que ampara el monto de la línea otorgada al FACTORADO y en cuyo caso se procederá mediante dicho documento a falta de pago de los Derechos de Crédito.
                        
                        TASA DE INTERÉS APLICABLE: Significa, respecto de cada CONTRATO DE FACTORAJE FINANCIERO, la tasa de interés que resulte de adicionar el número de puntos porcentuales que convengan las partes en cada CONTRATO DE FACTORAJE FINANCIERO a la TASA DE INTERÉS y que se aplicará sobre el PAGO que “EL FACTORADO” efectúe durante el PLAZO DE VIGENCIA del CONTRATO correspondiente.\n\n`,
                        
                        {text:`SEGUNDA.- OBJETO.`,bold:true},` “EL FACTORANTE” adquirirá las facturas, contra recibos, y títulos de crédito emitidos en favor de “EL FACTORADO”, con responsabilidad de éste, en lo sucesivo, en términos de la fracción II del Artículo 419 de la Ley General de Títulos y Operaciones de Crédito, por lo que “EL FACTORADO” es responsable del pago puntual y oportuno de los Créditos de aquellos “CLIENTES” previamente autorizados por “EL FACTORANTE” Y QUE HAYAN EMITIDO SU CONFORMIDAD, suscribiendo el consecutivo correspondiente del Anexo 2 (Contrato de Cesión de Derechos), y que son referidos en el Anexo 1 (Relación de personas emisoras de las que se pueden descontar derechos de crédito), del presente contrato mediante endoso de Pagarés, Letras de Cambio o demás títulos de créditos.
                        
                        Asimismo, las partes están de acuerdo en que durante la vigencia del presente contrato, “EL FACTORADO” podrá presentar a descuento nuevos DERECHOS DE CRÉDITO y “CLIENTE”S en cuyo caso se adicionara el indicado Anexo 2 (Contrato de Cesión de Derechos).\n\n`,
                        
                        {text:`TERCERA. TRANSMISIÓN DE DERECHOS.`,bold:true},` “EL FACTORADO” en este acto transmite, sin reserva ni limitación alguna a “EL FACTORANTE” y éste adquiere los Créditos objeto de este contrato.
                        
                        “EL FACTORADO” se obliga solidariamente con sus “CLIENTES”,  al pago total y puntual de los Créditos  de  conformidad  con  lo dispuesto  en  el Artículo 1988 del Código Civil Federal, así como en los Artículos 419, fracción II, 422, 423, y 426 de la LGTOC.\n\n`,
                        
                        {text:`Devoluciones.`,bold:true},` Si del acto jurídico que dio origen a los derechos de crédito se derivan devoluciones, los bienes correspondientes se entregarán a “EL FACTORADO”, salvo pacto en contrario.\n\n`,
                        
                        {text:`CUARTA. DESTINO Y APLICACIÓN DEL CRÉDITO.`,bold:true},` - 	"EL FACTORADO”, se obliga a destinar el Monto del Crédito a la actividad descrita en el punto número 2) de la Carátula de este contrato.
                        
                        "EL FACTORADO” se compromete y obliga a otorgar a “MIZRAFIN”, las facilidades necesarias para que verifique la exacta aplicación del Monto del Crédito, incluyendo, sin limitación, `
                    ], fontSize: 8
                }
            ], columnGap: 40, pageBreak: 'before'
        },
        {
          alignment: 'justify',
          columns: [
              {
                  text: [
                      `la facultad de realizar visitas de inspección, ya sea de escritorio o de campo, a las instalaciones, oficinas o propiedades de "EL FACTORADO” y de sus subsidiarias o afiliadas, así como para revisar su contabilidad y demás registros comerciales, financieros u operativos, para lo cual “EL FACTORADO” dará las facilidades necesarias.\n`,
                      {text:`QUINTA. VIGENCIA.`,bold:true},` Las partes convienen en que la vigencia del presente contrato será por el plazo de dos años. Dicho plazo  se  renovará  automáticamente  por  periodos iguales, salvo que cualquiera de las partes comunique a la otra, por escrito, su deseo de darlo por terminado con treinta días de anticipación.
                      
                      Aún y cuando el presente contrato o cualquiera de sus prórrogas llegué a su término, “EL FACTORADO” permanecerá obligado conforme a lo pactado a pagar a “EL FACTORANTE”, los DERECHOS DE CRÉDITO que esta última haya descontado y tengan un vencimiento posterior a dicha determinación, conforme a lo establecido en el presente contrato.
                      Cuando el contrato por acuerdo de las partes se haya terminado por anticipado, “EL FACTORANTE” entregará una constancia a “EL FACTORADO” dando constancia de la terminación de la relación, previa liquidación de los DERECHOS DE CRÉDITO vigentes.\n\n`,
                      
                      {text:`SEXTA. ENTREGA DE LA DOCUMENTACIÓN Y NOTIFICACIÓN.`,bold:true},` “El FACTORADO” entrega a “EL FACTORANTE” en este acto todos los documentos necesarios para realizar la cobranza y comprobar la existencia de los Créditos transmitidos, con los endosos en propiedad de los distintos Títulos De Crédito, o del formato que se incluye en el ANEXO 2 (Contrato de Cesión de Derechos), que debidamente firmado por las partes formará parte integral del presente contrato.\n\n`,
                      
                      {text:`SÉPTIMA.- NOTIFICACIÓN.`,bold:true},` Una vez adquiridos los Créditos, “EL FACTORANTE” efectuará  la notificación  de  la transmisión  de  los mismos, en términos de los estatutos por los Artículos 426, 427 de la LGTOC y 2038 del CCF, dentro de un plazo que no excederá de 10 (diez) días hábiles a partir de la fecha en que se operó la cesión correspondiente. La notificación deberá hacerse a través de cualquiera de las formas siguientes:
                      
                      I.	Entrega del documento o documentos comprobatorios del derecho de crédito en los que conste el sello o leyenda relativa a la transmisión y acuse de recibo por el deudor mediante contraseña, contra recibo o cualquier otro signo inequívoco de recepción;
                      II.	Comunicación por correo certificado con acuse de recibo, telegrama, télex o tele facsímil, contraseñados que deje evidencia de su recepción por parte del deudor;
                      III.	Notificación realizada por fedatario público; y
                      IV.	Mensajes de datos, en los términos del Título Segundo del Libro Segundo del Código de Comercio vigente.\n\n`,

                      
                      {text:`OCTAVA. INFORMACIÓN ADICIONAL.`,bold:true},` “EL FACTORADO” proporcionará a “EL FACTORANTE” toda la información que tenga respecto a los “CLIENTES”, así como la información sobre el origen, naturaleza, términos y condiciones de los Créditos.
                      
                      “EL FACTORANTE” podrá revisar en días y horas hábiles, en las oficinas de “EL FACTORADO”, cualquier información o documento que el mismo tenga en relación de los Créditos transmitidos.\n\n`,
                      
                      {text:`NOVENA FONDEO.`,bold:true},` Cuando alguna disposición sujeta al presente contrato sea fondeada con recursos provenientes de cualquier institución financiera del país o del extranjero, Banca de Desarrollo, Banca Comercial o cualquier otra fuente de fondeo con Nacional Financiera y/o Financiera Nacional, “EL FACTORADO” deberá proporcionar toda la información que estos le requieran, `
                  ], fontSize: 8
              },
              {
                  text: [
                     `respecto de los créditos descontados; así mismo otorgar todas la facilidades al personal de dichas entidades o a quien estas designen, para la supervisión y evaluación de sus actividades, registros y documentos relacionados con los créditos descontados conforme al programa de inversiones contratado.
                     Cuando una parte o la totalidad de la línea de crédito que ampara el presente contrato sea Fondeada con recursos del Banco Mundial, “MIZRAFIN” deberá informar a “EL FACTORADO” haciendo entrega de la Guía Anticorrupción que será proporcionada por la Institución correspondiente, obteniendo de “EL FACTORADO”: 
                     a.	Declaración donde manifieste que recibió la Guía señalada en el párrafo anterior, y que está de acuerdo con su cumplimiento;
                     b.	Compromiso de seguir prácticas comerciales lícitas para la adquisición de los bienes y/o servicios para los que contrato el crédito.\n\n`,
                     {text:`DÉCIMA. REQUISITOS PARA EL FACTORAJE FINANCIERO.`,bold:true},` LAS PARTES están de acuerdo en que los derechos de crédito materia del Factoraje Financiero, deben sujetarse a los requisitos que se mencionan a continuación:
                     
                     1. Se deberán entregar a satisfacción de “EL FACTORANTE” la documentación original que sustente los DERECHOS DE CRÉDITO conforme:
                     
                     a)	A los términos a que se refiere el Anexo 2 (Contrato de Cesión de Derechos), del presente contrato y,
                     b)	Pagarés, Letras de Cambio, Contra recibos y demás Títulos de Crédito debidamente endosados.
                     
                     2. Estar denominados en`, {text:`PESOS MONEDA NACIONAL`,bold:true},` y encontrarse vigentes.
                     
                     3. No tener vencimientos mayores a 180 (ciento ochenta) días naturales.
                     4. Ser presentados a descuento a “EL FACTORANTE”, `,{text:`cuando menos 30 (treinta) días naturales antes de las fechas de sus respectivos vencimientos.\n\n`,bold:true},
                     
                     `5. Ser originados a favor del “EL FACTORADO” con motivo de la proveeduría regular de bienes y/o servicios que realiza por virtud de su actividad empresarial, los cuales deberán ser exigibles al “CLIENTE” a plazo determinado, salvo pacto entre LAS PARTES.
                     
                     6. Acreditar su existencia y ser pagaderos por el “CLIENTE” en una sola exhibición.
                     
                     7. Encontrarse libres de todo gravamen o garantía alguna, que afecte o pueda afectar su pago total y oportuno.\n\n`,
                     
                     
                     {text:`DÉCIMA PRIMERA.`,bold:true},` CONDICIONES PARA EL FACTORAJE FINANCIERO. La realización de las operaciones previstas en el presente contrato, estarán sujetas a las siguientes condiciones:
                     
                     1. Los DERECHOS DE CRÉDITO deberán reunir todos los requisitos establecidos en el Anexo 2 de este contrato y Pagarés, Letras de Cambio, Contra recibos y demás Títulos de Crédito debidamente endosados.
                     
                     2. “EL FACTORADO” se abstendrá de presentar a descuento cualquier DERECHO DE CRÉDITO respecto del cual tenga conocimiento de la existencia de algún derecho de compensación o reclamo de cualquier naturaleza por parte del “CLIENTE” que tenga a su cargo dicho derechos, que afecte o pueda afectar el pago total y oportuno que correspondan a “EL FACTORANTE”.
                     `
                  ], fontSize: 8
              }
          ], columnGap: 40, pageBreak: 'before'
      },
      {
        alignment: 'justify',
        columns: [
            {
                text: [
                    `3. “EL FACTORADO” se abstendrá de presentar a descuento cualquier DERECHO DE CRÉDITO respecto del cual tenga conocimiento de la existencia de alguna situación que afecte o pueda afectar la capacidad económica de pago total y oportuno de dicho DERECHO DE CRÉDITO por parte del “CLIENTE”.

                    4. Sin perjuicio o limitación de las demás causas previstas en este contrato, “EL FACTORANTE” podrá negarse a efectuar cualquier operación a amparo de este contrato cuando así lo considere conveniente.\n\n`,
                    
                    {text:`DECIMA SEGUNDA. EXISTENCIA DE LOS DERECHOS DE CRÉDITO.`,bold:true},` “EL FACTORANTE” podrá solicitar a “EL FACTORADO” la información que juzgue necesaria o conveniente para comprobar la existencia de los DERECHOS DE CRÉDITO y la solvencia de los “CLIENTES”.\n\n`,
                    
                    {text:`DÉCIMA TERCERA. DETERMINACIÓN Y PAGO DEL IMPORTE DEL FACTORAJE. `,bold:true},`Como contraprestación en favor de “EL FACTORADO” por la transmisión de cada DERECHO DE CRÉDITO, “EL FACTORANTE” entregará a “EL FACTORADO” el importe descontado correspondiente de conformidad con el cálculo que a continuación se describe:\n\n`,
                    
                    {text:`1. TASA DE INTERÉS ORDINARIA. SE DETERMINARÁ LA TASA DE DESCUENTO, QUE SERÁ UNA TASA FIJA, `,bold:true},{text:`la cual está establecida en la caratula perteneciente del contrato,`,bold:true,decoration: 'underline'},` dicha tasa se multiplicará por el monto de la operación real después de aforos, por el número de días que transcurran entre la fecha en que se lleve a cabo el descuento del DERECHO DE CRÉDITO y la fecha de vencimiento del mismo, entre 360 (Trescientos sesenta días), base anual financiera. El cálculo de descuento al factoraje se realiza de la manera siguiente: `,{text:`(IMPORTE REAL PARA FACTORAJE * TASA DE DESCUENTO ANUAL * DIAS DE PLAZO / BASE ANUAL DE DIAS 360).\n\n`,bold:true},
                    {text:`2. TASA DE INTERÉS MORATORIA. SE DETERMINARÁ LA TASA DE DESCUENTO POR MORA, QUE SERÁ UNA TASA FIJA, `,bold:true},{text:`la cual está establecida en la caratula perteneciente del contrato.`,bold:true,decoration:'underline'},`  Se entiende por INTERESES MORATORIOS, al resultado que se obtenga de multiplicar por dos (2) la TASA DE DESCUENTO VIGENTE que haya sido pactada por LAS PARTES. Los INTERESES MORATORIOS serán calculados por los días transcurridos entre la fecha estipulada de pago entre LAS PARTES, indicada en el ANEXO 2 o en los distintos Títulos de Crédito operados, y la fecha en que efectivamente se realiza el pago, definiéndose el intervalo como periodo de incumplimiento. El método de cálculo es el siguiente: `,{text:`(IMPORTE * 2 VECES TASA ANUAL / 360 DIAS * DIAS ATRASO).\n`,bold:true},
                    `Los INTERESES MORATORIOS aplican para los casos en que “EL FACTORADO” no hiciere el pago oportuno a “EL FACTORANTE” en la fecha de pago indicada en el ANEXO 2, o en los distintos Títulos Crédito operados de cada uno de sus DERECHOS DE CRÉDITO descontados, o bien no le hiciere la entrega a “EL FACTORANTE” de las cantidades recibidas en pago por sus DERECHOS DE CRÉDITO por parte de su “CLIENTE” en caso de cobranza delegada, “EL FACTORADO” pagará a “EL FACTORANTE” los INTERESES MORATORIOS, durante todo el periodo en que dure su incumplimiento. 
                    
                    1.	Al total de cada DERECHO DE CRÉDITO TRANSMITIDO se le disminuirá la tasa de descuento y el resultante será el importe a pagar a “EL FACTORADO”, misma que se le cubrirá por “EL FACTORANTE” a más tardar al día siguiente de la presentación del DERECHO DE CRÉDITO.
                    
                    2.	COMISIONES. Se realizará un cobro de comisión por cada operación. 
                    La comisión se cobra utilizando como `, {text:`metodología de cálculo`,decoration:'underline'},` la cantidad resultante de multiplicar un porcentaje fijo por el monto total de cada uno de los DERECHOS DE CRÉDITO objeto de `
                ], fontSize: 8
            },
            {
                text: [
                   `descuento, resultando de ello el cobro de la cantidad resultante, más el correspondiente Impuesto al Valor Agregado (IVA). Dicha comisión se cubrirá al momento de entregar a “EL FACTORADO” los DERECHOS DE CRÉDITO para su descuento, y su `, {text:`periodicidad`,decoration:'underline'},` es por operación (se cobran la comisión por cada operación). La comisión se cobrará sobre el monto total de la operación de factoraje efectivamente realizada (no sobre montos aforados). El cobro es independiente al plazo de vencimiento, y sólo es un porcentaje del valor de la suma de la cesión de derechos descontada en la operación. `,{text:`“EL FACTORADO” PAGARÁ LA COMISIÓN SEÑALADA EN LA CARATULA REFERANTE AL PRESENTE CONTRATO AL FACTORANTE POR CADA OPERACIÓN,`,bold:true},` sobre el monto total de cada uno de los DERECHOS DE CRÉDITO objeto de descuento, más el correspondiente Impuesto al Valor Agregado (IVA). No podrán haber `,{text:`comisiones duplicadas`,bold:true},` bajo ninguna circunstancia, tampoco en reestructuras de crédito.\n\n`,

                   {text:`DÉCIMA CUARTA. FORMA Y LUGAR DEL PAGO.`,bold:true},` Las cantidades debidas por “EL FACTORADO” a “EL FACTORANTE” con motivo de operaciones relacionadas con el presente contrato se cubrirán mediante abono a la cuenta que “EL FACTORANTE” mantiene abierta a su nombre en el banco `,{text:`BANCOMER`,bold:true},` con el número `,{text:`0163074501`,bold:true,decoration:'underline'},` clabe `,{text:`012420001630745014`,bold:true,decoration:'underline'},` ó `,{text:`BANORTE`,bold:true},` con el número `,{text:`00586880139`,bold:true,decoration:'underline'},` clabe `,{text:`072420005868801397`,bold:true,decoration:'underline'},` y serán pagaderas en la fecha de su vencimiento conforme a lo pactado en el presente contrato, sin necesidad de previo requerimiento. En caso de que alguna de las fechas en que “EL FACTORADO” deba realizar un pago en un día inhábil, el pago respectivo deberá efectuarse el día hábil inmediato siguiente. 
                   
                   Las cantidades debidas por “EL FACTORADO” a “EL FACTORANTE” con motivo de operaciones relacionadas con el presente contrato se cubrirán mediante transferencia electrónicas con cheque a cargo del banco designado y serán pagaderas en la fecha de su vencimiento conforme a lo pactado en el presente contrato, sin necesidad de previo requerimiento.
                   En caso de que “EL FACTORANTE” realice alguna modificación en sus cuentas bancarias este hará de su conocimiento a “EL FACTORADO” para los fines convenientes.\n\n`,
                   
                   {text:`DÉCIMA QUINTA. PAGARÉ.`,bold:true},` De conformidad con lo establecido en el Artículo 424 de la LGTOC, en la fecha de firma del presente contrato, “EL FACTORADO” y el OBLIGADO SOLIDARIO Y AVAL suscriben y entregan un pagaré de línea en favor de “EL FACTORANTE” que documenten la(s) disposiciones que “EL FACTORADO” realice respecto del importe otorgado. Dicho pagaré deberá ser suscrito adicionalmente por el OBLIGADO SOLIDARIO Y AVAL en caso de la existencia del mismo. También se respaldarán las operaciones con el contrato de cesión de derechos de cobro integrado en el contrato como ANEXO 2, así como el endoso de los Títulos de Crédito para cada una de las operaciones, mismo que deberá integrar los títulos de crédito o instrumentos de cobranza cedidas a favor de “EL FACTORANTE” para su registro debido en el RUG (Registro Único de Garantías), de la Secretaría de Economía (SE).
                   
                   Los mencionados títulos de crédito reunirán las características de la normatividad vigente a que se refiere el Artículo 170 de la LGTOC. “EL FACTORADO” autoriza expresamente a “EL FACTORANTE” a ceder, negociar y re descontar los títulos de crédito así suscritos, en cuyo evento subsistirán las garantías concedidas, sin que ello implique responsabilidad alguna para “EL FACTORANTE”.
                   
                   Dado que las operaciones de cesión de DERECHOS DE CRÉDITO son en modalidad de factoraje, “EL FACTORADO” deberá siempre documentar las cesiones de derecho de cobro por medio del ANEXO 2 o endoso de los Títulos de Crédito y el PAGARÉ de línea fungiendo como obligado solidario y aval de las operaciones.
                   `
                ], fontSize: 8
            }
        ], columnGap: 40, pageBreak: 'before'
    },
		{
      alignment: 'justify',
      columns: [
          {
              text: [
                  `Asimismo, no puede considerarse a la suscripción y entrega de los pagarés como pago o dación en pago de la obligación documentada, sino como una garantía colateral del pago, que deberá ser depositado a “EL FACTORANTE” mediante transferencia a las cuentas indicadas en la Cláusula Décima Segunda.\n\n`,

                  {text:`DÉCIMA SEXTA. ORDEN DE PRELACIÓN DE PAGO.`,bold:true},` El orden de prelación en la aplicación de los pagos de adeudos hechos por “EL FACTORADO” será el siguiente:
                  
                  a) Otros gastos y costos derivados del presente contrato.
                  b) Comisiones.
                  c) Intereses Moratorios
                  d) Intereses Ordinarios.
                  e) Capital\n\n`,
                  
                  {text:`Fecha de Pago.-`,bold:true},` La fecha de pago de las operaciones, será indicada de forma distinta para cada operación realizada sobre los DERECHOS DE CRÉDITO descontados en las diferentes operaciones. Por tanto, habrá que acudir al Anexo 2 (Contrato de Cesión de Derechos) o los distintos títulos de Crédito, donde se enlistarán los vencimientos correspondientes a cada uno de los DERECHOS DE CRÉDITO cedidos por “EL FACTORADO” a “EL FACTORANTE”.\n\n`,
                  
                  {text:`Monto Total a Pagar.-`,bold:true},` El monto total a pagar será definido particularmente de acuerdo a cada operación individual de cesión de DERECHOS DE CRÉDITO. El monto indicado correspondiente a cada operación, se encuentra dentro del Anexo 2 (Contrato de Cesión de Derechos) dentro de la tabla que relaciona los montos a pagar por cada operación de factoraje realizada; así como en los distintos Títulos de Créditos operados.\n\n`,
                  
                  {text:`DÉCIMA SÉPTIMA	. OBLIGACIONES DE “EL FACTORADO”.`,bold:true},` “EL FACTORADO”, sin necesidad de requerimiento judicial o extrajudicial, se obliga a devolver dentro del DIA HÁBIL inmediato siguiente a la solicitud que le efectúe “EL FACTORANTE”, las cantidades que haya recibido por cada uno de aquellos DERECHOS DE CRÉDITO descontados aún no vencidos, para el caso de que se den cualesquiera de los supuestos que a continuación se mencionan:
                  
                  1. Si “EL FACTORADO” presentase a “EL FACTORANTE” información o declaraciones que resulten falsas.
                  
                  2. Si “EL FACTORADO” presenta a descuento DERECHOS DE CRÉDITO que no reúnan cualquiera de los requisitos establecidos en el presente contrato.
                  
                  En caso de que “EL FACTORADO” no devuelva las cantidades a que se refiere el primer párrafo de esta cláusula, se entenderá que ha actuado con mala fe con la intención de cometer fraude y falsificación de información con dolo.\n\n`,
                   
                  {text:`DÉCIMA OCTAVA. COBRANZA DE LOS DERECHOS DE CRÉDITO DESCONTADOS.`,bold:true},` “EL FACTORANTE” se encargara de la cobranza de los DERECHOS DE CRÉDITO descontados, a cuyo efecto “EL FACTORANTE” notificara al “CLIENTE” la transmisión de dichos DERECHOS DE CRÉDITO. “EL FACTORADO” se obliga a proporcionar a “EL FACTORANTE” toda la información y colaboración que razonablemente le sea solicitada por “EL FACTORANTE” para tal fin.
                  
                  En caso que el “CLIENTE” pague directamente a “EL FACTORADO” los DERECHOS DE CRÉDITO descontados, aún y cuando ello obedezca a falta de notificación por parte de “EL FACTORANTE” al “CLIENTE” de la transmisión de los DERECHOS DE CRÉDITO, “EL FACTORADO” entregará a “EL FACTORANTE” el importe total del pago recibido a la brevedad `
              ], fontSize: 8
          },
          {
              text: [
                 `posible, y en su defecto, a más tardar DIEZ DÍAS HÁBILES después de haberlo recibido, al respecto acuerdan LAS PARTES que en dicho supuesto “EL FACTORADO” tendrá el carácter de depositario respecto de las cantidades recibidas, en los términos del artículo 332, 334, 335 y demás relativos del Código de Comercio, con todas las obligaciones inherentes a dicho cargo, el cual será gratuitamente desempeñado por el Depositario, quién en este acto acepta dicho cargo. Esta operación también se denomina como un factoraje con Cobranza Delegada.

                 Si “EL FACTORADO” no hiciere entrega a “EL FACTORANTE” de las cantidades recibidas en el plazo señalado en el párrafo anterior, en adición a cualquier responsabilidad civil o penal en que incurra, “EL FACTORADO” pagará a “EL FACTORANTE” los INTERESES MORATORIOS, que enseguida se definen, durante todo el periodo en que dure su incumplimiento, definidos en el punto 2 en la Cláusula Decima Primera del presente contrato.\n\n`,
                 
                 {text:`DÉCIMA NOVENA. CESIÓN DE DERECHOS.`,bold:true},` “EL FACTORADO” y en su caso, el “GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL”, autoriza(n) expresamente a “EL FACTORANTE” para transmitir, endosar, ceder, descontar o en cualquier otra forma negociar parcial o totalmente los contratos y los pagarés que documenten la presente operación bajo las modalidades y para los efectos que más convengan a “EL FACTORANTE”, comprendiendo incluso todos los derechos accesorios, así como los derechos, en su caso, sobre los bienes muebles y/o inmuebles otorgados en garantía, aún antes de su vencimiento, manifestando también “EL FACTORADO” y en su caso, el “GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL, su voluntad de reconocer a los que se les transmitan los derechos antes mencionados o endosatarios o cesionarios, los mismos derechos que corresponden a “EL FACTORANTE”, sin más requisitos que notificar a “EL FACTORADO” y en su caso, el GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL, respecto de la Cesión, en términos de las disposiciones jurídicas aplicables, salvo que “EL FACTORANTE” conserve la administración del crédito y éste sea garantizado con hipoteca, en cuyo caso no será necesario notificar a “EL FACTORADO” ni, en su caso, el GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL, en los términos del artículo 2926 del Código Civil Federal y demás correlativos aplicables de los Códigos Civiles del Distrito Federal.
                 Asimismo, “EL FACTORADO” y en su caso, el “GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL”, autorizan expresamente a “EL FACTORANTE” para endosar, o en cualquier otra forma, negociar, aún antes del vencimiento de este Contrato, el o los Títulos de crédito mediante los cuales se ha documentado el crédito, teniendo para esos fines el carácter de Mandatario de los tenedores de los títulos de crédito, en virtud que en este supuesto subsistirá la obligación de “EL FACTORANTE”, de vigilar y conservar las garantías otorgadas. En tal virtud, “EL FACTORANTE”, queda facultado para ceder o descontar el crédito así documentado.
                 
                 “EL FACTORADO” no podrá ceder los derechos y obligaciones que le corresponden en virtud de este contrato, sin el consentimiento previo y por escrito de “EL FACTORANTE”.\n\n`,
                 
                 {text:`VIGÉSIMA. ESTADOS DE CUENTA.`,bold:true},` “EL FACTORADO” en este acto exime a “EL FACTORANTE” de la obligación de enviarle los estados de cuenta a su domicilio, obligándose “EL FACTORANTE” a ponerlos a su disposición dentro de los diez días hábiles siguientes a la fecha de corte para el pago de intereses, a través del correo electrónico de “EL FACTORADO”, el cual ha quedado señalado en la Hoja de Identificación del presente contrato.
                   
                 `
              ], fontSize: 8
          }
      ], columnGap: 40, pageBreak: 'before'
  },
  {
    alignment: 'justify',
    columns: [
        {
            text: [
                `Los estados de cuenta indicarán los adeudos del financiamiento contratado, desglosado por los conceptos de capital e intereses, vigentes y vencidos, comisiones y otros conceptos aplicables. 
                “EL FACTORANTE”, pondrá a disposición y de manera gratuita a “EL FACTORADO” una copia del estado de cuenta, a partir del séptimo día hábil siguiente a la fecha de corte.
                 
                “EL FACTORADO” contará con un plazo de 30 (treinta) días naturales para en su caso objetar el mismo, transcurrido dicho plazo se entenderá que no tiene objeción alguna.\n\n`,
                
                {text:`VIGÉSIMA PRIMER. DE LA SUPERVISIÓN.`,bold:true},` A partir de esta fecha y durante todo el tiempo que "EL FACTORADO” adeude alguna cantidad a “EL FACTORANTE” por motivo de este contrato, ésta tendrá el derecho de nombrar un supervisor que vigile el exacto cumplimiento de las obligaciones de "EL FACTORADO” asumidas en este contrato, bajo un previo aviso de 5 (cinco) días hábiles.
                El supervisor que se nombre, atendiendo al aviso y plazo mencionado en el párrafo anterior, tendrá libre acceso a las oficinas, instalaciones, libros de contabilidad y documentos del negocio de "EL FACTORADO” relacionados con el proyecto para el cual se destina el crédito y siempre y cuando no sean de carácter confidencial, la cual se obliga a otorgar al supervisor todas las facilidades necesarias para que cumpla con su cometido.
                Si como resultado de las verificaciones e inspecciones que “MIZRAFIN” realice a través de su Supervisor, detecta alguna situación que no sea de su conformidad, se le hará saber a "EL FACTORADO” para su corrección dentro del plazo que “EL FACTOTANTE” le otorgue, en el que "EL FACTORADO” deberá solventar las aclaraciones que correspondan y si a juicio de “EL FACTOTANTE” la situación que se presente pone en riesgo la recuperación del Crédito, emprenderá las acciones que salvaguarden sus intereses, incluyendo en éstas la rescisión de este contrato de Crédito.\n\n`,
                
                {text:`VIGÉSIMA SEGUNDA. TERMINACIÓN ANTICIPADA.`,bold:true},` Serán causas de terminación del presente contrato las siguientes:
                
                1. El mutuo acuerdo firmado por LAS PARTES.
                
                2. El incumplimiento de “EL FACTORADO” a cualquiera de las obligaciones a su cargo estipuladas en el presente contrato, en este caso, “EL FACTORANTE” podrá declarar por vencida anticipadamente la vigencia original del presente contrato o la vigencia de cualquiera de sus prórrogas.
                
                “EL FACTORADO” podrá solicitar en todo momento la terminación anticipada, debiendo cubrir en su caso y en los términos pactados, el monto total del adeudo, incluyendo todos los accesorios financieros que éste hubiera generado a la fecha en que se solicite la terminación anticipada del contrato, bastando para ello la presentación de una solicitud por escrito en cualquier oficina de “EL FACTORANTE”.\n\n`,
                {text:`VIGESIMA TERCERA. GASTOS Y COSTOS.`,bold:true},` “EL FACTORADO” pagará a “EL FACTORANTE” cualquier costo, gasto o pérdida en que incurra “EL FACTORANTE” por la ejecución y/o ratificación ante fe pública del presente contrato.\n\n`,
                
                {text:`VIGESIMA CUARTA. ANTICIPOS.`,bold:true},` “EL FACTORANTE”, se exime de cualquier obligación para devolver o regresar intereses o comisiones a “EL FACTORADO” por concepto de pagos adelantados o anticipos efectuados.\n\n`,
                
                {text:`VIGÉSIMA QUINTA. MODIFICACIONES AL CONTRATO.`,bold:true},` Ninguna modificación o renuncia a disposición alguna de este Contrato y ningún consentimiento dado a “EL FACTORADO” para divergir del Contrato surtirá efectos, a menos que conste por escrito y se suscriba por “EL FACTORANTE” y “EL FACTORADO”, y aún en dicho supuesto, tal renuncia o `
            ], fontSize: 8
        },
        {
            text: [
                
               `consentimiento tendrá efecto solamente en el caso y para el fin específico para el cual fue otorgado.
               “EL FACTORANTE” podrá modificar el contrato conforme a sus políticas de negocio, aumentar, disminuir o modificar los requisitos del factoraje de acuerdo a lo siguiente:
               
               a) Con diez días naturales de anticipación a la entrada en vigor, deberá notificar a “EL FACTORADO” las modificaciones propuestas mediante aviso incluido en el estado de cuenta correspondiente. El aviso deberá especificar de forma notoria la fecha en que las modificaciones surtirán efecto.
               
               b) En el evento de que “EL FACTORADO” no esté de acuerdo con las modificaciones propuestas, podrá solicitar la terminación del contrato hasta 60 días naturales después de la entrada en vigor de dichas modificaciones, sin responsabilidad ni comisión alguna a su cargo, debiendo cubrir, en su caso, los adeudos que ya se hubieren generado a la fecha en que se solicite la terminación. O bien, se entenderá su aceptación tácita, por parte de “EL FACTORADO”, por el simple hecho de que presente una nueva operación a descuento.
               
               Lo anterior, con excepción a las modificaciones realizadas a la información a que se refieren las cláusulas, DÉCIMO QUINTA, DÉCIMO NOVENA, VIGESIMA Y VIGÉSIMA SEGUNDA, en cuanto a servicios y atención a usuarios.
               
               c) Una vez transcurrido el plazo señalado en el inciso anterior sin que “EL FACTORANTE” haya recibido comunicación alguna por parte de “EL FACTORADO”, se tendrán por aceptadas las modificaciones.\n\n`,
               
               {text:`VIGÉSIMA SEXTA. DE LA INFORMACIÓN CREDITICIA.`,bold:true},` “EL FACTORADO” manifiesta expresamente que es de su conocimiento que las Sociedades de Información Crediticia tienen por objeto prestar servicios de información sobre las operaciones financieras que realizan con personas físicas y/o morales, por lo que “EL FACTORADO” no tiene ningún inconveniente y está de acuerdo en que EL FACTORANTE proporcione información relativa a las operaciones contempladas en el presente contrato. Asimismo, “EL FACTORADO” autoriza expresamente a “EL FACTORANTE” para que a través de sus funcionarios facultados lleve a cabo investigaciones sobre su comportamiento crediticio en las Sociedades de Información Crediticia que estime conveniente. “EL FACTORADO” manifiesta que conoce la naturaleza y alcance de la información que se solicitó, del uso que “EL FACTORANTE” hará de tal información y de que EL FACTORANTE podrá realizar consultas periódicas de su historial crediticio, consintiendo que la autorización concedida se encuentre vigente por un período de 3 (tres) años contados a partir de la fecha de su expedición y en todo caso durante el tiempo en que se mantenga una relación jurídica entre “EL FACTORADO” y “EL FACTORANTE”.
               “EL FACTORADO” renuncia expresamente al ejercicio de cualquier acción legal en contra de “EL FACTORANTE” que derive o sea consecuencia de que éste haya hecho uso  de las  facultades  conferidas  en  la presente cláusula.\n\n`,
               
               {text:`VIGÉSIMA SÉPTIMA. ATENCIÓN A USUARIOS.`,bold:true},` La Comisión Nacional para la Protección y Defensa de los Usuarios de Servicios Financieros (CONDUSEF), brindara atención a usuarios vía telefónica al número 53-400-999 o Lada sin costo 01-800-999-80-80, a través de su página de Internet en www.condusef.gob.mx y por medio de su correo electrónico opinion@condusef.gob.mx
               
               En el caso de modificaciones a los datos antes mencionados, la Comisión Nacional para la Protección y Defensa de los Usuarios de Servicios Financieros (CONDUSEF) lo hará del conocimiento de las Sociedades Financieras de Objeto Múltiple, Entidades No `
            ], fontSize: 8
        }
    ], columnGap: 40, pageBreak: 'before'
},
{
  alignment: 'justify',
  columns: [
      {
          text: [
              `Reguladas a través de su página web, con 30 días naturales de anticipación.

              Para la atención a usuarios por parte de “EL FACTORANTE”. La unidad especializada será la ubicada en Av. Circuito de la Industria Ote. 36 y 38, Parque Industrial Lerma, Lerma Edo. de México, C.P.52000 o a través de sus líneas telefónicas en los números (728) 282 7272 Ext. 134.\n\n`,
              
              {text:`VIGÉSIMA OCTAVA. SOLICITUDES, CONSULTAS, ACLARACIONES, INCONFORMIDADES Y QUEJAS.`,bold:true},` El proceso y los requisitos para la presentación y seguimiento de las solicitudes, consultas, aclaraciones, inconformidades y quejas será el siguiente: 
              
              1.	Presentar la queja, duda, comentario, pregunta o sugerencia por escrito al correo electrónico: atencion_usuario@mizrafin.com 
              
              2.	El usuario o “CLIENTE” obtendrá una respuesta por escrito que tratará de resolver la cuestión. Tal respuesta, contará con un número de folio específico proveído por EL FACTORANTE.
              
              3.	Si la cuestión planteada por el usuario no fuese resuelta, el usuario podrá comunicarse al teléfono (728) 282 7272, Ext. 134, refiriendo su caso mediante el número de folio que le fue proveído en la respuesta escrita a su queja y ser atendido por el personal de la unidad especializada de atención al usuario de ””EL FACTORANTE”
              
              De no estar conforme con la atención y resolución que se haya dado vía telefónica, el usuario podrá acudir directamente a las oficinas ubicadas en `,{text:`Av. Circuito de la Industria Ote. 36 y 38, Parque Industrial Lerma, Lerma, Edo. de México, C.P.52000`,decoration:'underline'},`, y resolver así su cuestión directamente con la unidad especializada de atención al usuario.
              
              Como última instancia de ser fallidas las anteriores, el usuario podrá acudir directamente a la Comisión Nacional para la Protección y Defensa de los Usuarios de Servicios Financieros (CONDUSEF). Sirviendo como oficina de enlace para atender los requerimientos las ubicadas en: Av. Circuito de la Industria Ote.36 y 38, Parque Industrial Lerma, Lerma, Edo. de México, C.P.52000. o a través de sus líneas telefónicas en los números: `,{text:`(728) 282 7272 Ext. 134,\n\n`,bold:true}, 
              
              {text:`VIGÉSIMA NOVENA. DOMICILIO PARA NOTIFICACIONES.`,bold:true},` Todas las notificaciones deberán hacerse por escrito y se considerarán debidamente efectuadas si se mandan a los siguientes domicilios.\n\n`,
              
              {text:`“EL FACTORANTE”:`,bold:true},` El ubicado en `,{text:`Av. Circuito de la Industria Ote. 36 y 38, Parque Industrial Lerma, Lerma, Edo. de México, C.P.52000.\n\n`,bold:true},
              
               {text:`“EL FACTORADO”: El domicilio señalado en la Hoja de Identificación del presente contrato.\n\n`,bold:true},
              
              {text:`El “GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL”: El domicilio señalado en la Hoja de Identificación del presente contrato.\n\n`,bold:true},
               
              `Mientras las partes no se notifiquen el cambio de sus domicilios, los emplazamientos, notificaciones y demás diligencias judiciales y extrajudiciales se practicarán y surtirán todos sus efectos legales en los domicilios señalados en la presente cláusula. 
              
              Las partes convienen que las notificaciones a que se refiere la presente cláusula no se podrán efectuar a través o por medios electrónicos, ópticos o de cualquier otra tecnología, no obstante `
          ], fontSize: 8
      },
      {
          text: [
              
             `de que dichos medios puedan ser atribuibles a las mismas, o bien de que éstos sean accesibles de ser consultados en forma ulterior.\n\n`,

             {text:`TRIGÉSIMA. COMPROBANTES DE OPERACIÓN.`,bold:true},` “EL FACTORANTE” pondrá a disposición de “EL FACTORADO” los comprobantes que documenten las transacciones efectuadas por medio de Contratos de Cesión referido en el Anexo 2, o endoso de Títulos de Crédito ya sea a través de su entrega física, o a través de un medio electrónico o de telecomunicaciones, dependiendo el medio por el que se haya celebrado la operación.
             
             La información contenida en los mismos deberá ser veraz, precisa, clara, completa, objetiva, actualizada, oportuna y que “EL FACTORADO” pueda confirmar la operación llevada a cabo.
             
             Los comprobantes que “EL FACTORANTE” emitan en sus oficinas o sucursales deberán contar con la calidad suficiente para que no se borren ni se deterioren en un plazo mínimo de 90 días naturales, debiendo contener al menos:
             
             a) Identificación de “EL FACTORANTE” u oficina, en donde la operación haya sido efectuada.
             b) Monto de la operación.
             c) Tipo de operación efectuada.
             d) Los datos de identificación de la cuenta o contrato en el que se efectuó la operación.
             e) En su caso, las Comisiones cobradas en la operación.
             f) Plaza geográfica donde la operación haya sido efectuada.
             g) Fecha y hora de la operación.
             h) Los datos de localización de la Unidad Especializada de “EL FACTORANTE”.\n\n`,
             
             {text:`TRIGÉSIMA PRIMERA. JURISDICCIÓN.`,bold:true},` Las partes se someten expresamente a la jurisdicción de las leyes y de los Tribunales competentes de la Ciudad de Lerma, Estado de México, para todo lo relativo a la interpretación y cumplimiento de este contrato, renunciando al fuero que por cualquier razón pudiera corresponderle.\n\n`,
             {text:`TRIGÉSIMA SEGUNDA. INTERCAMBIO DE INFORMACIÓN.`,bold:true},` Efectuar por sí o mediante tercero, cualquier tipo de investigación presente y futura, en lo que respecta a sus relaciones financieras particularmente crediticias, con Sociedades Financieras de Objeto Múltiple, Sociedades Financieras de Objeto Limitado, Instituciones de Crédito, Organizaciones Auxiliares de Crédito, Casas Comerciales y en general con cualquier persona física o moral, nacional o extranjera. Por lo anterior y derivado de las reciprocidades que pudieran existir “EL FACTORADO”, autoriza de igual manera a “EL FACTORANTE” a proporcionar la misma información a las empresas que en ejercicio de sus funciones así lo soliciten liberando en ambos casos a “EL FACTORANTE” de cualquier clase de responsabilidad de orden civil o penal, por lo que a mayor abundamiento, “EL FACTORADO” declara bajo protesta de decir verdad que conoce la naturaleza y consecuencias que la investigación e información de los datos a que se refiere esta cláusula puedan derivar.\n\n`,
             
             {text:`TRIGESIMA TERCERA. OBLIGADO SOLIDARIO.`,bold:true},` La persona que se menciona en la Hoja de Identificación de este contrato, comparece en este acto con su carácter de OBLIGADO SOLIDARIO, y se constituye como tal de “EL FACTORADO”, frente y a favor de “EL FACTORANTE”, debiendo suscribir con el mismo carácter, así como los pagarés en calidad de AVAL y cualquier documento que se derive de este contrato.
             En tal virtud, la obligación solidaria que en este acto y con la firma de los anexos  se contrae se constituye en términos de los artículos 1987 y demás aplicables del Código Civil Federal, así como del artículo 4 de la Ley General de Títulos y Operaciones de Crédito y en consecuencia la persona referida en el párrafo anterior hace suyas todas la obligaciones y prestaciones derivadas de este Contrato, comprometiéndose a cumplirlas en su totalidad.
             `
          ], fontSize: 8
      }
  ], columnGap: 40, pageBreak: 'before'
},
{
  alignment: 'justify',
  columns: [
      {
          text: [
             `Igualmente, el OBLIGADO SOLIDARIO conviene en continuar obligado solidariamente de conformidad con este Contrato, aún y cuando los derechos a favor de “EL FACTORANTE” derivados del mismo y sus anexos, sean cedidos total o parcialmente.\n\n`,

             {text:`TRIGESIMA CUARTA. GARANTÍA.`,bold:true},` En garantía del cumplimiento de todas y cada una de las obligaciones de “EL FACTORADO” y del pago exacto y oportuno de todas las cantidades adeudadas por “EL FACTORADO” a “EL FACTORANTE” conforme a este Contrato, incluyendo, de forma enunciativa pero no limitativa, la suerte principal, intereses ordinarios, intereses moratorios, gastos de cobranza y de ejecución y demás accesorios derivados de este Contrato (en lo sucesivo las “Obligaciones Garantizadas”), EL “GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL” constituye la GARANTÍA como se indica en la caratula y Anexo 3 de este contrato en los términos y condiciones de la misma, con la finalidad de garantizar las obligaciones a cargo de “EL FACTORADO”, en primer lugar en favor de “EL FACTORANTE”.\n\n`,
             
             {text:`TRIGESIMA QUINTA.- TITULO EJECUTIVO`,bold:true},` De conformidad con el Artículo. 87-F de la Ley General de Organizaciones y Actividades Auxiliares del Crédito, esté Contrato junto con el estado de Cuenta que guarde y certificado por el contador de EL FACTORANTE serán título ejecutivo mercantil sin necesidad de reconocimiento de firma ni de otro requisito alguno, lo anterior para todos los efectos legales a que haya lugar.
             `
          ], fontSize: 8
      },
      {
          text: [
              
             {text:`TRIGÉSIMA SEXTA. TÍTULOS DE LAS CLÁUSULAS.`,bold:true},` Los títulos con los que se denomina a cada una de las cláusulas que aparecen en el presente contrato, se han puesto con el exclusivo propósito de facilitar su lectura,  por  tanto,  no  necesariamente  definen  ni limitan el contenido de las mismas. Para efectos de interpretación de cada cláusula deberá atenderse exclusivamente a su contenido, y de ninguna manera a su título.\n\n`,
             {text:`TRIGESIMA SÉPTIMA. ANEXO DE DISPOSICIONES LEGALES`,bold:true},`, Los preceptos legales a los que se hacen referencia en el presente contrato, podrán ser consultados por “EL FACTORADO” en el Anexo de Disposiciones Legales, el cual estará a disposición de este en las oficinas de “EL FACTORANTE” o su página de internet en www.mizrafin.com.
             Enteradas las partes del Alcance y contenido se las Cláusulas anteriores firman por duplicado el presente contrato (Uno para cada uno de las partes).
             
             LUGAR Y FECHA DE SUSCRIPCIÓN:
             
             Lerma, Estado de México a __ de ___________ de ____
             `
          ], fontSize: 8
      }
  ], columnGap: 40, pageBreak: 'before'
},
[{
  style: 'tabla',
  
  table: {
    widths: ['*','*'],
    body: [
      [{text: '\n'}, {}],
      [{text: '\n'}, {}],
      [{text: '\n'}, {}],
      [{text: '\n'}, {}],
      [{text: ` “EL FACTORANTE”\n\n\n\n\n____________________________________________\nMIZRAFIN, SAPI DE C.V., SOFOM ENR\nChemaya Mizrahi Fernández`, alignment: 'center'}, {text: ` “EL FACTORADO\n\n\n\n\n____________________________________________\n\n(Nombre y Firma)`, alignment: 'center'}],
      [{text: '\n'}, {}],
      [{text: '\n'}, {}],
      [{text: '\n'}, {}],
      [{text: ` “OBLIGADOS SOLIDARIOS Y AVALISTAS”\n\n\n\n\n____________________________________________\n(Nombre)`,alignment: 'center', colSpan: 2}, {} ],
    ]
  },
  layout: 'noBorders'
  , colSpan: 5},{},{},{},{}],
  {
    text: [
      {text:`A N E X O No. 1\n\n`,fontSize: 10},

      {text:`RELACIÓN DE PERSONAS EMISORAS O DOCUMENTOS DE LAS QUE SE PUEDEN DESCONTAR DERECHOS DE CRÉDITO\n\n`,bold:true,fontSize: 8}, 
      
      {text:`“EL FACTORADO” podrá descontar derechos de crédito de las personas físicas y morales que a continuación se enlistan:\n\n`,fontSize: 8},
      
    ], pageBreak: 'before'
  },
  {style: 'tabla',
            table: {
            widths: ['*','*','*','*'],
                    body: [
                        [{text:`NOMBRE, DENOMINACIÓN O RAZÓN SOCIAL`, alignment: 'center', bold: true}, {text:`DOMICILIO FISCAL`, alignment: 'center', bold: true}, {text:`REGISTRO FEDERAL DE CONTRIBUYENTES `, alignment: 'center', bold: true}, {text:`ACTIVIDAD `, alignment: 'center', bold: true}],
                        [{text:``},{text:``},{text:``},{text:``}],
                        [{text:``},{text:``},{text:``},{text:``}],
                        [{text:``},{text:``},{text:``},{text:``}],
                        [{text:``},{text:``},{text:``},{text:``}],
                        [{text:``},{text:``},{text:``},{text:``}],
                        [{text:``},{text:``},{text:``},{text:``}],
                        [{text:``},{text:``},{text:``},{text:``}],
                        [{text:``},{text:``},{text:``},{text:``}],
                        [{text:``},{text:``},{text:``},{text:``}],
                        [{text:``},{text:``},{text:``},{text:``}],
                    ]
                }},
  {text:'\n\n\n\n'},
  {text:`F I R M A S:\n\n`, alignment: 'center', bold:true, fontSize: 9},
  {style: 'tabla',
            table: {
            widths: ['*','*'],
                    body: [
                        [{text:`“EL FACTORANTE”`, alignment: 'center', bold: true}, {text:`“EL FACTORADO”`, alignment: 'center', bold: true}],
                        [{text:` MIZRAFIN, SAPI DE CV, SOFOM, E.N.R.\n\n\n\n\n_______________________________\n\nREPRESENTADA POR\n\nCHEMAYA MIZRAHI FERNANDEZ`, alignment: 'center', bold: true}, {text:`\n\n\n\n\n_______________________________\n\n(NOMBRE Y FIRMA)`, alignment: 'center', bold: true}],
                    ]
                }},
                {text: [
    {text: `A N E X O No. 2\n\n`,bold:true, alignment: 'center', fontSize: 8}, 
    {text: `CONTRATO DE CESION DE DERECHOS\n`,bold:true, alignment: 'center', fontSize: 8}, 
    {text: `__________________________________________________________\n`,bold:true, alignment: 'center', fontSize: 8},
    {text: `“MIZRAFIN”, SAPI DE CV, SOFOM, E.N.R.\n\n`,bold:true, alignment: 'center', fontSize: 8},], alignment: 'justify', fontSize: 8, pageBreak: 'after'},
    {
      style: 'tabla',
      
      table: {
        widths: ['*','*'],
        body: [
          [{text: '\n'}, {}],
          [{text: `Anexo que forma parte del\nCONTRATO NORMATIVO DE FACTORAJE FINANCIERO\ncon Número:\nde fecha`, alignment: 'left'}, {text: `Marque con una “x”\nCobranza directa___   Cobranza delegada___.\nCONTRATO DE CESIÓN DE DERECHOS Nº\nde fecha\nNº  de relaciones 1`, alignment: 'right'}],
        ]},layout: 'noBorders'},
{text:'\n'},
{text: `CONTRATO DE CESIÓN DE DERECHOS que celebran por una primera parte ______________________________ (en lo sucesivo denominada “EL CEDENTE”); por una segunda parte “MIZRAFIN”, SAPI de CV, SOFOM, ENR., (en lo sucesivo denominada “CESIONARIO”), y por ultima parte _____________________________________ en su carácter de “GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL”.\n\n`, bold:true, fontSize: 8},
{text: `DECLARACIONES\n`, fontSize: 8,alignment: 'center',bold:true},
{text: `Las partes declaran: \n\n`, fontSize: 8,alignment: 'left',bold:true},
{text: `I. Declara el “CESIONARIO” por conducto de su representante legal: \n\n`, fontSize: 8,alignment: 'left',bold:true},
{
  text: [
    `a) Ser una Sociedad Anónima Promotora de Inversión de Capital Variable, constituida con la denominación “MIZRAFIN”, SAPI DE CV, SOFOM, ENR, bajo las leyes de la República Mexicana, mediante Escritura Número 106,219 libro 2,340 de fecha 18 de agosto de 2008, ante la fe del Notario Público Número 30 del Distrito Federal, Licenciado Francisco Villalón Igartua, e inscrita en el Registro Público de la Propiedad y de Comercio del Distrito Federal, bajo el folio mercantil número 394800, el día 17 de febrero de 2009.

    b) La sociedad es una Sociedad Financiera de Objeto Múltiple (SOFOM), Entidad No Regulada (E.N.R.), conforme al “DECRETO por el que se reforman, derogan y adicionan diversas disposiciones de la Ley General de Títulos y Operaciones de Crédito, Ley General de Organizaciones y Actividades Auxiliares del Crédito, Ley de Instituciones de Crédito, Ley General de Instituciones y Sociedades Mutualistas de Seguros, Ley Federal de Instituciones de Fianzas, Ley para Regular las Agrupaciones Financieras, Ley de Ahorro y Crédito Popular, Ley de Inversión Extranjera, Ley del Impuesto sobre la Renta, Ley del Impuesto al Valor Agregado y del Código Fiscal de la Federación” publicado en el Diario Oficial de la Federación el día 18 de julio de 2006; 
    
    c) En cumplimiento al Artículo 87-J vigente a la fecha de la Ley General de Organizaciones y Actividades Auxiliares del Crédito, se indica lo siguiente: La Sociedad opera como SOFOM, ENR, y no requiere de la autorización de la Secretaría de Hacienda y Crédito Público, y no está sujeta a la supervisión y vigilancia de la Comisión Nacional Bancaria y de Valores.
    
    d) Personalidad: El C. Chemaya Mizrahi Fernández, acredita su personalidad como Apoderado de “MIZRAFIN”, SAPI DE CV, SOFOM, ENR, mediante Póliza Pública número 1,363 libro 2 de fecha 10 de octubre de 2011, ante la fe del Corredor Público Número 70, del Distrito Federal, Licenciado Carlos Porcel Sastrías, e inscrita en el Registro Público de la Propiedad y de Comercio de la Ciudad de Lerma, Estado de México. bajo el folio mercantil número 2277*11, el día 30 de Mayo del 2012 y manifiesta bajo protesta de decir verdad que su poder y facultades son las necesarias para suscribir el presente contrato, y que no le han sido revocadas ni modificadas en forma alguna.
    
    e) Que el Depositario legal conviene en constituirse como tal respecto de todos y cada uno de los Derechos de Crédito objeto de este Contrato. (En cobranza delegada)\n\n`,
    
    {text:`II. Declara “EL CEDENTE”:\n\n`,bold:true}, 
    
    `a) Que por sus generales ser: de nacionalidad (es)_________, originario de ______ donde nació el día __ del mes __ del año _____ , con domicilio en _________________.
    
    b) Con RFC _____________ y CURP __________________ .
    
    c) Que su estado civil es ___________________ bajo el régimen matrimonial ___________________. 
    
    d) Que es una persona física capacitada legalmente para la celebración del presente contrato y para asumir y dar cumplimiento a las obligaciones que en el mismo se establecen, las cuales son válidas y exigibles en su contra y exhibiendo identificación oficial vigente con fotografía y firma, cuyo emisor es ____________________ con número ___________________________ .
    
    e) Que su principal actividad es ___________________________________.\n\n`,   
    
    {text:`III.- Declara el “GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL”:\n\n`,bold:true},
    
    
    `a) Que es su interés participar en el presente contrato como `,{text:`“GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL” de “EL FACTORADO”`,bold:true},` respecto de las obligaciones contraídas por este último, sin perjuicio de tener el patrimonio suficiente para responder y, en su caso, cumplir con las obligaciones que asume.\n\n`,

    {text:`IV.`,bold:true},` Las partes declaran que en cumplimiento de dicho contrato desean celebrar el presente acto, de acuerdo al tenor de las siguientes:\n\n`,
    {text:`CLÁUSULAS\n\n`,bold:true,alignment:'center'},
    
    {text:`PRIMERA: “ELCEDENTE”`,bold:true},` transmite en este acto a `,{text:`“EL CESIONARIO”`,bold:true},` los Derechos de Crédito que se detallan en la (s) relación (es) (Tabla I) que se adjuntan a este documento, como parte integral del mismo, haciendo entrega de toda la documentación que comprueba su existencia.
    La transmisión que por virtud de este contrato se celebra, se lleva a cabo sin reserva ni limitación alguna e incluye todos los derechos accesorios tales como los intereses que en su caso hubieran sido pactados y las garantías otorgadas en relación con los mismos.
    En los términos del artículo 419 fracción II de la Ley General de Títulos y Operaciones de Crédito, `,{text:`“ELCEDENTE”`,bold:true},` se obliga solidariamente con los Clientes al pago puntual y oportuno de los Derechos de Crédito transmitidos.\n\n`,
    
    {text:`SEGUNDA:`,bold:true},` Las partes convienen en que para efectos de la transmisión de los Derechos de Crédito objeto de este Contrato el Plazo de Vigencia del Contrato será hasta que se liquiden a `,{text:`“EL CESIONARIO”`,bold:true},`, todos los derechos de crédito cedidos en el presente contrato.\n\n`,
    
    {text:`TERCERA:`,bold:true},` Las partes convienen expresamente que la Tasa de Interés y Comisiones aplicables a este Contrato de Factoraje Financiero será la tasa fija y comisiones pactadas dentro del marco del presente contrato, cuyas condiciones se resumen en el presente anexo.
    Para el caso de que los Derechos de Crédito no se liquiden oportunamente, las partes convienen en que se aplicará al presente contrato un interés adicional sobre saldos insolutos diarios, computados desde la fecha de vencimiento del Plazo de Vigencia del Contrato de los Derechos de Crédito transmitidos hasta su liquidación total calculados a razón de dos veces la Tasa de Interés Aplicable.\n\n`,
    
    {text:`CUARTA:`,bold:true},` De acuerdo con lo señalado en el Contrato Normativo de Factoraje Financiero con recurso, `,{text:`“ELCEDENTE”`,bold:true},` paga en este acto a `,{text:`“EL CESIONARIO”`,bold:true},` o a quien este le indique, un __% aplicado al precio estipulado en la cláusula TERCERA como comisiones de operación y de cobranza.\n\n`,
    	
    {text:`QUINTA:`,bold:true},` El `,{text:`“GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL”`,bold:true},` se comprometen a garantizar las obligaciones a cargo de `,{text:`“ELCEDENTE”`,bold:true},` en los términos del Contrato Normativo de Factoraje Financiero y en forma específica las contenidas en este Contrato.\n\n`,
    
    {text:`SEXTA: “ELCEDENTE” y el “GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL”`,bold:true},` manifiestan bajo protesta de decir verdad que su situación patrimonial a la fecha del presente Contrato es la misma que tenía al suscribir el Contrato Normativo de Factoraje Financiero.\n\n`,
    
    {text:`SEPTIMA:`,bold:true},` De conformidad con el artículo 87-F de la Ley General de Organizaciones y Actividades Auxiliares del Crédito, este Contrato es un título ejecutivo que trae aparejada ejecución.\n\n`,
    
    {text:`OCTAVA:`,bold:true},` Las partes convienen expresamente en dar por reproducido íntegramente el Contrato Normativo de Factoraje Financiero como si a la letra se insertare para todos los efectos legales a que haya lugar.\n\n`,
    
    {text:`NOVENA:`,bold:true},` De conformidad con el Contrato Normativo de Factoraje Financiero, las partes se someten a la jurisdicción de los Tribunales competentes señalados en el mismo.\n\n`,
    
    {text:`DÉCIMA: “ELCEDENTE”`,bold:true},` tendrá la obligación de responder del detrimento en el valor de los derechos de crédito objeto del presente contrato de cesión, fungiendo como obligado solidario de la operación de factoraje al valor original indicado en la cesión de DERECHOS DE CRÉDITO enlistada a continuación. Si se derivan devoluciones, los bienes correspondientes se entregarán a `,{text:`“EL CEDENTE”.\n\n`,bold:true},

    {text:`CUADRO INFORMATIVO DEL CONTRATO NORMATIVO DE FACTORAJE FINANCIERO\n\n`,bold:true, alignment:'center'},

    `Los rubros precisados en este resumen se entenderán referidos a las cláusulas contenidas en el contrato de adhesión del que se desprenden.\n\n
    `
  ],fontSize: 8, alignment: 'justify'
},
{style: 'tabla',
            table: {
            widths: ['*','*'],
                    body: [
                        [{text:'CAT', aligment: 'left',bold:true}, {text:'', aligment: 'left'}],
              [{text:'MONTO O LÍMITE DE LA OPERACIÓN:', aligment: 'left',bold:true}, {text:'', aligment: 'left'}],
              [{text:'PLAZO', aligment: 'left',bold:true}, {text:'', aligment: 'left'}],
              [{text:'TASA DE INTERES', aligment: 'left',bold:true}, {text:'', aligment: 'left'}],
              [{text:'COMISIONES', aligment: 'left',bold:true}, {text:'___% aplicado al precio establecido en la cláusula QUINTA del contrato de factoraje financiero sin recurso', aligment: 'left'}],
              [{text:'MONTO Y NUMERO DE PAGOS', aligment: 'left',bold:true}, {text:'NO APLICA', aligment: 'left'}],
              [{text:'PERIODICIDAD DE PAGO O FECHA DE PAGO', aligment: 'left',bold:true}, {text:'NO APLICA', aligment: 'left'}],
              [{text:'FECHA DE CORTE', aligment: 'left',bold:true}, {text:'NO APLICA', aligment: 'left'}],
              [{text:'SEGUROS CON LOS QUE CUENTA LA OPERACIÓN O SERVICIO:', aligment: 'left',bold:true}, {text:'NO APLICA', aligment: 'left'}],
              [{text:'DATOS DE LA UNIDAD ESPECIALIZADA DE ATENCIÓN A USUARIOS:', aligment: 'left',bold:true}, {text:`Av. Circuito de la Industria Ote. 36 y 38, Lerma, Edo de México, C.P. 52000, Teléfono: (728) 282 7272 ext. 134 Fax: (728) 282 7298, E-mail: atencion_usuario@mizrafin.com
              `, aligment: 'left'}],
                    ]
                }},
                {text:`TABLA I\n\n`,bold:true, alignment: 'center',pageBreak: 'before',fontSize:10},
                {text:`RELACIÓN DE DOCUMENTOS CEDIDOS A FAVOR DE:\n“MIZRAFIN”, SAPI DE CV, SOFOM ENR\n\n`,bold:true, alignment: 'center',fontSize:10},
                {style: 'tabla',
                    table: {
                    widths: ['*','*'],
                            body: [
                                [{text:'FECHA', aligment: 'left',bold:true}, {text:`CONTRATO DE CESION Nº\nNº DE RELACIONES: UNA DE UNA`, aligment: 'left'}],
                            ]
                        }},
                        {style: 'tabla',
                        table: {
                        widths: ['*','*','*','*','*','*','*'],
                        body: [
                          [{text:`EMISOR O DEUDOR (Razones Sociales de los Deudores del CLIENTE)`, alignment: 'center',bold:true},{text:`DOCTO No`, alignment: 'center',bold:true},{text:`TIPO DOCTO. *`, alignment: 'center',bold:true},{text:`FECHA DE ENTREGA MERCANCIA`, alignment: 'center',bold:true},{text:`FECHA VENCIMIENTO`, alignment: 'center',bold:true,},{text:`IMPORTE FACTURA 100%`, alignment: 'center',bold:true},{text:`% O IMPORTE A OPERAR`, alignment: 'center', bold:true},],
                         // [{text:``, aligment: 'left'},{text:``, aligment: 'left'},{text:``, aligment: 'left'},{text:``, aligment: 'left'},{text:``, aligment: 'left',},{text:``, aligment: 'left'},{text:``, aligment: 'left'},],
                         // [{text:`MONTO TOTAL`, aligment: 'left',colSpan: 5},{},{},{},{},{text:`$`, aligment: 'left'},{text:``, aligment: 'left'},],
                        ]
                      }},
                      this.table(this.losdocs, ['EMISOR_O_DEUDOR', 'DOCTO_No', 'TIPO_DOCTO', 'FECHA_DE_ENTREGA_MERCANCIA', 'FECHA_VENCIMIENTO', 'IMPORTE_FACTURA_100', 'O_IMPORTE_A_OPERAR']),
                      {style: 'tabla',
                        table: {
                        widths: ['*','*','*','*','*','*','*'],
                        body: [
                         
                          [{text:`MONTO TOTAL`, alignment: 'left',colSpan: 5},{},{},{},{},{text:`$ ${this.importe_facturas_100}`, alignment: 'left'},{text:`${this.importe_operarstr}`, alignment: 'left'},],
                        ]
                      }}, 
                {text:'\n'},
                {text:'\n'},
                {text:`* Tipos de documento             
                •	FS = Factura sellada  
                •	CR = Contrarrecibo 
                •	FE = Factura electrónica   
                •	PA = Pagaré   
                •	LC = Letra de cambio
                `, fontSize: 7},
                {
                  style: 'tabla',
                  
                  table: {
                    widths: ['*','*'],
                    body: [
                      [{text: '\n'}, {}],
                      [{text: '\n'}, {}],
                      [{text: ` “EL CESIONARIO”\n\n\n\n_________________________________\nMIZRAFIN SAPI DE C.V. SOFOM ENR\nChemaya Mizrahi Fernández`, alignment: 'center'}, {text: ` “EL CEDENTE”\n\n\n\n_________________________________\n(Nombre del Representante Legal)`, alignment: 'center'}],
                      [{text: '\n'}, {}],
                      [{text: '\n'}, {}],
                      [{text: '\n'}, {}],
                      [{text: ` ““OBLIGADOS SOLIDARIOS Y AVALISTAS””\n\n\n_________________________________\n(nombre)`,alignment: 'center', colSpan: 2}, {} ],
                    ]
                  },
                  layout: 'noBorders'
                  },
                  {text:`“ANEXO No 3”\n\n`,bold:true, alignment: 'left',pageBreak: 'before',fontSize:10},
                  {text:`“GARANTIA(S)”\n\n`,bold:true, alignment: 'center',fontSize:10},
                  {text:`	
                  ___ PRENDA

                  ___ HIPOTECA

                  ___ FIDEICOMISO

                  `,fontSize:10},
                  {text: `DESCRIPCION:

                  ____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

                  LUGAR Y FECHA DE SUSCRIPCIÓN:
                  
                  LERMA DE VILLADA, ESTADO DE MÉXICO A ______ DE ___________ DE ___________\n\n
                  `, fontSize: 8},
                  {text: `F I R M A S\n\n`, bold:true, fontSize: 8 },
                  {
                    style: 'tabla',
                    
                    table: {
                      widths: ['*','*'],
                      body: [
                        [{text: '\n'}, {}],
                        [{text: '\n'}, {}],
                        [{text: '\n'}, {}],
                        [{text: '\n'}, {}],
                        [{text: ` “EL FACTORANTE”\n\n\n\n\n____________________________________________\nMIZRAFIN, SAPI DE C.V., SOFOM ENR\nChemaya Mizrahi Fernández`, alignment: 'center'}, {text: ` “EL FACTORADO\n\n\n\n\n____________________________________________\n\n(Nombre y Firma)`, alignment: 'center'}],
                        [{text: '\n'}, {}],
                        [{text: '\n'}, {}],
                        [{text: '\n'}, {}],
                        [{text: ` “OBLIGADOS SOLIDARIOS Y AVALISTAS”\n\n\n\n\n____________________________________________\n(Nombre)`,alignment: 'center', colSpan: 2}, {} ],
                      ]
                    },
                    layout: 'noBorders'},
                  {text:`“P A G A R E”\n\n`,bold:true, alignment: 'center',pageBreak: 'before',fontSize:10},
                  {text:`BUENO POR: $\n\n`,bold:true, alignment: 'right',fontSize:8},
                  {text: [
                    {text: `Debo y Pagaré incondicionalmente a la orden de “MIZRAFIN”, SOCIEDAD ANONIMA PROMOTORA DE INVERSION DE CAPITAL VARIABLE, SOCIEDAD FINANCIERA DE OBJETO MULTIPLE, ENTIDAD NO REGULADA, en sus oficinas ubicadas en Avenida Circuito de la Industria Oriente número 36 y 38, Colonia Parque Industrial Lerma, en Lerma de Villada Estado de México C.P. 52000, el día    de            de 20   , a la vista, la suma de $             . (                           Pesos 00/100 Moneda Nacional).
            
                    La suma principal amparada por este Pagaré devengará intereses ordinarios a partir de esta fecha y hasta el pago total del mismo a una tasa de interés anual de  % (             por ciento), y una comisión de   % (            por ciento) del monto del pagaré, que serán cubiertos en términos del presente pagaré. 
                    
                    Ante el incumplimiento en el pago de la suma principal e intereses derivados de este Pagaré en lugar de la tasa de interés ordinaria referida anteriormente este pagaré devengara interés moratorios sobre su saldo insoluto a una tasa de interés igual a la tasa de interés anual ordinaria mencionada al principio de este párrafo multiplicada por 2(dos).    
                    
                    Tanto el importe del capital de este Título expresado en Moneda Nacional, así como los intereses que el mismo cause, serán cubiertos en un plazo no mayor a   meses.
                    
                    Este pagaré es un Título de Crédito sujeto a las disposiciones de los Artículos 4,114, 170 y demás aplicables a la Ley General de Títulos y Operaciones de Crédito.
                    
                    Para la ejecución y cumplimiento de este Pagaré y para el requerimiento judicial de pago de las cantidades adeudadas conforme al mismo, el Suscriptor y el Aval se someten expresa e irrevocablemente a la jurisdicción de los tribunales competentes en la Ciudad de Lerma de Villada, Estado de México. Mediante la suscripción y entrega de este Pagaré el Suscriptor y el Aval renuncian irrevocablemente a cualquier otro fuero al que tengan o lleguen a tener derecho, en virtud de su domicilio (presente o futuro) o por cualquier otra razón.
                    
                    El Suscriptor designa como su domicilio para requerimiento judicial de pago, el siguiente:
                    
                    El Aval designa como su domicilio para requerimiento judicial de pago, el siguiente:
                    
                    Por el presente Pagaré el Suscriptor y el Aval renuncian a cualquier diligencia de presentación, requerimiento o protesto. La omisión o retraso del tenedor del presente Pagaré en el ejercicio de cualquiera de sus derechos conforme a este Pagaré en ningún caso constituirá una renuncia a dichos derechos.
                    
                    El Suscriptor y el Aval prometen incondicional e irrevocablemente pagar los costos y gastos que impliquen el cobro de este Pagaré incluyendo, sin limitación alguna, los honorarios de los abogados que intervengan en el cobro, en caso de incumplimiento en el pago de este Pagaré. 
                    
                    El presente Pagaré se suscribe y entrega en la Ciudad de Lerma de Villada, Estado de México el día      de      de 20     .
                    `}, 
                    
                    ,], alignment: 'justify', fontSize: 8},
            
                    {
                      style: 'tabla',
                      
                      table: {
                        widths: ['*','*'],
                        body: [
                          [{text: '\n'}, {}],
                          [{text: '\n'}, {}],
                          [{text: ` SUSCRIPTOR\n"               "\n\n\n_________________________________\n(nombre y firma)`, alignment: 'center'}, {text: ` AVAL\n"               "\n\n\n_________________________________\n(Nombre y firma)`, alignment: 'center'}],
                
                        ]
                      },
                      layout: 'noBorders'
                      },
            ],
        styles: {
          tabla: {
            bold: false,
            fontSize: 8.5,
            color: 'black'
          }
        },
        defaultStyle: {
          // alignment: 'justify'
        }
      };
      
    
    
    
    
    
    //  pdfMake.createPdf(dd).open();
    
    const pdfDocGenerator = pdfMake.createPdf(dd);
    pdfDocGenerator.getBlob((blob) => {
    this.subirdocMizrafin(blob,ids, folio);
  });
  }
  
  CONTRATO_MIZFACTURAS_CON_RESURSO_PM(ids, folio, resp){
    this.losdocs = [];
    this.monto_toal= 0;
    this.importe_facturas_100 = '';
    this.importe_operar = 0;
    this.importe_operarstr = '';
    
      // VALIDACIONES DE LOS DATOS
      let req = {
        cat: '',
        comisiones: '',
        fecha_limite_pago: '',
        linea_factoraje: '',
        plazo: '',
        tasa_anual: '',
        total_apagar: '',
        vigencia_contrato: ''
      }
      let fin = {
        denominacion_social: '',
        domicilio: '',
        colonia: '',
        municipio: '',
        estado: '',
        entidad_federativa: '',
        codigo_postal: '',
        representante_legal: '',
        escritura: '',
        fecha_escritura: '',
        antefe_notario: '',
        titular_notaria: '',
        folio_inscripcion: '',
        lugar_inscripcion: '',
        fecha_inscripcion: ''
      }
     /* let client_pf = {
        nombre_completo: '',
        domicilio: '',
        colonia: '',
        municipio: '',
        estado: '',
        entidad_federativa: '',
        codigo_postal: '',
        curp: '',
        rfc: '',
        martial_status: '',
        id_type: '',
        identification: '',
        phone: '',
        email: ''
      } */
      let client_pm = {
        denominacion_social: '',
        domicilio: '',
        colonia: '',
        municipio: '',
        estado: '',
        entidad_federativa: '',
        codigo_postal: '',
        rfc: '',
        phone: '',
        email: ''
      }
    /*  let legal_reppf = {
        nombre_completo: '',
        domicilio: '',
        colonia: '',
        municipio: '',
        estado: '',
        entidad_federativa: '',
        codigo_postal: '',
        curp: '',
        rfc: '',
        martial_status: '',
        id_type: '',
        identification: '',
        phone: '',
        email: ''
      } */
      let legal_reppm = {
        nombre_completo: '',
        domicilio: '',
        colonia: '',
        municipio: '',
        estado: '',
        entidad_federativa: '',
        codigo_postal: '',
        curp: '',
        rfc: '',
        martial_status: '',
        id_type: '',
        identification: '',
        phone: '',
        email: ''
      }
     /* let garantepf = {
        nombre_completo: '',
        domicilio: '',
        colonia: '',
        municipio: '',
        estado: '',
        entidad_federativa: '',
        codigo_postal: '',
        curp: '',
        rfc: '',
        martial_status: '',
        id_type: '',
        identification: '',
        phone: '',
        email: ''
      } */
      let garantepm = {
        nombre_completo: '',
        domicilio: '',
        colonia: '',
        municipio: '',
        estado: '',
        entidad_federativa: '',
        codigo_postal: '',
        curp: '',
        rfc: '',
        martial_status: '',
        id_type: '',
        identification: '',
        phone: '',
        email: ''
      }
      if (resp.request.length > 0) {
          req = {
          cat: resp.request[0].cat,//
          comisiones: resp.request[0].comisiones,//
          fecha_limite_pago: resp.request[0].fecha_limite_pago,//
          linea_factoraje: resp.request[0].linea_factoraje,//
          plazo: resp.request[0].plazo,
          tasa_anual: resp.request[0].tasa_anual,//
          total_apagar: resp.request[0].total_apagar,
          vigencia_contrato: resp.request[0].vigencia_contrato//
        }
      }
      if (resp.fin.length > 0) {
        fin = {
          denominacion_social: resp.fin[0].denominacion_social,//
          domicilio: resp.fin[0].domicilio,//
          colonia: resp.fin[0].colonia,//
          municipio: resp.fin[0].municipio,//
          estado: resp.fin[0].estado,
          entidad_federativa: resp.fin[0].entidad_federativa,//
          codigo_postal: resp.fin[0].codigo_postal,//
          representante_legal: resp.fin[0].representante_legal,//
          escritura: resp.fin[0].escritura,//
          fecha_escritura: resp.fin[0].fecha_escritura,//
          antefe_notario: resp.fin[0].antefe_notario,//
          titular_notaria: resp.fin[0].titular_notaria,//
          folio_inscripcion: resp.fin[0].folio_inscripcion,//
          lugar_inscripcion: resp.fin[0].lugar_inscripcion,//
          fecha_inscripcion: resp.fin[0].fecha_inscripcion//
        }
      }
    /*  if (resp.client_pf.length > 0) {
          client_pf = {
          nombre_completo: resp.client_pf[0].nombre_completo,
          domicilio: resp.client_pf[0].dimicilio,
          colonia: resp.client_pf[0].colonia,
          municipio: resp.client_pf[0].municipio,
          estado: resp.client_pf[0].estado,
          entidad_federativa: resp.client_pf[0].entidad_federativa,
          codigo_postal: resp.client_pf[0].codigo_postal,
          curp: resp.client_pf[0].curp,
          rfc: resp.client_pf[0].rfc,
          martial_status: resp.client_pf[0].martial_status,
          id_type: resp.client_pf[0].id_type,
          identification: resp.client_pf[0].identification,
          phone: resp.client_pf[0].phone,
          email: resp.client_pf[0].email
        }
          if (resp.legal_rep.length > 0) {
            legal_reppf = {
              nombre_completo: resp.legal_rep[0].nombre_completo,
              domicilio: resp.legal_rep[0].domicilio,
              colonia: resp.legal_rep[0].colonia,
              municipio: resp.legal_rep[0].municipio,
              estado: resp.legal_rep[0].estado,
              entidad_federativa: resp.legal_rep[0].entidad_federativa,
              codigo_postal: resp.legal_rep[0].codigo_postal,
              curp: resp.legal_rep[0].curp,
              rfc: resp.legal_rep[0].rfc,
              martial_status: resp.legal_rep[0].martial_status,
              id_type: resp.legal_rep[0].id_type,
              identification: resp.legal_rep[0].identification,
              phone: resp.legal_rep[0].phone,
              email: resp.legal_rep[0].email
              }
          }
          if (resp.garante.length > 0) {
            garantepf = {
              nombre_completo: resp.garante[0].nombre_completo,
              domicilio: resp.garante[0].domicilio,
              colonia: resp.garante[0].colonia,
              municipio: resp.garante[0].municipio,
              estado: resp.garante[0].estado,
              entidad_federativa: resp.garante[0].entidad_federativa,
              codigo_postal: resp.garante[0].codigo_postal,
              curp: resp.garante[0].curp,
              rfc: resp.garante[0].rfc,
              martial_status: resp.garante[0].martial_status,
              id_type: resp.garante[0].id_type,
              identification: resp.garante[0].identification,
              phone: resp.garante[0].phone,
              email: resp.garante[0].email
            }
          }
      }*/
      if (resp.client_pm.length > 0) {
        client_pm = {
          denominacion_social: resp.client_pm[0].denominacion_social,
          domicilio: resp.client_pm[0].domicilio,
          colonia: resp.client_pm[0].colonia,
          municipio: resp.client_pm[0].municipio,
          estado: resp.client_pm[0].estado,
          entidad_federativa: resp.client_pm[0].entidad_federativa,
          codigo_postal: resp.client_pm[0].codigo_postal,
          rfc: resp.client_pm[0].rfc,
          phone: resp.client_pm[0].phone,
          email: resp.client_pm[0].email
      }
        if (resp.legal_rep.length > 0) {
          legal_reppm = {
            nombre_completo: resp.legal_rep[0].nombre_completo,
            domicilio: resp.legal_rep[0].domicilio,
            colonia: resp.legal_rep[0].colonia,
            municipio: resp.legal_rep[0].municipio,
            estado: resp.legal_rep[0].estado,
            entidad_federativa: resp.legal_rep[0].entidad_federativa,
            codigo_postal: resp.legal_rep[0].codigo_postal,
            curp: resp.legal_rep[0].curp,
            rfc: resp.legal_rep[0].rfc,
            martial_status: resp.legal_rep[0].martial_status,
            id_type: resp.legal_rep[0].id_type,
            identification: resp.legal_rep[0].identification,
            phone: resp.legal_rep[0].phone,
            email: resp.legal_rep[0].email
            }
        }
        if (resp.garante.length > 0) {
          garantepm = {
            nombre_completo: resp.garante[0].nombre_completo,
            domicilio: resp.garante[0].domicilio,
            colonia: resp.garante[0].colonia,
            municipio: resp.garante[0].municipio,
            estado: resp.garante[0].estado,
            entidad_federativa: resp.garante[0].entidad_federativa,
            codigo_postal: resp.garante[0].codigo_postal,
            curp: resp.garante[0].curp,
            rfc: resp.garante[0].rfc,
            martial_status: resp.garante[0].martial_status,
            id_type: resp.garante[0].id_type,
            identification: resp.garante[0].identification,
            phone: resp.garante[0].phone,
            email: resp.garante[0].email
          }
        }
    }
      
      
      if (resp.docs.length > 0) {
        for (let i in resp.docs) {
          this.losdocs[i] = { EMISOR_O_DEUDOR : resp.docs[i].emisor, DOCTO_No: resp.docs[i].docto_no, TIPO_DOCTO: resp.docs[i].tipo_docto, FECHA_DE_ENTREGA_MERCANCIA: resp.docs[i].fecha_entrega, FECHA_VENCIMIENTO: resp.docs[i].fecha_vencimiento, IMPORTE_FACTURA_100: resp.docs[i].factura_100, O_IMPORTE_A_OPERAR: resp.docs[i].importe_operar }
          this.monto_toal = this.monto_toal +  parseInt(resp.docs[i].factura_100.replace(/,/g, ''), 10);
          this.importe_operar = this.importe_operar +  parseInt(resp.docs[i].importe_operar.replace(/,/g, ''), 10);
        }
        this.importe_facturas_100 = this.monto_toal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        this.importe_operarstr = this.importe_operar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    var dd = {
        pageMargins: [ 40, 60, 40, 60 ],
        header: {
          columns: [
            {
              image: `data:image/png;base64,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`,
              width: 150,
              height: 50,
            },
          {text: `RECA: ${this.num}\nNo de contrato`, alignment: 'right'},
          ]
                 },
        
      
                 footer: function(currentPage, pageCount) {
                  return {
                      margin:10,
                      columns: [
                      {
                          fontSize: 9,
                          text:[
                          {
                          text: currentPage.toString() + ' de ' + pageCount,
                          }
                          ],
                          alignment: 'right'
                      }
                      ]
                  };
            
              },
              
        content: [
          {text: 'CARATULA DE CONTRATO NORMATIVO DE FACTORAJE CON RECURSO', alignment: 'center', bold: true, italic: true},
          {style: 'tabla',
            table: {
            widths: ['*','*','*','*'],
                    body: [
                        [{text:`1)	NOMBRE COMERCIAL DEL PRODUCTO:\nTipo de Crédito:`, colSpan: 4}, {}, {}, {}],
              [{text:'2)	DESTINO Y APLICACIÓN DEL CRÉDITO: ', colSpan: 4},{},{},{}],
              [{text: `3) CAT (Costo Anual Total), A la fecha de contratación y para efectos informativos es del ${req.cat}% anual.`}, 
                {text: `4) TASA DE INTERÉS ANUAL, ORDINARIA Y MORATORIA:\n${req.tasa_anual}`}, 
                {text: `5) MONTO O LÍNEA DE CRÉDITO: ${req.linea_factoraje} \nSin incluir accesorios`},
                {text: `6) MONTO TOTAL A PAGAR\n${req.total_apagar}`}],
              [{text: `7)	VIGENCIA DEL CONTRATO:\n ${req.vigencia_contrato}` , colSpan: 2}, {},{text:`8)	Fecha Límite de pago: ${req.fecha_limite_pago}\n Fecha de Corte para los Estados de Cuenta:` , colSpan: 2},{}],
              [{text:'9)	FORMA DE PAGO DEL CREDITO:', colSpan: 4}, {}, {}, {}],
              [{text:`10)	COMISIONES: ${req.comisiones}\n- Contratación o apertura: ___                         - Administración o manejo de cuenta: ___                         - Por operación: ___`, colSpan: 4, preserveLeadingSpaces: true}, {}, {}, {}],
              [{text:'11)	ADVERTENCIAS \n•	“Incumplir tus obligaciones te puede generar Comisiones e intereses moratorios”;\n•	“Contratar créditos que excedan tu capacidad de pago afecta tu historial crediticio”\n•	“El avalista, obligado solidario o coacreditado responderá como obligado principal por el total del pago frente a la Entidad Financiera” ;', colSpan: 4 }, {}, {}, {}],
              [{text:'12)	SEGUROS:\n Seguro:         NA                                    Aseguradora:          NA                                           Cláusula:       NA     \n(opcional u obligatoria)', colSpan: 4}, {}, {}, {}],
              [{text:'13)	ESTADO DE CUENTA\n- Vía Correo Electrónico                     Si                          - Domicilio                        No                        - Internet   No', colSpan: 4}, {}, {}, {}],
              [{text:'14)	ACLARACIONES Y RECLAMACIONES\nUnidad Especializada de Atención a Usuarios: Av. Circuito de la Industria Oriente 36 y 38, Parque Industrial Lerma, Municipio Lerma de Villada, Código Postal 52000, Estado de México.\nTeléfono (728) 282 72 72 ext. 134Fax (728) 282 72 98\nE-mail: atencion_usuario@mirzrafin.com', colSpan: 4}, {}, {}, {}],
              [{text:`15) Registro de Contratos de Adhesión Núm: ${this.num} \nComisión Nacional para la Protección y Defensa de los Usuarios de Servicios Financieros (CONDUSEF) Teléfono:01 800 999 8080 y 53400999. Página de Internet www.condusef.gob.mx  `, colSpan: 4}, {}, {}, {}],
              [{
                style: 'tabla',
                
                table: {
                  widths: ['*','*'],
                  body: [
                    [{text: '\n'}, {}],
                    [{text: '\n'}, {}],
                    [{text: ` “EL FACTORANTE”\n_________________________________\nMIZRAFIN, SAPI DE C.V., SOFOM ENR\nChemaya Mizrahi Fernández`, alignment: 'center'}, {text: ` “EL FACTORADO”\n_________________________________\n(Nombre del Representante Legal)`, alignment: 'center'}],
                    [{text: '\n'}, {}],
                    [{text: '\n'}, {}],
                    [{text: '\n'}, {}],
                    [{text: ` ““OBLIGADOS SOLIDARIOS Y AVALISTAS””\n_________________________________\n(Nombre)`,alignment: 'center', colSpan: 2}, {} ],
                  ]
                },
                layout: 'noBorders'
                , colSpan: 4},{},{},{}] 
                    ]
                }},
          {text: `CONTRATO NORMATIVO DE FACTORAJE FINANCIERO (PERSONA MORAL) QUE CELEBRAN POR UNA PARTE “MIZRAFIN”, SOCIEDAD ANÓNIMA PROMOTORA DE INVERSIÓN DE CAPITAL VARIABLE, SOCIEDAD FINANCIERA DE OBJETO MÚLTIPLE, ENTIDAD NO REGULADA, A QUIEN EN LO SUCESIVO SE LE DENOMINARA COMO “EL FACTORANTE”, REPRESENTADA EN ESTE ACTO POR LA(S) PERSONA(S) IDENTIFICADA(S) EN LA HOJA DE IDENTIFICACIÓN DEL PRESENTE CONTRATO Y POR OTRA PARTE LA(S) PERSONA(S) IDENTIFICADA(S) EN LA HOJA DE IDENTIFICACIÓNDEL PRESENTE CONTRATO, A QUIENES EN LO SUCESIVO SE LE(S) DENOMINARA RESPECTIVAMENTE COMO EL “FACTORADO” Y EL “GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL; AL TENOR DE LAS SIGUIENTES DECLARACIONES Y CLÁUSULAS:\n\n`, pageBreak: 'before', fontSize: 9, alignment: 'justify'},
          {style: 'tabla',
            table: {
            widths: ['*','*','*','*','*'],
                    body: [
              //FIN        
              [{text:'HOJA DE IDENTIFICACIÓN', colSpan: 5, alignment: 'justify'}, {}, {}, {}, {}],
              [{text:'DATOS DEL FACTORANTE', colSpan: 5, alignment: 'left', fillColor: '#000000', color: '#FFFFFF', bold:true}, {}, {}, {}, {}],
              [{text:`Denominación Social:\n${fin.denominacion_social}`, colSpan: 5, alignment: 'center'}, {}, {}, {}, {}],
              [{text:`DOMICILIO:\n${fin.domicilio}`}, {text:`COLONIA O POBLACION:\n${fin.colonia}`}, {text:`DELEGACION O MUNICIPIO:\n${fin.municipio}`}, {text:`ENTIDAD FEDERATIVA:\n${fin.estado}`}, {text:`C.P.:\n${fin.codigo_postal}`}],
              [{text:`NOMBRE DEL FACTORANTE::\n${fin.representante_legal}`, colSpan: 5, alignment: 'left'}, {}, {}, {}, {}],
                    ]
                }},
          {text: '\n'},
          {style: 'tabla',
            table: {
            widths: ['*','*','*','*','*'],
                    body: [
              //CLIENT_PM       
              [{text:`DATOS DEL FACTORADO`, colSpan: 5, aligment: 'left', bold: true, fillColor: '#000000', color: '#FFFFFF'}, {}, {}, {}, {}],
              [{text:`DENOMINACIÓN SOCIAL:\n${client_pm.denominacion_social}`, colSpan: 5, aligment: 'left'}, {}, {}, {}, {}],
              [{text:`DOMICILIO:\n${client_pm.domicilio}`, aligment: 'left'}, {text:`COLONIA O POBLACION:\n${client_pm.colonia}`, aligment: 'left'}, {text:`DELEGACIÓN O MUNICIPIO:\n${client_pm.municipio}`, aligment: 'left'}, {text:`ENTIDAD FEDERATIVA:\n${client_pm.estado}`, aligment: 'left'}, {text:`C.P.:\n${client_pm.codigo_postal}`, aligment: 'left'}],
              [{text:`NACIONALIDAD:`, aligment: 'left'},{text:`RFC:\n${client_pm.rfc}`, aligment: 'left'},{text:`TELÉFONO:\n${client_pm.phone}`},{text:`CORREO ELECTRÓNICO:\n${client_pm.email}`,colSpan: 2},{}],
              //FIN
              [{text:`ACTA CONSTITUTIVA`, colSpan: 5, aligment: 'left', bold: true}, {}, {}, {}, {}],
              [{text:`ESCRITURA O PÓLIZA PÚBLICA NÚMERO:\n${fin.escritura}`, aligment: 'left'}, {text:`FECHA DE LA ESCRITURA O PÓLIZA PÚBLICA:\n${fin.fecha_escritura}`, aligment: 'left'}, {text:`ANTE FE DEL NOTARIO/CORREDOR PÚBLICO:\n${fin.antefe_notario}`, aligment: 'left', colSpan: 3}, {}, {}],
              [{text:`TITULAR DE LA NOTARIA/CORREDURIA No\n${fin.titular_notaria}`, aligment: 'left'}, {text:`FOLIO DE INSCRIPCIÓN:\n${fin.folio_inscripcion}`, aligment: 'left'}, {text:`LUGAR DE INSCRIPCIÓN:\n${fin.lugar_inscripcion}`, aligment: 'left'}, {text:`FECHA DE INSCRIPCIÓN:\n${fin.fecha_inscripcion}`, aligment: 'left', colSpan: 2}, {}],
              //LEGAL_REPPM
              [{text:`REPRESENTANTE LEGAL`, colSpan: 5, aligment: 'left', bold: true}, {}, {}, {}, {}],
              [{text:`NOMBRE COMPLETO:\n${legal_reppm.nombre_completo}`, colSpan: 2, aligment: 'left'}, {}, {text:`DOMICILIO:\n${legal_reppm.domicilio}`, colSpan: 2, aligment: 'left'}, {}, {text:`COLONIA O POBLACION:\n${legal_reppm.colonia}`, aligment: 'left'}],
              [{text:`DELEGACIÓN O MUNICIPIO:\n${legal_reppm.municipio}`, aligment: 'left'}, {text:`ENTIDAD FEDERATIVA:\n${legal_reppm.estado}`, aligment: 'left'}, {text:`C.P.\n${legal_reppm.codigo_postal}`, aligment: 'left'}, {text:`FECHA DE NACIMIENTO:`, aligment: 'left'}, {text:`LUGAR DE NACIMIENTO:`, aligment: 'left'}],
              [{text:`NACIONALIDAD:`, aligment: 'left'}, {text:`OCUPACIÓN O PROFESIÓN:`, aligment: 'left'}, {text:`CURP:\n${legal_reppm.curp}`, aligment: 'left', colSpan: 2}, {}, {text:`RFC:\n${legal_reppm.rfc}`, aligment: 'left'}],
              [{text:`TIPO DE IDENTIFICACIÓN OFICIAL VIGENTE:\n${legal_reppm.id_type}`, aligment: 'left'}, {text:`EMITIDA POR:`, aligment: 'left'}, {text:`FOLIO No.:\n${legal_reppm.identification}`, aligment: 'left'}, {text:`TELÉFONO:\n${legal_reppm.phone}`, aligment: 'left'}, {text:`CORREO ELECTRÓNICO:\n${legal_reppm.email}`, aligment: 'left'}],
              [{text:`ESCRITURA PÚBLICA NÚMERO:`, aligment: 'left'}, {text:`FECHA DE LA ESCRITURA PÚBLICA:`, aligment: 'left'}, {text:`ANTE FE DEL NOTARIO PÚBLICO:`, aligment: 'left'}, {text:`TITULAR DE LA NOTARIA No.`, aligment: 'left', colSpan: 2}, {}],
              [{text:`TITULAR DE LA NOTARIA/CORREDURIA No`, aligment: 'left'}, {text:`FOLIO DE INSCRIPCIÓN:`, aligment: 'left'}, {text:`LUGAR DE INSCRIPCIÓN:`, aligment: 'left'}, {text:`FECHA DE INSCRIPCIÓN:`, aligment: 'left', colSpan: 2}, {}],
              //GARANTEPM
              [{text:`DATOS DEL GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL (PERSONA MORAL)`, colSpan: 5, aligment: 'left', bold: true, fillColor: '#000000', color: '#FFFFFF'}, {}, {}, {}, {}],
              [{text:`DENOMINACIÓN SOCIAL:\n${garantepm.nombre_completo}`, colSpan: 5, aligment: 'left', bold: true}, {}, {}, {}, {}],
              [{text:`DOMICILIO:\n${garantepm.domicilio}`, aligment: 'left'}, {text:`COLONIA O POBLACION:\n${garantepm.colonia}`, aligment: 'left'}, {text:`DELEGACIÓN O MUNICIPIO:\n${garantepm.municipio}`, aligment: 'left'}, {text:`ENTIDAD FEDERATIVA:\n${garantepm.estado}`, aligment: 'left'}, {text:`CP:\n${garantepm.codigo_postal}`, aligment: 'left'}],
              [{text:`NACIONALIDAD:`, aligment: 'left'}, {text:`RFC:\n${garantepm.rfc}`, aligment: 'left'}, {text:`TELÉFONO:\n${garantepm.phone}`, aligment: 'left'}, {text:`CORREO ELECTRÓNICO:\n${garantepm.email}`, aligment: 'left', colSpan: 2}, {}],
              [{text:`ACTA CONSTITUTIVA`, colSpan: 5, aligment: 'left', bold: true}, {}, {}, {}, {}],
              [{text:`ESCRITURA O PÓLIZA PÚBLICA NÚMERO:`, aligment: 'left'}, {text:`FECHA DE LA ESCRITURA O PÓLIZA PÚBLICA:`, aligment: 'left'}, {text:`ANTE FE DEL NOTARIO/CORREDOR PÚBLICO:`, aligment: 'left', colSpan: 3}, {}, {}],
              [{text:`TITULAR DE LA NOTARIA/CORREDURIA No`, aligment: 'left'}, {text:`FOLIO DE INSCRIPCIÓN:`, aligment: 'left'}, {text:`LUGAR DE INSCRIPCIÓN:`, aligment: 'left'}, {text:`FECHA DE INSCRIPCIÓN:`, aligment: 'left', colSpan: 2}, {}],

              [{text:`REPRESENTANTE LEGAL`, colSpan: 5, aligment: 'left', bold: true}, {}, {}, {}, {}],
              [{text:`NOMBRE COMPLETO:`, colSpan: 2, aligment: 'left'}, {}, {text:`DOMICILIO:`, colSpan: 2, aligment: 'left'}, {}, {text:`COLONIA O POBLACION:`, aligment: 'left'}],
              [{text:`DELEGACIÓN O MUNICIPIO:`, aligment: 'left'}, {text:`ENTIDAD FEDERATIVA:`, aligment: 'left'}, {text:`C.P.`, aligment: 'left'}, {text:`FECHA DE NACIMIENTO:`, aligment: 'left'}, {text:`LUGAR DE NACIMIENTO:`, aligment: 'left'}],
              [{text:`NACIONALIDAD:`, aligment: 'left'}, {text:`OCUPACIÓN O PROFESIÓN:`, aligment: 'left'}, {text:`CURP`, aligment: 'left', colSpan: 2}, {}, {text:`RFC`, aligment: 'left'}],
              [{text:`TIPO DE IDENTIFICACIÓN OFICIAL VIGENTE:`, aligment: 'left'}, {text:`EMITIDA POR:`, aligment: 'left'}, {text:`FOLIO No.:`, aligment: 'left'}, {text:`TELÉFONO:`, aligment: 'left'}, {text:`CORREO ELECTRÓNICO:`, aligment: 'left'}],
              [{text:`ESCRITURA PÚBLICA NÚMERO:`, aligment: 'left'}, {text:`FECHA DE LA ESCRITURA PÚBLICA:`, aligment: 'left'}, {text:`ANTE FE DEL NOTARIO PÚBLICO:`, aligment: 'left'}, {text:`TITULAR DE LA NOTARIA No.`, aligment: 'left', colSpan: 2}, {}],
              [{text:`TITULAR DE LA NOTARIA/CORREDURIA No`, aligment: 'left'}, {text:`FOLIO DE INSCRIPCIÓN:`, aligment: 'left'}, {text:`LUGAR DE INSCRIPCIÓN:`, aligment: 'left'}, {text:`FECHA DE INSCRIPCIÓN:`, aligment: 'left', colSpan: 2}, {}],

              [{text:`DATOS DEL GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL (PERSONA FISICA)`, colSpan: 5, aligment: 'left', bold: true, fillColor: '#000000', color: '#FFFFFF'}, {}, {}, {}, {}],
              [{text:`NOMBRE COMPLETO:`, colSpan: 2, aligment: 'left'}, {}, {text:`DOMICILIO:`, colSpan: 2, aligment: 'left'}, {}, {text:`COLONIA O POBLACION:`, aligment: 'left'}],
              [{text:`DELEGACIÓN O MUNICIPIO:`, aligment: 'left'}, {text:`ENTIDAD FEDERATIVA:`, aligment: 'left'}, {text:`C.P.`, aligment: 'left'}, {text:`FECHA DE NACIMIENTO:`, aligment: 'left'}, {text:`LUGAR DE NACIMIENTO:`, aligment: 'left'}],
              [{text:`NACIONALIDAD:`, aligment: 'left'}, {text:`OCUPACIÓN O PROFESIÓN:`, aligment: 'left'}, {text:`CURP`, aligment: 'left', colSpan: 2}, {}, {text:`RFC`, aligment: 'left'}],
              [{text:`ESTADO CIVIL:`, aligment: 'left'}, {text:`RÉGIMEN MATRIMONIAL:`, aligment: 'left'}, {text:`ENTIDAD DE CONTRACCIÓN NUPCIAL:`, aligment: 'left', colSpan: 3}, {}, {}],
              [{text:`TIPO DE IDENTIFICACIÓN OFICIAL VIGENTE:`, aligment: 'left'}, {text:`EMITIDA POR:`, aligment: 'left'}, {text:`FOLIO No.:`, aligment: 'left'}, {text:`TELÉFONO:`, aligment: 'left'}, {text:`CORREO ELECTRÓNICO:`, aligment: 'left'}],
              [{text:`SECCIÓN DE FIRMAS`, colSpan: 5, alignment: 'center', bold: true, fillColor: '#000000', color: '#FFFFFF'}, {}, {}, {}, {}],
              [{
                style: 'tabla',
                
                table: {
                  widths: ['*','*'],
                  body: [
                    [{text: '\n'}, {}],
                    [{text: '\n'}, {}],
                    [{text: '\n'}, {}],
                    [{text: '\n'}, {}],
                    [{text: ` “EL FACTORANTE”\n\n\nMIZRAFIN, SAPI DE C.V., SOFOM ENR\nRepresentada por \nChemaya Mizrahi Fernández`, alignment: 'center'}, {text: ` “EL FACTORADO\n\n\n(Nombre y Firma)`, alignment: 'center'}],
                    [{text: '\n'}, {}],
                    [{text: '\n'}, {}],
                    [{text: '\n'}, {}],
                    [{text: ` “EL GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL”\n\n\nNOMBRE Y FIRMA\n\nLUGAR Y FECHA DE SUSCRIPCIÓN: Lerma de Villada, Estado de México a _________ de _________________ de 20_____.`,alignment: 'center', colSpan: 2}, {} ],
                  ]
                },
                layout: 'noBorders'
                , colSpan: 5},{},{},{},{}]
                    ]
                }},
          {text: '\n'},
          {text: `D E C L A R A C I O N E S\n\n`, bold: true, alignment: 'center', pageBreak: 'before',fontSize: 8},
          {
            alignment: 'justify',
            columns: [
                {
                    text: [
                        {text: `I. Declara “EL FACTORANTE” por conducto de su representante legal:\n\n`, bold:true},

                        {text:`a)`,bold:true},` Ser una Sociedad Anónima Promotora de Inversión de Capital Variable, constituida con la denominación “MIZRAFIN”, SAPI DE CV, SOFOM, ENR, bajo las leyes de la República Mexicana, mediante Escritura Pública Número 106,219 libro 2340 de fecha 18 de agosto de 2008, ante la fe del Notario Público Número 30 del Distrito Federal, Licenciado Francisco Villalón Igartua, e inscrita en el Registro Público de la Propiedad y de Comercio del Distrito Federal, bajo el folio mercantil número 394800, el día 17 de febrero de 2009.\n\n`,

                        {text:`b)`,bold:true},` La sociedad es una Sociedad Financiera de Objeto Múltiple (SOFOM), Entidad No Regulada (E.N.R.), conforme al “DECRETO por el que se reforman, derogan y  adicionan diversas disposiciones de la Ley General de Títulos y Operaciones de Crédito, Ley General de Organizaciones y Actividades Auxiliares del Crédito, Ley de Instituciones de Crédito, Ley General de Instituciones y Sociedades Mutualistas de Seguros, Ley Federal de Instituciones de Fianzas, Ley para Regular las Agrupaciones Financieras, Ley de Ahorro y Crédito Popular, Ley de Inversión Extranjera, Ley del Impuesto sobre la Renta, Ley del Impuesto al Valor Agregado y del Código Fiscal de la Federación” publicado en el Diario Oficial de la Federación el día 18 de julio de 2006;\n\n`,
                        
                        {text:`c)`,bold:true},` En cumplimiento al Artículo 87-J vigente de la Ley General de Organizaciones y Actividades Auxiliares del Crédito, se indica lo siguiente: La Sociedad opera como SOFOM ENR, no requiere de la autorización de la Secretaría de Hacienda y Crédito Público, y está sujeta a la supervisión y vigilancia de la Comisión Nacional Bancaria y de Valores, sino solamente de la Comisión Nacional para la Protección y Defensa de los Usuarios de Servicios Financieros (CONDUSEF).\n\n`,
                        
                        {text:`d)`,bold:true},` Personalidad El C. Chemaya Mizrahi Fernández, acredita su personalidad como Apoderado de “MIZRAFIN”, SAPI DE CV, SOFOM, ENR, mediante Póliza Pública número 1,363 libro 2 de fecha 10 de octubre de 2011, ante la fe del Corredor Público Número 70, del Distrito Federal, Licenciado Carlos Porcel Sastrías, e inscrita en el Registro Público de la Propiedad y de Comercio de la Ciudad de Lerma, Estado de México. bajo el folio mercantil número 2277*11, el día 30 de mayo del 2012 y manifiesta bajo protesta de decir verdad que su poder y facultades son las necesarias para suscribir el presente contrato, y que no le han sido revocadas ni modificadas en forma alguna.\n\n`,
                        
                        {text:`e)`,bold:true},` Que previo a la firma del presente contrato solicitó y obtuvo de “EL FACTORADO” y el “GARANTE Y/O “OBLIGADO SOLIDARIO Y AVAL” su autorización para realizar la investigación sobre su historial crediticio en los términos de lo previsto por la Ley para Regular las Sociedades de Información Crediticia.\n\n`,
                        
                        {text:`f)`,bold:true},` Que de conformidad con las estipulaciones contenidas en el artículo 95 bis de la Ley General de Organizaciones y Actividades Auxiliares del Crédito y demás disposiciones aplicables, manifiesta  bajo protesta de decir verdad  que  los recursos objeto de este contrato son recursos de procedencia lícita y de actividades propias de “EL FACTORANTE” y la utilización de dichos recursos no contraviene en forma alguna ninguna legislación vigente, obligándose a proporcionar a las autoridades competentes, la información que le sea requerida.\n\n`,
                        
                        {text:`g)`,bold:true},` Tiene conocimiento del contenido y alcance del artículo 95 bis de la Ley General de Organizaciones y Actividades Auxiliares del Crédito, y en virtud de ello manifiesta que todas las transacciones, depósitos y demás actos que se llegaren a realizar al amparo de este instrumento, han sido y serán con dinero producto  del desarrollo normal de sus actividades y que tales recursos en ningún caso han provenido y se compromete que en el futuro no provengan de actividades ilícitas que tengan o puedan representar la comisión de cualquier delito y en especial los previstos en los artículos 139 Quáter y 400 bis del Código Penal Federal.
                        
                        `
                    ], fontSize: 8
                },
                {
                    text: [

                        {text: `II. Declara “EL FACTORADO” por conducto de su representante legal:\n\n`,bold:true},
                        
                        {text:`a)`,bold:true},` Que su representada es una sociedad constituida y regida, conforme a las leyes de los Estados Unidos Mexicanos, de conformidad a la escritura  pública y datos de inscripción señalados en la Hoja de Identificación del presente contrato.\n\n`,

                        {text:`b)`,bold:true},` Que cuenta con las facultades necesarias para obligar a su representada en los términos del presente contrato y para la realización de los actos jurídicos que se determinan y se prevén en el clausulado del presente contrato como según consta en la escritura referida en la Hoja de Identificación del presente contrato. Manifestando que a la fecha no le han sido modificados, limitados o revocados los poderes que en la referida escritura se le confieren.\n\n`,
                        
                        {text:`c)`,bold:true},` Que con objeto de contar con recursos oportunos cuando así lo requiera, desea celebrar con “EL FACTORANTE” el presente contrato ya que regularmente, para el desarrollo adecuado de sus actividades, presta bienes y/o servicios a diversas personas físicas y morales; (a quien en lo sucesivo se denominaran (“CLIENTE” o los “CLIENTES”), mismos de los que se originan derechos de crédito a su favor.\n\n`,
                        
                        {text:`d)`,bold:true},` Realiza actividades empresariales y/o comerciales de conformidad con las leyes de la República Mexicana y que se encuentra facultada para celebrar el presente contrato y cumplir con todas y cada una de las obligaciones a su cargo derivadas del mismo, RFC señalado en la Hoja de Identificación perteneciente al contrato.\n\n`,
                        
                        {text:`e)`,bold:true},` Entre su actividad comercial se comprende la proveeduría de bienes y/o la prestación de servicios;\n\n`,
                         
                        {text:`f)`,bold:true},` En lo sucesivo (los “CLIENTES”), han emitido a su favor títulos de crédito u otros instrumentos que documentan los derechos de crédito derivados de las operaciones comerciales que realiza con los mismos;\n\n`,
                        
                        {text:`g)`,bold:true},` Es su interés celebrar operaciones de Factoraje Financiero con “EL FACTORANTE”, para lo cual está dispuesto a transferirle la propiedad de los títulos de crédito (pagarés, letras de cambio, contra recibos, cheques, facturas).\n\n`,
                        {text:`h)`,bold:true},` Su(s) representante(s) legal(es) cuenta(n) con las facultades suficientes para obligar a su representada en los términos del presente contrato y para endosar en propiedad a “EL FACTORANTE” los títulos de Crédito que se operen en Factoraje Financiero.\n\n`,
                        
                        {text:`i)`,bold:true},` Que previo a la celebración del presente contrato otorgó a “EL FACTORANTE” su autorización por escrito para que realizará la investigación sobre su historial crediticio en los términos de lo previsto en la Ley para Regular las Sociedades de Información Crediticia.\n\n`,
                        
                        {text:`j)`,bold:true},` Que de conformidad con las estipulaciones contenidas en el artículo 95 bis de la Ley General de Organizaciones y Actividades Auxiliares del Crédito y demás disposiciones aplicables, manifiesta  bajo protesta de decir verdad  que  los recursos objeto de este contrato son recursos de procedencia lícita y de actividades propias de “EL FACTORADO” y no provienen de ningún tercero y la utilización de dichos recursos no contraviene en forma alguna ninguna legislación vigente, obligándose a proporcionar a las autoridades competentes, la información que le sea requerida.\n\n`,
                        
                        {text:`k)`,bold:true},` Tiene conocimiento del contenido y alcance del artículo 95 bis de la Ley General de Organizaciones y Actividades Auxiliares del Crédito, y en virtud de ello manifiesta que todas las transacciones, depósitos y demás actos que se llegaren a realizar al amparo de este instrumento,
                        `
                    ], fontSize: 8
                }
            ], columnGap: 40
        },
        {
            alignment: 'justify',
            columns: [
                {
                    text: [
                        `han sido y serán con dinero producto  del desarrollo normal de sus actividades y que tales recursos en ningún caso han provenido y se compromete que en el futuro no provengan de actividades ilícitas que tengan o puedan representar la comisión de cualquier delito y en especial los previstos en los artículos 139 Quáter, y 400 bis del Código Penal Federal.\n\n`,

                        {text:`l)`,bold:true},` “EL FACTORADO” conoce que el presente financiamiento podrá ser fondeado con recursos provenientes de la misma institución financiera y/o de cualquier institución financiera del país o del extranjero, Banca de Desarrollo, Banca Comercial o cualquier otra fuente de fondeo con Nacional Financiera o Nacional Financiera, la acreditada declara conocer que el crédito se otorga con el apoyo de Nacional Financiera, exclusivamente para fines de desarrollo nacional\n\n`,

                        {text: `III.- Declara el “GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL”, que:\n\n`,bold:true},
                        
                        {text:`a)`,bold:true},` Que son auténticos los datos generales, así como el domicilio que se señalan en la identificación de datos referidos en la Hoja de Registro del presente contrato.\n\n`,

                        {text:`b)`,bold:true},` Es su interés participar en el presente contrato como `, {text:`“GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL” de  “EL FACTORANTE”`,bold:true},` respecto de las obligaciones contraídas por este último, sin perjuicio de tener el patrimonio suficiente para responder y, en su caso, cumplir con las obligaciones que asume.\n\n`,
                        
                        {text:`c)`,bold:true},` Que de conformidad con las estipulaciones contenidas en el artículo 95 bis de la Ley General de Organizaciones y Actividades Auxiliares del Crédito y demás disposiciones aplicables, manifiesta  bajo protesta de decir verdad  que  los recursos objeto de este contrato son recursos de procedencia lícita y de actividades propias de el “GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL” y no provienen de ningún tercero y la utilización de dichos recursos no contraviene en forma alguna ninguna legislación vigente, obligándose a proporcionar a las autoridades competentes, la información que le sea requerida.\n\n`,
                        
                        {text:`d)`,bold:true},` Tiene conocimiento del contenido y alcance del artículo 95 bis de  la Ley General de Organizaciones y Actividades Auxiliares del Crédito, y en virtud de ello manifiesta que todas las transacciones, depósitos y demás actos que se llegaren a realizar al amparo de este instrumento, han sido y serán con dinero producto  del desarrollo normal de sus actividades y que tales recursos en ningún caso han provenido y se compromete que en el futuro no provengan de actividades ilícitas que tengan o puedan representar la comisión de cualquier delito y en especial los previstos en los artículos 139 Quáter, y 400 bis del Código Penal Federal.\n\n`,
                        
                        {text:`IV.- Declaraciones que derivan de la Disposición Única de la Comisión Nacional para la Protección y Defensa de los Usuarios de los Servicios Financieros.\n\n`,bold:true},
                        
                        {text:`a)`,bold:true},` El presente contrato considerado como de Adhesión se encuentra debidamente inscrito en el “Registro de Contratos de Adhesión” perteneciente a la Comisión Nacional para la Protección y Defensa de los Usuarios de los Servicios Financieros, bajo número 2847-425-033757/01-03811-1120 con fecha 05 de noviembre de 2020.\n\n`,
                        
                        {text:`V.-`,bold:true},` Atentas las partes a las declaraciones que anteceden, manifiestan su conformidad en otorgar el presente `,{text:`CONTRATO.\n\n`,bold:true},
                        
                        {text:`CLÁUSULAS\n\n`,bold:true,alignment:'center'},
                        
                        {text:`PRIMERA. DEFINICIÓN DE TÉRMINOS.`,bold:true},` Para los efectos del presente Contrato, los siguientes términos deben entenderse y tendrán el significado que se expresa a continuación y que serán igualmente aplicables tanto para el singular como para el plural de los mismos:
                        
                        `
                    ], fontSize: 8
                },
                {
                    text: [
                        `CARÁTULA.- Documento que contiene las características particulares del presente contrato y que forma parte del mismo

                        CONTRATO NORMATIVO DE FACTORAJE FINANCIERO: Es aquél mediante el cual las partes formalizan cada transmisión y  adquisición de Derechos de Crédito.
                        
                        DERECHOS DE CRÉDITO: Son las cantidades a favor del FACTORADO a cargo del Cliente que tengan su origen en el suministro de bienes o en la prestación de servicios que son motivo del presente Contrato,  documentados en facturas, contra recibos, títulos de crédito u otros documentos denominados en Moneda Nacional o Extranjera, que acrediten la existencia de dichos Derechos.
                        
                        FACTORANTE: Tiene el significado atribuido a dicho término en la hoja de identificación del presente contrato.
                        
                        FACTORADO: Tiene el significado atribuido a dicho término en la hoja de identificación del presente contrato.
                        
                        PAGARÉ DE LINEA: Documento que ampara el monto de la línea otorgada al FACTORADO y en cuyo caso se procederá mediante dicho documento a falta de pago de los Derechos de Crédito.
                        
                        TASA DE INTERÉS APLICABLE: Significa, respecto de cada CONTRATO DE FACTORAJE FINANCIERO, la tasa de interés que resulte de adicionar el número de puntos porcentuales que convengan las partes en cada CONTRATO DE FACTORAJE FINANCIERO a la TASA DE INTERÉS y que se aplicará sobre el PAGO que “EL FACTORADO” efectúe durante el PLAZO DE VIGENCIA del CONTRATO correspondiente.\n\n`,
                        {text:`SEGUNDA. OBJETO.`,bold:true},` “EL FACTORANTE” adquirirá las facturas, contra recibos, y títulos de crédito emitidos en favor de “EL FACTORADO”, con responsabilidad de éste, en lo sucesivo, en términos de la fracción II del Artículo 419 de la Ley General de Títulos y Operaciones de Crédito, por lo que “EL FACTORADO” es responsable del pago puntual y oportuno de los Créditos de aquellos “CLIENTES” previamente autorizados por “EL FACTORANTE” Y QUE HAYAN EMITIDO SU CONFORMIDAD, suscribiendo el consecutivo correspondiente del Anexo 2 (Contrato de Cesión de  Derechos),  y que son referidos en el Anexo 1 (Relación de personas emisoras de las que se pueden descontar derechos de crédito), del presente contrato mediante endoso de Pagarés, Letras de Cambio o demás títulos de créditos.
                        Asimismo, las partes están de acuerdo en que, durante la vigencia del presente contrato, “EL FACTORADO” podrá presentar a descuento nuevos DERECHOS DE CRÉDITO y “CLIENTES” en cuyo caso se adicionará el indicado Anexo 2 (Contrato de Cesión de Derechos).\n\n`,
                        
                        {text:`TERCERA. TRANSMISIÓN DE DERECHOS.`,bold:true},` “EL FACTORADO” en este acto transmite, sin reserva ni limitación alguna a “EL FACTORANTE” y éste adquiere los Créditos objeto de este contrato.
                        
                        “EL FACTORADO” se obliga solidariamente con sus “CLIENTES”,  al  pago  total  y  puntual  de  los Créditos   de   conformidad   con   lo  dispuesto   en   el Artículo 1988 del Código Civil Federal, así como en los Artículos 419, fracción II, 422, 423, y 426 de la LGTOC.\n\n`,
                        
                        {text:`Devoluciones.`,bold:true},` Si del acto jurídico que dio origen a los derechos de crédito se derivan devoluciones, los bienes correspondientes se entregarán a “EL FACTORADO”, salvo pacto en contrario.\n\n`,
                        
                        {text:`CUARTA. DESTINO Y APLICACIÓN DEL CRÉDITO. -`,bold:true},` 	"EL FACTORADO”, se obliga a destinar el Monto del Crédito a la `
                    ], fontSize: 8
                }
            ], columnGap: 40, pageBreak: 'before'
        },
        {
          alignment: 'justify',
          columns: [
              {
                  text: [
                      `actividad descrita en el punto número 2) de la Carátula de este contrato.

                      "EL FACTORADO” se compromete y obliga a otorgar a “MIZRAFIN”, las facilidades necesarias para que verifique la exacta aplicación del Monto del Crédito, incluyendo, sin limitación, la facultad de realizar visitas de inspección, ya sea de escritorio o de campo, a las instalaciones, oficinas o propiedades de "EL FACTORADO” y de sus subsidiarias o afiliadas, así como para revisar su contabilidad y demás registros comerciales, financieros u operativos, para lo cual “EL FACTORADO” dará las facilidades necesarias.\n\n`,
                      
                      {text:`QUINTA. VIGENCIA.`,bold:true},` Las partes convienen en que la vigencia del presente contrato  será  por  el  plazo de dos  años.  Dicho plazo   se   renovará   automáticamente    por   periodos iguales, salvo que cualquiera de las partes comunique a la otra, por escrito, su deseo de darlo por terminado con treinta días de anticipación.
                      
                      Aún y cuando el presente contrato o cualquiera de sus prórrogas llegué a su término, “EL FACTORADO” permanecerá obligado conforme a lo pactado a pagar a “EL FACTORANTE”, los DERECHOS DE CRÉDITO que esta última haya descontado y tengan un vencimiento posterior a dicha determinación, conforme a lo establecido en el presente contrato.
                      
                      Cuando el contrato por acuerdo de las partes se haya terminado por anticipado, “EL FACTORANTE” entregará una constancia a “EL FACTORADO” dando constancia de la terminación de la relación, previa liquidación de los DERECHOS DE CRÉDITO vigentes.\n\n`,
                      
                      {text:`SEXTA. ENTREGA DE LA DOCUMENTACIÓN Y NOTIFICACIÓN.`,bold:true},` “El FACTORADO” entrega a “EL  FACTORANTE” en  este  acto todos los documentos necesarios para realizar la cobranza y comprobar la existencia de los Créditos transmitidos, con los endosos en propiedad de los distintos Títulos De Crédito, o del formato que se incluye en el ANEXO 2 (Contrato de Cesión de Derechos), que debidamente firmado por las partes formará parte integral del presente contrato.\n\n`,
                      
                      {text:`SÉPTIMA. NOTIFICACIÓN.`,bold:true},` Una vez adquiridos los Créditos, “EL FACTORANTE” efectuará   la  notificación   de   la  transmisión   de   los mismos, en términos de los estatutos por los Artículos 426, 427 de la LGTOC y 2038 del CCF, dentro de un plazo que no excederá de 10 (diez) días hábiles a partir de la fecha en que se operó la cesión correspondiente. La notificación deberá hacerse a través de cualquiera de las formas siguientes:
                      
                      I.	Entrega del documento o documentos comprobatorios del derecho de crédito en los que conste el sello o leyenda relativa  a la transmisión  y acuse de recibo por el deudor mediante  contraseña,  contra recibo  o cualquier otro signo inequívoco de recepción;
                      II.	Comunicación por correo certificado con acuse de recibo, telegrama, télex o tele facsímil, contraseñados que deje evidencia de su recepción por parte del deudor;
                      III.	Notificación realizada por fedatario público; y
                      IV.	Mensajes de datos, en los términos del Título Segundo del Libro Segundo del Código de Comercio vigente.\n\n`,
                      
                      {text:`OCTAVA. INFORMACIÓN ADICIONAL.`,bold:true},` “EL FACTORADO” proporcionará a “EL FACTORANTE” toda la información que tenga respecto a los “CLIENTES”, así como la información  sobre el origen, naturaleza, términos y condiciones de los Créditos.
                      
                      “EL FACTORANTE” podrá revisar en días y horas hábiles, en las oficinas de “EL FACTORADO”, cualquier información o documento que el mismo tenga en relación de los Créditos transmitidos.
                      `
                  ], fontSize: 8
              },
              {
                  text: [
                     {text:`NOVENA FONDEO.`,bold:true},` Cuando alguna disposición sujeta al presente contrato sea fondeada con recursos provenientes de cualquier institución financiera del país o del extranjero, Banca de Desarrollo, Banca Comercial o cualquier otra fuente de fondeo con Nacional Financiera y/o Financiera Nacional, “EL FACTORADO” deberá proporcionar toda la información que estos le requieran, respecto de los créditos descontados; así mismo otorgar todas la facilidades al personal de dichas entidades o a quien estas designen, para la supervisión y evaluación de sus actividades, registros y documentos relacionados con los créditos descontados conforme al programa de inversiones contratado.
                     Cuando una parte o la totalidad de la línea de crédito que ampara el presente contrato sea Fondeada con recursos del Banco Mundial, “MIZRAFIN” deberá informar a “EL FACTORADO” haciendo entrega de la Guía Anticorrupción que será proporcionada por la Institución correspondiente, obteniendo de “EL FACTORADO”: 
                     a.	Declaración donde manifieste que recibió la Guía señalada en el párrafo anterior, y que está de acuerdo con su cumplimiento;
                     b.	Compromiso de seguir prácticas comerciales lícitas para la adquisición de los bienes y/o servicios para los que contrato el crédito.\n\n`,
                     {text:`DÉCIMA. REQUISITOS PARA EL FACTORAJE FINANCIERO.`,bold:true},` LAS PARTES están de acuerdo en que los derechos de crédito materia del Factoraje Financiero, deben sujetarse a los requisitos que se mencionan a continuación:
                     
                     1. Se deberán entregar a satisfacción de “EL FACTORANTE” la documentación original que sustente los DERECHOS DE CRÉDITO conforme:
                     a)	A los términos a que se refiere el Anexo 2 (Contrato de Cesión de Derechos), del presente contrato y,
                     b)	Pagarés, Letras de Cambio, Contra recibos y demás Títulos de Crédito debidamente endosados.
                     
                     2. Estar denominados en `,{text:`PESOS MONEDA NACIONAL`,bold:true},` y encontrarse vigentes.\n\n`,
                     
                     {text:`3. No tener vencimientos mayores a 180 (ciento ochenta) días naturales.`,bold:true},
                     
                     `4. Ser presentados a descuento a “EL FACTORANTE”, `,{text:`cuando menos 30 (treinta) días naturales antes de las fechas de sus respectivos vencimientos.\n\n`,bold:true},
                     
                     `5. Ser originados a favor del “EL FACTORADO” con motivo de la proveeduría regular de bienes y/o servicios que realiza por virtud de su actividad empresarial, los cuales deberán ser exigibles al “CLIENTE” a plazo determinado, salvo pacto entre LAS PARTES.
                     6. Acreditar su existencia y ser pagaderos por el “CLIENTE” en una sola exhibición.
                     
                     7. Encontrarse libres de todo gravamen o garantía alguna, que afecte o pueda afectar su pago total y oportuno.\n\n`,
                     
                     {text:`DÉCIMA PRIMERA CONDICIONES PARA EL FACTORAJE FINANCIERO.`,bold:true},` La realización de las operaciones previstas en el presente contrato, estarán sujetas a las siguientes condiciones:
                     
                     1. Los DERECHOS DE CRÉDITO deberán reunir todos los requisitos establecidos en el Anexo 2 de este contrato; en el caso de Pagarés, Letras de Cambio, Contra recibos y demás Títulos de Crédito tendrán que estar debidamente endosados.
                     
                     2. “EL FACTORADO” se abstendrá de presentar a descuento cualquier DERECHO DE CRÉDITO respecto del cual tenga conocimiento de la existencia de algún derecho de compensación o reclamo de cualquier naturaleza por parte del “CLIENTE” que 
                     `
                  ], fontSize: 8
              }
          ], columnGap: 40, pageBreak: 'before'
      },
      {
        alignment: 'justify',
        columns: [
            {
                text: [
                    `tenga a su cargo dicho derechos, que afecte o pueda afectar el pago total y oportuno que correspondan a “EL FACTORANTE”.

                    3. “EL FACTORADO” se abstendrá de presentar a descuento cualquier DERECHO DE CRÉDITO respecto del cual tenga conocimiento de la existencia de alguna situación que afecte o pueda afectar la capacidad económica de pago total y oportuno de dicho DERECHO DE CRÉDITO por parte del “CLIENTE”.
                    
                    4. Sin perjuicio o limitación de las demás causas previstas en este contrato, “EL FACTORANTE” podrá negarse a efectuar cualquier operación a amparo de este contrato cuando así lo considere conveniente.\n\n`,
                    
                    {text:`DECIMA SEGUNDA. EXISTENCIA DE LOS DERECHOS DE CRÉDITO.`,bold:true},` “EL FACTORANTE” podrá solicitar a “EL FACTORADO” la información que juzgue necesaria o conveniente para comprobar la existencia de los DERECHOS DE CRÉDITO y la solvencia de los “CLIENTES”.\n\n`,
                    
                    {text:`DÉCIMA TERCERA. DETERMINACIÓN Y PAGO DEL IMPORTE DEL FACTORAJE.`,bold:true},` Como contraprestación en favor de “EL FACTORADO” por la transmisión de cada DERECHO DE CRÉDITO, “EL FACTORANTE” entregará a “EL FACTORADO” el importe descontado correspondiente de conformidad con el cálculo que a continuación se describe:\n\n`,
                    
                    {text:`1. TASA DE INTERÉS ORDINARIA. SE DETERMINARÁ LA TASA DE DESCUENTO, QUE SERÁ UNA TASA FIJA,`,bold:true},{text:` la cual está establecida en la caratula perteneciente del contrato,`,bold:true,decoration:'underline'},` dicha tasa se multiplicará por el monto de la operación real después de aforos, por el  número de días que transcurran entre la fecha en que se lleve a cabo el descuento del DERECHO DE CRÉDITO y la fecha de vencimiento del mismo, entre 360 (Trescientos sesenta días), base anual financiera. El cálculo de descuento al factoraje se realiza de la manera siguiente: `,{text:`(IMPORTE REAL PARA FACTORAJE * TASA DE DESCUENTO ANUAL * DIAS DE PLAZO / BASE ANUAL DE DIAS 360).\n\n`,bold:true},
                    
                    {text:`2. TASA DE INTERÉS MORATORIA. SE DETERMINARÁ LA TASA DE DESCUENTO POR MORA, QUE SERÁ UNA TASA FIJA,`,bold:true},{text:` la cual está establecida en la caratula perteneciente del contrato.`,bold:true,decoration:'underline'},`   Se entiende por INTERESES MORATORIOS, al resultado que se obtenga de multiplicar por dos (2) la TASA DE DESCUENTO VIGENTE que haya sido pactada por LAS PARTES. Los INTERESES MORATORIOS serán calculados por los días transcurridos entre la fecha estipulada de pago entre LAS PARTES, indicada en el ANEXO 2 o en los distintos Títulos de Crédito operados, y la fecha en que efectivamente se realiza el pago, definiéndose el intervalo como periodo de incumplimiento. El método de cálculo es el siguiente: `,{text:`(IMPORTE *  2 VECES TASA ANUAL / 360 DIAS * DIAS ATRASO).\n`,bold:true},
                    `Los INTERESES MORATORIOS aplican para los casos en que “EL FACTORADO” no hiciere  el pago oportuno a “EL FACTORANTE” en la fecha de pago indicada en el ANEXO 2, o en los distintos Títulos Crédito operados de cada uno de sus DERECHOS DE CRÉDITO descontados, o bien no le hiciere la entrega a “EL FACTORANTE” de las cantidades recibidas en pago por sus DERECHOS DE CRÉDITO por parte de su “CLIENTE” en caso de cobranza delegada, “EL FACTORADO” pagará a “EL FACTORANTE” los INTERESES MORATORIOS, durante todo el periodo en que dure su incumplimiento. 
                    
                    1.	Al total de cada DERECHO DE CRÉDITO TRANSMITIDO se le disminuirá la tasa de descuento y el resultante será el importe a pagar a “EL FACTORADO”, misma que se le cubrirá por “EL FACTORANTE” a más tardar al día siguiente de la presentación del DERECHO DE CRÉDITO.
                    
                    2.	COMISIONES. Se realizará un cobro de comisión por cada operación. 
                    La comisión se cobra utilizando como `,{text:`metodología de cálculo`,decoration:'underline'},` la cantidad resultante de multiplicar un porcentaje fijo por el monto `
                ], fontSize: 8
            },
            {
                text: [
                   `total de cada uno de los DERECHOS DE CRÉDITO objeto de descuento, resultando de ello el cobro de la cantidad resultante, más el correspondiente Impuesto al Valor Agregado (IVA). Dicha comisión se cubrirá al momento de entregar a “EL FACTORADO” los DERECHOS DE CRÉDITO para su descuento, y su periodicidad es por operación  (se cobran la comisión por cada operación). La comisión se cobrará sobre el monto total de la operación de factoraje efectivamente realizada (no sobre montos aforados). El cobro es independiente al plazo de vencimiento, y sólo es un porcentaje del valor de la suma de la cesión de derechos descontada en la operación. `,{text:`“EL FACTORADO” PAGARÁ LA COMISIÓN SEÑALADA EN LA CARATULA REFERANTE AL PRESENTE CONTRATO AL FACTORANTE POR CADA OPERACIÓN,`,bold:true},`  sobre el monto  total de cada uno de los DERECHOS DE CRÉDITO objeto de descuento, más el correspondiente Impuesto al Valor Agregado (IVA). No podrán haber comisiones duplicadas bajo ninguna circunstancia, tampoco en reestructuras de crédito.\n\n`,

                   {text:`DÉCIMA CUARTA. FORMA Y LUGAR DEL PAGO.`,bold:true},` Las cantidades debidas por “EL FACTORADO” a “EL FACTORANTE” con motivo de operaciones relacionadas con el presente contrato se cubrirán mediante abono a la cuenta que “EL FACTORANTE” mantiene abierta a su nombre en el banco `,{text:`BANCOMER`,bold:true},` con el número `,{text:`0163074501`,bold:true,decoration:'underline'},` clabe `,{text:`012420001630745014`,bold:true,decoration:'underline'},`, o `,{text:`BANORTE`,bold:true},` con el número `,{text:`00586880139`,bold:true,decoration:'underline'},` clabe `,{text:`072420005868801397`,bold:true,decoration:'underline'},`  y serán pagaderas en la fecha de su vencimiento conforme a lo pactado en el presente contrato, sin necesidad de previo requerimiento. En caso de que alguna de las fechas en que “EL FACTORADO” deba realizar un pago en un día inhábil, el pago respectivo deberá efectuarse el día hábil inmediato siguiente.  
                   Las cantidades debidas por “EL FACTORADO” a “EL FACTORANTE” con motivo de operaciones relacionadas con el presente contrato se cubrirán mediante transferencia electrónicas con cheque a cargo del banco designado y serán pagaderas en la fecha de su vencimiento conforme a lo pactado en el presente contrato, sin necesidad de previo requerimiento.
                   
                   En caso de que “EL FACTORANTE” realice alguna modificación en sus cuentas bancarias este hará de su conocimiento a “EL FACTORADO” para los fines convenientes.\n\n`,
                   
                   {text:`DÉCIMA QUINTA. PAGARÉ.`,bold:true},` De conformidad con lo establecido en el Artículo 424 de  la  LGTOC,  en  la  fecha  de  firma  del  presente contrato, “EL FACTORADO” y el OBLIGADO SOLIDARIO Y AVAL  suscriben  y  entregan  un  pagaré de línea en favor de “EL FACTORANTE” que documenten la(s) disposiciones que “EL FACTORADO” realice respecto del importe  otorgado.  Dicho pagaré deberá ser suscrito adicionalmente por el OBLIGADO SOLIDARIO Y AVAL en caso de la existencia del mismo. También se respaldarán las operaciones con el contrato de cesión de derechos de cobro integrado en el contrato como ANEXO 2, así como el endoso de los Títulos de Crédito para cada una de las operaciones, mismo que deberá integrar los títulos de crédito o instrumentos de cobranza cedidas a favor de “EL FACTORANTE” para su registro debido en el RUG (Registro Único de Garantías), de la Secretaría de Economía (SE).
                   
                   Los mencionados títulos de crédito reunirán las características de la normatividad vigente a que se refiere el Artículo 170 de la LGTOC. “EL FACTORADO” autoriza expresamente a “EL FACTORANTE” a ceder, negociar y re descontar los títulos de crédito así suscritos, en cuyo evento subsistirán las garantías concedidas, sin que ello implique responsabilidad alguna para “EL FACTORANTE”.
                   
                   Dado que las operaciones de cesión de DERECHOS DE CRÉDITO son en modalidad de factoraje, “EL FACTORADO” deberá siempre documentar las cesiones de derecho de cobro por medio del ANEXO 2 o endoso de los Títulos de Crédito y el 
                   `
                ], fontSize: 8
            }
        ], columnGap: 40, pageBreak: 'before'
    },
		{
      alignment: 'justify',
      columns: [
          {
              text: [
                  `PAGARÉ de línea fungiendo como obligado solidario y aval de las operaciones.

                  Asimismo, no puede considerarse a la suscripción y entrega de los pagarés como pago o dación en pago de la obligación documentada, sino como una garantía colateral del pago, que deberá ser depositado a “EL FACTORANTE” mediante transferencia a las cuentas indicadas en la Cláusula Décima Cuarta.\n\n`,
                  
                  {text:`DÉCIMA SEXTA. ORDEN DE PRELACIÓN DE PAGO.`,bold:true},` El orden de prelación en la aplicación de los pagos de adeudos hechos por “EL FACTORADO” será el siguiente:
                  
                  a) Otros gastos y costos derivados del presente contrato.
                  b) Comisiones.
                  c) Intereses Moratorios
                  d) Intereses Ordinarios.
                  e) Capital\n\n`,
                  
                  {text:`Fecha de Pago.-`,bold:true},` La fecha de pago de las operaciones, será indicada de forma distinta para cada operación realizada sobre los DERECHOS DE CRÉDITO descontados en las diferentes operaciones. Por tanto, habrá que acudir al Anexo 2 (Contrato de Cesión de Derechos) o los distintos títulos de Crédito, donde se enlistarán los vencimientos correspondientes a cada uno de los DERECHOS DE CRÉDITO cedidos por “EL FACTORADO” a “EL FACTORANTE”.\n\n`,
                  
                  {text:`Monto Total a Pagar.-`,bold:true},` El monto total a pagar será definido particularmente de acuerdo a cada operación individual de cesión de DERECHOS DE CRÉDITO. El monto indicado correspondiente a cada operación, se encuentra dentro del Anexo 2 (Contrato de Cesión de Derechos) dentro de la tabla que relaciona los montos a pagar por cada operación de factoraje realizada; así como en los distintos Títulos de Créditos operados.\n\n`,
                  
                  {text:`DÉCIMA SÉPTIMA	.`,bold:true},` OBLIGACIONES DE “EL FACTORADO”. “EL FACTORADO”, sin necesidad de requerimiento judicial o extrajudicial, se obliga a devolver dentro del DIA HÁBIL inmediato siguiente a la solicitud que le efectúe “EL FACTORANTE”, las cantidades que haya recibido por cada uno de aquellos DERECHOS DE CRÉDITO descontados aún no vencidos, para el caso de que se den cualesquiera de los supuestos que a continuación se mencionan:
                  
                  1. Si “EL FACTORADO” presentase a “EL FACTORANTE” información o declaraciones que resulten falsas.
                  
                  2. Si “EL FACTORADO” presenta a descuento DERECHOS DE CRÉDITO que no reúnan cualquiera de los requisitos establecidos en el presente contrato.
                  
                  En caso de que “EL FACTORADO” no devuelva las cantidades a que se refiere el primer párrafo de esta cláusula, se entenderá que ha actuado con mala fe con la intención de cometer fraude y falsificación de información con dolo.
                  
                  En lo que les corresponda, “EL FACTORADO” y “EL OBLIGADO SOLIDARIO Y AVAL” se obligan de manera respectiva frente a `,{text:`“MIZRAFIN”`,bold:true},`, durante el tiempo que esté vigente este contrato y hasta en tanto no se realice el pago total de las cantidades de principal, intereses y accesorios insolutos del Crédito, a cumplir con las siguientes obligaciones de dar, hacer y no hacer:
                  1.	Asegurar los bienes otorgados en garantía, así como los conceptos de inversión y/o los activos productivos que generen la fuente de pago, debiendo otorgar copia del documento soporte a “MIZRAFIN” 
                  2.	Permitir al Supervisor de “MIZRAFIN” así como a  instituciones financieras del país o del extranjero, Banca de Desarrollo, Banca Comercial o cualquier otra fuente de fondeo y/o Entidades Fiscalizadoras, cuando aplique: i) realizar la supervisión y/o auditoria, ii) solicitar la información financiera y contable; y iii) en general proporcionarles `
              ], fontSize: 8
          },
          {
              text: [
                 `cualquier documento y/o datos que les soliciten en relación con los créditos descontados, lo anterior previo aviso por escrito con 5 (cinco) días naturales de anticipación a la visita. 
                 3.	Conservar y Mantener en condiciones eficientes de servicio la maquinaria, equipo y en general, los demás elementos de producción que generen la fuente de pago, así como los bienes otorgados en garantía de los créditos descontados. 
                 4.	Dar aviso a “MIZRAFIN”, dentro de los siguientes 10 (diez) días naturales, de cualquier evento que pudiera implicar un Cambio Material Adverso, respecto a su negocio, su situación financiera o resultado de operaciones, así como cualquier procedimiento legal, judicial o administrativo que afecte a "LA ACREDITADA” o a cualquiera de sus propiedades o activos y que pueda afectar la obligación de pago del Crédito. 
                 5.	Manejar racionalmente los recursos naturales y preservar el medio ambiente, acatando las medidas y acciones dictadas por las autoridades competentes, así como cumplir las orientaciones y recomendaciones técnicas del personal y/o el Supervisor de “MIZRAFIN”\n\n`,
                 
                 {text:`DÉCIMA OCTAVA. COBRANZA DE LOS DERECHOS DE CRÉDITO DESCONTADOS.`,bold:true},` “EL FACTORANTE” se encargara de la cobranza de los DERECHOS DE CRÉDITO descontados, a cuyo efecto “EL FACTORANTE” notificara al “CLIENTE” la transmisión de dichos DERECHOS DE CRÉDITO. “EL FACTORADO” se obliga a proporcionar a “EL FACTORANTE” toda la información y colaboración que razonablemente le sea solicitada por “EL FACTORANTE” para tal fin.
                 
                 En caso que el “CLIENTE” pague directamente a “EL FACTORADO” los DERECHOS DE CRÉDITO descontados, aún y cuando ello obedezca a falta de notificación por parte de “EL FACTORANTE” al “CLIENTE” de la transmisión de los DERECHOS DE CRÉDITO, “EL FACTORADO” entregará a “EL FACTORANTE” el importe total del pago recibido a la brevedad posible, y en su defecto, a más tardar DIEZ DÍAS  HÁBILES después de haberlo recibido, al respecto acuerdan LAS PARTES que en dicho supuesto “EL FACTORADO” tendrá el carácter de depositario respecto de las cantidades recibidas, en los términos del artículo 332, 334, 335 y demás relativos del Código de Comercio, con todas las obligaciones inherentes a dicho cargo, el cual será gratuitamente desempeñado por el Depositario, quién en este acto acepta dicho cargo. Esta operación también se denomina como un factoraje con Cobranza Delegada.
                 Si “EL FACTORADO” no hiciere entrega a “EL FACTORANTE” de las cantidades recibidas en el plazo señalado en el párrafo anterior, en adición a cualquier responsabilidad civil o penal en que incurra, “EL FACTORADO” pagará a “EL FACTORANTE” los INTERESES MORATORIOS, que enseguida se definen, durante todo el periodo en que dure su incumplimiento, definidos en el punto 2 en la Cláusula Decima Tercera del presente contrato.\n\n`,
                 
                 {text:`DÉCIMA NOVENA. CESIÓN DE DERECHOS.`,bold:true},` “EL FACTORADO” y en su caso, el “GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL”, autoriza(n) expresamente a “EL FACTORANTE” para transmitir, endosar, ceder, descontar o en cualquier otra forma negociar parcial o totalmente los contratos y los pagarés que documenten la presente operación bajo las modalidades y para los efectos que más convengan a “EL FACTORANTE”, comprendiendo incluso todos los derechos accesorios, así como los derechos, en su caso, sobre los bienes muebles y/o inmuebles otorgados en garantía, aún antes de su vencimiento, manifestando también “EL FACTORADO” y en su caso, el “GARANTE  Y/O OBLIGADO SOLIDARIO Y AVAL, su voluntad de reconocer a los que se les transmitan los derechos antes mencionados o endosatarios o cesionarios, los mismos derechos que corresponden a “EL FACTORANTE”, sin más requisitos que notificar a “EL FACTORADO” y en su caso, el GARANTE  Y/O OBLIGADO SOLIDARIO Y AVAL,  respecto de la 
                   
                 `
              ], fontSize: 8
          }
      ], columnGap: 40, pageBreak: 'before'
  },
  {
    alignment: 'justify',
    columns: [
        {
            text: [
                `Cesión, en términos de las disposiciones jurídicas aplicables, salvo que “EL FACTORANTE” conserve la administración del crédito  y éste sea garantizado con hipoteca, en cuyo caso no será necesario notificar a “EL FACTORADO” ni, en su caso, el GARANTE  Y/O OBLIGADO SOLIDARIO Y AVAL,  en los términos del artículo 2926 del Código Civil Federal y demás correlativos aplicables de los Códigos Civiles del Distrito Federal.

                Asimismo, “EL FACTORADO” y en su caso, el “GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL”, autorizan expresamente a “EL FACTORANTE” para endosar, o en cualquier otra forma, negociar, aún antes del vencimiento de este Contrato, el o los Títulos de crédito mediante los cuales se ha documentado el crédito, teniendo para esos fines el carácter de Mandatario de los tenedores de los títulos de crédito, en virtud que en este supuesto subsistirá la obligación de “EL FACTORANTE”, de vigilar y conservar las garantías otorgadas. En tal virtud, “EL FACTORANTE”, queda facultado para ceder o descontar el crédito así documentado.
                
                “EL FACTORADO” no podrá ceder los derechos y obligaciones que le corresponden en virtud de este contrato, sin el consentimiento previo y por escrito de “EL FACTORANTE”.\n\n`,
                
                {text:`VIGESIMA. ESTADOS DE CUENTA.`,bold:true},` “EL FACTORADO” en este acto exime a “EL FACTORANTE” de la obligación de enviarle los estados de cuenta a su domicilio, obligándose “EL FACTORANTE” a ponerlos a su disposición dentro de los diez días hábiles siguientes a la fecha de corte para el pago de intereses, a través del correo electrónico de “EL FACTORADO”, el cual ha quedado señalado en la Hoja de Identificación del presente contrato.
                  
                Los estados de cuenta indicarán los adeudos del financiamiento contratado, desglosado por los conceptos de capital e intereses, vigentes y vencidos, comisiones  y otros conceptos aplicables. 
                
                “EL FACTORANTE”, pondrá a disposición y de manera gratuita  a “EL FACTORADO”  una copia del estado de cuenta, a partir del séptimo día hábil siguiente a la fecha de corte.
                 
                “EL FACTORADO” contará con un plazo de 30 (treinta) días naturales para en su caso objetar el mismo, transcurrido dicho plazo se entenderá que no tiene objeción alguna.\n\n`,
                
                {text:`VIGÉSIMA PRIMERA. DE LA SUPERVISIÓN.`,bold:true},` A partir de esta fecha y durante todo el tiempo que "EL FACTORADO” adeude alguna cantidad a “EL FACTORANTE” por motivo de este contrato, ésta tendrá el derecho de nombrar un supervisor que vigile el exacto cumplimiento de las obligaciones de "EL FACTORADO” asumidas en este contrato, bajo un previo aviso de 5 (cinco) días hábiles.
                El supervisor que se nombre, atendiendo al aviso y plazo mencionado en el párrafo anterior, tendrá libre acceso a las oficinas, instalaciones, libros de contabilidad y documentos del negocio de "EL FACTORADO” relacionados con el proyecto para el cual se destina el crédito y siempre y cuando no sean de carácter confidencial, la cual se obliga a otorgar al supervisor todas las facilidades necesarias para que cumpla con su cometido.
                Si como resultado de las verificaciones e inspecciones que “MIZRAFIN” realice a través de su Supervisor, detecta alguna situación que no sea de su conformidad, se le hará saber a "EL FACTORADO”  para su corrección dentro del plazo que “EL FACTOTANTE” le otorgue, en el que "EL FACTORADO”  deberá solventar las aclaraciones que correspondan y si a juicio de “EL FACTOTANTE” la situación que se presente pone en riesgo la recuperación del Crédito, emprenderá las acciones que salvaguarden sus intereses, incluyendo en éstas la rescisión de este contrato de Crédito.\n\n`,
                
                {text:`VIGÉSIMA SEGUNDA. TERMINACIÓN ANTICIPADA.`,bold:true},` Serán causas de terminación del presente contrato las siguientes:
                `
            ], fontSize: 8
        },
        {
            text: [
                
               `1. El mutuo acuerdo firmado por LAS PARTES.

               2. El incumplimiento de “EL FACTORADO” a cualquiera de las obligaciones a su cargo estipuladas en el presente contrato, en este caso, “EL FACTORANTE” podrá declarar por vencida anticipadamente la vigencia original del presente contrato o la vigencia de cualquiera de sus prórrogas.
               
               “EL FACTORADO” podrá solicitar en todo momento la terminación anticipada, debiendo cubrir en su caso y en los términos pactados, el monto total del adeudo, incluyendo todos los accesorios financieros que éste hubiera generado a la fecha en que se solicite la terminación anticipada del contrato, bastando para ello la presentación de una solicitud por escrito en cualquier oficina de “EL FACTORANTE”.\n\n`,
               
               {text:`VIGESIMA TERCERA. GASTOS Y COSTOS.`,bold:true},` “EL FACTORADO” pagará a “EL FACTORANTE” cualquier costo, gasto o pérdida en que incurra “EL FACTORANTE” por la ejecución y/o ratificación ante fe pública del presente contrato.\n\n`,
               
               {text:`VIGESIMA CUARTA. ANTICIPOS.`,bold:true},` “EL FACTORANTE”, se exime de cualquier obligación para devolver o regresar intereses o comisiones a “EL FACTORADO” por concepto de pagos adelantados o anticipos efectuados.\n\n`,
               
               {text:`VIGÉSIMA QUINTA. MODIFICACIONES AL CONTRATO.`,bold:true},` Ninguna modificación o renuncia a disposición alguna de este Contrato y ningún consentimiento dado a “EL FACTORADO” para divergir del Contrato surtirá efectos, a menos que conste por escrito y se suscriba por “EL FACTORANTE” y “EL FACTORADO”, y aún en dicho supuesto, tal renuncia o consentimiento tendrá efecto solamente en el caso y para el fin específico para el cual fue otorgado.
               “EL FACTORANTE” podrá modificar el contrato conforme a sus políticas de negocio, aumentar, disminuir o modificar los requisitos del factoraje de acuerdo a lo siguiente:
               a) Con diez días naturales de anticipación a la entrada en vigor, deberá notificar a “EL FACTORADO” las modificaciones propuestas mediante aviso incluido en el estado de cuenta correspondiente. El aviso deberá especificar de forma notoria la fecha en que las modificaciones surtirán efecto.
               
               b) En el evento de que “EL FACTORADO” no esté de acuerdo con las modificaciones propuestas, podrá solicitar la terminación del contrato hasta 60 días naturales después de la entrada en vigor de dichas modificaciones, sin responsabilidad ni comisión alguna a su cargo, debiendo cubrir, en su caso, los adeudos que ya se hubieren generado a la fecha en que se solicite la terminación. O bien, se entenderá su aceptación tácita, por parte de “EL FACTORADO”, por el simple hecho de que presente una nueva operación a descuento.
               
               Lo anterior, con excepción a las modificaciones realizadas a la información a que se refieren las cláusulas, DÉCIMO QUINTA, DÉCIMO NOVENA, VIGÉSIMA Y VIGÉSIMA SEGUNDA, en cuanto a servicios y atención a usuarios.
               
               c) Una vez transcurrido el plazo señalado en el inciso anterior sin que “EL FACTORANTE” haya recibido comunicación alguna por parte de “EL FACTORADO”, se tendrán por aceptadas las modificaciones.\n\n`,
               
               {text:`VIGÉSIMA SEXTA. DE LA INFORMACIÓN CREDITICIA.`,bold:true},` “EL FACTORADO” manifiesta expresamente que es de su conocimiento que las Sociedades de Información Crediticia tienen por objeto prestar servicios de información sobre las operaciones financieras que realizan con personas físicas y/o morales, por lo que “EL FACTORADO” no tiene ningún inconveniente y está de acuerdo en que EL FACTORANTE proporcione información  relativa  a las operaciones  contempladas en el presente contrato. Asimismo, “EL FACTORADO” autoriza expresamente a “EL `
            ], fontSize: 8
        }
    ], columnGap: 40, pageBreak: 'before'
},
{
  alignment: 'justify',
  columns: [
      {
          text: [
              `FACTORANTE” para que a través de sus funcionarios facultados lleve a cabo investigaciones sobre su comportamiento crediticio en las Sociedades de Información Crediticia que estime conveniente. “EL FACTORADO”   manifiesta   que   conoce   la  naturaleza   y alcance  de la información  que  se solicitó,  del uso que “EL FACTORANTE”  hará de tal información y de que EL  FACTORANTE  podrá  realizar  consultas  periódicas de su historial crediticio, consintiendo que la autorización  concedida se encuentre  vigente por un período  de  3 (tres)  años  contados  a  partir  de  la  fecha  de  su expedición y en todo caso durante el tiempo en que se mantenga una relación jurídica entre “EL FACTORADO” y “EL FACTORANTE”.

              “EL FACTORADO” renuncia expresamente al ejercicio de cualquier acción legal en contra de “EL FACTORANTE” que derive o sea consecuencia de que éste haya hecho uso   de las   facultades   conferidas   en   la presente cláusula.\n\n`,
              
              {text:`VIGÉSIMA SÉPTIMA. ATENCIÓN A USUARIOS.`,bold:true},` La Comisión Nacional  para la Protección y Defensa de los Usuarios de Servicios Financieros  (CONDUSEF), brindara atención a usuarios vía telefónica al número 53-400-999 o Lada sin costo 01-800-999-80-80, a través de su página de Internet en www.condusef.gob.mx  y por medio de su correo electrónico opinion@condusef.gob.mx 
              
              En el caso de modificaciones a los datos antes mencionados, la Comisión Nacional para la Protección y Defensa de los Usuarios de Servicios Financieros (CONDUSEF) lo hará del conocimiento de las Sociedades Financieras de Objeto Múltiple, Entidades No Reguladas a través de su página web, con 30 días naturales de anticipación.
              
              Para la atención a usuarios por parte de “EL FACTORANTE”. La unidad especializada será la ubicada en Av. Circuito de la Industria Ote. 36 y 38, Parque Industrial Lerma, Lerma Edo. de México, C.P.52000 o a través de sus líneas telefónicas en los números (728) 282 7272 Ext. 134.\n\n`,
              
              {text:`VIGÉSIMA OCTAVA SOLICITUDES, CONSULTAS, ACLARACIONES, INCONFORMIDADES Y QUEJAS.`,bold:true},` El proceso y los requisitos para la presentación y seguimiento de las solicitudes, consultas, aclaraciones, inconformidades y quejas será el siguiente: 
              
              1.	Presentar la queja, duda, comentario, pregunta o sugerencia por escrito al correo electrónico: atencion_usuario@mizrafin.com 
              
              2.	El usuario o “CLIENTE” obtendrá una respuesta por escrito que tratará de resolver la cuestión. Tal respuesta, contará con un número de folio específico proveído por EL FACTORANTE.
              
              3.	Si la cuestión planteada por el usuario no fuese resuelta, el usuario podrá comunicarse al teléfono (728) 282 7272, Ext. 134, refiriendo su caso mediante el número de folio que le fue proveído en la respuesta escrita a su queja y ser atendido por el personal de la unidad especializada de atención al usuario de” EL FACTORANTE”
              
              De no estar conforme con la atención y resolución que se haya dado vía telefónica, el usuario podrá acudir directamente a las oficinas ubicadas en `,{text:`Av. Circuito de la Industria Ote. 36 y 38, Parque Industrial Lerma, Lerma, Edo. de México, C.P.52000`,decoration:'underline'},`, y resolver así su cuestión directamente con la unidad especializada de atención al usuario.
              
              Como última instancia de ser fallidas las anteriores, `,{text:`el usuario podrá acudir directamente a la Comisión Nacional para la Protección y Defensa de los Usuarios de Servicios Financieros (CONDUSEF)`,decoration:'underline'},`. Sirviendo como oficina de enlace para atender los requerimientos las ubicadas en: `,{text:`Av. Circuito de la Industria Ote`,decoration:'underline'},
          ], fontSize: 8
      },
      {
          text: [
              
             {text:`36 y 38, Parque Industrial Lerma, Lerma, Edo. de México, C.P.52000. o a través de sus líneas telefónicas en los números: (728) 282 7272 Ext. 134.\n\n`,decoration:'underline'},

             {text:`VIGÉSIMA NOVENA.`,bold:true},` DOMICILIO PARA NOTIFICACIONES. Todas las notificaciones deberán hacerse por escrito y se considerarán debidamente efectuadas si se mandan a los siguientes domicilios.\n\n`,
             
             {text:`“EL FACTORANTE”:`,bold:true},` El ubicado en `,{text:`Av. Circuito de la Industria Ote. 36 y 38, Parque Industrial Lerma, Lerma, Edo. de México, C.P.52000.\n\n`,decoration:'underline'},
             {text:`“EL FACTORADO”: El domicilio señalado en la Hoja de Identificación del presente contrato.\n\n`,bold:true},
             
             {text:`El “GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL”: El domicilio señalado en la Hoja de Identificación del presente contrato.\n\n`,bold:true},
              
             `Mientras las partes no se notifiquen el cambio de sus domicilios, los emplazamientos, notificaciones y demás diligencias judiciales y extrajudiciales se practicarán y surtirán todos sus efectos legales en los domicilios señalados en la presente cláusula.  
             
             Las partes convienen que las notificaciones a que se refiere la presente cláusula no se podrán efectuar a través o por medios electrónicos, ópticos o de cualquier otra tecnología, no obstante, de que dichos medios puedan ser atribuibles a las mismas, o bien de que éstos sean accesibles de ser consultados en forma ulterior.\n\n`,
             
             {text:`TRIGESIMA. COMPROBANTES DE OPERACIÓN.`,bold:true},` “EL FACTORANTE” pondrá a disposición de “EL FACTORADO” los comprobantes que documenten las transacciones efectuadas por medio de Contratos de Cesión referido en el Anexo 2, o endoso de Títulos de Crédito ya sea a través de su entrega física, o a través de un medio electrónico o de telecomunicaciones, dependiendo el medio por el que se haya celebrado la operación.
             
             La información contenida en los mismos deberá ser veraz, precisa, clara, completa, objetiva, actualizada, oportuna y que “EL FACTORADO” pueda confirmar la operación llevada a cabo.
             
             Los comprobantes que “EL FACTORANTE” emitan en sus oficinas o sucursales deberán contar con la calidad suficiente para que no se borren ni se deterioren en un plazo mínimo de 90 días naturales, debiendo contener al menos:
             
             a) Identificación de “EL FACTORANTE” u oficina, en donde la operación haya sido efectuada.
             b) Monto de la operación.
             c) Tipo de operación efectuada.
             d) Los datos de identificación de la cuenta o contrato en el que se efectuó la operación.
             e) En su caso, las Comisiones cobradas en la operación.
             f) Plaza geográfica donde la operación haya sido efectuada.
             g) Fecha y hora de la operación.
             h) Los datos de localización de la Unidad Especializada de “EL FACTORANTE”.\n\n`,
             
             {text:`TRIGÉSIMA PRIMERA. JURISDICCIÓN.`,bold:true},` Las partes se someten expresamente a la jurisdicción de las leyes y de los Tribunales competentes de la Ciudad de Lerma, Estado de México, para todo lo relativo a la interpretación y cumplimiento de este contrato, renunciando al fuero que por cualquier razón pudiera corresponderle.\n\n`,
             
             {text:`TRIGESIMA SEGUNDA. INTERCAMBIO DE INFORMACIÓN.`,bold:true},` Efectuar por sí o mediante tercero, cualquier tipo de investigación presente y futura, en lo que respecta a sus relaciones financieras particularmente crediticias, con Sociedades Financieras de Objeto Múltiple, Sociedades Financieras de Objeto Limitado, Instituciones de Crédito, Organizaciones Auxiliares de Crédito, 
             `
          ], fontSize: 8
      }
  ], columnGap: 40, pageBreak: 'before'
},
{
  alignment: 'justify',
  columns: [
      {
          text: [
             `Casas Comerciales y en general con cualquier persona física o moral, nacional o extranjera. Por lo anterior y derivado de las reciprocidades que pudieran existir “EL FACTORADO”, autoriza de igual manera a “EL FACTORANTE” a proporcionar la misma información a las empresas que en ejercicio de sus funciones así lo soliciten liberando en ambos casos a “EL FACTORANTE” de cualquier clase de responsabilidad de orden civil o penal, por lo que a mayor abundamiento, “EL FACTORADO” declara bajo protesta de decir verdad que conoce la naturaleza y consecuencias que la investigación e información de los datos a que se refiere esta cláusula puedan derivar.\n\n`,

             {text:`TRIGESIMA TERCERA. OBLIGADO SOLIDARIO.`,bold:true},` La persona que se menciona en la Hoja de Identificación de este contrato comparece en este acto con su carácter de OBLIGADO SOLIDARIO, y se constituye como tal de “EL FACTORADO”, frente y a favor de “EL FACTORANTE”, debiendo suscribir con el mismo carácter, así como los pagarés en calidad de AVAL y cualquier documento que se derive de este contrato.
             En tal virtud, la obligación solidaria que en este acto y con la firma de los anexos   se contrae se constituye en términos de los artículos 1987 y demás aplicables del Código Civil Federal, así como del artículo 4 de la Ley General de Títulos y Operaciones de Crédito y en consecuencia la persona referida en el párrafo anterior hace suyas todas la obligaciones y prestaciones derivadas de este Contrato, comprometiéndose a cumplirlas en su totalidad.
             Igualmente, el OBLIGADO SOLIDARIO conviene en continuar obligado solidariamente de conformidad con este Contrato, aún y cuando los derechos a favor de “EL FACTORANTE” derivados del mismo y sus anexos, sean cedidos total o parcialmente.\n\n`,
             
             {text:`TRIGESIMA CUARTA. GARANTÍA.`,bold:true},` En garantía del cumplimiento de todas y cada una de las obligaciones de “EL FACTORADO” y del pago exacto y oportuno de todas las cantidades adeudadas por “EL FACTORADO” a “EL FACTORANTE” conforme a este Contrato, incluyendo, de forma enunciativa pero no limitativa, la suerte principal, intereses ordinarios, intereses moratorios, gastos de cobranza y de ejecución y demás accesorios derivados de este Contrato (en lo 
             `
          ], fontSize: 8
      },
      {
          text: [
              
             `sucesivo las “Obligaciones Garantizadas”), EL “GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL” constituye la GARANTÍA como se indica en la caratula y Anexo 3 de este contrato en los términos y condiciones de la misma, con la finalidad de garantizar las obligaciones a cargo de “EL FACTORADO”, en primer lugar en favor de “EL FACTORANTE”.\n\n`,

             {text:`TRIGESIMA QUINTA. TITULO EJECUTIVO`,bold:true},` De conformidad con el Artículo. 87-F de la Ley General de Organizaciones y Actividades Auxiliares del Crédito, esté Contrato junto con el estado de Cuenta que guarde y certificado por el contador de” EL FACTORANTE” serán título ejecutivo mercantil sin necesidad de reconocimiento de firma ni de otro requisito alguno, lo anterior para todos los efectos legales a que haya lugar.\n\n`,
             
             {text:`TRIGESIMA SEXTA. TÍTULOS DE LAS CLÁUSULAS.`,bold:true},` Los títulos con los que se denomina a cada una de las cláusulas que aparecen en el presente contrato, se han puesto con el exclusivo propósito de facilitar su lectura, por tanto, no necesariamente   definen ni limitan el contenido de estas. Para efectos de interpretación de cada cláusula deberá atenderse exclusivamente a su contenido, y de ninguna manera a su título.\n\n`,
             {text:`TRIGESIMA SÉPTIMA. ANEXO DE DISPOSICIONES LEGALES`,bold:true},`, Los preceptos legales a los que se hacen referencia en el presente contrato, podrán ser consultados por “EL FACTORADO” en el Anexo de Disposiciones Legales, el cual estará a disposición de este en las oficinas de “EL FACTORANTE” o su página de internet en www.mizrafin.com.
             Enteradas las partes del Alcance y contenido se las Cláusulas anteriores firman por duplicado el presente contrato (Uno para cada una de las partes).
             LUGAR Y FECHA DE SUSCRIPCIÓN:
             Lerma, Estado de México a __ de ___________ de ____
             `
          ], fontSize: 8
      }
  ], columnGap: 40, pageBreak: 'before'
},
[{
  style: 'tabla',
  
  table: {
    widths: ['*','*'],
    body: [
      [{text: '\n'}, {}],
      [{text: '\n'}, {}],
      [{text: '\n'}, {}],
      [{text: '\n'}, {}],
      [{text: ` “EL FACTORANTE”\n\n\n\n\n____________________________________________\nMIZRAFIN, SAPI DE C.V., SOFOM ENR\nChemaya Mizrahi Fernández`, alignment: 'center'}, {text: ` “EL FACTORADO\n\n\n\n\n____________________________________________\n\n(Nombre del Representante Legal)`, alignment: 'center'}],
      [{text: '\n'}, {}],
      [{text: '\n'}, {}],
      [{text: '\n'}, {}],
      [{text: ` “OBLIGADOS SOLIDARIOS Y AVALISTAS”\n\n\n\n\n____________________________________________\n(Nombre)`,alignment: 'center', colSpan: 2}, {} ],
    ]
  },
  layout: 'noBorders'
  , colSpan: 5},{},{},{},{}],
  {
    text: [
      {text:`A N E X O No. 1\n\n`,fontSize: 10},

      {text:`RELACIÓN DE PERSONAS EMISORAS O DOCUMENTOS DE LAS QUE SE PUEDEN DESCONTAR DERECHOS DE CRÉDITO\n\n`,bold:true,fontSize: 8}, 
      
      {text:`“EL FACTORADO” podrá descontar derechos de crédito de las personas físicas y morales que a continuación se enlistan:\n\n`,fontSize: 8},
      
    ], pageBreak: 'before'
  },
  {style: 'tabla',
            table: {
            widths: ['*','*','*','*'],
                    body: [
                        [{text:`NOMBRE, DENOMINACIÓN O RAZÓN SOCIAL`, alignment: 'center', bold: true}, {text:`DOMICILIO FISCAL`, alignment: 'center', bold: true}, {text:`REGISTRO FEDERAL DE CONTRIBUYENTES `, alignment: 'center', bold: true}, {text:`ACTIVIDAD `, alignment: 'center', bold: true}],
                        [{text:``},{text:``},{text:``},{text:``}],
                        [{text:``},{text:``},{text:``},{text:``}],
                        [{text:``},{text:``},{text:``},{text:``}],
                        [{text:``},{text:``},{text:``},{text:``}],
                        [{text:``},{text:``},{text:``},{text:``}],
                        [{text:``},{text:``},{text:``},{text:``}],
                        [{text:``},{text:``},{text:``},{text:``}],
                        [{text:``},{text:``},{text:``},{text:``}],
                        [{text:``},{text:``},{text:``},{text:``}],
                        [{text:``},{text:``},{text:``},{text:``}],
                    ]
                }},
  {text:'\n\n\n\n'},
  {text:`F I R M A S:\n\n`, alignment: 'center', bold:true, fontSize: 9},
  {style: 'tabla',
            table: {
            widths: ['*','*'],
                    body: [
                        [{text:`“EL FACTORANTE”`, alignment: 'center', bold: true}, {text:`“EL FACTORADO”`, alignment: 'center', bold: true}],
                        [{text:` MIZRAFIN, SAPI DE CV, SOFOM, E.N.R.\n\n\n\n\n_______________________________\nCHEMAYA MIZRAHI FERNANDEZ\n(REPRESENTANTE LEGAL)`, alignment: 'center', bold: true}, {text:`“NOMBRE DEL FACTORADO”.\n\n\n\n\n_______________________________\nREPRESENTADA POR`, alignment: 'center', bold: true}],
                    ]
                }},
                {text: [
    {text: `A N E X O No. 2\n\n`,bold:true, alignment: 'center', fontSize: 8}, 
    {text: `CONTRATO DE CESION DE DERECHOS\n`,bold:true, alignment: 'center', fontSize: 8}, 
    {text: `__________________________________________________________\n`,bold:true, alignment: 'center', fontSize: 8},
    {text: `“MIZRAFIN”, SAPI DE CV, SOFOM, E.N.R.\n\n`,bold:true, alignment: 'center', fontSize: 8},], alignment: 'justify', fontSize: 8, pageBreak: 'after'},
    {
      style: 'tabla',
      
      table: {
        widths: ['*','*'],
        body: [
          [{text: '\n'}, {}],
          [{text: `Anexo que forma parte del\nCONTRATO NORMATIVO DE FACTORAJE FINANCIERO\ncon Número:\nde fecha`, alignment: 'left'}, {text: `Marque con una “x”\nCobranza directa___   Cobranza delegada___.\nCONTRATO DE CESIÓN DE DERECHOS Nº\nde fecha\nNº  de relaciones 1`, alignment: 'right'}],
        ]},layout: 'noBorders'},
{text:'\n'},
{text: `CONTRATO DE CESIÓN DE DERECHOS que celebran por una primera parte ______________________________ (en lo sucesivo denominada “EL CEDENTE”); por una segunda parte “MIZRAFIN”, SAPI de CV, SOFOM, ENR., (en lo sucesivo denominada “CESIONARIO”), y por ultima parte _____________________________________ en su carácter de “GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL”.\n\n`, bold:true, fontSize: 8},
{text: `DECLARACIONES\n`, fontSize: 8,alignment: 'center',bold:true},
{text: `Las partes declaran: \n\n`, fontSize: 8,alignment: 'left',bold:true},
{text: `I. Declara el “CESIONARIO” por conducto de su representante legal: \n\n`, fontSize: 8,alignment: 'left',bold:true},
{
  text: [
    `a) Ser una Sociedad Anónima Promotora de Inversión de Capital Variable, constituida con la denominación “MIZRAFIN”, SAPI DE CV, SOFOM, ENR, bajo las leyes de la República Mexicana, mediante Escritura Número 106,219 libro 2,340 de fecha 18 de agosto de 2008, ante la fe del Notario Público Número 30 del Distrito Federal, Licenciado Francisco Villalón Igartua, e inscrita en el Registro Público de la Propiedad y de Comercio del Distrito Federal, bajo el folio mercantil número 394800, el día 17 de febrero de 2009.

    b) La sociedad es una Sociedad Financiera de Objeto Múltiple (SOFOM), Entidad No Regulada (E.N.R.), conforme al “DECRETO por el que se reforman, derogan y adicionan diversas disposiciones de la Ley General de Títulos y Operaciones de Crédito, Ley General de Organizaciones y Actividades Auxiliares del Crédito, Ley de Instituciones de Crédito, Ley General de Instituciones y Sociedades Mutualistas de Seguros, Ley Federal de Instituciones de Fianzas, Ley para Regular las Agrupaciones Financieras, Ley de Ahorro y Crédito Popular, Ley de Inversión Extranjera, Ley del Impuesto sobre la Renta, Ley del Impuesto al Valor Agregado y del Código Fiscal de la Federación” publicado en el Diario Oficial de la Federación el día 18 de julio de 2006; 
    
    c) En cumplimiento al Artículo 87-J vigente a la fecha de la Ley General de Organizaciones y Actividades Auxiliares del Crédito, se indica lo siguiente: La Sociedad opera como SOFOM, ENR, y no requiere de la autorización de la Secretaría de Hacienda y Crédito Público, y no está sujeta a la supervisión y vigilancia de la Comisión Nacional Bancaria y de Valores.
    
    d) Personalidad: El C. Chemaya Mizrahi Fernández, acredita su personalidad como Apoderado de “MIZRAFIN”, SAPI DE CV, SOFOM, ENR, mediante Póliza Pública número 1,363 libro 2 de fecha 10 de octubre de 2011, ante la fe del Corredor Público Número 70, del Distrito Federal, Licenciado Carlos Porcel Sastrías, e inscrita en el Registro Público de la Propiedad y de Comercio de la Ciudad de Lerma, Estado de México. bajo el folio mercantil número 2277*11, el día 30 de Mayo del 2012 y manifiesta bajo protesta de decir verdad que su poder y facultades son las necesarias para suscribir el presente contrato, y que no le han sido revocadas ni modificadas en forma alguna.
    
    e) Que el Depositario legal conviene en constituirse como tal respecto de todos y cada uno de los Derechos de Crédito objeto de este Contrato. (En cobranza delegada)\n\n`,
    
    {text:`II. Declara “EL CEDENTE”:\n\n`,bold:true}, 
    
    `a) Que por sus generales ser: de nacionalidad (es)_________, originario de ______ donde nació el día __ del mes __ del año _____ , con domicilio en _________________.
    
    b) Con RFC _____________ y CURP __________________ .
    
    c) Que su estado civil es ___________________ bajo el régimen matrimonial ___________________. 
    
    d) Que es una persona física capacitada legalmente para la celebración del presente contrato y para asumir y dar cumplimiento a las obligaciones que en el mismo se establecen, las cuales son válidas y exigibles en su contra y exhibiendo identificación oficial vigente con fotografía y firma, cuyo emisor es ____________________ con número ___________________________ .
    
    e) Que su principal actividad es ___________________________________.\n\n`,   
    
    {text:`III.- Declara el “GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL”:\n\n`,bold:true},
    
    
    `a) Que es su interés participar en el presente contrato como `,{text:`“GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL” de “EL FACTORADO”`,bold:true},` respecto de las obligaciones contraídas por este último, sin perjuicio de tener el patrimonio suficiente para responder y, en su caso, cumplir con las obligaciones que asume.\n\n`,

    {text:`IV.`,bold:true},` Las partes declaran que en cumplimiento de dicho contrato desean celebrar el presente acto, de acuerdo al tenor de las siguientes:\n\n`,
    {text:`CLÁUSULAS\n\n`,bold:true,alignment:'center'},
    
    {text:`PRIMERA: “ELCEDENTE”`,bold:true},` transmite en este acto a `,{text:`“EL CESIONARIO”`,bold:true},` los Derechos de Crédito que se detallan en la (s) relación (es) (Tabla I) que se adjuntan a este documento, como parte integral del mismo, haciendo entrega de toda la documentación que comprueba su existencia.
    La transmisión que por virtud de este contrato se celebra, se lleva a cabo sin reserva ni limitación alguna e incluye todos los derechos accesorios tales como los intereses que en su caso hubieran sido pactados y las garantías otorgadas en relación con los mismos.
    En los términos del artículo 419 fracción II de la Ley General de Títulos y Operaciones de Crédito, `,{text:`“ELCEDENTE”`,bold:true},` se obliga solidariamente con los Clientes al pago puntual y oportuno de los Derechos de Crédito transmitidos.\n\n`,
    
    {text:`SEGUNDA:`,bold:true},` Las partes convienen en que para efectos de la transmisión de los Derechos de Crédito objeto de este Contrato el Plazo de Vigencia del Contrato será hasta que se liquiden a `,{text:`“EL CESIONARIO”`,bold:true},`, todos los derechos de crédito cedidos en el presente contrato.\n\n`,
    
    {text:`TERCERA:`,bold:true},` Las partes convienen expresamente que la Tasa de Interés y Comisiones aplicables a este Contrato de Factoraje Financiero será la tasa fija y comisiones pactadas dentro del marco del presente contrato, cuyas condiciones se resumen en el presente anexo.
    Para el caso de que los Derechos de Crédito no se liquiden oportunamente, las partes convienen en que se aplicará al presente contrato un interés adicional sobre saldos insolutos diarios, computados desde la fecha de vencimiento del Plazo de Vigencia del Contrato de los Derechos de Crédito transmitidos hasta su liquidación total calculados a razón de dos veces la Tasa de Interés Aplicable.\n\n`,
    
    {text:`CUARTA:`,bold:true},` De acuerdo con lo señalado en el Contrato Normativo de Factoraje Financiero con recurso, `,{text:`“ELCEDENTE”`,bold:true},` paga en este acto a `,{text:`“EL CESIONARIO”`,bold:true},` o a quien este le indique, un __% aplicado al precio estipulado en la cláusula TERCERA como comisiones de operación y de cobranza.\n\n`,
    	
    {text:`QUINTA:`,bold:true},` El `,{text:`“GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL”`,bold:true},` se comprometen a garantizar las obligaciones a cargo de `,{text:`“ELCEDENTE”`,bold:true},` en los términos del Contrato Normativo de Factoraje Financiero y en forma específica las contenidas en este Contrato.\n\n`,
    
    {text:`SEXTA: “ELCEDENTE” y el “GARANTE Y/O OBLIGADO SOLIDARIO Y AVAL”`,bold:true},` manifiestan bajo protesta de decir verdad que su situación patrimonial a la fecha del presente Contrato es la misma que tenía al suscribir el Contrato Normativo de Factoraje Financiero.\n\n`,
    
    {text:`SEPTIMA:`,bold:true},` De conformidad con el artículo 87-F de la Ley General de Organizaciones y Actividades Auxiliares del Crédito, este Contrato es un título ejecutivo que trae aparejada ejecución.\n\n`,
    
    {text:`OCTAVA:`,bold:true},` Las partes convienen expresamente en dar por reproducido íntegramente el Contrato Normativo de Factoraje Financiero como si a la letra se insertare para todos los efectos legales a que haya lugar.\n\n`,
    
    {text:`NOVENA:`,bold:true},` De conformidad con el Contrato Normativo de Factoraje Financiero, las partes se someten a la jurisdicción de los Tribunales competentes señalados en el mismo.\n\n`,
    
    {text:`DÉCIMA: “ELCEDENTE”`,bold:true},` tendrá la obligación de responder del detrimento en el valor de los derechos de crédito objeto del presente contrato de cesión, fungiendo como obligado solidario de la operación de factoraje al valor original indicado en la cesión de DERECHOS DE CRÉDITO enlistada a continuación. Si se derivan devoluciones, los bienes correspondientes se entregarán a `,{text:`“EL CEDENTE”.\n\n`,bold:true},

    {text:`CUADRO INFORMATIVO DEL CONTRATO NORMATIVO DE FACTORAJE FINANCIERO\n\n`,bold:true, alignment:'center'},

    `Los rubros precisados en este resumen se entenderán referidos a las cláusulas contenidas en el contrato de adhesión del que se desprenden.\n\n
    `
  ],fontSize: 8, alignment: 'justify'
},
{style: 'tabla',
            table: {
            widths: ['*','*'],
                    body: [
                        [{text:'CAT', aligment: 'left',bold:true}, {text:'', aligment: 'left'}],
              [{text:'MONTO O LÍMITE DE LA OPERACIÓN:', aligment: 'left',bold:true}, {text:'', aligment: 'left'}],
              [{text:'PLAZO', aligment: 'left',bold:true}, {text:'', aligment: 'left'}],
              [{text:'TASA DE INTERES', aligment: 'left',bold:true}, {text:'', aligment: 'left'}],
              [{text:'COMISIONES', aligment: 'left',bold:true}, {text:'___% aplicado al precio establecido en la cláusula QUINTA del contrato de factoraje financiero sin recurso', aligment: 'left'}],
              [{text:'MONTO Y NUMERO DE PAGOS', aligment: 'left',bold:true}, {text:'NO APLICA', aligment: 'left'}],
              [{text:'PERIODICIDAD DE PAGO O FECHA DE PAGO', aligment: 'left',bold:true}, {text:'NO APLICA', aligment: 'left'}],
              [{text:'FECHA DE CORTE', aligment: 'left',bold:true}, {text:'NO APLICA', aligment: 'left'}],
              [{text:'SEGUROS CON LOS QUE CUENTA LA OPERACIÓN O SERVICIO:', aligment: 'left',bold:true}, {text:'NO APLICA', aligment: 'left'}],
              [{text:'DATOS DE LA UNIDAD ESPECIALIZADA DE ATENCIÓN A USUARIOS:', aligment: 'left',bold:true}, {text:`Av. Circuito de la Industria Ote. 36 y 38, Lerma, Edo de México, C.P. 52000, Teléfono: (728) 282 7272 ext. 134 Fax: (728) 282 7298, E-mail: atencion_usuario@mizrafin.com
              `, aligment: 'left'}],
                    ]
                }},
                {text:`TABLA I\n\n`,bold:true, alignment: 'center',pageBreak: 'before',fontSize:10},
                {text:`RELACIÓN DE DOCUMENTOS CEDIDOS A FAVOR DE:\n“MIZRAFIN”, SAPI DE CV, SOFOM ENR\n\n`,bold:true, alignment: 'center',fontSize:10},
                {style: 'tabla',
                    table: {
                    widths: ['*','*'],
                            body: [
                                [{text:'FECHA', aligment: 'left',bold:true}, {text:`CONTRATO DE CESION Nº\nNº DE RELACIONES: UNA DE UNA`, aligment: 'left'}],
                            ]
                        }},
                        {style: 'tabla',
                        table: {
                        widths: ['*','*','*','*','*','*','*'],
                        body: [
                          [{text:`EMISOR O DEUDOR (Razones Sociales de los Deudores del CLIENTE)`, alignment: 'center',bold:true},{text:`DOCTO No`, alignment: 'center',bold:true},{text:`TIPO DOCTO. *`, alignment: 'center',bold:true},{text:`FECHA DE ENTREGA MERCANCIA`, alignment: 'center',bold:true},{text:`FECHA VENCIMIENTO`, alignment: 'center',bold:true,},{text:`IMPORTE FACTURA 100%`, alignment: 'center',bold:true},{text:`% O IMPORTE A OPERAR`, alignment: 'center', bold:true},],
                         // [{text:``, aligment: 'left'},{text:``, aligment: 'left'},{text:``, aligment: 'left'},{text:``, aligment: 'left'},{text:``, aligment: 'left',},{text:``, aligment: 'left'},{text:``, aligment: 'left'},],
                         // [{text:`MONTO TOTAL`, aligment: 'left',colSpan: 5},{},{},{},{},{text:`$`, aligment: 'left'},{text:``, aligment: 'left'},],
                        ]
                      }},
                      this.table(this.losdocs, ['EMISOR_O_DEUDOR', 'DOCTO_No', 'TIPO_DOCTO', 'FECHA_DE_ENTREGA_MERCANCIA', 'FECHA_VENCIMIENTO', 'IMPORTE_FACTURA_100', 'O_IMPORTE_A_OPERAR']),
                      {style: 'tabla',
                        table: {
                        widths: ['*','*','*','*','*','*','*'],
                        body: [
                         
                          [{text:`MONTO TOTAL`, alignment: 'left',colSpan: 5},{},{},{},{},{text:`$ ${this.importe_facturas_100}`, alignment: 'left'},{text:`${this.importe_operarstr}`, alignment: 'left'},],
                        ]
                      }}, 
                {text:'\n'},
                {text:'\n'},
                {text:`* Tipos de documento             
                •	FS = Factura sellada  
                •	CR = Contrarrecibo 
                •	FE = Factura electrónica   
                •	PA = Pagaré   
                •	LC = Letra de cambio
                `, fontSize: 7},
                {
                  style: 'tabla',
                  
                  table: {
                    widths: ['*','*'],
                    body: [
                      [{text: '\n'}, {}],
                      [{text: '\n'}, {}],
                      [{text: ` “EL CESIONARIO”\nMIZRAFIN SAPI DE C.V. SOFOM ENR\n\n\n_________________________________\nREPRESENTADA POR\nChemaya Mizrahi Fernández`, alignment: 'center'}, {text: ` “EL CEDENTE”\nNOMBRE DEL CEDENTE\n\n\n_________________________________\nREPRESENTADA POR\n(Nombre del Representante Legal)`, alignment: 'center'}],
                      [{text: '\n'}, {}],
                      [{text: '\n'}, {}],
                      [{text: '\n'}, {}],
                      [{text: ` ““OBLIGADOS SOLIDARIOS Y AVALISTAS””\n\n\n_________________________________\n(nombre)`,alignment: 'center', colSpan: 2}, {} ],
                    ]
                  },
                  layout: 'noBorders'
                  },
                  {text:`“ANEXO No 3”\n\n`,bold:true, alignment: 'left',pageBreak: 'before',fontSize:10},
                  {text:`“GARANTIA(S)”\n\n`,bold:true, alignment: 'center',fontSize:10},
                  {text:`	
                  ___ PRENDA

                  ___ HIPOTECA

                  ___ FIDEICOMISO

                  `,fontSize:10},
                  {text: `DESCRIPCION:

                  ____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

                  LUGAR Y FECHA DE SUSCRIPCIÓN:
                  
                  LERMA DE VILLADA, ESTADO DE MÉXICO A ______ DE ___________ DE ___________\n\n
                  `, fontSize: 8},
                  {text: `F I R M A S\n\n`, bold:true, fontSize: 8 },
                  {
                    style: 'tabla',
                    
                    table: {
                      widths: ['*','*'],
                      body: [
                        [{text: '\n'}, {}],
                        [{text: '\n'}, {}],
                        [{text: '\n'}, {}],
                        [{text: '\n'}, {}],
                        [{text: ` “EL FACTORANTE”\n\n\n\n\n____________________________________________\nMIZRAFIN, SAPI DE C.V., SOFOM ENR\nChemaya Mizrahi Fernández`, alignment: 'center'}, {text: ` “EL FACTORADO\n\n\n\n\n____________________________________________\n\n(Nombre del Representante Legal)`, alignment: 'center'}],
                        [{text: '\n'}, {}],
                        [{text: '\n'}, {}],
                        [{text: '\n'}, {}],
                        [{text: ` “OBLIGADOS SOLIDARIOS Y AVALISTAS”\n\n\n\n\n____________________________________________\n(Nombre)`,alignment: 'center', colSpan: 2}, {} ],
                      ]
                    },
                    layout: 'noBorders'},
                  {text:`“P A G A R E”\n\n`,bold:true, alignment: 'center',pageBreak: 'before',fontSize:10},
                  {text:`BUENO POR: $\n\n`,bold:true, alignment: 'right',fontSize:8},
                  {text: [
                    {text: `Debo y Pagaré incondicionalmente a la orden de “MIZRAFIN”, SOCIEDAD ANONIMA PROMOTORA DE INVERSION DE CAPITAL VARIABLE, SOCIEDAD FINANCIERA DE OBJETO MULTIPLE, ENTIDAD NO REGULADA, en sus oficinas ubicadas en Avenida Circuito de la Industria Oriente número 36 y 38, Colonia Parque Industrial Lerma, en Lerma de Villada Estado de México C.P. 52000, el día    de            de 20   , a la vista, la suma de $             . (                           Pesos 00/100 Moneda Nacional).
            
                    La suma principal amparada por este Pagaré devengará intereses ordinarios a partir de esta fecha y hasta el pago total del mismo a una tasa de interés anual de  % (             por ciento), y una comisión de   % (            por ciento) del monto del pagaré, que serán cubiertos en términos del presente pagaré. 
                    
                    Ante el incumplimiento en el pago de la suma principal e intereses derivados de este Pagaré en lugar de la tasa de interés ordinaria referida anteriormente este pagaré devengara interés moratorios sobre su saldo insoluto a una tasa de interés igual a la tasa de interés anual ordinaria mencionada al principio de este párrafo multiplicada por 2(dos).    
                    
                    Tanto el importe del capital de este Título expresado en Moneda Nacional, así como los intereses que el mismo cause, serán cubiertos en un plazo no mayor a   meses.
                    
                    Este pagaré es un Título de Crédito sujeto a las disposiciones de los Artículos 4,114, 170 y demás aplicables a la Ley General de Títulos y Operaciones de Crédito.
                    
                    Para la ejecución y cumplimiento de este Pagaré y para el requerimiento judicial de pago de las cantidades adeudadas conforme al mismo, el Suscriptor y el Aval se someten expresa e irrevocablemente a la jurisdicción de los tribunales competentes en la Ciudad de Lerma de Villada, Estado de México. Mediante la suscripción y entrega de este Pagaré el Suscriptor y el Aval renuncian irrevocablemente a cualquier otro fuero al que tengan o lleguen a tener derecho, en virtud de su domicilio (presente o futuro) o por cualquier otra razón.
                    
                    El Suscriptor designa como su domicilio para requerimiento judicial de pago, el siguiente:
                    
                    El Aval designa como su domicilio para requerimiento judicial de pago, el siguiente:
                    
                    Por el presente Pagaré el Suscriptor y el Aval renuncian a cualquier diligencia de presentación, requerimiento o protesto. La omisión o retraso del tenedor del presente Pagaré en el ejercicio de cualquiera de sus derechos conforme a este Pagaré en ningún caso constituirá una renuncia a dichos derechos.
                    
                    El Suscriptor y el Aval prometen incondicional e irrevocablemente pagar los costos y gastos que impliquen el cobro de este Pagaré incluyendo, sin limitación alguna, los honorarios de los abogados que intervengan en el cobro, en caso de incumplimiento en el pago de este Pagaré. 
                    
                    El presente Pagaré se suscribe y entrega en la Ciudad de Lerma de Villada, Estado de México el día      de      de 20     .
                    `}, 
                    
                    ,], alignment: 'justify', fontSize: 8},
            
                    {
                      style: 'tabla',
                      
                      table: {
                        widths: ['*','*'],
                        body: [
                          [{text: '\n'}, {}],
                          [{text: '\n'}, {}],
                          [{text: ` SUSCRIPTOR\n"               "\n\n\n_________________________________\n(nombre y firma)`, alignment: 'center'}, {text: ` AVAL\n"               "\n\n\n_________________________________\n(Nombre y firma)`, alignment: 'center'}],
                
                        ]
                      },
                      layout: 'noBorders'
                      },
            ],
        styles: {
          tabla: {
            bold: false,
            fontSize: 8.5,
            color: 'black'
          }
        },
        defaultStyle: {
          // alignment: 'justify'
        }
      };
    const pdfDocGenerator = pdfMake.createPdf(dd);
    pdfDocGenerator.getBlob((blob) => {
    this.subirdocMizrafin(blob,ids, folio);
  });
  }

  cesion_derechos_factor(conttabla, ids, folio, data) {
    // OBTENER LA FECHA ACTUAL ///////////////
    const a = new Date();
    a.setMinutes( a.getMinutes() + a.getTimezoneOffset() );
    let montha = '' + (a.getMonth() + 1);
    let daya = '' + a.getDate();
    const yeara = a.getFullYear();
    if (montha.length < 2) {
    montha = '0' + montha;
    }
    if (daya.length < 2) {
    daya = '0' + daya;
    }
    let fechaHoyReporte = [daya, montha, yeara].join('/');
    // OBTENER LA FECHA ACTUAL ///////////////
    
    let tablapos = 110;
    let incremetotabla = (conttabla.length * 10) + 10;
    if (conttabla[0]) {
      if (conttabla[0][0]) {
        console.log(conttabla[0][0].length)
        if (conttabla[0][0].length >= 21 && conttabla[0][0].length <= 93) {
          
          tablapos = 130
        } else if (conttabla[0][0].length >= 94) {
          
          tablapos = 150
        }
      }
    }
        // tslint:disable-next-line: forin
        // tslint:disable-next-line: no-conditional-assignment
    let doc = new jsPDF({marginRight: 10});
    doc.setFontType('arial');
    doc.setFontType('bold');
    doc.text('ANEXO 1', 105, 20, 'center');
    doc.setFontSize(10);
    doc.text('RELACIÓN DE DOCUMENTOS QUE CONTIENEN LOS DERECHOS DE CRÉDITO QUE SE TRANSMITEN', 102, 30, 'center');
    doc.setFontSize(11);
    doc.setFontType('normal');
    doc.text('Chihuahua, Chihuahua a ' + fechaHoyReporte, 192, 40, 'right');
    doc.setFontType('bold');
    doc.text('Nombre del Deudor ' + data.nombrecadena, 14, 50, 'left');
    doc.text('P R E S E N T E :', 14, 60, 'left');
    doc.setFontType('normal');
    doc.text('De conformidad a lo establecido en el contrato de Cadenas a Proveedores celebrados con ustedes en fecha ' + data.startdatesuplier +
    ' hacemos de su conocimiento relación de los Documentos que contienen los Derechos de crédito que se transmiten a nuestro favor, ' +
    'mismos que derivan de productos y/o servicios que recibió de sus proveedores Proveedor(es), mismos que se abonaran a la(s) cuenta(s) ' +
    'señalada(s) previamente por el(los) Proveedor(es) en el Contrato Único de Factoraje y/o Descuento.', 14, 70, {maxWidth: 180, align: "justify"});
    doc.autoTable({
          head: [['PROVEEDOR', 'No. DOCTO', 'VALOR NOMINAL', 'FECHA EMISIÓN', 'FECHA DE VENCIMIENTO']],
          body: conttabla, startY: 100
        });
    doc.addPage();
    doc.text('Chihuahua, Chihuahua a ' + fechaHoyReporte, 188, 20, 'right');
    doc.setFontType('bold');
    doc.text(data.nombrecadena, 14, 30, 'left');
    doc.text(data.direccioncompany + 'direccion tipo fiscal', 14, 35, 'left');
    doc.text('P R E S E N T E ', 14, 50, 'left');
    doc.setFontType( 'normal');
    doc.text('En mi calidad de representante legal de la sociedad ' + data.nombreproveedor +
    'por medio de la presente les notificamos que hemos transmitido los derechos de crédito de los Documentos que se' +
    'indican a continuación, mismos que derivan de los productos y/o servicios que recibió, afavor de Factor GFC Global' +
    'Sociedad Anónima de Capital Variable, Sociedad Financiera de Objeto Múltiple Entidad No Regulada, y con motivo de lo' +
    'anterior les instruimos a ustedes, efectuar el pago total de dichos Documentos a la cuenta de cheques a nombre de' +
    'Factor GFC Global, Sociedad Anónima de Capital Variable, Sociedad Financiera de Objeto Múltiple Entidad No Regulada' +
    'identificada con el número 0857275314 en la institución bancaria denominada Banco Mercantil del Norte, Sociedad Anónima,' +
    'Institución de Banca Múltiple, Grupo Financiero Banorte, o mediante transferencia electrónica de fondos interbancarios,' +
    'a la misma cuenta, cuya Clave Bancaria Estandarizada (CLABE) es 072150008572753147.', 14, 60, {maxWidth: 180, align: "justify"});
    doc.autoTable({
          head: [['PROVEEDOR', 'No. DOCTO', 'VALOR NOMINAL', 'FECHA EMISIÓN', 'FECHA DE VENCIMIENTO']],
          body: conttabla, startY: 110
        });
    doc.text('En consecuencia a lo anterior, le notificamos que la presente instrucción sólo se podrá modificar con la autorización previa' +
    'y por escrito de un apoderado con facultades suficientes de Factor GFC Global, Sociedad Anónima de Capital Variable, Sociedad' +
    'Financiera de Objeto Múltiple Entidad No Regulada.', 14, (tablapos) + incremetotabla, {maxWidth: 180, align: "justify"});
    doc.setFontType( 'bold');
    doc.text('A T E N T A M E N T E', 14, (tablapos + incremetotabla) + 30, 'left');
    doc.setFontType( 'normal');
    doc.text(data.nombreproveedor, 14, (tablapos + incremetotabla) + 35, 'left');
    doc.setLineWidth(.5);
    doc.line(80, (tablapos + incremetotabla) + 45, 14, (tablapos + incremetotabla) + 45); // horizontal line
    doc.text(data.firmantesreportenombres, 14, (tablapos + incremetotabla) + 50, 'left');
    doc.setFontType( 'bold');
    doc.text('R E C I B I D O', 14, (tablapos + incremetotabla) + 60, 'left');
    doc.setFontType( 'normal');
    doc.text(data.nombrecadena, 14, (tablapos + incremetotabla) + 65, 'left');
    doc.line(80, (tablapos + incremetotabla) + 75, 14, (tablapos + incremetotabla) + 75); // horizontal line
        // doc.save('nalgas.pdf');
        // console.log(doc.output());
     this.subirdocFactor(doc.output('blob'), ids, folio);
      }

      subirdocFactor( sol, idsol, folio ) {
        const file = sol;
        const filepath = `${folio}/${folio}`;
        const fileRef = this._firestorage.ref(filepath);
        this._firestorage.upload(filepath, file).then(() => { fileRef.getDownloadURL().subscribe( resp => {
        this.uploadURL = resp;
        const params = {
          token: '',
          secret_key: '',
          attached: this.uploadURL
      };
        this._solicitudesservice.updateSolicitudes(idsol, params).subscribe(resp => console.log(resp));
        (err) => {console.log(err)}} ); }); // this.subirurl(); });
    
      }

      subirdocMizrafin( sol, idsol, folio ) {
        const file = sol;
        const filepath = `${folio}/${folio}`;
        const fileRef = this._firestorage.ref(filepath);
        this._firestorage.upload(filepath, file).then(() => { fileRef.getDownloadURL().subscribe( resp => {
        this.uploadURL = resp;
        const params = {
          token: '',
          secret_key: '',
          attached: this.uploadURL
      };
        this._solicitudesservice.updateSolicitudes(idsol, params).subscribe(resp => (console.log(resp)));
        (err) => {console.log(err)}} ); }); // this.subirurl(); });
    
      }  
}