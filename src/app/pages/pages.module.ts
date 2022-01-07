
import { NgModule } from '@angular/core';
import { PAGES_ROUTES } from './pages.routes';

import { SharedModule } from '../shared/shared.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {TableModule} from 'primeng/table';

import {InputTextareaModule} from 'primeng/inputtextarea';

import {MultiSelectModule} from 'primeng/multiselect';

import {BreadcrumbModule} from 'primeng/breadcrumb';
import {DialogModule, Dialog} from 'primeng/dialog';
import { MatSliderModule } from '@angular/material/slider';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';


// ng2-charts
import { ChartsModule } from 'ng2-charts';
import {ChartModule} from 'primeng/chart';

import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../../environments/environment';


import {FileUploadModule} from 'primeng/fileupload';

import { PagesComponent } from './pages.component';

import {TabViewModule} from 'primeng/tabview';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import { CommonModule } from '@angular/common';
import {PickListModule} from 'primeng/picklist';
import { IncrementadorComponent } from '../components/incrementador/incrementador.component';
import { GraficoDonaComponent } from '../components/grafico-dona/grafico-dona.component';
import { AccoutSettingsComponent } from './accout-settings/accout-settings.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { CrearUsuarioComponent } from './usuarios/crearusuario.component';
import { VerUsuariosComponent } from './usuarios/verusuarios.component';
import { EditarUsuarioComponent } from './usuarios/editarusuario.component';
import { DataTablesModule } from 'angular-datatables';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {InputSwitchModule} from 'primeng/inputswitch';
import { PipesModule } from '../pipes/pipes.module';
import { PrivilegiosUsuariosComponent } from './privilegiosusuarios/privilegiosusuarios.component';
import { PrivilegioUsuarioComponent } from './privilegiosusuarios/privilegiousuario.component';
import { CrearPrivilegioComponent } from './privilegiosusuarios/crearprivilegio.component';
import { ActualizaPrivilegioComponent } from './privilegiosusuarios/actualizaprivilegio.component';
import { RolesComponent } from './roles/roles.component';
import { CrearRolComponent } from './roles/crearrol.component';
import { ActualizaRolComponent } from './roles/actualizarol.component';
import { ParametrosComponent } from './parametrosgenerales/parametros.component';
import { CreaParametroComponent } from './parametrosgenerales/creaparametro.component';
import { ActualizaParametroComponent } from './parametrosgenerales/actualizaparametro.component';
import { OptionsComponent } from './options/options.component';
import { CreaOptionComponent } from './options/creaoption.component';
import { ActualizaOptionComponent } from './options/actualizaoption.component';
import { AsignaOptionsComponent } from './userOptions/asignaoptions.component';
import { UsuariosOptionsComponent } from './userOptions/usuariosoptions.component';
import { ListasComponent } from './listas/listas.component';
import { CreaListaComponent } from './listas/crealista.component';
import { RolesOptionsComponent } from './roleOptions/rolesoptions.component';
import { AsignaOptionsRolesComponent } from './roleOptions/asignaoptionsroles.component';
import { ActualizaListaComponent } from './listas/actualizalista.component';
import { AltacontribuyentesComponent } from './altacontribuyentes/altacontribuyentes.component';
import { MantcontribuyentesComponent } from './mantenimientocontribuyentes/mantcontribuyentes.component';
import { AltaSolicitudesComponent } from './alta solicitudes/altasolicitudes.component';
import { EstatusSolicitudesComponent } from './estatussolicitudes/estatussolicitudes.component';
import { FacturasComponent } from './reportes/facturas.component';
import { DailyoperationsComponent } from './reportes/dailyoperations.component';
import { LayoutBanorteComponent } from './reportes/layoutbanorte.component';
import { PagosCompanyComponent } from './reportes/pagoscompany.component';
import { AproveedorComponent } from './pagos/aproveedor.component';
import { DeCadenaComponent } from './pagos/decadena.component';
import { FacturasDetallesComponent } from './reportes/facturasdetalles.component';
import { FacturaDetalleComponent } from './reportes/facturadetalle.component';
import { ReporteSolicitudesComponent } from './reportes/reportesolicitudes.component';
import { ReporteSolicitudesDetallesComponent } from './reportes/reportesolicitudesdetalles.component';
import { ReporteSolicitudDetalleComponent } from './reportes/reportesolicituddetalle.component';
import { TarifasComponent } from './tarifas/tarifas.component';
import { ActualizaTarifaComponent } from './tarifas/actualizatarifa.component';
import { CreaTarifaComponent } from './tarifas/creatarifa.component';
import { AltaCyPComponent } from './altacyp/altacyp.component';
import { ActualizaCadenaComponent } from './altacyp/actualizacadena.component';
import { CreaCadenaComponent } from './altacyp/creacadena.component';
import { CreaProveedorComponent } from './altacyp/creaproveedor.component';
import { ActualizaProveedorComponent } from './altacyp/actualizaproveedor.component';
import { AltaFacturasComponent } from './facturas/altafacturas.component';
import { MantenimientoContComponent } from './mantenimientocontribuyentes/mantenimientocont.component';
import { ContribuyenteMantComponent } from './mantenimientocontribuyentes/contribuyentemant.component';
import { CfdisComponent } from './reportes/cfdis.component';
import { UsuariosProveedoresComponent } from './userSupliers/usuariosproveedores.component';
import { AsignarProveedorComponent } from './userSupliers/asignarproveedor.component';
import { DirectorReportComponent } from './reportes/directorreport.component';
import { SegmentosCadenaComponent } from './altacyp/segmentoscadena.component';
import { SuplierProjectsComponent } from './suplierproject/suplierprojects.component';
import { MuestraSuplierProjectsComponent } from './suplierproject/muestrasuplierprojects.component';
import { UsuariosCadenasComponent } from './userCompany/usuarioscadenas.component';
import { AsignarCadenaComponent } from './userCompany/asignarcadena.component';
import { BancosComponent } from './reportes/bancos/bancos.component';
import { BanorteComponent } from './reportes/bancos/banorte.component';
import { BanregioComponent } from './reportes/bancos/banregio.component';
import { BaseComponent } from './reportes/bancos/base.component';
import { BancreaComponent } from './reportes/bancos/bancrea.component';
import { CesionderechosComponent } from './cesionderechos/cesionderechos.component';
import { ContribuyentesfundersComponent } from './funders/funder/contribuyentesfunders.component';
import { CreaFunderComponent } from './funders/funder/creafunder.component';
import { ActualizaFunderComponent } from './funders/funder/actualizafunder.component';
import { CreaCreditlineComponent } from './funders/creditline/creacreditline.component';
import { SolicitudDeFondeoComponent } from './funders/solicituddefondeo/solicituddefondeo.component';
import { AfinancieraComponent } from './funders/pagos/afinanciera.component';
import { AfondeadorComponent } from './funders/pagos/afondeador.component';
import { ReporteSolicitudesFondeoComponent } from './reportes/reportesolicitudesfondeo.component';
import { CreaSegmentoCadenaComponent } from './altacyp/creasegmentocadena.component';
import { EditaSegmentoCadenaComponent } from './altacyp/editasegmentocadena.component';
import { ClientesCadenaComponent } from './altacyp/clientesscadena.component';
import { EditaClienteCadenaComponent } from './altacyp/editaclientecadena.component';


