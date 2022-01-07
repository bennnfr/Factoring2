import { Injectable } from '@angular/core';
import { Usuario, Usuario2, Usuario3, UserOptions } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
import { Perfisica, PerMoral, ContribuyenteFisica, ContribuyenteMoral, DocumentoPropiedad } from '../../models/personas.model';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';


@Injectable()
export class DashboardService {

  usuario: Usuario;
  token: string;
  usuario2: Usuario2;
  idUsuario: string;

  constructor(
    public http: HttpClient,
    public router: Router
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

  getDatos() {

    const url = `${environment.URL_SERVICIOS}/reports/dashboard_admin?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

    return this.http.get(url).pipe(
      map( (resp: any) => {
        return resp;
      } )
    );

  }

  getAdminInvoices() {

    const url = `${environment.URL_SERVICIOS}/reports/dashboard_admin_invoices?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

    return this.http.get(url).pipe(
      map( (resp: any) => {
        return resp;
      } )
    );

  }

  getAdminRequests() {

    const url = `${environment.URL_SERVICIOS}/reports/dashboard_admin_requests?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

    return this.http.get(url).pipe(
      map( (resp: any) => {
        return resp;
      } )
    );

  }
// SOFOM ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getAfiliadosTotales() {
    const url = `${environment.URL_SERVICIOS}/reports/dashboard_sofom_suppliers_for_company?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
    return this.http.get(url).pipe(
      map( (resp: any) => {
        return resp;
      } )
    );
  }
  getDispuestoInterescobrado() {
    const url = `${environment.URL_SERVICIOS}/reports/dashboard_sofom_interest_discounts_month?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
    return this.http.get(url).pipe(
      map( (resp: any) => {
        return resp;
      } )
    );
  }
  getFacturasvsDescuentos() {
    const url = `${environment.URL_SERVICIOS}/reports/dashboard_sofom_invoices_vs_discounts_month?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
    return this.http.get(url).pipe(
      map( (resp: any) => {
        return resp;
      } )
    );
  }
  getProveedoresAfiliados() {
    const url = `${environment.URL_SERVICIOS}/reports/dashboard_sofom_suppliers_movements?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
    return this.http.get(url).pipe(
      map( (resp: any) => {
        return resp;
      } )
    );
  }
  getAvgDiscountDays() {
    const url = `${environment.URL_SERVICIOS}/reports/dashboard_sofom_avg_discount_days_avg?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
    return this.http.get(url).pipe(
      map( (resp: any) => {
        return resp;
      } )
    );
  }

  getPagosyDisperciones() {
    const url = `${environment.URL_SERVICIOS}/reports/dashboard_sofom_payments_vs_discounts?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
    return this.http.get(url).pipe(
      map( (resp: any) => {
        return resp;
      } )
    );
  }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// CADENA /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
getFacturasCanceladas(idc) {
  const url = `${environment.URL_SERVICIOS}/reports/company_id/${idc}/dashboard_company_invoices_ca?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  return this.http.get(url).pipe(
    map( (resp: any) => {
      return resp;
    } )
  );
}
getProximosPagos(idc) {
  const url = `${environment.URL_SERVICIOS}/reports/company_id/${idc}/dashboard_company_next_payments?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  return this.http.get(url).pipe(
    map( (resp: any) => {
      return resp;
    } )
  );
}
getFacturasdescontadasynodescontadas(idc) {
    const url = `${environment.URL_SERVICIOS}/reports/company_id/${idc}/dashboard_company_all_invoices?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
    return this.http.get(url).pipe(
      map( (resp: any) => {
        return resp;
      } )
    );
    }
getFacturasdescontadasproveedores(idc) {
      const url = `${environment.URL_SERVICIOS}/reports/company_id/${idc}/dashboard_company_invoices_vs_desc?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
      return this.http.get(url).pipe(
        map( (resp: any) => {
          return resp;
        } )
      );
      }
getFacturasCanceladasTotales(idc) {
        const url = `${environment.URL_SERVICIOS}/reports/company_id/${idc}/dashboard_company_cancel_invoices?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
        return this.http.get(url).pipe(
          map( (resp: any) => {
            return resp;
          } )
        );
        }
getComisionPagoSofom(idc) {
          const url = `${environment.URL_SERVICIOS}/reports/company_id/${idc}/dashboard_company_fees?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
          return this.http.get(url).pipe(
            map( (resp: any) => {
              return resp;
            } )
          );
          }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// PROVEEDOR //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
getFacturasNoDescontadas(idp) {
  const url = `${environment.URL_SERVICIOS}/reports/supplier_id/${idp}/dashboard_supplier_inv_to_expire_not_request?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  return this.http.get(url).pipe(
    map( (resp: any) => {
      return resp;
    } )
  );
  }
  getFacturasDescontadas(idp) {
    const url = `${environment.URL_SERVICIOS}/reports/supplier_id/${idp}/dashboard_supplier_inv_request?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
    return this.http.get(url).pipe(
      map( (resp: any) => {
        return resp;
      } )
    );
    }
    getFacturasDescontadasMes(idp) {
      const url = `${environment.URL_SERVICIOS}/reports/supplier_id/${idp}/dashboard_supplier_used_int_rate_month?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
      return this.http.get(url).pipe(
        map( (resp: any) => {
          return resp;
        } )
      );
      }
      getImporteFacturas(idp) {
        const url = `${environment.URL_SERVICIOS}/reports/supplier_id/${idp}/dashboard_supplier_used_int?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
        return this.http.get(url).pipe(
          map( (resp: any) => {
            return resp;
          } )
        );
        }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///// VALIDACIONES /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

getUserType(idu) {
  const url = `${environment.URL_SERVICIOS}/reports/user_id/${idu}/user_type?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  return this.http.get(url).pipe(
    map( (resp: any) => {
      return resp;
    } )
  );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}
