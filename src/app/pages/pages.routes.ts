import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { LoginGuardGuard, AltaFacturasGuard, RolesGuard, UserOptionsGuard, VerUsuariosGuard, PrivilegiosUsuariosGuard,
         ParametrosGuard, OptionsGuard, UsuariosCadenasGuard, ListasGuard, RolesOptionsGuard, AltaContribuyentesGuard,
         MantenimientoContribuyentesGuard, AltaSolicitudesGuard, EstatusSolicitudesGuard, ReporteFacturasGuard,
         ReporteDiarioGuard, ReporteBancosGuard, ReportePagosCompanyGuard, ReporteFacturasDetallesGuard, ReporteSolicitudesGuard,
         ReporteSolicitudesDetallesGuard, ReportecfdisGuard, ReporteDirectorGuard, ReporteSolicitudesFondeoGuard,
         ProyectosProveedoresGuard, PagosProveedorGuard, PagosCadenaGuard, TarifasGuard, AltacypGuard, UsuariosProveedoresGuard,
         ContribuyentesFundersGuard, SolicituddeFondeoGuard, PagosafinancieraGuard, PagosafondeadorGuard } from '../services/service.index';
// Generales
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { RxjsComponent } from './rxjs/rxjs.component';
// Usuarios
import { CrearUsuarioComponent } from './usuarios/crearusuario.component';
import { VerUsuariosComponent } from './usuarios/verusuarios.component';
import { AccoutSettingsComponent } from './accout-settings/accout-settings.component';
import { EditarUsuarioComponent } from './usuarios/editarusuario.component';
// Privilegios Usuarios
import { PrivilegiosUsuariosComponent } from './privilegiosusuarios/privilegiosusuarios.component';
import { PrivilegioUsuarioComponent } from './privilegiosusuarios/privilegiousuario.component';
import { CrearPrivilegioComponent } from './privilegiosusuarios/crearprivilegio.component';
import { ActualizaPrivilegioComponent } from './privilegiosusuarios/actualizaprivilegio.component';
// Roles
import { RolesComponent } from './roles/roles.component';
import { CrearRolComponent } from './roles/crearrol.component';
import { ActualizaRolComponent } from './roles/actualizarol.component';
// Parametros Generales
import { ParametrosComponent } from './parametrosgenerales/parametros.component';
import { CreaParametroComponent } from './parametrosgenerales/creaparametro.component';
import { ActualizaParametroComponent } from './parametrosgenerales/actualizaparametro.component';
// Options
import { OptionsComponent } from './options/options.component';
import { CreaOptionComponent } from './options/creaoption.component';
import { ActualizaOptionComponent } from './options/actualizaoption.component';
// User Options
import { UsuariosOptionsComponent } from './userOptions/usuariosoptions.component';
import { AsignaOptionsComponent } from './userOptions/asignaoptions.component';
// Listas
import { ListasComponent } from './listas/listas.component';
import { CreaListaComponent } from './listas/crealista.component';
import { ActualizaListaComponent } from './listas/actualizalista.component';
// Role Options
import { RolesOptionsComponent } from './roleOptions/rolesoptions.component';
import { AsignaOptionsRolesComponent } from './roleOptions/asignaoptionsroles.component';
// Alta contribuyentes
import { AltacontribuyentesComponent } from './altacontribuyentes/altacontribuyentes.component';
// Mantenimiento Contribuyentes
import { MantcontribuyentesComponent } from './mantenimientocontribuyentes/mantcontribuyentes.component';
import { MantenimientoContComponent } from './mantenimientocontribuyentes/mantenimientocont.component';
import { ContribuyenteMantComponent } from './mantenimientocontribuyentes/contribuyentemant.component';
// Alta Solicitudes
import { AltaSolicitudesComponent } from './alta solicitudes/altasolicitudes.component';
// Estatus Solicitudes
import { EstatusSolicitudesComponent } from './estatussolicitudes/estatussolicitudes.component';
// Reportes
import { FacturasComponent } from './reportes/facturas.component';
import { DailyoperationsComponent } from './reportes/dailyoperations.component';
import { LayoutBanorteComponent } from './reportes/layoutbanorte.component';
import { PagosCompanyComponent } from './reportes/pagoscompany.component';
import { FacturasDetallesComponent } from './reportes/facturasdetalles.component';
import { FacturaDetalleComponent } from './reportes/facturadetalle.component';
import { ReporteSolicitudesComponent } from './reportes/reportesolicitudes.component';
import { ReporteSolicitudesDetallesComponent } from './reportes/reportesolicitudesdetalles.component';
import { DirectorReportComponent } from './reportes/directorreport.component';
import { CfdisComponent } from './reportes/cfdis.component';
import { SuplierProjectsComponent } from './suplierproject/suplierprojects.component';
import { MuestraSuplierProjectsComponent } from './suplierproject/muestrasuplierprojects.component';
import { ReporteSolicitudesFondeoComponent } from './reportes/reportesolicitudesfondeo.component';
// Pagos
import { AproveedorComponent } from './pagos/aproveedor.component';
import { DeCadenaComponent } from './pagos/decadena.component';
import { ReporteSolicitudDetalleComponent } from './reportes/reportesolicituddetalle.component';
// Tarifas
import { TarifasComponent } from './tarifas/tarifas.component';
import { ActualizaTarifaComponent } from './tarifas/actualizatarifa.component';
import { CreaTarifaComponent } from './tarifas/creatarifa.component';
 // Alta cadenas y proveedores
