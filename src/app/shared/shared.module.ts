import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';

import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { PipesModule } from '../pipes/pipes.module';
import {InputSwitchModule} from 'primeng/inputswitch';
import { AccesoDenegadoComponent } from './accesodenegado/accesodenegado.component';


@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        PipesModule,
        InputSwitchModule,
        FormsModule
    ],
    declarations: [
        NopagefoundComponent,
        AccesoDenegadoComponent,
        HeaderComponent,
        SidebarComponent,
        BreadcrumbsComponent,
        NopagefoundComponent
    ],
    exports: [
        NopagefoundComponent,
        AccesoDenegadoComponent,
        HeaderComponent,
        SidebarComponent,
        BreadcrumbsComponent,
        NopagefoundComponent
    ]
})
export class SharedModule { }
