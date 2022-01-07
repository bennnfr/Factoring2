import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContribuyentesService } from '../../services/service.index';
import { Privilegio, Usuario2 } from '../../models/usuario.model';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Key } from 'readline';
import swal2 from 'sweetalert2';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
declare function init_plugins();

@Component({
  selector: 'app-muestrasuplierprojects',
  templateUrl: './muestrasuplierprojects.component.html',
  styles: []
})
export class MuestraSuplierProjectsComponent implements OnInit {

  forma: FormGroup;
  idl: string;
  cadena: any[] = [];
  cadenas: any[] = [];
  idcadenan = '';
  proyectos: any[] = [];
  idsuplier = '';
  idcontribuyente = '';
  nombrecadena = '';
  nombrenegocio = '';
  cols: any[];
  segmentos: any[] = [];
  currency: any[] = [];
  selectedSegmentos: any[] = [];
  newCar: boolean;
  car = {id_de_cadena: '', nombrecadena: '', nombre_proyecto: '', id: '', company_project_id: '', suplier_id: '', rate: '', fee: '', capacity: '', limit_days: '', currency: '', expiration_day: '', expiration_type: '', status: '', token: '', secret_key: ''};
  displayDialog: boolean;
  cars: any[] = [];
  selectedCar: [];
  displayDialognuevo: boolean;
  nombreproveedorproyecto: string;
  constructor(
    private route: ActivatedRoute,
    public _contribuyentesService: ContribuyentesService,
    public router: Router
  ) { }


  ngOnInit() {
    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
      swal2.showLoading();
      this.proyectos = [];
      this.car = {id_de_cadena: '', nombrecadena: '', nombre_proyecto: '', id: '', company_project_id: '', suplier_id: '', rate: '', fee: '', capacity: '', limit_days: '', currency: '', expiration_day: '', expiration_type: '', status: '', token: '', secret_key: ''};
      this.segmentos = [];
      this.nombreproveedorproyecto = this.route.snapshot.paramMap.get('nombre');
      this.idsuplier = this.route.snapshot.paramMap.get('id');
      this.idcontribuyente = this.route.snapshot.paramMap.get('idc');
     // console.log(this.idcontribuyente);
      this.nombrenegocio = this.route.snapshot.paramMap.get('nombre');
      this._contribuyentesService.getCadenas().subscribe( resp => { this.cadenas = resp; } );
      this._contribuyentesService.getCompanySegmentsCurrency().subscribe( resp => this.currency = resp );
      this._contribuyentesService.getCompanySuplierProjects(this.idsuplier).subscribe( resp => {this.segmentos = resp; // console.log(this.segmentos);
                                                                                               // this._contribuyentesService.getCadenaxcontribuyente(this.idcontribuyente).subscribe( resp2 => {this.cadena = resp2; console.log(resp2); this.nombrecadena = this.cadena[0].business_name;
                                                                                                  // tslint:disable-next-line: forin
                                                                                               //                                                                                                for (const prop in this.segmentos) {
                                                                                               //                                                                                                  console.log(this.segmentos[prop].company_project_id);
                                                                                               //                                                                                                  this._contribuyentesService.getCompanyProject(this.cadena[0].id, this.segmentos[prop].company_project_id).subscribe( resp3 => { this.segmentos[prop].nombre_proyecto = resp3.data.attributes.key + '-' + resp3.data.attributes.name; } );
                                                                                               //                                                                                                   }} );
                                                                                                // tslint:disable-next-line: forin
                                                                                                for (const prop in this.segmentos) {
                                                                                                  this._contribuyentesService.getProjectName(this.segmentos[prop].company_project_id).subscribe( resp3 => { this.segmentos[prop].nombre_proyecto = resp3.data.attributes.key + '-' + resp3.data.attributes.name;
                                                                                                                                                                                                            this.segmentos[prop].id_de_cadena = resp3.data.attributes.company_id;
                                                                                                                                                                                                          //  console.log(this.segmentos[prop].id_de_cadena);
                                                                                                                                                                                                            this._contribuyentesService.getcompany(this.segmentos[prop].id_de_cadena).subscribe(resp8 => this.segmentos[prop].nombrecadena = resp8.data.attributes.business_name);  } );
                                                                                                }
                                                                                               // console.log(this.segmentos);
                                                                                                swal2.close(); } );

      this.cols = [
          //  { field: 'key', header: 'Clave' },
          //  { field: 'name', header: 'Nombre' },
          //  { field: 'start_date', header: 'Fecha inicio' },
          //  { field: 'end_date', header: 'Fecha fin' },
            { field: 'rate', header: 'Tasa' },
            { field: 'fee', header: 'Comisión' },
            { field: 'capacity', header: 'Capacidad' },
            { field: 'limit_days', header: 'Limite días' },
            { field: 'expiration_day', header: 'Día expiración' },
            { field: 'expiration_type', header: 'Tipo expiración' },
            { field: 'status', header: 'Estatus' },
            { field: 'currency', header: 'Moneda' },
            { field: 'nombre_proyecto', header: 'Proyecto' },
            { field: 'nombrecadena', header: 'Cadena' }
        ];
  }