import { AltaCyPComponent } from './altacyp/altacyp.component';
import { ActualizaCadenaComponent } from './altacyp/actualizacadena.component';
import { CreaCadenaComponent } from './altacyp/creacadena.component';
import { CreaProveedorComponent } from './altacyp/creaproveedor.component';
import { ActualizaProveedorComponent } from './altacyp/actualizaproveedor.component';
import { SegmentosCadenaComponent } from './altacyp/segmentoscadena.component';
import { CreaSegmentoCadenaComponent } from './altacyp/creasegmentocadena.component';
import { EditaSegmentoCadenaComponent } from './altacyp/editasegmentocadena.component';
import { ClientesCadenaComponent } from './altacyp/clientesscadena.component';
import { EditaClienteCadenaComponent } from './altacyp/editaclientecadena.component';
// Facturas
import { AltaFacturasComponent } from './facturas/altafacturas.component';
// Usuarios Proveedores
import { UsuariosProveedoresComponent } from './userSupliers/usuariosproveedores.component';
import { AsignarProveedorComponent } from './userSupliers/asignarproveedor.component';
// User Company
import { UsuariosCadenasComponent } from './userCompany/usuarioscadenas.component';
import { AsignarCadenaComponent } from './userCompany/asignarcadena.component';
// Bancos
import { BancosComponent } from './reportes/bancos/bancos.component';
import { BanorteComponent } from './reportes/bancos/banorte.component';
import { BanregioComponent } from './reportes/bancos/banregio.component';
import { BaseComponent } from './reportes/bancos/base.component';
import { BancreaComponent } from './reportes/bancos/bancrea.component';
import { CesionderechosComponent } from './cesionderechos/cesionderechos.component';
// Funders
import { ContribuyentesfundersComponent } from './funders/funder/contribuyentesfunders.component';
import { CreaFunderComponent } from './funders/funder/creafunder.component';
import { ActualizaFunderComponent } from './funders/funder/actualizafunder.component';
import { CreaCreditlineComponent } from './funders/creditline/creacreditline.component';
import { SolicitudDeFondeoComponent } from './funders/solicituddefondeo/solicituddefondeo.component';
import { AfinancieraComponent } from './funders/pagos/afinanciera.component';
import { AfondeadorComponent } from './funders/pagos/afondeador.component';



