import { Component, OnInit } from '@angular/core';
import { UsuarioService, DashboardService } from '../../services/service.index';
import { ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {

  usuarios: string;
  idu = '';
  data: any;
  data2: any;
  data3: any;
  options: any;
  options2: any;
  adminInvoices: any[] = [];
  adminRequests: any[] = [];
  datos: any[] = [];
  nombrecadena: string;
  totalintereses = '0';
  posemana = '0';
  primerdash = false;
  // SOFOM ////////
  sofomdash = false;
  afiliadostotales: any[] = [];
  dispuestointeres: any[] = [];
  facturasvsdescue: any[] = [];
  facturasvsdesord: any[] = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  proveedoresafili: any[] = [];
  proveedoresaford: any[] = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  avgdiscountdays : any[] = [];
  pagosydisperciones: any[] = [];
  ////////////////
  // COMPANY /////
  companydash = false;
  facturasCanceladas: any[] = [];
  proximosPagos: any[] = [];
  facturasdescontadas: any[] = [];
  facturasdescontadasproveedores: any[] = [];
  facturascanceladastotales: any[] = [];
  comisionPagoSofom: any[] = [];
  porcentajecomision = '';
  isCompany: any[] = [];
  ///////////////
  // SUPLIER ////
  suplierdash = false;
  facturasnodescontadas: any[] = [];
  facturasdescontadassuplier: any[] = [];
  facturasdescontadasmes: any[] = [];
  importefacturas: any[] = [];
  isSuppier: any[] = [];
  ///////////////

  thipousuario: any[] = [];
  fileName = '';
  constructor(public _usuarioservice: UsuarioService,
              public _dashboardservice: DashboardService,
              private route: ActivatedRoute) {

   }

  ngOnInit() {
    this.idu = localStorage.getItem('id');
    this.companydash = false;
    this.suplierdash = false;
    this.sofomdash = false;

    this._dashboardservice.getUserType(this.idu).subscribe( resp => { this.thipousuario = resp;
      // DASHBOARD SOFOM /////////////////////////////////////////////////
                                                                     // this.thipousuario[0].tipo_usuario = 'SOFOM';
                                                                      if (this.thipousuario[0].tipo_usuario == 'SOFOM') {
                                                                        this.sofomdash = true;
                                                                        this._dashboardservice.getPagosyDisperciones().subscribe( resp20 => this.pagosydisperciones = resp20 );
                                                                        this._dashboardservice.getAfiliadosTotales().subscribe( resp2 => { this.afiliadostotales = resp2; } );
                                                                        this._dashboardservice.getFacturasvsDescuentos().subscribe( resp3 => { this.facturasvsdescue = resp3;
                                                                            // tslint:disable-next-line: forin
                                                                                                                                               for (const prop in this.facturasvsdescue) {
                                                                              if (this.facturasvsdescue[prop].mes === 'ENERO') {
                                                                                this.facturasvsdesord[0] = (this.facturasvsdescue[prop]);
                                                                              }
                                                                              if (this.facturasvsdescue[prop].mes === 'FEBRERO') {
                                                                                this.facturasvsdesord[1] = (this.facturasvsdescue[prop]);
                                                                              }
                                                                              if (this.facturasvsdescue[prop].mes === 'MARZO') {
                                                                                this.facturasvsdesord[2] = (this.facturasvsdescue[prop]);
                                                                              }
                                                                              if (this.facturasvsdescue[prop].mes === 'ABRIL') {
                                                                                this.facturasvsdesord[3] = (this.facturasvsdescue[prop]);
                                                                              }
                                                                              if (this.facturasvsdescue[prop].mes === 'MAYO') {
                                                                                this.facturasvsdesord[4] = (this.facturasvsdescue[prop]);
                                                                              }
                                                                              if (this.facturasvsdescue[prop].mes === 'JUNIO') {
                                                                                this.facturasvsdesord[5] = (this.facturasvsdescue[prop]);
                                                                              }
                                                                              if (this.facturasvsdescue[prop].mes === 'JULIO') {
                                                                                this.facturasvsdesord[6] = (this.facturasvsdescue[prop]);
                                                                              }
                                                                              if (this.facturasvsdescue[prop].mes === 'AGOSTO') {
                                                                                this.facturasvsdesord[7] = (this.facturasvsdescue[prop]);
                                                                              }
                                                                              if (this.facturasvsdescue[prop].mes === 'SEPTIEMBRE') {
                                                                                this.facturasvsdesord[8] = (this.facturasvsdescue[prop]);
                                                                              }
                                                                              if (this.facturasvsdescue[prop].mes === 'OCTUBRE') {
                                                                                this.facturasvsdesord[9] = (this.facturasvsdescue[prop]);
                                                                              }
                                                                              if (this.facturasvsdescue[prop].mes === 'NOVIEMBRE') {
                                                                                this.facturasvsdesord[10] = (this.facturasvsdescue[prop]);
                                                                              }
                                                                              if (this.facturasvsdescue[prop].mes === 'DICIEMBRE') {
                                                                                this.facturasvsdesord[11] = (this.facturasvsdescue[prop]);
                                                                              }
                                                                            }
      } );
                                                                        this._dashboardservice.getDispuestoInterescobrado().subscribe( resp4 => { this.dispuestointeres = resp4;
                                                                                                                                                  this.data2 = {
                                                                               labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
                                                                                        'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                                                                               datasets: [
                                                                                         {
                                                                                             label: 'Total Dispuesto ',
                                                                                             backgroundColor: '#949dab',
                                                                                             borderColor: '#1E88E5',
                                                                                             data: [parseFloat(this.dispuestointeres[0].total_dispuesto_enero.replace(/,/g, '')),
                                                                                                    parseFloat(this.dispuestointeres[0].total_dispuesto_febrero.replace(/,/g, '')),
                                                                                                    parseFloat(this.dispuestointeres[0].total_dispuesto_marzo.replace(/,/g, '')),
                                                                                                    parseFloat(this.dispuestointeres[0].total_dispuesto_abril.replace(/,/g, '')),
                                                                                                    parseFloat(this.dispuestointeres[0].total_dispuesto_mayo.replace(/,/g, '')),
                                                                                                    parseFloat(this.dispuestointeres[0].total_dispuesto_junio.replace(/,/g, '')),
                                                                                                    parseFloat(this.dispuestointeres[0].total_dispuesto_julio.replace(/,/g, '')),
                                                                                                    parseFloat(this.dispuestointeres[0].total_dispuesto_agosto.replace(/,/g, '')),
                                                                                                    parseFloat(this.dispuestointeres[0].total_dispuesto_septiembre.replace(/,/g, '')),
                                                                                                    parseFloat(this.dispuestointeres[0].total_dispuesto_octubre.replace(/,/g, '')),
                                                                                                    parseFloat(this.dispuestointeres[0].total_dispuesto_noviembre.replace(/,/g, '')),
                                                                                                    parseFloat(this.dispuestointeres[0].total_dispuesto_diciembre.replace(/,/g, ''))
                                                                                                    ]
                                                                                         },
                                                                                         {
                                                                                          label: 'Total Cobrado ',
                                                                                          backgroundColor: '#434750',
                                                                                          borderColor: '#7CB342',
                                                                                          data: [parseFloat(this.dispuestointeres[0].total_intereses_enero.replace(/,/g, '')),
                                                                                                 parseFloat(this.dispuestointeres[0].total_intereses_febrero.replace(/,/g, '')),
                                                                                                 parseFloat(this.dispuestointeres[0].total_intereses_marzo.replace(/,/g, '')),
                                                                                                 parseFloat(this.dispuestointeres[0].total_intereses_abril.replace(/,/g, '')),
                                                                                                 parseFloat(this.dispuestointeres[0].total_intereses_mayo.replace(/,/g, '')),
                                                                                                 parseFloat(this.dispuestointeres[0].total_intereses_junio.replace(/,/g, '')),
                                                                                                 parseFloat(this.dispuestointeres[0].total_intereses_julio.replace(/,/g, '')),
                                                                                                 parseFloat(this.dispuestointeres[0].total_intereses_agosto.replace(/,/g, '')),
                                                                                                 parseFloat(this.dispuestointeres[0].total_intereses_septiembre.replace(/,/g, '')),
                                                                                                 parseFloat(this.dispuestointeres[0].total_intereses_octubre.replace(/,/g, '')),
                                                                                                 parseFloat(this.dispuestointeres[0].total_intereses_noviembre.replace(/,/g, '')),
                                                                                                 parseFloat(this.dispuestointeres[0].total_intereses_diciembre.replace(/,/g, ''))
                                                                                                 ]
                                                                                      },
                                                                                         ]
                                                                              };
                                                                      } );
                                                                        this._dashboardservice.getProveedoresAfiliados().subscribe( resp5 => { this.proveedoresafili = resp5;
        // tslint:disable-next-line: forin
                                                                                                                                               for (const prop in this.proveedoresafili) {
          if (this.proveedoresafili[prop].mes === 'ENERO') {
            this.proveedoresaford[0] = (this.proveedoresafili[prop]);
          }
          if (this.proveedoresafili[prop].mes === 'FEBRERO') {
            this.proveedoresaford[1] = (this.proveedoresafili[prop]);
          }
          if (this.proveedoresafili[prop].mes === 'MARZO') {
            this.proveedoresaford[2] = (this.proveedoresafili[prop]);
          }
          if (this.proveedoresafili[prop].mes === 'ABRIL') {
            this.proveedoresaford[3] = (this.proveedoresafili[prop]);
          }
          if (this.proveedoresafili[prop].mes === 'MAYO') {
            this.proveedoresaford[4] = (this.proveedoresafili[prop]);
          }
          if (this.proveedoresafili[prop].mes === 'JUNIO') {
            this.proveedoresaford[5] = (this.proveedoresafili[prop]);
          }
          if (this.proveedoresafili[prop].mes === 'JULIO') {
            this.proveedoresaford[6] = (this.proveedoresafili[prop]);
          }
          if (this.proveedoresafili[prop].mes === 'AGOSTO') {
            this.proveedoresaford[7] = (this.proveedoresafili[prop]);
          }
          if (this.proveedoresafili[prop].mes === 'SEPTIEMBRE') {
            this.proveedoresaford[8] = (this.proveedoresafili[prop]);
          }
          if (this.proveedoresafili[prop].mes === 'OCTUBRE') {
            this.proveedoresaford[9] = (this.proveedoresafili[prop]);
          }
          if (this.proveedoresafili[prop].mes === 'NOVIEMBRE') {
            this.proveedoresaford[10] = (this.proveedoresafili[prop]);
          }
          if (this.proveedoresafili[prop].mes === 'DICIEMBRE') {
            this.proveedoresaford[11] = (this.proveedoresafili[prop]);
          }
        }

       } );
                                                                        this._dashboardservice.getAvgDiscountDays().subscribe( resp6 => { this.avgdiscountdays = resp6; } );
      }
      ///////////////////////////////////////////////////////////////////
      // DASHBOARD COMPANY ////////////////////////////////////////////////
    // tslint:disable-next-line: align
    if (this.thipousuario[0].tipo_usuario == 'COMPANY') {
      this.companydash = true;
      this._dashboardservice.getFacturasCanceladas(this.thipousuario[0].company_id).subscribe( resp7 => { this.facturasCanceladas = resp7; } );
      this._dashboardservice.getProximosPagos(this.thipousuario[0].company_id).subscribe( resp8 => { this.proximosPagos = resp8; } );
      this._dashboardservice.getFacturasdescontadasynodescontadas(this.thipousuario[0].company_id).subscribe( resp9 => { this.facturasdescontadas = resp9; } );
      this._dashboardservice.getFacturasdescontadasproveedores(this.thipousuario[0].company_id).subscribe( resp10 => { this.facturasdescontadasproveedores = resp10; } );
      this._dashboardservice.getFacturasCanceladasTotales(this.thipousuario[0].company_id).subscribe( resp11 => { this.facturascanceladastotales = resp11;
                                                                                                                  this.data2 = {
          labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
                   'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
          datasets: [
                    {
                        label: 'Facturas canceladas ',
                        backgroundColor: '#949dab',
                        borderColor: '#1E88E5',
                        data: [ this.facturascanceladastotales[0].enero,
                        this.facturascanceladastotales[0].febrero,
                        this.facturascanceladastotales[0].marzo,
                        this.facturascanceladastotales[0].abril,
                        this.facturascanceladastotales[0].mayo,
                        this.facturascanceladastotales[0].junio,
                        this.facturascanceladastotales[0].julio,
                        this.facturascanceladastotales[0].agosto,
                        this.facturascanceladastotales[0].septiembre,
                        this.facturascanceladastotales[0].octubre,
                        this.facturascanceladastotales[0].noviembre,
                        this.facturascanceladastotales[0].diciembre,
                               ]
                    }
                    ]
         };
      } );
      this._dashboardservice.getComisionPagoSofom(this.thipousuario[0].company_id).subscribe( resp12 => { this.comisionPagoSofom = resp12; this.porcentajecomision = this.comisionPagoSofom[0].porcentaje_comision;
                                                                                                          this.data3 = {
  labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
  'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  datasets: [
  {
  label: 'Comision ',
  backgroundColor: '#949dab',
  borderColor: '#1E88E5',
  data: [ parseFloat(this.comisionPagoSofom[0].comision_enero.replace(/,/g, '')),
  parseFloat(this.comisionPagoSofom[0].comision_febrero.replace(/,/g, '')),
  parseFloat(this.comisionPagoSofom[0].comision_marzo.replace(/,/g, '')),
  parseFloat(this.comisionPagoSofom[0].comision_abril.replace(/,/g, '')),
  parseFloat(this.comisionPagoSofom[0].comision_mayo.replace(/,/g, '')),
  parseFloat(this.comisionPagoSofom[0].comision_junio.replace(/,/g, '')),
  parseFloat(this.comisionPagoSofom[0].comision_julio.replace(/,/g, '')),
  parseFloat(this.comisionPagoSofom[0].comision_agosto.replace(/,/g, '')),
  parseFloat(this.comisionPagoSofom[0].comision_septiembre.replace(/,/g, '')),
  parseFloat(this.comisionPagoSofom[0].comision_octubre.replace(/,/g, '')),
  parseFloat(this.comisionPagoSofom[0].comision_noviembre.replace(/,/g, '')),
  parseFloat(this.comisionPagoSofom[0].comision_diciembre.replace(/,/g, '')),
  ]
  }
  ]
  };
  } );
      }
      ////////////////////////////////////////////////////////////////////
      // DASHBOARD SUPLIER ////////////////////////////////////////////////
                                                                      if (this.thipousuario[0].tipo_usuario == 'SUPPLER') {
      this.suplierdash = true;
      this._dashboardservice.getFacturasNoDescontadas(this.thipousuario[0].supplier_id).subscribe( resp13 => { this.facturasnodescontadas = resp13; } );
      this._dashboardservice.getFacturasDescontadas(this.thipousuario[0].supplier_id).subscribe( resp14 => { this.facturasdescontadassuplier = resp14; } );
      this._dashboardservice.getFacturasDescontadasMes(this.thipousuario[0].supplier_id).subscribe( resp15 => { this.facturasdescontadasmes = resp15; } );
      this._dashboardservice.getImporteFacturas(this.thipousuario[0].supplier_id).subscribe( resp16 => { this.importefacturas = resp16; } );
    }
    ////////////////////////////////////////////////////////////////////
    } );

    /*

    if (this.primerdash) {
    this._dashboardservice.getDatos().subscribe( resp => { this.datos = resp;

                                                           this.totalintereses = this.datos[0].total_intereses;

                                                           this.posemana = this.datos[0].promedio_operacion_semana;

                                                           this.nombrecadena = this.datos[0].cadena;

                                                           this.options = {
                                                            title: {
                                                                display: true,
                                                                text: 'Porcentaje Descuento: ' + this.datos[0].porcentaje_descuento + '%',
                                                                fontSize: 16
                                                            },
                                                            legend: {
                                                                position: 'bottom'
                                                            }
                                                        };
                                                           this.options2 = {
                                                            title: {
                                                                display: true,
                                                                text: 'Saldo: ' + '$' + this.datos[0].saldo,
                                                                fontSize: 16
                                                            },
                                                            legend: {
                                                                position: 'bottom'
                                                            }
                                                        };

                                                           this.data = {
                                                                        labels: ['Proveedores ' + this.datos[0].numero_proveedores, 'Afiliados ' + this.datos[0].afiliados],
                                                                        datasets: [
                                                                                    {
                                                                                    data: [this.datos[0].numero_proveedores, this.datos[0].afiliados],
                                                                                    backgroundColor: [
                                                                                    "#03072.0",
                                                                                    "#434750"
                                                                                    ],
                                                                                    hoverBackgroundColor: [
                                                                                    "#03072.0",
                                                                                    "#434750"
                                                                                    ]
                                                                                    }]
                                                                                    };

                                                           this.data2 = {
                                                                          labels: [''],
                                                                          datasets: [
                                                                                      {
                                                                                      label: 'Total Facturas ' + this.datos[0].total_facturas,
                                                                                      backgroundColor: '#03072.0',
                                                                                      borderColor: '#1E88E5',
                                                                                      data: [this.datos[0].total_facturas]
                                                                                      },
                                                                                      {
                                                                                      label: 'Facturas en Descuento ' + this.datos[0].total_facturas_en_descuento,
                                                                                      backgroundColor: '#434750',
                                                                                      borderColor: '#7CB342',
                                                                                      data: [this.datos[0].total_facturas_en_descuento]
                                                                                      }
                                                                                      ]
                                                                                      };
                                                           this.data3 = {
                                                                           labels: [''],
                                                                           datasets: [
                                                                                      {
                                                                                      label: 'Limite Credito ' + this.datos[0].limite_credito,
                                                                                      backgroundColor: '#03072.0',
                                                                                      borderColor: '#1E88E5',
                                                                                      data: [this.datos[0].limite_credito.replace(/,/g, '')]
                                                                                      },
                                                                                      {
                                                                                      label: 'Credito Disponible ' + this.datos[0].credito_disponible,
                                                                                      backgroundColor: '#434750',
                                                                                      borderColor: '#7CB342',
                                                                                      data: [this.datos[0].credito_disponible.replace(/,/g, '')]
                                                                                      }
                                                                                    ]
                                                                          };

    } );

    this._dashboardservice.getAdminInvoices().subscribe( resp => {this.adminInvoices = resp; } );

    this._dashboardservice.getAdminRequests().subscribe( resp => {this.adminRequests = resp; } );
  }


    // DASHBOARD SOFOM /////////////////////////////////////////////////
    if (this.sofomdash) {

    this._dashboardservice.getAfiliadosTotales().subscribe( resp => { this.afiliadostotales = resp; } );
    this._dashboardservice.getFacturasvsDescuentos().subscribe( resp => { this.facturasvsdescue = resp;
                                                                          // tslint:disable-next-line: forin
                                                                          for (const prop in this.facturasvsdescue) {
                                                                            if (this.facturasvsdescue[prop].mes === 'ENERO') {
                                                                              this.facturasvsdesord[0] = (this.facturasvsdescue[prop]);
                                                                            }
                                                                            if (this.facturasvsdescue[prop].mes === 'FEBRERO') {
                                                                              this.facturasvsdesord[1] = (this.facturasvsdescue[prop]);
                                                                            }
                                                                            if (this.facturasvsdescue[prop].mes === 'MARZO') {
                                                                              this.facturasvsdesord[2] = (this.facturasvsdescue[prop]);
                                                                            }
                                                                            if (this.facturasvsdescue[prop].mes === 'ABRIL') {
                                                                              this.facturasvsdesord[3] = (this.facturasvsdescue[prop]);
                                                                            }
                                                                            if (this.facturasvsdescue[prop].mes === 'MAYO') {
                                                                              this.facturasvsdesord[4] = (this.facturasvsdescue[prop]);
                                                                            }
                                                                            if (this.facturasvsdescue[prop].mes === 'JUNIO') {
                                                                              this.facturasvsdesord[5] = (this.facturasvsdescue[prop]);
                                                                            }
                                                                            if (this.facturasvsdescue[prop].mes === 'JULIO') {
                                                                              this.facturasvsdesord[6] = (this.facturasvsdescue[prop]);
                                                                            }
                                                                            if (this.facturasvsdescue[prop].mes === 'AGOSTO') {
                                                                              this.facturasvsdesord[7] = (this.facturasvsdescue[prop]);
                                                                            }
                                                                            if (this.facturasvsdescue[prop].mes === 'SEPTIEMBRE') {
                                                                              this.facturasvsdesord[8] = (this.facturasvsdescue[prop]);
                                                                            }
                                                                            if (this.facturasvsdescue[prop].mes === 'OCTUBRE') {
                                                                              this.facturasvsdesord[9] = (this.facturasvsdescue[prop]);
                                                                            }
                                                                            if (this.facturasvsdescue[prop].mes === 'NOVIEMBRE') {
                                                                              this.facturasvsdesord[10] = (this.facturasvsdescue[prop]);
                                                                            }
                                                                            if (this.facturasvsdescue[prop].mes === 'DICIEMBRE') {
                                                                              this.facturasvsdesord[11] = (this.facturasvsdescue[prop]);
                                                                            }
                                                                          }
    } );
    this._dashboardservice.getDispuestoInterescobrado().subscribe( resp => { this.dispuestointeres = resp;
                                                                             this.data2 = {
                                                                             labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
                                                                                      'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                                                                             datasets: [
                                                                                       {
                                                                                           label: 'Total Dispuesto ',
                                                                                           backgroundColor: '#03072.0',
                                                                                           borderColor: '#1E88E5',
                                                                                           data: [parseFloat(this.dispuestointeres[0].total_dispuesto_enero.replace(/,/g, '')),
                                                                                                  parseFloat(this.dispuestointeres[0].total_dispuesto_febrero.replace(/,/g, '')),
                                                                                                  parseFloat(this.dispuestointeres[0].total_dispuesto_marzo.replace(/,/g, '')),
                                                                                                  parseFloat(this.dispuestointeres[0].total_dispuesto_abril.replace(/,/g, '')),
                                                                                                  parseFloat(this.dispuestointeres[0].total_dispuesto_mayo.replace(/,/g, '')),
                                                                                                  parseFloat(this.dispuestointeres[0].total_dispuesto_junio.replace(/,/g, '')),
                                                                                                  parseFloat(this.dispuestointeres[0].total_dispuesto_julio.replace(/,/g, '')),
                                                                                                  parseFloat(this.dispuestointeres[0].total_dispuesto_agosto.replace(/,/g, '')),
                                                                                                  parseFloat(this.dispuestointeres[0].total_dispuesto_septiembre.replace(/,/g, '')),
                                                                                                  parseFloat(this.dispuestointeres[0].total_dispuesto_octubre.replace(/,/g, '')),
                                                                                                  parseFloat(this.dispuestointeres[0].total_dispuesto_noviembre.replace(/,/g, '')),
                                                                                                  parseFloat(this.dispuestointeres[0].total_dispuesto_diciembre.replace(/,/g, ''))
                                                                                                  ]
                                                                                       },
                                                                                       {
                                                                                        label: 'Total Cobrado ',
                                                                                        backgroundColor: '#434750',
                                                                                        borderColor: '#7CB342',
                                                                                        data: [parseFloat(this.dispuestointeres[0].total_intereses_enero.replace(/,/g, '')),
                                                                                               parseFloat(this.dispuestointeres[0].total_intereses_febrero.replace(/,/g, '')),
                                                                                               parseFloat(this.dispuestointeres[0].total_intereses_marzo.replace(/,/g, '')),
                                                                                               parseFloat(this.dispuestointeres[0].total_intereses_abril.replace(/,/g, '')),
                                                                                               parseFloat(this.dispuestointeres[0].total_intereses_mayo.replace(/,/g, '')),
                                                                                               parseFloat(this.dispuestointeres[0].total_intereses_junio.replace(/,/g, '')),
                                                                                               parseFloat(this.dispuestointeres[0].total_intereses_julio.replace(/,/g, '')),
                                                                                               parseFloat(this.dispuestointeres[0].total_intereses_agosto.replace(/,/g, '')),
                                                                                               parseFloat(this.dispuestointeres[0].total_intereses_septiembre.replace(/,/g, '')),
                                                                                               parseFloat(this.dispuestointeres[0].total_intereses_octubre.replace(/,/g, '')),
                                                                                               parseFloat(this.dispuestointeres[0].total_intereses_noviembre.replace(/,/g, '')),
                                                                                               parseFloat(this.dispuestointeres[0].total_intereses_diciembre.replace(/,/g, ''))
                                                                                               ]
                                                                                    },
                                                                                       ]
                                                                            };
                                                                    } );
    this._dashboardservice.getProveedoresAfiliados().subscribe( resp => { this.proveedoresafili = resp;
      // tslint:disable-next-line: forin
                                                                          for (const prop in this.proveedoresafili) {
        if (this.proveedoresafili[prop].mes === 'ENERO') {
          this.proveedoresaford[0] = (this.proveedoresafili[prop]);
        }
        if (this.proveedoresafili[prop].mes === 'FEBRERO') {
          this.proveedoresaford[1] = (this.proveedoresafili[prop]);
        }
        if (this.proveedoresafili[prop].mes === 'MARZO') {
          this.proveedoresaford[2] = (this.proveedoresafili[prop]);
        }
        if (this.proveedoresafili[prop].mes === 'ABRIL') {
          this.proveedoresaford[3] = (this.proveedoresafili[prop]);
        }
        if (this.proveedoresafili[prop].mes === 'MAYO') {
          this.proveedoresaford[4] = (this.proveedoresafili[prop]);
        }
        if (this.proveedoresafili[prop].mes === 'JUNIO') {
          this.proveedoresaford[5] = (this.proveedoresafili[prop]);
        }
        if (this.proveedoresafili[prop].mes === 'JULIO') {
          this.proveedoresaford[6] = (this.proveedoresafili[prop]);
        }
        if (this.proveedoresafili[prop].mes === 'AGOSTO') {
          this.proveedoresaford[7] = (this.proveedoresafili[prop]);
        }
        if (this.proveedoresafili[prop].mes === 'SEPTIEMBRE') {
          this.proveedoresaford[8] = (this.proveedoresafili[prop]);
        }
        if (this.proveedoresafili[prop].mes === 'OCTUBRE') {
          this.proveedoresaford[9] = (this.proveedoresafili[prop]);
        }
        if (this.proveedoresafili[prop].mes === 'NOVIEMBRE') {
          this.proveedoresaford[10] = (this.proveedoresafili[prop]);
        }
        if (this.proveedoresafili[prop].mes === 'DICIEMBRE') {
          this.proveedoresaford[11] = (this.proveedoresafili[prop]);
        }
      }
                                                                          console.log(this.proveedoresaford);
     } );
    this._dashboardservice.getAvgDiscountDays().subscribe( resp => { this.avgdiscountdays = resp; } );
    }
    ///////////////////////////////////////////////////////////////////

    // DASHBOARD COMPANY ////////////////////////////////////////////////
    if (this.companydash) {
    this._dashboardservice.getFacturasCanceladas(2).subscribe( resp => { this.facturasCanceladas = resp; } );
    this._dashboardservice.getProximosPagos(2).subscribe( resp => { this.proximosPagos = resp; } );
    this._dashboardservice.getFacturasdescontadasynodescontadas(2).subscribe( resp => { this.facturasdescontadas = resp; } );
    this._dashboardservice.getFacturasdescontadasproveedores(2).subscribe( resp=> { this.facturasdescontadasproveedores = resp; } );
    this._dashboardservice.getFacturasCanceladasTotales(2).subscribe( resp => { this.facturascanceladastotales = resp; 
                                                                                this.data2 = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
                 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: [
                  {
                      label: 'Facturas canceladas ',
                      backgroundColor: '#03072.0',
                      borderColor: '#1E88E5',
                      data: [ this.facturascanceladastotales[0].enero,
                      this.facturascanceladastotales[0].febrero,
                      this.facturascanceladastotales[0].marzo,
                      this.facturascanceladastotales[0].abril,
                      this.facturascanceladastotales[0].mayo,
                      this.facturascanceladastotales[0].junio,
                      this.facturascanceladastotales[0].julio,
                      this.facturascanceladastotales[0].agosto,
                      this.facturascanceladastotales[0].septiembre,
                      this.facturascanceladastotales[0].octubre,
                      this.facturascanceladastotales[0].noviembre,
                      this.facturascanceladastotales[0].diciembre,
                             ]
                  }
                  ]
       };
    } );
    this._dashboardservice.getComisionPagoSofom(2).subscribe( resp => { this.comisionPagoSofom = resp; this.porcentajecomision = this.comisionPagoSofom[0].porcentaje_comision;
                                                                        this.data3 = {
labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
datasets: [
{
label: 'Comision ',
backgroundColor: '#03072.0',
borderColor: '#1E88E5',
data: [ this.facturascanceladastotales[0].comision_enero,
this.comisionPagoSofom[0].comision_febrero,
this.comisionPagoSofom[0].comision_marzo,
this.comisionPagoSofom[0].comision_abril,
this.comisionPagoSofom[0].comision_mayo,
this.comisionPagoSofom[0].comision_junio,
this.comisionPagoSofom[0].comision_julio,
this.comisionPagoSofom[0].comision_agosto,
this.comisionPagoSofom[0].comision_septiembre,
this.comisionPagoSofom[0].comision_octubre,
this.comisionPagoSofom[0].comision_noviembre,
this.comisionPagoSofom[0].comision_diciembre,
]
}
]
};
} );
    }
    ////////////////////////////////////////////////////////////////////

    // DASHBOARD SUPLIER ////////////////////////////////////////////////
    if (this.suplierdash) {
      console.log('carga Suplier');
      this._dashboardservice.getFacturasNoDescontadas(4).subscribe( resp => { this.facturasnodescontadas = resp; } );
      this._dashboardservice.getFacturasDescontadas(4).subscribe( resp => { this.facturasdescontadassuplier = resp; } );
      this._dashboardservice.getFacturasDescontadasMes(4).subscribe( resp => { this.facturasdescontadasmes = resp; } );
      this._dashboardservice.getImporteFacturas(4).subscribe( resp => { this.importefacturas = resp; } );
    }
    ////////////////////////////////////////////////////////////////////
*/
  }

  facturas_no_descontadas() {
    this.fileName = 'FacturasNoDescontadas.xlsx';
    /* table id is passed over here */
    const element = document.getElementById('facturasnodescontadas');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, this.fileName);
 }

 facturas_descontadas() {
  this.fileName = 'FacturasDescontadas.xlsx';
  /* table id is passed over here */
  const element = document.getElementById('facturasdescontadas');
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
  /* generate workbook and add the worksheet */
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  /* save to file */
  XLSX.writeFile(wb, this.fileName);
}

