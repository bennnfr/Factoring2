import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { UserOptionsService, RolesOptionsService } from '../../services/service.index';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Idd } from '../../models/usuario.model';
declare var $;

@Component({
  selector: 'app-asignaoptionsroles',
  templateUrl: './asignaoptionsroles.component.html',
  styles: []
})
export class AsignaOptionsRolesComponent implements OnInit, OnDestroy {

  optionsfiltradas: any[] = [];
  options: any[] = [];
  datosTabla: Observable<any[]> = new Observable();
  sourceCars: any[];
  rolOptions: any[] = [];
  cols: any[];
  selectedColumns: any[];
  seleccion: Idd;
  colso: any[];
  resul: any[] = [];
  agregar = false;
  seleccionOptions: any[] = [];
  idu: string;
  nombreUsuaOp: string;
  subscription: Subscription;

  constructor( public _optionsservice: UserOptionsService,
               public _rolesoptionsservice: RolesOptionsService,
               public router: Router,
               public http: HttpClient,
               private route: ActivatedRoute ) {

                }

  ngOnInit() {

    this.rolOptions = [];
    this.options = [];
    this.seleccionOptions = [];

    this.idu = this.route.snapshot.paramMap.get('id');

    this._rolesoptionsservice.getRol(this.idu).subscribe((resp: string) => { this.nombreUsuaOp = resp; } );

    this.subscription = this._optionsservice.getOptions()
    .subscribe( resp => { this.options = resp;
                          this._rolesoptionsservice.getRolesOptions(this.idu)
                          .subscribe( resp2 => {this.rolOptions = resp2;
                                                if (this.rolOptions.length === 0) {
                                                  this.seleccionOptions = this.options;
                                                } else {
                                                // tslint:disable-next-line: forin
                                                for (const i in this.options) {
                                                  // tslint:disable-next-line: forin
                                                for (const j in this.rolOptions) {

                                                  if ( parseInt(this.options[i].id, 10) === parseInt(this.rolOptions[j].option_id, 10) ) {
                                                    this.agregar = false;
                                                    break;
                                                  } else {
                                                    this.agregar = true;

                                                  }
                                                                                     }
                                                if (this.agregar) {
                                                  this.seleccionOptions.push(this.options[i]);
                                                  this.agregar = false;
                                                }
                                                                                }
                                                        }
                                                      //  console.log(this.usuarioOptions);
                                                    });

                          } );

  //  this._optionsservice.getOptions().subscribe( resp => { this.options = resp; console.log(this.options) } );
  //  this._rolesoptionsservice.getRolesOptions(this.idu).subscribe(resp => {this.rolOptions = resp; console.log(this.rolOptions) } );

    this.cols = [

      { field: 'name', header: 'Opciones Disponibles' }
  ];

    this.colso = [

    { field: 'name', header: 'Opciones Asignadas al Rol' }
];

  }

  ngOnDestroy() {

  }

  agregaRol( ido: string ) {
    this._rolesoptionsservice.agregaRol( this.idu, ido ).subscribe();
    setTimeout(() => {
      this.refresh();
    }, 100);


  }

  quitarRol( idq: string ) {
    this._rolesoptionsservice.quitarRol(idq).subscribe();

    setTimeout(() => {
      this.refresh();
    }, 100);

  }

  refresh() {
    this.ngOnInit();
  // window.location.reload();
  }

}