const pagesRoutes: Routes = [
    {
        path: '',
        component: PagesComponent, 
        canActivate: [ LoginGuardGuard ],
        children: [
            // Generales
            { path: 'dashboard', component: DashboardComponent, data: { titulo: 'Dashboard' } },
            { path: 'progress', component: ProgressComponent, data: { titulo: 'ProgressBars' } },
            { path: 'graficas1', component: Graficas1Component, data: { titulo: 'Gráficas' } },
            { path: 'rxjs', component: RxjsComponent, data: { titulo: 'RxJs' } },
            // Usuarios
            { path: 'crearusuario', component: CrearUsuarioComponent,       data: { titulo: 'Crear Usuario' },      canActivate: [VerUsuariosGuard] },
            { path: 'verusuarios', component: VerUsuariosComponent,         data: { titulo: 'Usuarios' },           canActivate: [VerUsuariosGuard] },
            { path: 'account-settings', component: AccoutSettingsComponent, data: { titulo: 'Ajustes de Usuario' } },
            { path: 'editarusuario/:id', component: EditarUsuarioComponent, data: { titulo: 'Editar Usuario' },     canActivate: [VerUsuariosGuard] },
            // Privilegios Usuarios
            { path: 'privilegiosusuarios', component: PrivilegiosUsuariosComponent,                                                data: { titulo: 'Privilegios Usuarios' },   canActivate: [PrivilegiosUsuariosGuard] },
            { path: 'privilegiosusuarios/privilegiousuario/:id', component: PrivilegioUsuarioComponent,                            data: { titulo: 'Privilegios de Usuario' }, canActivate: [PrivilegiosUsuariosGuard] },
            { path: 'privilegiousuarios/privilegiousuario/crearprivilegio/:id', component: CrearPrivilegioComponent,               data: { titulo: 'Crear Privilegio' },       canActivate: [PrivilegiosUsuariosGuard] },
            { path: 'privilegiousuarios/privilegiousuario/actualizaprivilegio/:idu/:idp', component: ActualizaPrivilegioComponent, data: { titulo: 'Actualiza Privilegio' },   canActivate: [PrivilegiosUsuariosGuard] },
            // Roles
            { path: 'roles', component: RolesComponent,                         data: { titulo: 'Roles' },         canActivate: [RolesGuard] },
            { path: 'roles/crearrol', component: CrearRolComponent,             data: { titulo: 'Crear Rol' },     canActivate: [RolesGuard] },
            { path: 'roles/actualizarol/:id', component: ActualizaRolComponent, data: { titulo: 'Actualiza Rol' }, canActivate: [RolesGuard] },
            // Parametros Generales
            { path: 'parametros', component: ParametrosComponent,                                 data: { titulo: 'Parametros Generales' },         canActivate: [ParametrosGuard] },
            { path: 'parametros/creaparametro', component: CreaParametroComponent,                data: { titulo: 'Crear Parametro General' },      canActivate: [ParametrosGuard] },
            { path: 'parametros/actualizarparametro/:id', component: ActualizaParametroComponent, data: { titulo: 'Actualizar Parametro General' }, canActivate: [ParametrosGuard] },
            // Options
            { path: 'options', component: OptionsComponent,                             data: { titulo: 'Opciones' },          canActivate: [OptionsGuard] },
            { path: 'options/creaoption', component: CreaOptionComponent,               data: { titulo: 'Crear Opcion' },      canActivate: [OptionsGuard] },
            { path: 'options/actualizaoption/:id', component: ActualizaOptionComponent, data: { titulo: 'Actualizar Opcion' }, canActivate: [OptionsGuard] },
            // User Options
            { path: 'usuariosoptions', component: UsuariosOptionsComponent,                  data: { titulo: 'Usuarios Opciones' },          canActivate: [UserOptionsGuard] },
            { path: 'usuariosoptions/asignaroptions/:id', component: AsignaOptionsComponent, data: { titulo: 'Asignar Opciones a Usuario' }, canActivate: [UserOptionsGuard] },
            // User Company
            { path: 'usuarioscadenas', component: UsuariosCadenasComponent,                 data: { titulo: 'Usuarios Cadenas' },          canActivate: [UsuariosCadenasGuard] },
            { path: 'usuarioscadenas/asignarcadena/:id', component: AsignarCadenaComponent, data: { titulo: 'Asignar Cadenas a Usuario' }, canActivate: [UsuariosCadenasGuard] },
            // Listas
            { path: 'listas', component: ListasComponent,                            data: { titulo: 'Listas' },           canActivate: [ListasGuard] },
            { path: 'listas/crealista', component: CreaListaComponent,               data: { titulo: 'Crear Lista' },      canActivate: [ListasGuard] },
            { path: 'listas/actualizalista/:id', component: ActualizaListaComponent, data: { titulo: 'Actualizar Lista' }, canActivate: [ListasGuard] },
            // role Options
            { path: 'rolesoptions', component: RolesOptionsComponent,                              data: { titulo: 'Roles Opciones' },      canActivate: [RolesOptionsGuard] },
            { path: 'rolesoptions/asignaoptionsroles/:id', component: AsignaOptionsRolesComponent, data: { titulo: 'Asigna Opciones Rol' }, canActivate: [RolesOptionsGuard] },
            // Alta contribuyentes
            { path: 'altacontribuyentes', component: AltacontribuyentesComponent, data: { titulo: 'Alta de contribuyentes' }, canActivate: [AltaContribuyentesGuard] },
            // Mantenimiento Contribuyentes
            { path: 'mantenimientocontribuyentes', component: MantenimientoContComponent,                       data: { titulo: 'Mantenimiento Contribuyentes' }, canActivate: [MantenimientoContribuyentesGuard] },
            { path: 'mantenimientocontribuyentes/contribuyentemant/:id', component: ContribuyenteMantComponent, data: { titulo: 'Mantenimiento Contribuyente' },  canActivate: [MantenimientoContribuyentesGuard] },
            // Alta solicitudes
            { path: 'altasolicitudes', component: AltaSolicitudesComponent, data: { titulo: 'Alta Solicitudes' }, canActivate: [AltaSolicitudesGuard] },
            // Estatus Solicitudes
            { path: 'estatussolicitudes', component: EstatusSolicitudesComponent, data: { titulo: 'Flujo de solicitudes' }, canActivate: [EstatusSolicitudesGuard] },
            // Reportes
            { path: 'reportefacturas', component: FacturasComponent, data: { titulo: 'Reporte General de Facturas' }, canActivate: [ReporteFacturasGuard] },
            { path: 'reportediario', component: DailyoperationsComponent, data: { titulo: 'Reporte Diario' }, canActivate: [ReporteDiarioGuard] },
            { path: 'banorte', component: LayoutBanorteComponent, data: { titulo: 'Layout Banorte' } },
            { path: 'pagoscompany', component: PagosCompanyComponent, data: { titulo: 'Pagos Cadena' }, canActivate: [ReportePagosCompanyGuard] },
            { path: 'facturasdetalles', component: FacturasDetallesComponent, data: { titulo: 'Detalles de Facturas' }, canActivate: [ReporteFacturasDetallesGuard] },
            { path: 'facturasdetalles/facturadetalle/:id', component: FacturaDetalleComponent, data: { titulo: 'Detalles de Factura' }, canActivate: [ReporteFacturasDetallesGuard] },
            { path: 'reportesolicitudes', component: ReporteSolicitudesComponent, data: { titulo: 'Solicitudes' }, canActivate: [ReporteSolicitudesGuard] },
            { path: 'reportesolicitudesdetalles', component: ReporteSolicitudesDetallesComponent, data: { titulo: 'Detalles de Solicitudes' }, canActivate: [ReporteSolicitudesDetallesGuard] },
            { path: 'reportesolicitudesdetalles/reportesolicituddetalle/:id', component: ReporteSolicitudDetalleComponent, data: { titulo: 'Detalles de Solicitud' }, canActivate: [ReporteSolicitudesDetallesGuard] },
            { path: 'cfdis', component: CfdisComponent, data: { titulo: 'Reporte CFDI´s' }, canActivate: [ReportecfdisGuard] },
            { path: 'directorreport', component: DirectorReportComponent, data: { titulo: 'Reporte Director' }, canActivate: [ReporteDirectorGuard] },
            { path: 'reportesolicitudesfondeo', component: ReporteSolicitudesFondeoComponent, data: { titulo: 'Solicitudes Fondeo' }, canActivate: [ReporteSolicitudesFondeoGuard] },
            // Proyectos Proveedores
            { path: 'proyectosproveedores', component: SuplierProjectsComponent,                                                data: { titulo: 'Proyectos proveedores' }, canActivate: [ProyectosProveedoresGuard] },
            { path: 'proyectosproveedores/muestrasuplierprojects/:id/:idc/:nombre', component: MuestraSuplierProjectsComponent, data: { titulo: 'Proyectos proveedores' }, canActivate: [ProyectosProveedoresGuard] },
            // Pagos
            { path : 'pagos/aproveedor', component: AproveedorComponent, data: { titulo: 'Pago a Proveedor' }, canActivate: [PagosProveedorGuard] },
            { path : 'pagos/decadena', component: DeCadenaComponent, data: { titulo: 'Pago de Cadena' }, canActivate: [PagosCadenaGuard] },
            // Tarifas
            { path : 'tarifas', component: TarifasComponent,                             data: { titulo: 'Tarifas' },          canActivate: [TarifasGuard] },
            { path : 'tarifas/actualizatarifa/:id', component: ActualizaTarifaComponent, data: { titulo: 'Actualiza Tarifa' }, canActivate: [TarifasGuard] },
            { path : 'tarifas/creatarifa', component: CreaTarifaComponent,               data: { titulo: 'Crea Tarifa' },      canActivate: [TarifasGuard] },
            // Alta cadenas y proveedores
            { path : 'altacyp', component: AltaCyPComponent,                                                     data: { titulo: 'Alta Cadenas y proveedores' }, canActivate: [AltacypGuard] },
            { path : 'altacyp/actualizacadena/:id', component: ActualizaCadenaComponent,                         data: { titulo: 'Actualiza Cadena' },           canActivate: [AltacypGuard] },
            { path : 'altacyp/actualizaproveedor/:id', component: ActualizaProveedorComponent,                   data: { titulo: 'Actualiza Proveedor' },        canActivate: [AltacypGuard] },
            { path : 'altacyp/creacadena/:id', component: CreaCadenaComponent,                                   data: { titulo: 'Crea Cadena' },                canActivate: [AltacypGuard] },
            { path : 'altacyp/creaproveedor/:id', component: CreaProveedorComponent,                             data: { titulo: 'Crea Proveedor' },             canActivate: [AltacypGuard] },
            { path : 'altacyp/actualizacadena/segmentoscadena/:nombre/:id', component: SegmentosCadenaComponent, data: { titulo: 'Segmentos' },                  canActivate: [AltacypGuard] },
            { path : 'altacyp/actualizacadena/segmentoscadena/creasegmentocadena/:nombre/:id', component: CreaSegmentoCadenaComponent, data: { titulo: 'Crea Segmento' },       canActivate: [AltacypGuard] },
            { path : 'altacyp/actualizacadena/segmentoscadena/editasegmentocadena/:nombre/:idc/:ids', component: EditaSegmentoCadenaComponent, data: { titulo: 'Edita Segmento' },       canActivate: [AltacypGuard] },
            { path : 'altacyp/actualizacadena/segmentoscadena/clientescadena/:nombre/:idc/:ids', component: ClientesCadenaComponent, data: { titulo: 'Clientes Cadena' },       canActivate: [AltacypGuard] },
            { path : 'altacyp/actualizacadena/segmentoscadena/clientescadena/editaclientecadena/:nombre/:idcadena/:idcliente', component: EditaClienteCadenaComponent, data: { titulo: 'Edita Cliente Cadena' },       canActivate: [AltacypGuard] },
            // Facturas
            { path : 'altafacturas', component: AltaFacturasComponent, data: { titulo: 'Alta Facturas' }, canActivate: [AltaFacturasGuard] },
            // Usuarios Proveedores
            { path : 'usuariosproveedores', component: UsuariosProveedoresComponent,                   data: { titulo: 'Usuarios Proveedores' }, canActivate: [UsuariosProveedoresGuard] },
            { path : 'usuariosproveedores/asignarproveedor/:id', component: AsignarProveedorComponent, data: { titulo: 'Asigna proveedor' },     canActivate: [UsuariosProveedoresGuard] },
            // Bancos
            { path : 'bancos', component: BancosComponent,            data: { titulo: 'Bancos' },          canActivate: [ReporteBancosGuard] },
            { path : 'bancos/banorte', component: BanorteComponent,   data: { titulo: 'Layout Banorte' },  canActivate: [ReporteBancosGuard] },
            { path : 'bancos/banregio', component: BanregioComponent, data: { titulo: 'Layout Banregio' }, canActivate: [ReporteBancosGuard] },
            { path : 'bancos/base', component: BaseComponent,         data: { titulo: 'Layout Base' },     canActivate: [ReporteBancosGuard] },
            { path : 'bancos/bancrea', component: BancreaComponent,   data: { titulo: 'Layout Bancrea' },  canActivate: [ReporteBancosGuard] },
            // Cesion de derechos
            { path : 'cesionderechos', component: CesionderechosComponent, data: { titulo: 'Cesion derechos' } },
            // funders
            { path : 'contribuyentesfunders', component: ContribuyentesfundersComponent, data: { titulo: 'Funders' }, canActivate: [ContribuyentesFundersGuard] },
            { path : 'contribuyentesfunders/creafunder/:id', component: CreaFunderComponent, data: { titulo: 'Crea Funder' }, canActivate: [ContribuyentesFundersGuard] },
            { path : 'contribuyentesfunders/actualizafunder/:id', component: ActualizaFunderComponent, data: { titulo: 'Actualiza Funder' }, canActivate: [ContribuyentesFundersGuard] },
            { path : 'contribuyentesfunders/actualizafunder/creacreditline/:id', component: CreaCreditlineComponent, data: { titulo: 'Crea linea de credito' }, canActivate: [ContribuyentesFundersGuard] },
            { path : 'solicituddefondeo', component: SolicitudDeFondeoComponent, data: { titulo: 'Solicitud de Fondeo' }, canActivate: [SolicituddeFondeoGuard] },
            { path : 'pagos/afinanciera', component: AfinancieraComponent, data: { titulo: 'Pago a Financiera' }, canActivate: [PagosafinancieraGuard] },
            { path : 'pagos/afondeador', component: AfondeadorComponent, data: { titulo: 'Pago a Fondeador' }, canActivate: [PagosafondeadorGuard] },
            { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
        ]
    }
];


export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