descuentos_e_intereses_del_mes() {
  this.fileName = 'DescuentoseInteresesDelMes.xlsx';
  /* table id is passed over here */
  const element = document.getElementById('descuentoseinteresesdelmes');
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
  /* generate workbook and add the worksheet */
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  /* save to file */
  XLSX.writeFile(wb, this.fileName);
}

descuentos_totales() {
  this.fileName = 'DescuentosTotales.xlsx';
  /* table id is passed over here */
  const element = document.getElementById('descuentostotales');
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
  /* generate workbook and add the worksheet */
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  /* save to file */
  XLSX.writeFile(wb, this.fileName);
}

siguientes_pagos() {
  this.fileName = 'SiguientesPagos.xlsx';
  /* table id is passed over here */
  const element = document.getElementById('siguientespagos');
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
  /* generate workbook and add the worksheet */
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  /* save to file */
  XLSX.writeFile(wb, this.fileName);
}

porcentaje_de_descuento() {
  this.fileName = 'PorcentajeDeDescuento.xlsx';
  /* table id is passed over here */
  const element = document.getElementById('porcentajededescuento');
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
  /* generate workbook and add the worksheet */
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  /* save to file */
  XLSX.writeFile(wb, this.fileName);
}

facturas_canceladas() {
  this.fileName = 'FacturasCanceladas.xlsx';
  /* table id is passed over here */
  const element = document.getElementById('facturascanceladas');
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
  /* generate workbook and add the worksheet */
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  /* save to file */
  XLSX.writeFile(wb, this.fileName);
}

facturas_descontadas_vs_no_descontadas() {
  this.fileName = 'FacturasDescontadasVsNoDescontadas.xlsx';
  /* table id is passed over here */
  const element = document.getElementById('facturasdescontadasvsnodescontadas');
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
  /* generate workbook and add the worksheet */
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  /* save to file */
  XLSX.writeFile(wb, this.fileName);
}

porcentaje_de_descuento_sofom() {
  this.fileName = 'PorcentajeDeDescuento.xlsx';
  /* table id is passed over here */
  const element = document.getElementById('porcentajededescuentosofom');
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
  /* generate workbook and add the worksheet */
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  /* save to file */
  XLSX.writeFile(wb, this.fileName);
}

afiliados() {
  this.fileName = 'Afiliados.xlsx';
  /* table id is passed over here */
  const element = document.getElementById('afiliados');
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
  /* generate workbook and add the worksheet */
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  /* save to file */
  XLSX.writeFile(wb, this.fileName);
}
}
