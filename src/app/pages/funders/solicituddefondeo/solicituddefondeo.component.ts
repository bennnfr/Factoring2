import { Component, OnInit } from '@angular/core';
import { AltaSolicitudesService, OptionsService, ContribuyentesService, MantenimientoContribuyentesService, FundersService, PagosService } from '../../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import swal2 from 'sweetalert2';
import { Facturas } from 'src/app/models/usuario.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import * as fs from 'file-saver';
declare var $;

@Component({
  selector: 'app-solicituddefondeo',
  templateUrl: './solicituddefondeo.component.html',
  styles: []
})
export class SolicitudDeFondeoComponent implements OnInit {

  cols: any[];
  poperacion: number;
  selectedCars1: any[] = [];
  selectedCars2: any[] = [];
  selectedFac: Facturas[];
  options: any[] = [];
  facturas: any[] = [];
  facturass: any[] = [];
  facturasfiltradas: any[] = [];
  simulacion: any[];
  idu: string;
  cadenaproveedor: any[];
  nombrecadena: string[];
  nombreproveedor: string[];
  companyid: string;
  supplierid: string[];
  invoices: any[] = [];
  load: boolean;
  firmantes: any[] = [];
  confirma = true;
  muestratabla = true;
  muestratablafirmantes = false;
  currency: any[] = [];
  vienesinfiltro = false;
  totalaoperar;
  totalaoperearfiltro;
  proyectos: any[] = [];
  fechaHoy: string;
  fechaHoyParametro: string;
  muestracalendar: boolean;
  // PARA REPORTE
  layoutbase: any[] = [];
  primerRow  = [];
  segundoRow = [];
  detalles = [];
  ligaguardar = '';
  facturasReporte = [];
  respuesta: any[];
  uploadURL: Observable<string>;
  direcciones: any[];
  contribuyentes: any[];
  idcontsuplier = '';
  idcontcomany = '';
  startdatesuplier = '';
  direccioncompany = '';
  firmantesreporte: any[];
  firmantesreportenombres = '';
  idfunder = '';
  cadenas: any[];
  cadenaso: any[] = [];
  financieras: any[] = [];
  constructor(private _formBuilder: FormBuilder,
              public router: Router,
              private _firestorage: AngularFireStorage,
              private route: ActivatedRoute,
              public _optionsservice: OptionsService,
              public _contribuyentesService: ContribuyentesService,
              public _mantenimientocontservice: MantenimientoContribuyentesService,
              public _fundersservice: FundersService,
              public _pagosservice: PagosService,
              public _solicitudesservice: AltaSolicitudesService) {}

