import { Injectable } from '@angular/core';
import { OptionsService } from '../options/options.service';

@Injectable()
export class SidebarService {


  useroptions = localStorage.getItem('user_options');

  menu: any = [
    {
      titulo: 'Catalogos',
      icono: 'fa fa-file',
      submenu: [

        { titulo : 'Usuarios', url: '/verusuarios' },
        { titulo : 'Privilegios Usuarios', url: '/privilegiosusuarios' },
        { titulo : 'Roles', url: '/roles' },
        { titulo : 'Roles opciones', url: '/rolesoptions' },
        { titulo : 'Parametros Generales', url: '/parametros'  },
        { titulo : 'Opciones', url: '/options' },
        { titulo : 'Listas', url: '/listas' },
        { titulo : 'Opciones Usuarios', url: '/usuariosoptions' },

      ]
    },
    {
      titulo: 'Contribuyente',
      icono: 'fa fa-user-o',
      submenu: [

        { titulo : 'Alta', url: '/altacontribuyentes' },
        { titulo : 'Mantenimiento', url: '/mantenimientocontribuyentes' }

      ]
    },
    {
      titulo: 'Solicitudes',
      icono: 'fa fa-file-text',
      submenu: [

        { titulo : 'Alta', url: '/altasolicitudes' },
        { titulo : 'Estatus', url: '/estatussolicitudes' }
      ]
    },
    {
      titulo: 'Reportes',
      icono: 'fa fa-folder',
      submenu: [

        { titulo : 'Facturas', url: '/reportefacturas' },
        { titulo : 'Reporte Diario', url: '/reportediario' },
        { titulo : 'Layout Banorte', url: '/banorte' },
        { titulo : 'Pagos Cadena', url: '/pagoscompany' }
      ]
    },
    {
      titulo: 'Pagos',
      icono: 'fa fa-dollar',
      submenu: [

        { titulo : 'A proveedor', url: '/pagos/aproveedor' },
        { titulo : 'De Cadena', url: '/pagos/decadena' }
      ]
    }
  ];

  // menu2: any = [
  //  {
  //    titulo: 'Dashboard',
  //    icono: 'mdi mdi-view-dashboard',
  //    url: '/dashboard'
  //  }
  //  ];

  constructor( public _options: OptionsService ) {

   }



}
