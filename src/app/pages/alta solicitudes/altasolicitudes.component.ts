import { Component, OnInit } from '@angular/core';
import { AltaSolicitudesService, OptionsService, ContribuyentesService, MantenimientoContribuyentesService, ReportesPDFService } from '../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import swal2 from 'sweetalert2';
import { Facturas } from 'src/app/models/usuario.model';
import { FacturaSimulacion } from 'src/app/models/facturas.model';
import { AngularFireStorage } from '@angular/fire/storage';
import * as jsPDF from 'jspdf';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
declare var $;

@Component({
  selector: 'app-altasolicitudes',
  templateUrl: './altasolicitudes.component.html',
  styles: []
})
export class AltaSolicitudesComponent implements OnInit {
  showModal: boolean;
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
  companyid: string[];
  supplierid: string[];
  supplieridbandera: boolean;
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
  invoicesrequest: any[] = [];
  invoicesrequestrel: any[] = [];
  datostablapopup = [];
  // PARA REPORTE
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
  constructor(private _formBuilder: FormBuilder,
              public router: Router,
              private _firestorage: AngularFireStorage,
              private route: ActivatedRoute,
              public _optionsservice: OptionsService,
              public _contribuyentesService: ContribuyentesService,
              public reportespdf: ReportesPDFService,
              public _mantenimientocontservice: MantenimientoContribuyentesService,
              public _solicitudesservice: AltaSolicitudesService) {}

  ngOnInit() {
    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
 swal2.fire({
  title: 'Cargando',
  allowOutsideClick: false
});
    swal2.showLoading();
   // this.getAcceso('/altasolicitudes');
    this.idcontsuplier = '';
    this.idcontcomany = '';
    this.totalaoperar = 0;
    this.totalaoperearfiltro = 0;
    this.poperacion = 100;
    this.confirma = true;
    const valormoneda = 'PESOS';
    this. firmantesreporte = [];
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
    (document.getElementById('fechafactura') as HTMLInputElement).value = '';
    this.simulacion = [];

    this.idu = localStorage.getItem('id');
    
    this._solicitudesservice.getCadenaProveedor(this.idu).subscribe( resp => {// console.log(resp);
      if (resp.length > 0) {
                                                                              this.cadenaproveedor = resp;
                                                                              this.nombrecadena = this.cadenaproveedor[0].cadena;
                                                                              this.nombreproveedor = this.cadenaproveedor[0].proveedor;
                                                                              this.companyid = this.cadenaproveedor[0].company_id;
                                                                              this.supplierid = this.cadenaproveedor[0].supplier_id;
                                                                              
                                                                              this._solicitudesservice.getFacturas(this.companyid, this.supplierid, valormoneda).subscribe( resp2 => {this.facturas = resp2;// console.log(this.facturas)
                                                                                                                                                                                      // tslint:disable-next-line: forin
                                                                                                                                                                                      for (const prop in this.facturas) {
                                                                                                                                                                                        this.facturas[prop].porcentaje = 100;
                                                                                                                                                                                        this.facturas[prop].totalaoperar = parseFloat(this.facturas[prop].total).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                                                                                                                                                                        this.facturas[prop].totalformateado = parseFloat(this.facturas[prop].total).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                                                                                                                                                                      }
                                                                            } );
                                                                              
                                                                              if (this.cadenaproveedor[0].supplier_id !== 0) {
                                                                                
                                                                                this.supplieridbandera = false;
                                                                                this._solicitudesservice.getSignatories(this.supplierid).subscribe(resp2 => { this.firmantes = resp2;
                                                                                  // tslint:disable-next-line: forin
                                                                                  for (const prop in this.firmantes) {
                                                                                    this.firmantesreporte[prop] = this.firmantes[prop].firmante;
                                                                                  }
                                                                                  this.firmantesreportenombres = this.firmantesreporte.join(' / ');
    });
                                                                              } else {
                                                                                
                                                                                this.supplieridbandera = true;
                                                                                this._solicitudesservice.getSignatoriesw(this.companyid).subscribe(resp2 => { this.firmantes = resp2;// console.log(this.firmantes)
                                                                                  // tslint:disable-next-line: forin
                                                                                  for (const prop in this.firmantes) {
                                                                                    this.firmantesreporte[prop] = this.firmantes[prop].firmante;
                                                                                  }
                                                                                  this.firmantesreportenombres = this.firmantesreporte.join(' / ');
    });
                                                                              }
                                                                              
                                                                             // this._mantenimientocontservice.getDirecciones(this.idc).subscribe( resp => {this.direcciones = resp; } );
                                                                              this._solicitudesservice.getProyectos( this.companyid, this.supplierid, 'PESOS' ).subscribe( resp3 => {this.proyectos = resp3; } );
                                                                              swal2.close();
    } else {
    swal2.close();
    console.log('error');
    }
  }, (err) => {
    console.log(err);
    swal2.close();
    swal2.fire({
      title: 'Ocurrio un error al consultar la informacion',
      allowOutsideClick: false
    });
  }
    );

    this.cols = [
    { field: 'invoice_folio', header: 'Numero de Factura' },
    { field: 'uuid', header: 'UUID' },
    { field: 'status', header: 'Estatus' },
    { field: 'invoice_date', header: 'Fecha Factura' },
    { field: 'due_date', header: 'Fecha Vencimiento' },
    { field: 'totalformateado', header: 'Total' },

  ];

  }