  onRowSelect(event) {
    this.newCar = false;
    this.car = this.cloneCar(event.data);
    this.displayDialog = true;
  //  console.log(this.car);
}

cloneCar(c) {
  let car = {id_de_cadena: '', nombrecadena: '', nombre_proyecto: '', id: '', company_project_id: '', suplier_id: '', rate: '', fee: '', capacity: '', limit_days: '', currency: '', expiration_day: '', expiration_type: '', status: '', token: '', secret_key: ''};
  // tslint:disable-next-line: forin
  for (const prop in c) {
      car[prop] = c[prop];
  }
  return car;
}

showDialogToAdd() {
  this.newCar = true;
  this.car = {id_de_cadena: '', nombrecadena: '', nombre_proyecto: '', id: '', company_project_id: '', suplier_id: '', rate: '', fee: '', capacity: '', limit_days: '', currency: '', expiration_day: '', expiration_type: '', status: '', token: '', secret_key: ''};
  this.displayDialognuevo = true;
}

muestraprojectsn() {
  this.idcadenan = (document.getElementById('cadenan') as HTMLInputElement).value;
  if (this.idcadenan != "") {
    this._contribuyentesService.getCompanyProjects(this.idcadenan).subscribe( resp => { this.proyectos = resp;  } );
  }
  
}

muestraprojects() {
  this.idcadenan = (document.getElementById('cadena') as HTMLInputElement).value;
  this._contribuyentesService.getCompanyProjects(this.idcadenan).subscribe( resp => { this.proyectos = resp; } );
}

save() {
  let cars = [...this.cars];
//  console.log('aqui');
  if (this.newCar) {
    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
    swal2.showLoading();
    this.car = {id_de_cadena: '', nombrecadena: '', nombre_proyecto: '', id: '', suplier_id: this.idsuplier, company_project_id: (document.getElementById('proyecton') as HTMLInputElement).value,
      // key: (document.getElementById('keyn') as HTMLInputElement).value,
      // name: (document.getElementById('namen') as HTMLInputElement).value,
      // start_date: startdaten,
      // end_date: enddaten,
       rate: (document.getElementById('raten') as HTMLInputElement).value,
       fee: (document.getElementById('feen') as HTMLInputElement).value,
       capacity: (document.getElementById('capacityn') as HTMLInputElement).value,
       limit_days: (document.getElementById('limit_daysn') as HTMLInputElement).value,
       currency: (document.getElementById('currencyn') as HTMLInputElement).value,
       expiration_day: (document.getElementById('expiration_dayn') as HTMLInputElement).value,
       expiration_type: (document.getElementById('expiration_typen') as HTMLInputElement).value,
       status: (document.getElementById('statusn') as HTMLInputElement).value,
       token: '',
       secret_key: ''};
  //  console.log(this.car);
    this.newCar = false;
    this.displayDialognuevo = false;
    this._contribuyentesService.guardaProyecto( this.car ).subscribe( resp => {
      swal2.close();
      swal2.fire({
        title: 'Los datos fueron guardados',
        text: 'Con exito',
        icon: 'success',
        showConfirmButton: true,
        showCancelButton: false,
        allowOutsideClick: false
      }). then ( res => {

        if ( res.value ) {
         // window.location.reload();
         this.ngOnInit();
        }

      } );
    }, (err) => {
      swal2.close();
      console.log(err);
      swal2.fire({
        title: 'Ocurrio un error',
        text: '',
        icon: 'error',
        showConfirmButton: true,
        showCancelButton: false,
        allowOutsideClick: false
      }). then ( res => {
        if ( res.value ) {
          this.ngOnInit();
        }
      } );
     } );
  } else {
    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
  swal2.showLoading();
  this.car = {id_de_cadena: '', nombrecadena: '', nombre_proyecto: this.car.nombre_proyecto, id: this.car.id, suplier_id: this.idsuplier, company_project_id: (document.getElementById('proyecto') as HTMLInputElement).value,
      // key: this.car.key,
      // name: this.car.name,
      // start_date: this.car.start_date,
      // end_date: this.car.end_date,
       rate: this.car.rate,
       fee: this.car.fee,
       capacity: this.car.capacity,
       limit_days: this.car.limit_days,
       expiration_day: this.car.expiration_day,
       currency: (document.getElementById('currency') as HTMLInputElement).value,
       expiration_type: (document.getElementById('expiration_type') as HTMLInputElement).value,
       status: (document.getElementById('status') as HTMLInputElement).value,
       token: '',
       secret_key: ''};
//  console.log(this.car);
  this._contribuyentesService.actualizaProyecto(this.car).subscribe( resp => {
    swal2.close();
    swal2.fire({
      title: 'Los datos fueron actualizados',
      text: 'Con exito',
      icon: 'success',
      showConfirmButton: true,
      showCancelButton: false,
      allowOutsideClick: false
    }). then ( res => {

      if ( res.value ) {
       // window.location.reload();
       this.ngOnInit();
      }

    });
  }, (err) => {
    swal2.close();
    console.log(err);
    swal2.fire({
      title: 'Ocurrio un error',
      text: '',
      icon: 'error',
      showConfirmButton: true,
      showCancelButton: false,
      allowOutsideClick: false
    }). then ( res => {
      if ( res.value ) {
        this.ngOnInit();
      }
    } );
   } );
  }
  this.cars = cars;
  this.car = null;
  this.displayDialog = false;
}

 delete() {
  swal2.showLoading();
  this._contribuyentesService.borraProyecto(this.idsuplier, this.car.id).subscribe(resp => {
    swal2.close();
    swal2.fire({
      title: 'Los datos fueron borrados',
      text: 'Con exito',
      icon: 'success',
      showConfirmButton: true,
      showCancelButton: false,
      allowOutsideClick: false
    }). then ( res => {

      if ( res.value ) {
       // window.location.reload();
       this.ngOnInit();
      }

    } );
  }, (err) => {
    swal2.close();
    console.log(err);
    swal2.fire({
      title: 'Ocurrio un error',
      text: '',
      icon: 'error',
      showConfirmButton: true,
      showCancelButton: false,
      allowOutsideClick: false
    }). then ( res => {
      if ( res.value ) {
        this.ngOnInit();
      }
    } );
   } );

  this.displayDialog = false;

}


}
