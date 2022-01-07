import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { SidebarService, UsuarioService, OptionsService } from '../../services/service.index';
import swal2 from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  // PARA LOS MENUS
  mennu: any[];
  mennnu: any[] = [];
  catalogos: any = [];
  contribuyentes: any = [];
  configuracion: any = [];
  solicitudes: any = [];
  reportes: any = [];
  pagos: any = [];
  facturas: any = [];
  funders: any = [];

  menu: any[];
  banderacontribuyentes = false;
  idopciones: any[] = [];
  contadores: any[] = [];
  subscription: Subscription;

  // CONTADORES DE SUBMENUS
  contadorcatalogos = 0;
  contadorcontribuyentes = 0;
  contadorconfiguracion = 0;
  contadorsolicitudes = 0;
  contadorreportes = 0;
  contadorpagos = 0;
  contadorfacturas = 0;
  contadorfunders = 0;

  np = 0;

  constructor(

    public _sidebar: SidebarService,
    public _usuarioService: UsuarioService,
    public _options: OptionsService

  ) {

    // INICIALIZA CONTADORES
    this.contadorcatalogos = 0;
    this.contadorcontribuyentes = 0;
    this.contadorconfiguracion = 0;
    this.contadorsolicitudes = 0;
    this.contadorreportes = 0;
    this.contadorpagos = 0;
    this.contadorfacturas = 0;
    this.contadorfunders = 0;

    // INICIALIZA OBJETOS
    this.catalogos = {
    titulo: 'CatálogosNO',
    icono: 'fa fa-file',
    submenu: []
  };
    this.contribuyentes = {
    titulo: 'ContribuyenteNO',
    icono: 'fa fa-user-o',
    submenu: []
  };
    this.configuracion = {
    titulo: 'ConfiguraciónNO',
    icono: 'fa fa-gears',
    submenu: []
  };
    this.solicitudes = {
    titulo: 'SolicitudesNO',
    icono: 'fa fa-file-text',
    submenu: []
  };
    this.reportes = {
    titulo: 'ReportesNO',
    icono: 'fa fa-folder',
    submenu: []
  };
    this.pagos = {
    titulo: 'PagosNO',
    icono: 'fa fa-dollar',
    submenu: []
  };
    this.facturas = {
    titulo: 'FacturasNO',
    icono: 'fa fa-file',
    submenu: []
  };
    this.funders = {
    titulo: 'FondeadoresNO',
    icono: 'fa fa-bank',
    submenu: []
  };
  }

  ngOnInit() {

    // localStorage.getItem('id');
    swal2.showLoading();
    this.subscription =
    this._options.getOptionsxUsuario(localStorage.getItem('id')).subscribe( resp => {
                                                               // tslint:disable-next-line: forin
                                                               for ( const prop in resp ) {
                                                                if ( resp[prop].grupo === 'CATÁLOGOS' ) {
                                                                  this.catalogos.titulo = 'Catálogos';
                                                                  this.catalogos.submenu[this.contadorcatalogos] = { titulo: resp[prop].nombre, url: resp[prop].url };
                                                                  this.contadorcatalogos = this.contadorcatalogos + 1;
                                                                }
                                                                if (resp[prop].grupo === 'CONTRIBUYENTES') {
                                                                  this.contribuyentes.titulo = 'Contribuyente';
                                                                  this.contribuyentes.submenu[this.contadorcontribuyentes] = { titulo: resp[prop].nombre, url: resp[prop].url };
                                                                  this.contadorcontribuyentes = this.contadorcontribuyentes + 1;
                                                                }
                                                                if (resp[prop].grupo === 'CONFIGURACIÓN') {
                                                                  this.configuracion.titulo = 'Configuración';
                                                                  this.configuracion.submenu[this.contadorconfiguracion] = { titulo: resp[prop].nombre, url: resp[prop].url };
                                                                  this.contadorconfiguracion = this.contadorconfiguracion + 1;
                                                                }
                                                                if (resp[prop].grupo === 'SOLICITUDES') {
                                                                  this.solicitudes.titulo = 'Solicitudes';
                                                                  this.solicitudes.submenu[this.contadorsolicitudes] = { titulo: resp[prop].nombre, url: resp[prop].url };
                                                                  this.contadorsolicitudes = this.contadorsolicitudes + 1;
                                                                }
                                                                if (resp[prop].grupo === 'REPORTES') {
                                                                  this.reportes.titulo = 'Reportes';
                                                                  this.reportes.submenu[this.contadorreportes] = { titulo: resp[prop].nombre, url: resp[prop].url };
                                                                  this.contadorreportes = this.contadorreportes + 1;
                                                                }
                                                                if (resp[prop].grupo === 'PAGOS') {
                                                                  this.pagos.titulo = 'Pagos';
                                                                  this.pagos.submenu[this.contadorpagos] = { titulo: resp[prop].nombre, url: resp[prop].url };
                                                                  this.contadorpagos = this.contadorpagos + 1;
                                                                }
                                                                if (resp[prop].grupo === 'FACTURAS') {
                                                                  this.facturas.titulo = 'Facturas';
                                                                  this.facturas.submenu[this.contadorfacturas] = { titulo: resp[prop].nombre, url: resp[prop].url };
                                                                  this.contadorfacturas = this.contadorfacturas + 1;
                                                                }
                                                                if (resp[prop].grupo === 'FUNDERS') {
                                                                  this.funders.titulo = 'Fondeadores';
                                                                  this.funders.submenu[this.contadorfunders] = { titulo: resp[prop].nombre, url: resp[prop].url };
                                                                  this.contadorfunders = this.contadorfunders + 1;
                                                                }
                                                              }

                                                               if (this.mennu[0].titulo === 'CatálogosNO') {
                                                                this.mennnu.push(0);
                                                              }
                                                               if (this.mennu[1].titulo === 'ContribuyenteNO') {
                                                                this.mennnu.push(1);
                                                              }
                                                               if (this.mennu[2].titulo === 'ConfiguraciónNO') {
                                                                this.mennnu.push(2);
                                                              }
                                                               if (this.mennu[3].titulo === 'SolicitudesNO') {
                                                                this.mennnu.push(3);
                                                              }
                                                               if (this.mennu[4].titulo === 'ReportesNO') {
                                                                this.mennnu.push(4);
                                                              }
                                                               if (this.mennu[5].titulo === 'PagosNO') {
                                                                this.mennnu.push(5);
                                                              }
                                                               if (this.mennu[6].titulo === 'FacturasNO') {
                                                                this.mennnu.push(6);
                                                              }
                                                               if (this.mennu[7].titulo === 'FondeadoresNO') {
                                                                this.mennnu.push(7);
                                                              }
                                                               this.mennnu.sort().reverse();

                                                              // tslint:disable-next-line: forin
                                                               for (const i in this.mennnu) {
                                                                this.mennu.splice(this.mennnu[i], 1 );
                                                            }
                                                               swal2.close();
    } );
    this.mennu = [
      this.catalogos,
      this.contribuyentes,
      this.configuracion,
      this.solicitudes,
      this.reportes,
      this.pagos,
      this.facturas,
      this.funders
    ];
  }

  generaMenu() {

    this.mennu = [
      this.catalogos,
      this.contribuyentes,
      this.configuracion,
      this.solicitudes,
      this.reportes,
      this.pagos,
      this.facturas,
      this.funders
    ];

  }

}
