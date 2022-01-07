import { RouterModule, Routes } from '@angular/router';
//import { LoginRGuardGuard } from './services/service.index'
import { PagesComponent } from './pages/pages.component';

import { LoginComponent } from './login/login.component';
import { ResetpwdComponent } from './login/resetpwd.component';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';
import { AccesoDenegadoComponent } from './shared/accesodenegado/accesodenegado.component';


const appRoutes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: 'resetpwd/:token', component: ResetpwdComponent },
    { path: 'accesodenegado', component: AccesoDenegadoComponent },
    { path: '**', component: NopagefoundComponent }
];


export const APP_ROUTES = RouterModule.forRoot( appRoutes, { useHash: true } );