@NgModule({
    declarations: [
        PagesComponent,
        DashboardComponent,
        ProgressComponent,
        Graficas1Component,
        IncrementadorComponent,
        GraficoDonaComponent,
        AccoutSettingsComponent,
        RxjsComponent,
        CrearUsuarioComponent,
        VerUsuariosComponent,
        EditarUsuarioComponent,
        PrivilegiosUsuariosComponent,
        PrivilegioUsuarioComponent,
        CrearPrivilegioComponent,
        ActualizaPrivilegioComponent,
        RolesComponent,
        CrearRolComponent,
        ActualizaRolComponent,
        ParametrosComponent,
        CreaParametroComponent,
        ActualizaParametroComponent,
        OptionsComponent,
        CreaOptionComponent,
        ActualizaOptionComponent,
        AsignaOptionsComponent,
        UsuariosOptionsComponent,
        ListasComponent,
        CreaListaComponent,
        RolesOptionsComponent,
        AsignaOptionsRolesComponent,
        ActualizaListaComponent,
        AltacontribuyentesComponent,
        MantcontribuyentesComponent,
        AltaSolicitudesComponent,
        EstatusSolicitudesComponent,
        FacturasComponent,
        DailyoperationsComponent,
        LayoutBanorteComponent,
        PagosCompanyComponent,
        AproveedorComponent,
        DeCadenaComponent,
        FacturasDetallesComponent,
        FacturaDetalleComponent,
        ReporteSolicitudesComponent,
        ReporteSolicitudesDetallesComponent,
        ReporteSolicitudDetalleComponent,
        TarifasComponent,
        ActualizaTarifaComponent,
        CreaTarifaComponent,
        AltaCyPComponent,
        ActualizaCadenaComponent,
        ActualizaProveedorComponent,
        CreaCadenaComponent,
        CreaProveedorComponent,
        AltaFacturasComponent,
        MantenimientoContComponent,
        ContribuyenteMantComponent,
        CfdisComponent,
        UsuariosProveedoresComponent,
        AsignarProveedorComponent,
        UsuariosCadenasComponent,
        AsignarCadenaComponent,
        DirectorReportComponent,
        SegmentosCadenaComponent,
        CreaSegmentoCadenaComponent,
        EditaSegmentoCadenaComponent,
        SuplierProjectsComponent,
        MuestraSuplierProjectsComponent,
        BancosComponent,
        BanorteComponent,
        BanregioComponent,
        BaseComponent,
        BancreaComponent,
        CesionderechosComponent,
        ContribuyentesfundersComponent,
        CreaFunderComponent,
        ActualizaFunderComponent,
        CreaCreditlineComponent,
        SolicitudDeFondeoComponent,
        AfinancieraComponent,
        AfondeadorComponent,
        ReporteSolicitudesFondeoComponent,
        ClientesCadenaComponent,
        EditaClienteCadenaComponent
    ],
    exports: [
        DashboardComponent,
        ProgressComponent,
        Graficas1Component
    ],
    imports: [
        SharedModule,
        PAGES_ROUTES,
        FormsModule,
        ReactiveFormsModule,
        ChartsModule,
        PipesModule,
        CommonModule,
        TableModule,
        BrowserAnimationsModule,
        DataTablesModule,
        InputSwitchModule,
        PickListModule,
        BreadcrumbModule,
        MatSliderModule,
        MatStepperModule,
        MatFormFieldModule,
        MultiSelectModule,
        InputTextareaModule,
        ChartModule,
        FileUploadModule,
        TabViewModule,
        DialogModule,
        AngularFireStorageModule,
        AngularFireModule.initializeApp(environment.firebase),
        MatProgressBarModule,
    ]
})
export class PagesModule { }