  ngOnInit() {
   // this.getAcceso('/solicituddefondeo');
    this.idcontsuplier = '';
    this.idcontcomany = '';
    this.idfunder = '';
    this.totalaoperar = 0;
    this.totalaoperearfiltro = 0;
    this.poperacion = 100;
    this.confirma = true;
    const valormoneda = 'PESOS';
    this. firmantesreporte = [];
    this.cadenaso = [];
    this.cadenas = [];
    this.facturas = [];
    this.vienesinfiltro = false;
    this._solicitudesservice.getPaymentCurrency().subscribe( resp => this.currency = resp );
    this._solicitudesservice.getFechaParametro().subscribe( (resp: string) => { this.fechaHoyParametro = resp;
                                                                                if (this.fechaHoyParametro !== 'calendar') {
                                                                                      this.fechaHoy = resp;
                                                                                      this.muestracalendar = false;
                                                                               } else { this.muestracalendar = true;
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
                                                                                        this.fechaHoy = [yeara, montha, daya].join('-');
                                                                                         } } );
                                                                                     // OBTENER LA FECHA ACTUAL ///////////////
    this.muestratabla = true;
    this.muestratablafirmantes = false;
    this.selectedCars1 = [];
    this.selectedCars2 = [];
   // (document.getElementById('porcentajeoperacion') as HTMLInputElement).value = '';
    (document.getElementById('fechafactura') as HTMLInputElement).value = '';
   // (document.getElementById('fechaoperacion') as HTMLInputElement).value = '';
   // (document.getElementById('folio') as HTMLInputElement).value = '';
    this.simulacion = [];

    this.idu = localStorage.getItem('id');
    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
 swal2.fire({
  title: 'Cargando',
  allowOutsideClick: false
});
    swal2.showLoading();
    this._pagosservice.getCadenas().subscribe( resp => {this.cadenas = resp;
      // tslint:disable-next-line: forin
        for ( const prop in this.cadenas ) {
       this.cadenaso.push( this.cadenas[prop].nombre_cadena);
         }
  this.cadenaso.sort();
} );
    this._fundersservice.getfundersfinancial().subscribe( resp => {this.financieras = resp; swal2.close();} );

    this.cols = [
    { field: 'invoice_folio', header: 'Numero de Factura' },
    { field: 'uuid', header: 'UUID' },
    { field: 'status', header: 'Estatus' },
    { field: 'invoice_date', header: 'Fecha Factura' },
    { field: 'due_date', header: 'Fecha Vencimiento' },
    { field: 'totalformateado', header: 'Total' },

  ];

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

  getIds() {
    /////////////////////////
    
    ////////////////////////
    this.companyid = (document.getElementById('cadena') as HTMLInputElement).value;
   // console.log(this.companyid)
    const moneda: any = document.getElementById('moneda');
    const valormoneda = moneda.options[moneda.selectedIndex].value;
    if (this.companyid != 'noval' ) {
    this._fundersservice.getFacturasxcadena(this.companyid, valormoneda).subscribe( resp2 => {this.facturas = resp2;
      // tslint:disable-next-line: forin
    for (const prop in this.facturas) {
        this.facturas[prop].porcentaje = 100;
        this.facturas[prop].totalaoperar = parseFloat(this.facturas[prop].total).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        this.facturas[prop].totalformateado = parseFloat(this.facturas[prop].total).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
} ); }

  }

                                                                                actualizatosinfiltro() {
    this.totalaoperar = 0;
    // tslint:disable-next-line: forin
    for (const prop in this.selectedCars2) {
      this.selectedCars2[prop].totalaoperar = this.selectedCars2[prop].total * (this.selectedCars2[prop].porcentaje / 100);
      this.totalaoperar = this.totalaoperar + (this.selectedCars2[prop].totalaoperar);
      this.selectedCars2[prop].totalaoperar = parseFloat(this.selectedCars2[prop].totalaoperar.toString()).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    this.totalaoperar = (this.totalaoperar).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

                                                                                actualizatoconfiltro() {
    this.totalaoperearfiltro = 0;
    // tslint:disable-next-line: forin
    for (const prop in this.selectedCars1) {
      this.selectedCars1[prop].totalaoperar = this.selectedCars1[prop].total * (this.selectedCars1[prop].porcentaje / 100);
      this.totalaoperearfiltro = this.totalaoperearfiltro + (this.selectedCars1[prop].totalaoperar);
      this.selectedCars1[prop].totalaoperar = parseFloat(this.selectedCars1[prop].totalaoperar.toString()).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    this.totalaoperearfiltro = (this.totalaoperearfiltro).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

                                                                                muestraxcurr() {

                                                                                  this.companyid = (document.getElementById('cadena') as HTMLInputElement).value;
    
                                                                                  const moneda: any = document.getElementById('moneda');
                                                                                  const valormoneda = moneda.options[moneda.selectedIndex].value;
                                                                              
                                                                                  this._fundersservice.getFacturasxcadena(this.companyid, valormoneda).subscribe( resp2 => {this.facturas = resp2;
                                                                                    // tslint:disable-next-line: forin
                                                                                  for (const prop in this.facturas) {
                                                                                      this.facturas[prop].porcentaje = 100;
                                                                                      this.facturas[prop].totalaoperar = parseFloat(this.facturas[prop].total).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                                                                      this.facturas[prop].totalformateado = parseFloat(this.facturas[prop].total).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                                                                    }
                                                                              } );

  }

                                                                                lipiarcampos() {
    this.ngOnInit();
  }

                                                                                filtrafacturas() {
    this.totalaoperearfiltro = '0.00';
    this.totalaoperar = '0.00';
    this.selectedCars1 = [];
    this.selectedCars2 = [];
    const moneda: any = document.getElementById('moneda');
  //  const proyecto: any = document.getElementById('proyecto');
    const valormoneda = moneda.options[moneda.selectedIndex].value;
    const valorproyecto = 'todos';
   // this.muestratabla = false;
    this.facturasfiltradas = [];
    const a = new Date((document.getElementById('fechafactura')as HTMLInputElement).value);
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
    const fechaoperacion = [yeara, montha, daya].join('-');
    this._fundersservice.getFacturasxcadena(this.companyid, valormoneda).subscribe( resp => {
    this.facturass = resp;
    // tslint:disable-next-line: forin
    for (const prop in this.facturass) {
      this.facturass[prop].totalformateado = parseFloat(this.facturass[prop].total).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    if (fechaoperacion === 'NaN-NaN-NaN' && valorproyecto === 'todos') {
      this.muestratabla = true;
    } else if (fechaoperacion !== 'NaN-NaN-NaN' && valorproyecto === 'todos') {
      this.muestratabla = false;
      for ( const prop in this.facturas ) {
        if ( this.facturass[prop].invoice_date === fechaoperacion ) {
        this.facturasfiltradas.push(this.facturass[prop]);
        }
      }
      // tslint:disable-next-line: forin
      for (const prep in this.facturasfiltradas) {
        this.facturasfiltradas[prep].porcentaje = 100;
        this.facturasfiltradas[prep].totalaoperar = parseFloat(this.facturasfiltradas[prep].total).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
    }
  });
  }

                                                                                recalcula() {

    if (this.selectedCars1.length === 0) {
      swal2.fire(
        'Debe seleccionar al menos una factura',
        '',
        'error'
     );
    } else {
    let total = 0 ;
    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
    swal2.showLoading();
    const moneda: any = document.getElementById('moneda');

    const valormoneda = moneda.options[moneda.selectedIndex].value;
    // tslint:disable-next-line: forin
    for ( const prop in this.selectedCars1 ) {

    total = total + parseFloat( this.selectedCars1[prop].total );

    }
    // Fecha operacion request date
    const d = new Date((document.getElementById('fechafactura')as HTMLInputElement).value);
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

    let fechafactura = [year, month, day].join('-');


    let fechaMayorFactura = this.selectedCars1[0].due_date;
      // tslint:disable-next-line: forin
    for (const prop in this.selectedCars1) {
        if (fechaMayorFactura < this.selectedCars1[prop].due_date) {
         fechaMayorFactura = this.selectedCars1[prop].due_date;
        }

        fechafactura = fechaMayorFactura;
    }

    // Fecha Factura used date
    const a = new Date((document.getElementById('fechaoperacion')as HTMLInputElement).value);
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

    const fechaoperacion = [yeara, montha, daya].join('-');
    this.idfunder = ((document.getElementById('proveedor')as HTMLInputElement).value);
    const paramssimul = {
      token: '',
      secret_key: '',
      simulation: true,
      invoices: [],
      funding_request: {
        funder_id: this.idfunder,
        company_id: this.companyid.toString(),
        user_id: this.idu,
        funding_request_date: this.fechaHoy,
        attached: 'https://attached',
        currency: valormoneda,
      }
  };

  // tslint:disable-next-line: forin
    for (const prop in this.selectedCars1) {
      paramssimul.invoices[prop] = {id: this.selectedCars1[prop].id.toString(), percent: this.selectedCars1[prop].porcentaje };
  }
  //  console.log(paramssimul);
    this._fundersservice.getSimulacion( paramssimul ).subscribe( resp => {swal2.close();
                                                                          this.simulacion = resp;
                                                                          const fecha1 = new Date(this.simulacion[0].used_date);
                                                                          const fecha2 = new Date(this.simulacion[0].due_date);
                                                                          const milisegundosdia = 24 * 60 * 60 * 1000;
                                                                          const milisegundostranscurridos = Math.abs(fecha1.getTime() - fecha2.getTime());
                                                                          const diastranscurridos = Math.round(milisegundostranscurridos / milisegundosdia);
                                                                          this.simulacion[0].diastranscurridos = diastranscurridos;
                                                                          this.muestratablafirmantes = true;
                                                                          const totalformat = parseFloat(this.simulacion[0].total.replace(/,/g, ''));
                                                                          this.simulacion[0].total = totalformat.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                                                          const totalusedformat = parseFloat(this.simulacion[0].total_used.replace(/,/g, ''));
                                                                          this.simulacion[0].total_used = totalusedformat.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                                                          const interestsformat = parseFloat(this.simulacion[0].interests.replace(/,/g, ''));
                                                                          this.simulacion[0].interests = interestsformat.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                                                          const netamountformat = parseFloat(this.simulacion[0].net_amount.replace(/,/g, ''));
                                                                          this.simulacion[0].net_amount = netamountformat.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                                                            }, (err) => {
                                                                              console.log(err);
                                                                              swal2.fire({
                                                                                title: 'Ocurrio un error',
                                                                                text: err.error.errors[0],
                                                                                icon: 'error',
                                                                                showConfirmButton: true,
                                                                                showCancelButton: false,
                                                                                allowOutsideClick: false
                                                                              }). then ( res => {
                                                                                if ( res.value ) {
                                                                                  location.reload();
                                                                                }
                                                                              } );
                                                                             } );
  }

  }

                                                                                prueba() {
    if (this.vienesinfiltro) {
      this.load = true;
      let total = 0 ;
      this.invoices = [];
      let fechaMayorFactura = '';
      let fechaMayorDueDate = '';
      const moneda: any = document.getElementById('moneda');
      const valormoneda = moneda.options[moneda.selectedIndex].value;
      // tslint:disable-next-line: forin
      for ( const prop in this.selectedCars2 ) {

        total = total + parseFloat( this.selectedCars2[prop].total );

        this.invoices.push(this.selectedCars2[prop].id);

        }

      fechaMayorFactura = this.selectedCars2[0].invoice_date;
      for (const prop in this.selectedCars2) {
          if (fechaMayorFactura < this.selectedCars2[prop].invoice_date) {
           fechaMayorFactura = this.selectedCars2[prop].invoice_date;
          }
        }

      const fechafactura = fechaMayorFactura;

      const a = new Date((document.getElementById('fechaoperacion')as HTMLInputElement).value);
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

      const fechaoperacion = [yeara, montha, daya].join('-');

      fechaMayorDueDate = this.selectedCars2[0].due_date;
      for (const prop in this.selectedCars2) {
      if (fechaMayorDueDate < this.selectedCars2[prop].due_date) {
        fechaMayorDueDate = this.selectedCars2[prop].due_date;
      }
    }
    this.idfunder = ((document.getElementById('proveedor')as HTMLInputElement).value);
      const data = {
        token: '',
        secret_key: '',
        invoices: [],
        funding_request: {
          funder_id: this.idfunder,
          company_id: this.companyid.toString(),
          user_id: this.idu,
          funding_request_date: this.fechaHoy,
          attached: 'https://attached',
          currency: valormoneda,
        }
    };

      // tslint:disable-next-line: forin

      // tslint:disable-next-line: forin
      for (const prop in this.selectedCars2) {
        data.invoices[prop] = {id: this.selectedCars2[prop].id.toString(), percent: this.selectedCars2[prop].porcentaje };
      }

     // console.log(data);

      swal2.fire({
        title: 'Cargando',
        allowOutsideClick: false
   });
   swal2.fire({
    title: 'Cargando',
    allowOutsideClick: false
});
      swal2.showLoading();
      this.facturasReporte = [];
      this._fundersservice.getSimulacion(data).subscribe(
      resp => {// console.log(resp);
                this._fundersservice.getBaseLayout(resp[0].id).subscribe( resp2 => {
               // console.log(resp2);
                this.layoutbase = resp2;
                this.ligaguardar =  resp2.resumen[0].numero_acuse + '/' + resp2.resumen[0].numero_acuse + '.xls';
                this.primerRow.push(resp2.resumen[0].epo);
                this.primerRow.push((resp2.resumen[0].monto_descuento_mn));
                this.primerRow.push((resp2.resumen[0].monto_intereses_mn));
                this.primerRow.push((resp2.resumen[0].monto_operar_mn));
                this.primerRow.push((resp2.resumen[0].monto_descuento_usd));
                this.primerRow.push((resp2.resumen[0].monto_intereses_usd));
                this.primerRow.push((resp2.resumen[0].monto_operar_usd));
                this.segundoRow.push(resp2.resumen[0].numero_acuse);
                this.segundoRow.push(resp2.resumen[0].fecha_carga);
                this.segundoRow.push(resp2.resumen[0].hora_carga);
                this.segundoRow.push(resp2.resumen[0].usuario_captura);
                console.log(resp2.detalles);
                this.detalles.push(resp2.detalles);
                console.log(this.primerRow);
                console.log(this.segundoRow);
                console.log(this.detalles[0]);
                this.exportexcell( resp[0].id );
        } );
                swal2.close();
                swal2.fire({
                                                                        title: 'Creacion de Solicitud Exitosa',
                                                                        text:  resp[0].folio,
                                                                        icon: 'success',
                                                                        showConfirmButton: true,
                                                                        showCancelButton: false,
                                                                        allowOutsideClick: false
                                                                      }). then ( res => {
                                                                        if ( res.value ) {
                                                                          this.load = false;
                                                                          this.ngOnInit();
                                                                        }
                                                                      } );

                                                                    }, (err) => {
                                                                      console.log(err);
                                                                      swal2.fire({
                                                                        title: 'Ocurrio un error',
                                                                        text: err.error.errors[0],
                                                                        icon: 'error',
                                                                        showConfirmButton: true,
                                                                        showCancelButton: false,
                                                                        allowOutsideClick: false
                                                                      }). then ( res => {
                                                                        if ( res.value ) {
                                                                          this.load = false;
                                                                          location.reload();
                                                                        }
                                                                      } );
                                                                     }
                                                                      );
    } else {
    this.load = true;
    let total = 0 ;
    this.invoices = [];
    const moneda: any = document.getElementById('moneda');

    const valormoneda = moneda.options[moneda.selectedIndex].value;
    // tslint:disable-next-line: forin
    for ( const prop in this.selectedCars1 ) {

      total = total + parseFloat( this.selectedCars1[prop].total );

      this.invoices.push(this.selectedCars1[prop].id);

      }

    const d = new Date((document.getElementById('fechafactura')as HTMLInputElement).value);
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

    let fechafactura = [year, month, day].join('-');

    let fechaMayorFactura = this.selectedCars1[0].due_date;
    for (const prop in this.selectedCars1) {
        if (fechaMayorFactura < this.selectedCars1[prop].due_date) {
         fechaMayorFactura = this.selectedCars1[prop].due_date;
        }
      }
    fechafactura = fechaMayorFactura;


    const a = new Date((document.getElementById('fechaoperacion')as HTMLInputElement).value);
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

    const fechaoperacion = [yeara, montha, daya].join('-');

    this.idfunder = ((document.getElementById('proveedor')as HTMLInputElement).value);
    const data = {
      token: '',
      secret_key: '',
      invoices: [],
      funding_request: {
        funder_id: this.idfunder,
        company_id: this.companyid.toString(),
        user_id: this.idu,
        funding_request_date: this.fechaHoy,
        attached: 'https://attached',
        currency: valormoneda,
      }
  };
    // tslint:disable-next-line: forin
    for (const prop in this.selectedCars1) {
      data.invoices[prop] = {id: this.selectedCars1[prop].id.toString(), percent: this.selectedCars1[prop].porcentaje };
    }

  //  console.log(data);

    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
 swal2.fire({
  title: 'Cargando',
  allowOutsideClick: false
});
    swal2.showLoading();
    this.facturasReporte = [];
    this._fundersservice.getSimulacion(data).subscribe( resp => {
      this._fundersservice.getBaseLayout(resp[0].id).subscribe( resp2 => {
      //  console.log(resp2);
        this.layoutbase = resp2;
        this.ligaguardar =  resp2.resumen[0].numero_acuse + '/' + resp2.resumen[0].numero_acuse + '.xls';
        this.primerRow.push(resp2.resumen[0].epo);
        this.primerRow.push(resp2.resumen[0].monto_descuento_mn);
        this.primerRow.push(resp2.resumen[0].monto_intereses_mn);
        this.primerRow.push(resp2.resumen[0].monto_operar_mn);
        this.primerRow.push(resp2.resumen[0].monto_descuento_usd);
        this.primerRow.push(resp2.resumen[0].monto_intereses_usd);
        this.primerRow.push(resp2.resumen[0].monto_operar_usd);
        this.segundoRow.push(resp2.resumen[0].numero_acuse);
        this.segundoRow.push(resp2.resumen[0].fecha_carga);
        this.segundoRow.push(resp2.resumen[0].hora_carga);
        this.segundoRow.push(resp2.resumen[0].usuario_captura);
      //  console.log(resp2.detalles);
        this.detalles.push(resp2.detalles);
      //  console.log(this.detalles[0]);
        this.exportexcell( resp[0].id );
} );
      swal2.close();
      swal2.fire({
                                                                      title: 'Creacion de Solicitud Exitosa',
                                                                      text: resp[0].folio,
                                                                      icon: 'success',
                                                                      showConfirmButton: true,
                                                                      showCancelButton: false,
                                                                      allowOutsideClick: false
                                                                    }). then ( res => {
                                                                      if ( res.value ) {
                                                                        this.load = false;
                                                                        this.ngOnInit();
                                                                      }
                                                                    } );
                                                                  }, (err) => {
                                                                    console.log(err);
                                                                    swal2.fire({
                                                                      title: 'Ocurrio un error',
                                                                      text: err.error.errors[0],
                                                                      icon: 'error',
                                                                      showConfirmButton: true,
                                                                      showCancelButton: false,
                                                                      allowOutsideClick: false
                                                                    }). then ( res => {
                                                                      if ( res.value ) {
                                                                        location.reload();
                                                                        this.load = false;
                                                                      }
                                                                    } );
                                                                   }
                                                                    );
                                                                  }
  }

                                                                                enableconfirm() {
    this.confirma = !this.confirma;
  }

    recalculasinfiltro() {
    if (this.selectedCars2.length === 0) {
      swal2.fire(
        'Debe seleccionar al menos una factura',
        '',
        'error'
     );
    } else {
      swal2.fire({
        title: 'Cargando',
        allowOutsideClick: false
   });
    swal2.showLoading();
    let total = 0 ;
    let fechaMayorFactura = '';
    let fechaMayorDueDate = '';

    const moneda: any = document.getElementById('moneda');

    const valormoneda = moneda.options[moneda.selectedIndex].value;
    // tslint:disable-next-line: forin
    for ( const prop in this.selectedCars2 ) {

    total = total + parseFloat( this.selectedCars2[prop].total );

    }
    // Fecha operacion request date
    fechaMayorFactura = this.selectedCars2[0].invoice_date;
    for (const prop in this.selectedCars2) {
      if (fechaMayorFactura < this.selectedCars2[prop].invoice_date) {
       fechaMayorFactura = this.selectedCars2[prop].invoice_date;
      }
    }

    const fechafactura = fechaMayorFactura;
  //  console.log(fechafactura);

    // Fecha Factura used date
    const a = new Date((document.getElementById('fechaoperacion')as HTMLInputElement).value);
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

    const fechaoperacion = [yeara, montha, daya].join('-');

    fechaMayorDueDate = this.selectedCars2[0].due_date;
    for (const prop in this.selectedCars2) {
      if (fechaMayorDueDate < this.selectedCars2[prop].due_date) {
        fechaMayorDueDate = this.selectedCars2[prop].due_date;
      }
    }
    this.idfunder = ((document.getElementById('proveedor')as HTMLInputElement).value);
    const paramssimul = {
      token: '',
      secret_key: '',
      simulation: true,
      invoices: [],
      funding_request: {
                 funder_id: this.idfunder,
                 company_id: this.companyid.toString(),
                 user_id: this.idu,
                 funding_request_date: this.fechaHoy,
                 attached: 'https://attached',
                 currency: valormoneda,
               }
  };

  // tslint:disable-next-line: forin
    for (const prop in this.selectedCars2) {
      paramssimul.invoices[prop] = {id: this.selectedCars2[prop].id.toString(), percent: this.selectedCars2[prop].porcentaje };
  }
  //  console.log(paramssimul);
    this.vienesinfiltro = true;
  //  console.log(paramssimul);
    this._fundersservice.getSimulacion( paramssimul ).subscribe( resp => {swal2.close();
                                                                        //  console.log(resp);
                                                                          this.simulacion = resp;
                                                                          const fecha1 = new Date(this.simulacion[0].used_date);
                                                                          const fecha2 = new Date(this.simulacion[0].due_date);
                                                                          const milisegundosdia = 24 * 60 * 60 * 1000;
                                                                          const milisegundostranscurridos = Math.abs(fecha1.getTime() - fecha2.getTime());
                                                                          const diastranscurridos = Math.round(milisegundostranscurridos / milisegundosdia);
                                                                          this.simulacion[0].diastranscurridos = diastranscurridos;
                                                                          this.muestratablafirmantes = true;
                                                                          const totalformat = parseFloat(this.simulacion[0].total.replace(/,/g, ''));
                                                                          this.simulacion[0].total = totalformat.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                                                          const totalusedformat = parseFloat(this.simulacion[0].total_used.replace(/,/g, ''));
                                                                          this.simulacion[0].total_used = totalusedformat.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                                                          const interestsformat = parseFloat(this.simulacion[0].interests.replace(/,/g, ''));
                                                                          this.simulacion[0].interests = interestsformat.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                                                          const netamountformat = parseFloat(this.simulacion[0].net_amount.replace(/,/g, ''));
                                                                          this.simulacion[0].net_amount = netamountformat.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                                                            }, (err) => {
                                                                              swal2.close();
                                                                              console.log(err);
                                                                              swal2.fire({
                                                                                title: 'Ocurrio un error',
                                                                                text: err.error.errors[0],
                                                                                icon: 'error',
                                                                                showConfirmButton: true,
                                                                                showCancelButton: false,
                                                                                allowOutsideClick: false
                                                                              }). then ( res => {
                                                                                if ( res.value ) {
                                                                                  location.reload();
                                                                                }
                                                                              } );
                                                                             } );
  }
  }

  exportexcell( ids ) {
    // OJO AQUI //////
    if (this.segundoRow[3] === null) {
      this.segundoRow[3] = 'Factor GFC';
    }
    if (this.primerRow[0] === null) {
      this.primerRow[0] = 5080;
    }
    //  PARA LAS FECHAS DE UN ROW//////
    let fechacarga = this.segundoRow[1];
    // console.log(fechacarga);
    let fec = fechacarga.split('/');
    let horacarga = this.segundoRow[2];
    if (horacarga.includes('pm')) {
      let hcarga = horacarga.substring(0,8);
      console.log(hcarga);
      hcarga = hcarga + ' p. m.'
      console.log(hcarga);
      this.segundoRow[2] = hcarga;
    } else if (horacarga.incudes('am')) {
      let hcarga = horacarga.substring(0,8);
   // console.log(hcarga);
    hcarga = hcarga + ' a. m.'
    console.log(hcarga);
    this.segundoRow[2] = hcarga;
    }
    // FIN FECHAS DE UN ROW ///////////
    let numberrow = 8;
    const Excel = require('exceljs');
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Movimientos_Descontados');
    let header=['EPO', 'Monto Descuento M.N.', 'Monto de Intereses M.N.', 'Monto a Operar M.N.', 'Monto Descuento USD', 'Monto de Intereses USD', 'Monto a Operar USD'];
  //  console.log(header);
    let headerRow = worksheet.addRow(header);
    worksheet.addRow(this.primerRow);
    worksheet.addRow([]);
    worksheet.addRow(['Numero de Acuse', 'Fecha de Carga', 'Hora de Carga', 'Usuario de Captura']);
    worksheet.addRow(this.segundoRow);
    worksheet.addRow([]);
    let header3 = ['No. Cliente SIRAC', 'Proveedor',	'Numero de documento',	'Fecha de Emision',	'Fecha de Vencimiento',
    'Moneda',	'Monto', 	'Monto Descuento', 	'Monto Interés', 	'Monto a Operar', 	'Tasa',	'Plazo',	'Folio',
    'No. Proveedor',	'Porcentaje de Descuento',	'Recurso en Garantia'
  ]
    worksheet.addRow(header3);
    // tslint:disable-next-line: forin
    for (const prop in this.detalles[0]) {
      let fechaemision = this.detalles[0][prop].fecha_emision;
      let fecemi = fechaemision.split('/');
      let fechavencimineto = this.detalles[0][prop].fecha_vencimiento;
      let fecven = fechavencimineto.split('/');
      if (this.detalles[0][prop].moneda === 'MXN') {
        this.detalles[0][prop].moneda = 'MONEDA NACIONAL'
      }
    //  console.log()
      worksheet.addRow([this.detalles[0][prop].sirac, this.detalles[0][prop].proveedor, this.detalles[0][prop].funding_invoice_group, this.detalles[0][prop].fecha_emision, this.detalles[0][prop].fecha_vencimiento,
                        this.detalles[0][prop].moneda, this.detalles[0][prop].monto, this.detalles[0][prop].monto_descuento, this.detalles[0][prop].monto_intereses, this.detalles[0][prop].monto_operar,
                        this.detalles[0][prop].tasa, this.detalles[0][prop].plazo, this.detalles[0][prop].folio, this.detalles[0][prop].no_proveedor, this.detalles[0][prop].porcentaje_descuento, this.detalles[0][prop].recurso_garantia ]);
      worksheet.getCell('A' + numberrow).alignment = { vertical: 'bottom', horizontal: 'right' };
      worksheet.getCell('A' + numberrow).value = 1; //OJO AQUI///////////////////////
      worksheet.getCell('C' + numberrow).alignment = { vertical: 'bottom', horizontal: 'right' };
      worksheet.getCell('C' + numberrow).value = parseFloat(worksheet.getCell('C' + numberrow).value);
      worksheet.getCell('D' + numberrow).alignment = { vertical: 'bottom', horizontal: 'right' };
      worksheet.getCell('D' + numberrow).value = new Date(`${fecemi[2]}, ${fecemi[1]}, ${fecemi[0]} GMT-0000`);
      worksheet.getCell('E' + numberrow).alignment = { vertical: 'bottom', horizontal: 'right' };
      worksheet.getCell('E' + numberrow).value = new Date(`${fecven[2]}, ${fecven[1]}, ${fecven[0]} GMT-0000`);
      worksheet.getCell('G' + numberrow).alignment = { vertical: 'bottom', horizontal: 'right' };
      worksheet.getCell('G' + numberrow).value = parseFloat(worksheet.getCell('G' + numberrow).value);
      worksheet.getCell('H' + numberrow).alignment = { vertical: 'bottom', horizontal: 'right' };
      worksheet.getCell('H' + numberrow).value = parseFloat(worksheet.getCell('H' + numberrow).value);
      worksheet.getCell('I' + numberrow).alignment = { vertical: 'bottom', horizontal: 'right' };
      worksheet.getCell('I' + numberrow).value = parseFloat(worksheet.getCell('I' + numberrow).value);
      worksheet.getCell('J' + numberrow).alignment = { vertical: 'bottom', horizontal: 'right' };
      worksheet.getCell('J' + numberrow).value = parseFloat(worksheet.getCell('J' + numberrow).value);
      worksheet.getCell('K' + numberrow).alignment = { vertical: 'bottom', horizontal: 'right' };
      worksheet.getCell('K' + numberrow).value = parseFloat(worksheet.getCell('K' + numberrow).value);
      worksheet.getCell('L' + numberrow).alignment = { vertical: 'bottom', horizontal: 'right' };
      worksheet.getCell('M' + numberrow).alignment = { vertical: 'bottom', horizontal: 'right' };
      worksheet.getCell('N' + numberrow).alignment = { vertical: 'bottom', horizontal: 'right' };
      worksheet.getCell('O' + numberrow).alignment = { vertical: 'bottom', horizontal: 'right' };
      worksheet.getCell('O' + numberrow).value = parseFloat(worksheet.getCell('O' + numberrow).value);
      worksheet.getCell('P' + numberrow).alignment = { vertical: 'bottom', horizontal: 'right' };
      numberrow = numberrow + 1;
    }
    // FORMATEAR CELDAS ///////////////////////////
    worksheet.getCell('A2').alignment = { vertical: 'bottom', horizontal: 'right' };
    worksheet.getCell('B2').alignment = { vertical: 'bottom', horizontal: 'right' };
    worksheet.getCell('C2').alignment = { vertical: 'bottom', horizontal: 'right' };
    worksheet.getCell('D2').alignment = { vertical: 'bottom', horizontal: 'right' };
    worksheet.getCell('E2').alignment = { vertical: 'bottom', horizontal: 'right' };
    worksheet.getCell('F2').alignment = { vertical: 'bottom', horizontal: 'right' };
    worksheet.getCell('G2').alignment = { vertical: 'bottom', horizontal: 'right' };
    worksheet.getCell('B5').alignment = { vertical: 'bottom', horizontal: 'right' };
    worksheet.getCell('B5').value = new Date(`${fec[2]}, ${fec[1]}, ${fec[0]} GMT-0000`);
    worksheet.getCell('C5').alignment = { vertical: 'bottom', horizontal: 'right' };
    worksheet.getCell('B2').value = parseFloat(worksheet.getCell('B2').value);
    worksheet.getCell('C2').value = parseFloat(worksheet.getCell('C2').value);
    worksheet.getCell('D2').value = parseFloat(worksheet.getCell('D2').value);
    worksheet.getCell('E2').value = parseFloat(worksheet.getCell('E2').value);
    worksheet.getCell('F2').value = parseFloat(worksheet.getCell('F2').value);
    worksheet.getCell('G2').value = parseFloat(worksheet.getCell('G2').value);
    worksheet.columns = [
      { header: 'EPO', width: 21 }, { header: 'Monto Descuento M.N.', width: 21 }, { header: 'Monto de Intereses M.N.', width: 22 }, { header: 'Monto a Operar M.N.', width: 21 },
      { header: 'Monto Descuento USD', width: 21 }, { header: 'Monto de Intereses USD', width: 22 }, { header: 'Monto a Operar USD', width: 23 }, { header: '', width: 16 },
      { header: '', width: 15 }, { header: '', width: 14 }, { header: '', width: 7 }, { header: '', width: 7 }, { header: '', width: 7 }, { header: '', width: 15 }, { header: '', width: 23 },
      { header: '', width: 19 },
    ];
    //////////////////////////////////////////////
    workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], { type: '.xls' });
    const file = blob;
    const filepath = this.ligaguardar;
    const fileRef = this._firestorage.ref(filepath);
    this._firestorage.upload(filepath, file).then(() => { fileRef.getDownloadURL().subscribe( resp => {
      this.uploadURL = resp;
      const params = {
      token: '',
      secret_key: '',
      attached: this.uploadURL
  };
      this._fundersservice.agregaattached( ids, params ).subscribe( () => this._fundersservice.getEnviaMail( ids ).subscribe() );
      } ); });
  });
  
  }

}