  show() {
    this.showModal = true; // Show-Hide Modal Check
  }
  hide() {
    this.showModal = false;
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

    const moneda: any = document.getElementById('moneda');

    const valormoneda = moneda.options[moneda.selectedIndex].value;

    this._solicitudesservice.getCadenaProveedor(this.idu).subscribe( resp => {this.cadenaproveedor = resp;
                                                                              this.nombrecadena = this.cadenaproveedor[0].cadena;
                                                                              this.nombreproveedor = this.cadenaproveedor[0].proveedor;
                                                                              this.companyid = this.cadenaproveedor[0].company_id;
                                                                              this.supplierid = this.cadenaproveedor[0].supplier_id;
                                                                              this._solicitudesservice.getFacturas(this.companyid, this.supplierid, valormoneda).subscribe( resp2 => {this.facturas = resp2;
    } );

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
    const proyecto: any = document.getElementById('proyecto');
    const valormoneda = moneda.options[moneda.selectedIndex].value;
    const valorproyecto = proyecto.options[proyecto.selectedIndex].value;
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
    console.log(this.supplierid);
    this._solicitudesservice.getFacturas(this.companyid, this.supplierid, valormoneda).subscribe( resp => { console.log(resp);
    this.facturass = resp;
    // tslint:disable-next-line: forin
    for (const prop in this.facturass) {
      this.facturass[prop].totalformateado = parseFloat(this.facturass[prop].total).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    if (fechaoperacion === 'NaN-NaN-NaN' && valorproyecto === 'todos') {
      this.muestratabla = true;
    } else if (fechaoperacion === 'NaN-NaN-NaN' && valorproyecto === 'sinproyecto') {
      this.muestratabla = false;
      for ( const prop in this.facturas ) {
        if ( this.facturass[prop].company_project_id === null ) {
        this.facturasfiltradas.push(this.facturass[prop]);
        }
      }
      // tslint:disable-next-line: forin
      for (const prep in this.facturasfiltradas) {
        this.facturasfiltradas[prep].porcentaje = 100;
        this.facturasfiltradas[prep].totalaoperar = parseFloat(this.facturasfiltradas[prep].total).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
    } else if ( fechaoperacion === 'NaN-NaN-NaN' && valorproyecto !== 'todos' && valorproyecto !== 'sinproyecto' ) {
      this.muestratabla = false;
      for ( const prop in this.facturas ) {
        if ( this.facturass[prop].company_project_id == valorproyecto ) {
        this.facturasfiltradas.push(this.facturass[prop]);
        }
      }
      // tslint:disable-next-line: forin
      for (const prep in this.facturasfiltradas) {
        this.facturasfiltradas[prep].porcentaje = 100;
        this.facturasfiltradas[prep].totalaoperar = parseFloat(this.facturasfiltradas[prep].total).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
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
    } else if (fechaoperacion !== 'NaN-NaN-NaN' && valorproyecto === 'sinproyecto') {
      this.muestratabla = false;
      for ( const prop in this.facturas ) {
        if ( this.facturass[prop].invoice_date === fechaoperacion && this.facturass[prop].company_project_id === null ) {
        this.facturasfiltradas.push(this.facturass[prop]);
        }
      }
      // tslint:disable-next-line: forin
      for (const prep in this.facturasfiltradas) {
        this.facturasfiltradas[prep].porcentaje = 100;
        this.facturasfiltradas[prep].totalaoperar = parseFloat(this.facturasfiltradas[prep].total).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
    } else if (fechaoperacion !== 'NaN-NaN-NaN' && valorproyecto !== 'todos' && valorproyecto !== 'sinproyecto') {
      this.muestratabla = false;
      for ( const prop in this.facturas ) {
        if ( this.facturass[prop].invoice_date === fechaoperacion && this.facturass[prop].company_project_id == valorproyecto ) {
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

    filtrafac() {

    const moneda: any = document.getElementById('moneda');

    const valormoneda = moneda.options[moneda.selectedIndex].value;

    this.muestratabla = false;

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

    this._solicitudesservice.getFacturas(this.companyid, this.supplierid, valormoneda).subscribe( resp => { this.facturass = resp;
                                                                // tslint:disable-next-line: forin
                                                                                                            for ( const prop in this.facturas ) {
                                                                                                if ( this.facturass[prop].invoice_date === fechaoperacion ) {
                                                                                                this.facturasfiltradas.push(this.facturass[prop]);
                                                                                                }
                                                                                              }

                                                                                              // tslint:disable-next-line: forin
                                                                                                            for (const prep in this.facturasfiltradas) {
                                                                                                this.facturasfiltradas[prep].porcentaje = 100;
                                                                                                this.facturasfiltradas[prep].totalaoperar = parseFloat(this.facturasfiltradas[prep].total).toFixed(2);
                                                                                              }
    } );

  }

    recalcula() {
    if (this.supplieridbandera) {
      
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
  
      const simulacion = new FacturaSimulacion(
  
      total.toString(),
      '100', // (document.getElementById('porcentajeoperacion') as HTMLInputElement).value,
      fechafactura,
      fechaoperacion,
      this.selectedCars1[0].due_date,
      valormoneda,
      this.companyid.toString(),
      this.supplierid.toString(),
      this.idu,
      // (document.getElementById('folio') as HTMLInputElement).value,
      );
      const paramssimul = {
        token: '',
        secret_key: '',
        simulation: true,
        invoices: [],
        request: { // folio: "20201234599",
                   company_id: this.companyid.toString(),
                  // supplier_id: this.supplierid.toString(),
                   user_id: this.idu,
                   total: total.toString(),
                   capacity: '100.00',
                   request_date: this.fechaHoy,
                   used_date: fechaoperacion,
                   due_date: fechafactura,
                   currency: valormoneda,
                   status: 'PENDIENTE'
  
                 }
    };
  
    // tslint:disable-next-line: forin
      for (const prop in this.selectedCars1) {
        paramssimul.invoices[prop] = {id: this.selectedCars1[prop].id.toString(), percent: this.selectedCars1[prop].porcentaje };
    }
      this.simulacion = [];
      this.datostablapopup = [];
      this._solicitudesservice.getSimulacion( paramssimul ).subscribe( resp => {swal2.close();
                                                                                for (const i in resp.data.relations.invoices) {
                                                                                  this.invoicesrequest.push(resp.data.relations.invoices[i].attributes)
                                                                                  for (const h in resp.data.relations.request_invoices) {
                                                                                    if ( resp.data.relations.invoices[i].attributes.id === resp.data.relations.request_invoices[h].attributes.invoice_id ) {
                                                                                      this.datostablapopup.push( { 
                                                                                        folio: resp.data.relations.invoices[i].attributes.invoice_folio,
                                                                                        uuid: resp.data.relations.invoices[i].attributes.uuid,
                                                                                        ext_rate: resp.data.relations.request_invoices[h].attributes.ext_rate,
                                                                                        int_rate: resp.data.relations.request_invoices[h].attributes.int_rate,
                                                                                        total_rate: resp.data.relations.request_invoices[h].attributes.total_rate,
                                                                                        interests: resp.data.relations.request_invoices[h].attributes.interests,
                                                                                        total_used: resp.data.relations.request_invoices[h].attributes.total_used
                                                                                      } )
                                                                                      
                                                                                    }
                                                                                  }
                                                                                }
                                                                                this.simulacion.push(resp.data.attributes);
                                                                               // this.simulacion = resp;
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
                                                                               // console.log(err);
                                                                                console.clear();
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
    } else {
      
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
  
      const simulacion = new FacturaSimulacion(
  
      total.toString(),
      '100', // (document.getElementById('porcentajeoperacion') as HTMLInputElement).value,
      fechafactura,
      fechaoperacion,
      this.selectedCars1[0].due_date,
      valormoneda,
      this.companyid.toString(),
      this.supplierid.toString(),
      this.idu,
      // (document.getElementById('folio') as HTMLInputElement).value,
      );
      const paramssimul = {
        token: '',
        secret_key: '',
        simulation: true,
        invoices: [],
        request: { // folio: "20201234599",
                   company_id: this.companyid.toString(),
                   supplier_id: this.supplierid.toString(),
                   user_id: this.idu,
                   total: total.toString(),
                   capacity: '100.00',
                   request_date: this.fechaHoy,
                   used_date: fechaoperacion,
                   due_date: fechafactura,
                   currency: valormoneda,
                   status: 'PENDIENTE'
  
                 }
    };
  
    // tslint:disable-next-line: forin
      for (const prop in this.selectedCars1) {
        paramssimul.invoices[prop] = {id: this.selectedCars1[prop].id.toString(), percent: this.selectedCars1[prop].porcentaje };
    }
      this.simulacion = [];
      this.datostablapopup = [];
      this._solicitudesservice.getSimulacion( paramssimul ).subscribe( resp => {swal2.close();
                                                                                for (const i in resp.data.relations.invoices) {
                                                                                  this.invoicesrequest.push(resp.data.relations.invoices[i].attributes)
                                                                                  for (const h in resp.data.relations.request_invoices) {
                                                                                    if ( resp.data.relations.invoices[i].attributes.id === resp.data.relations.request_invoices[h].attributes.invoice_id ) {
                                                                                      this.datostablapopup.push( { 
                                                                                        folio: resp.data.relations.invoices[i].attributes.invoice_folio,
                                                                                        uuid: resp.data.relations.invoices[i].attributes.uuid,
                                                                                        ext_rate: resp.data.relations.request_invoices[h].attributes.ext_rate,
                                                                                        int_rate: resp.data.relations.request_invoices[h].attributes.int_rate,
                                                                                        total_rate: resp.data.relations.request_invoices[h].attributes.total_rate,
                                                                                        interests: resp.data.relations.request_invoices[h].attributes.interests,
                                                                                        total_used: resp.data.relations.request_invoices[h].attributes.total_used
                                                                                      } )
                                                                                      
                                                                                    }
                                                                                  }
                                                                                }
                                                                                this.simulacion.push(resp.data.attributes);
                                                                               // this.simulacion = resp;
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
                                                                               // console.log(err);
                                                                                console.clear();
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
    

  }

    prueba() {
      if (this.supplieridbandera) {
       
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
    
          const data = {
            token: '',
            secret_key: '',
            invoices: [],
            request: { // folio: (document.getElementById('folio') as HTMLInputElement).value,
                       company_id: this.companyid.toString(),
                       //supplier_id: this.supplierid.toString(),
                       user_id: this.idu,
                       total: total.toString(),
                       capacity: '100', // (document.getElementById('porcentajeoperacion') as HTMLInputElement).value,
                       request_date: this.fechaHoy,
                       used_date: fechaoperacion,
                       due_date: fechaMayorDueDate,
                       currency: valormoneda,
                       status: 'PENDIENTE'
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
          this._solicitudesservice.confirmacion(data).subscribe(
          resp => {
                   // tslint:disable-next-line: forin
                   for ( const prop in resp[1].invoices ) {
                     this.facturasReporte[prop] = [this.nombreproveedor, resp[0].folio, resp[1].invoices[prop].attributes.total_used, resp[1].invoices[prop].attributes.entry_date, resp[1].invoices[prop].attributes.due_date];
                   }
                   const  data = {
                    nombrecadena: this.nombrecadena,
                    startdatesuplier: this.startdatesuplier,
                    direccioncompany: this.direccioncompany,
                    nombreproveedor: this.nombreproveedor,
                    firmantesreportenombres: this.firmantesreportenombres,
                    }
                    if (environment.CLIENTE === 'FACTORGFCGLOBAL') {
                      this.reportespdf.cesion_derechos_factor(this.facturasReporte, resp[0].id, resp[0].folio, data );
                    } else if (environment.CLIENTE === 'MIZRAFIN') {
                      this.reportespdf.reporte_recurso(resp[0].id, resp[0].folio);
                    }
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
                                                                         // console.log(err);
                                                                         console.clear();
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
    
    
        const data = {
          token: '',
          secret_key: '',
          invoices: [],
          request: { // folio: (document.getElementById('folio') as HTMLInputElement).value,
                     company_id: this.companyid.toString(),
                     //supplier_id: this.supplierid.toString(),
                     user_id: this.idu,
                     total: total.toString(),
                     capacity: '100', // (document.getElementById('porcentajeoperacion') as HTMLInputElement).value,
                     request_date: this.fechaHoy,
                     used_date: fechaoperacion,
                     due_date: fechafactura,
                     currency: valormoneda,
                     status: 'PENDIENTE'
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
        this._solicitudesservice.confirmacion(data).subscribe( resp => {
          // this.respuesta = resp;
           // tslint:disable-next-line: forin
                                                                        for ( const prop in resp[1].invoices ) {
             this.facturasReporte[prop] = [this.nombreproveedor, resp[0].folio, resp[1].invoices[prop].attributes.total_used, resp[1].invoices[prop].attributes.entry_date, resp[1].invoices[prop].attributes.due_date];
           }
                                                                    const  data = {
                                                                      nombrecadena: this.nombrecadena,
                                                                      startdatesuplier: this.startdatesuplier,
                                                                      direccioncompany: this.direccioncompany,
                                                                      nombreproveedor: this.nombreproveedor,
                                                                      firmantesreportenombres: this.firmantesreportenombres,
                                                                      }
                                                                      if (environment.CLIENTE === 'FACTORGFCGLOBAL') {
                                                                        this.reportespdf.cesion_derechos_factor(this.facturasReporte, resp[0].id, resp[0].folio, data );
                                                                      } else if (environment.CLIENTE === 'MIZRAFIN') {
                                                                        this.reportespdf.reporte_recurso(resp[0].id, resp[0].folio);
                                                                      }
                                                                      //  this.htmltoPDF(this.facturasReporte, resp[0].id, resp[0].folio, data );
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
                                                                       // console.log(err);
                                                                        console.clear(); 
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
      } else {
        
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
    
          const data = {
            token: '',
            secret_key: '',
            invoices: [],
            request: { // folio: (document.getElementById('folio') as HTMLInputElement).value,
                       company_id: this.companyid.toString(),
                       supplier_id: this.supplierid.toString(),
                       user_id: this.idu,
                       total: total.toString(),
                       capacity: '100', // (document.getElementById('porcentajeoperacion') as HTMLInputElement).value,
                       request_date: this.fechaHoy,
                       used_date: fechaoperacion,
                       due_date: fechaMayorDueDate,
                       currency: valormoneda,
                       status: 'PENDIENTE'
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
          this._solicitudesservice.confirmacion(data).subscribe(
          resp => {
                  // this.respuesta = resp;
                   // tslint:disable-next-line: forin
                   for ( const prop in resp[1].invoices ) {
                     this.facturasReporte[prop] = [this.nombreproveedor, resp[0].folio, resp[1].invoices[prop].attributes.total_used, resp[1].invoices[prop].attributes.entry_date, resp[1].invoices[prop].attributes.due_date];
                   }
                   const  data = {
                    nombrecadena: this.nombrecadena,
                    startdatesuplier: this.startdatesuplier,
                    direccioncompany: this.direccioncompany,
                    nombreproveedor: this.nombreproveedor,
                    firmantesreportenombres: this.firmantesreportenombres,
                    }
                    if (environment.CLIENTE === 'FACTORGFCGLOBAL') {
                      this.reportespdf.cesion_derechos_factor(this.facturasReporte, resp[0].id, resp[0].folio, data );
                    } else if (environment.CLIENTE === 'MIZRAFIN') {
                      this.reportespdf.reporte_mizfacturas_sin_recurso(resp[0].id, resp[0].folio);
                    }
                    
                 //  this.htmltoPDF(this.facturasReporte, resp[0].id, resp[0].folio, data );
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
                                                                         //console.clear();
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
    
    
        const data = {
          token: '',
          secret_key: '',
          invoices: [],
          request: { // folio: (document.getElementById('folio') as HTMLInputElement).value,
                     company_id: this.companyid.toString(),
                     supplier_id: this.supplierid.toString(),
                     user_id: this.idu,
                     total: total.toString(),
                     capacity: '100', // (document.getElementById('porcentajeoperacion') as HTMLInputElement).value,
                     request_date: this.fechaHoy,
                     used_date: fechaoperacion,
                     due_date: fechafactura,
                     currency: valormoneda,
                     status: 'PENDIENTE'
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
        this._solicitudesservice.confirmacion(data).subscribe( resp => {
          // this.respuesta = resp;
           // tslint:disable-next-line: forin
                                                                        for ( const prop in resp[1].invoices ) {
             this.facturasReporte[prop] = [this.nombreproveedor, resp[0].folio, resp[1].invoices[prop].attributes.total_used, resp[1].invoices[prop].attributes.entry_date, resp[1].invoices[prop].attributes.due_date];
           }
                                                                    const  data = {
                                                                      nombrecadena: this.nombrecadena,
                                                                      startdatesuplier: this.startdatesuplier,
                                                                      direccioncompany: this.direccioncompany,
                                                                      nombreproveedor: this.nombreproveedor,
                                                                      firmantesreportenombres: this.firmantesreportenombres,
                                                                      }
                                                                      if (environment.CLIENTE === 'FACTORGFCGLOBAL') {
                                                                        this.reportespdf.cesion_derechos_factor(this.facturasReporte, resp[0].id, resp[0].folio, data );
                                                                      } else if (environment.CLIENTE === 'MIZRAFIN') {
                                                                        this.reportespdf.reporte_mizfacturas_sin_recurso(resp[0].id, resp[0].folio);
                                                                      }
                                                                      
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
                                                                       // console.log(err);
                                                                        console.clear(); 
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
    
  }

                                                                                enableconfirm() {
    this.confirma = !this.confirma;
  }

    recalculasinfiltro() {
    
    if (this.supplieridbandera) {
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
  
      const paramssimul = {
        token: '',
        secret_key: '',
        simulation: true,
        invoices: [],
        request: { // folio: "20201234599",
                   company_id: this.companyid.toString(),
                  // supplier_id: this.supplierid.toString(),
                   user_id: this.idu,
                   total: total.toString(),
                   capacity: '100.00',
                   request_date: this.fechaHoy,
                   used_date: fechaoperacion,
                   due_date: fechaMayorDueDate,
                   currency: valormoneda,
                   status: 'PENDIENTE'
  
                 }
    };
  
    // tslint:disable-next-line: forin
      for (const prop in this.selectedCars2) {
        paramssimul.invoices[prop] = {id: this.selectedCars2[prop].id.toString(), percent: this.selectedCars2[prop].porcentaje };
    }
      //console.log(paramssimul);
      this.vienesinfiltro = true;
      this.simulacion = [];
      this.datostablapopup = [];
      this._solicitudesservice.getSimulacion( paramssimul ).subscribe( resp => {swal2.close(); //console.log(resp);
       // console.log(resp)
                                                                                for (const i in resp.data.relations.invoices) {
                                                                                  this.invoicesrequest.push(resp.data.relations.invoices[i].attributes)
                                                                                  for (const h in resp.data.relations.request_invoices) {
                                                                                    if ( resp.data.relations.invoices[i].attributes.id === resp.data.relations.request_invoices[h].attributes.invoice_id ) {
                                                                                      this.datostablapopup.push( { 
                                                                                        folio: resp.data.relations.invoices[i].attributes.invoice_folio,
                                                                                        uuid: resp.data.relations.invoices[i].attributes.uuid,
                                                                                        ext_rate: resp.data.relations.request_invoices[h].attributes.ext_rate,
                                                                                        int_rate: resp.data.relations.request_invoices[h].attributes.int_rate,
                                                                                        total_rate: resp.data.relations.request_invoices[h].attributes.total_rate,
                                                                                        interests: resp.data.relations.request_invoices[h].attributes.interests,
                                                                                        total_used: resp.data.relations.request_invoices[h].attributes.total_used
                                                                                      } )
                                                                                      
                                                                                    }
                                                                                  }
                                                                                }
                                                                                this.simulacion.push(resp.data.attributes);
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
                                                                                console.log(err)
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
    } else {
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
  
      const paramssimul = {
        token: '',
        secret_key: '',
        simulation: true,
        invoices: [],
        request: { // folio: "20201234599",
                   company_id: this.companyid.toString(),
                   supplier_id: this.supplierid.toString(),
                   user_id: this.idu,
                   total: total.toString(),
                   capacity: '100.00',
                   request_date: this.fechaHoy,
                   used_date: fechaoperacion,
                   due_date: fechaMayorDueDate,
                   currency: valormoneda,
                   status: 'PENDIENTE'
  
                 }
    };
  
    // tslint:disable-next-line: forin
      for (const prop in this.selectedCars2) {
        paramssimul.invoices[prop] = {id: this.selectedCars2[prop].id.toString(), percent: this.selectedCars2[prop].porcentaje };
    }
     // console.log(paramssimul);
      this.vienesinfiltro = true;
      this.simulacion = [];
      this.datostablapopup = [];
      this._solicitudesservice.getSimulacion( paramssimul ).subscribe( resp => {swal2.close();
       // console.log(resp)
                                                                                for (const i in resp.data.relations.invoices) {
                                                                                  this.invoicesrequest.push(resp.data.relations.invoices[i].attributes)
                                                                                  for (const h in resp.data.relations.request_invoices) {
                                                                                    if ( resp.data.relations.invoices[i].attributes.id === resp.data.relations.request_invoices[h].attributes.invoice_id ) {
                                                                                      this.datostablapopup.push( { 
                                                                                        folio: resp.data.relations.invoices[i].attributes.invoice_folio,
                                                                                        uuid: resp.data.relations.invoices[i].attributes.uuid,
                                                                                        ext_rate: resp.data.relations.request_invoices[h].attributes.ext_rate,
                                                                                        int_rate: resp.data.relations.request_invoices[h].attributes.int_rate,
                                                                                        total_rate: resp.data.relations.request_invoices[h].attributes.total_rate,
                                                                                        interests: resp.data.relations.request_invoices[h].attributes.interests,
                                                                                        total_used: resp.data.relations.request_invoices[h].attributes.total_used
                                                                                      } )
                                                                                      
                                                                                    }
                                                                                  }
                                                                                }
                                                                                this.simulacion.push(resp.data.attributes);
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
                                                                                console.log(err)
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
    
  }

  htmltoPDF(conttabla, ids, folio) {
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
doc.text('Nombre del Deudor ' + this.nombrecadena, 14, 50, 'left');
doc.text('P R E S E N T E :', 14, 60, 'left');
doc.setFontType('normal');
doc.text('De conformidad a lo establecido en el contrato de Cadenas a Proveedores celebrados con ustedes en fecha ' + this.startdatesuplier +
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
doc.text(this.nombrecadena, 14, 30, 'left');
doc.text(this.direccioncompany + 'direccion tipo fiscal', 14, 35, 'left');
doc.text('P R E S E N T E ', 14, 50, 'left');
doc.setFontType( 'normal');
doc.text('En mi calidad de representante legal de la sociedad ' + this.nombreproveedor +
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
      body: conttabla, startY: tablapos
    });
doc.text('En consecuencia a lo anterior, le notificamos que la presente instrucción sólo se podrá modificar con la autorización previa' +
'y por escrito de un apoderado con facultades suficientes de Factor GFC Global, Sociedad Anónima de Capital Variable, Sociedad' +
'Financiera de Objeto Múltiple Entidad No Regulada.', 14, tablapos + incremetotabla, {maxWidth: 180, align: "justify"});
doc.setFontType( 'bold');
doc.text('A T E N T A M E N T E', 14, (tablapos + incremetotabla) + 30, 'left');
doc.setFontType( 'normal');
doc.text(this.nombreproveedor, 14, (tablapos + incremetotabla) + 35, 'left');
doc.setLineWidth(.5);
doc.line(80, (tablapos + incremetotabla) + 45, 14, (tablapos + incremetotabla) + 45); // horizontal line
doc.text(this.firmantesreportenombres, 14, (tablapos + incremetotabla) + 50, 'left');
doc.setFontType( 'bold');
doc.text('R E C I B I D O', 14, (tablapos + incremetotabla) + 60, 'left');
doc.setFontType( 'normal');
doc.text(this.nombrecadena, 14, (tablapos + incremetotabla) + 65, 'left');
doc.line(80, (tablapos + incremetotabla) + 75, 14, (tablapos + incremetotabla) + 75); // horizontal line
    // doc.save('nalgas.pdf');
    // console.log(doc.output());
this.subirdoc(doc.output('blob'), ids, folio);
  }
subirdoc( sol, idsol, folio ) {
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
    this._solicitudesservice.updateSolicitudes(idsol, params).subscribe();
    } ); }); // this.subirurl(); });

  }

}







