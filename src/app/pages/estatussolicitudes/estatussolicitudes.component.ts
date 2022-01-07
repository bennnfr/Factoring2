import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { AltaSolicitudesService, OptionsService, MiFielService } from '../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import swal2 from 'sweetalert2';
import * as firebase from 'firebase';
import { HttpClient } from '@angular/common/http';
import { getMaxListeners } from 'process';
import { browser } from 'protractor';
declare var $;

@Component({
  selector: 'app-estatussolicitudes',
  templateUrl: './estatussolicitudes.component.html',
  styles: []
})
export class EstatusSolicitudesComponent implements OnInit {
  uploadForm: FormGroup;
  url: any;
  file: any;
  datosdetalles: any[] = [];
  selectedSol: any[] = [];
  cols: any[] = [];
  solicitudes: any[] = [];
  estatussolicitudes: any[] = [];
  usuarios: any[] = [];
  idu: string;
  documentonulo: boolean;
  uploadURL: Observable<string>;
  uploadProgress: Observable<number>;
  showModal: boolean;
  showmodalds: boolean;
  idsolicitud: string;
  foliosolicitud: string;
  carpeta: string;
  nombrearchivosubido: string;
  constructor(private _formBuilder: FormBuilder,
              public router: Router,
              private route: ActivatedRoute,
              public _optionsservice: OptionsService,
              public _mifiel: MiFielService,
              private formBuilder: FormBuilder, private httpClient: HttpClient, 
              private _firestorage: AngularFireStorage,
              public _solicitudesservice: AltaSolicitudesService) {}

              show(datarow) {
                this.showModal = true; // Show-Hide Modal Check
               // console.log(datarow);
                this.idsolicitud = datarow.id;
                this.foliosolicitud = datarow.folio;
              }
              hide() {
                this.showModal = false;
                this.idsolicitud = '';
                this.foliosolicitud = '';
                this.ngOnInit();
              }

  ngOnInit() {
    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
    swal2.showLoading();
    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });
   // this.getAcceso('/estatussolicitudes');

    const estatus: any = document.getElementById('estatus');

    estatus.options[estatus.selectedIndex].value = 0;

    this.selectedSol = [];

    this.idu = localStorage.getItem('id'); 

    this._solicitudesservice.getSolicitudesxusuario(this.idu).subscribe( resp => { this.solicitudes = resp; swal2.close(); } );

    this._solicitudesservice.getUsuariosFinanciero().subscribe( resp => { this.usuarios = resp;} );

    this._solicitudesservice.getEstatusFacturas().subscribe( resp => { this.estatussolicitudes = resp; } );

    this.cols = [

    { field: 'fecha_factura', header: 'Fecha Factura' },
    { field: 'fecha_operacion', header: 'Fecha Operacion' },
    { field: 'fecha_vencimiento', header: 'Fecha Vencimiento' },
    { field: 'total_operar', header: 'Total operado' },
    { field: 'usuario', header: 'Usuario' },
    { field: 'status', header: 'Estatus' },
    { field: 'cadena', header: 'Cadena' },
    { field: 'proovedor', header: 'Proveedor' },
   // { field: 'attached', header: 'Documento de sesion de derechos' }
  ];
    
  }

  hideds() {
    this.showmodalds = false;
  }
   
  
  
   imageChoice(theEventFromHtml) {
    this.file = theEventFromHtml.target.files[0]

  }

  getAcceso(url) {
    let tieneacceso = false;
    this._optionsservice.getOptionsxUsuario(localStorage.getItem('id')).subscribe(resp2 => {
      // tslint:disable-next-line: forin
      for (const j in resp2 ) {
          if ( resp2[j].url === url ) {
            tieneacceso = true;
            break;
          }
        }
      if (!tieneacceso) {
        this.router.navigate(['/accesodenegado']);
      }
    });
  }

  mustradetallessolicitud(id) {

    this.showmodalds = true;
    this._solicitudesservice.getdetallessolicitudes(id).subscribe( resp => {this.datosdetalles = resp  } 
    ,(err) => {
      swal2.fire(
        'Ocurrio un error al consultar los detalles',
        '',
        'error'
        );
    })
  }

  guardarCambios() {

    let idu = (document.getElementById('usuario')as HTMLInputElement).value;;
    let estatusval: any = (document.getElementById('estatus')as HTMLInputElement).value;

    if ( this.selectedSol.length === 0 ) {

      swal2.fire(
        'Debe seleccionar al menos una solicitud',
        '',
        'error'
        );

    } else if ( estatusval === '0' && idu === '' ) {

      swal2.fire(
        'Debe seleccionar un estatus o un usuario',
        '',
        'error'
        );

    } else {
      swal2.showLoading();

      // tslint:disable-next-line: forin
      if (estatusval !== '0' && idu !== '') {
        for (const prop in this.selectedSol) {
          const ids = this.selectedSol[prop].id;
          const params = {
            token: '',
            secret_key: '',
            folio: this.selectedSol[prop].folio,
            user_id: idu,
            status: estatusval
        };
        //  console.log(params);
          this._solicitudesservice.updateSolicitudes(ids, params).subscribe();
      }
      
      } else if (estatusval !== '0' && idu === '') {
        for (const prop in this.selectedSol) {
          const ids = this.selectedSol[prop].id;
          const params = {
            token: '',
            secret_key: '',
            folio: this.selectedSol[prop].folio,
           // user_id: idu,
            status: estatusval
        };
        //  console.log(params);
          this._solicitudesservice.updateSolicitudes(ids, params).subscribe();
      }
      
      } else if (estatusval === '0' && idu !== '') {
        for (const prop in this.selectedSol) {
          const ids = this.selectedSol[prop].id;
          const params = {
            token: '',
            secret_key: '',
            folio: this.selectedSol[prop].folio,
            user_id: idu,
           // status: estatusval
        };
        //  console.log(params);
          this._solicitudesservice.updateSolicitudes(ids, params).subscribe();
      } 
      }
      swal2.close();
      swal2.fire({
          title: 'Modificacion de Solicitudes',
          text: 'Exitosa',
          icon: 'success',
          showConfirmButton: true,
          showCancelButton: false,
          allowOutsideClick: false
        }). then ( res => {
          if ( res.value ) {
            location.reload();
          }
        } );
    }

  }

  actualizaattach() {

    if (this.selectedSol.length < 1) {
      swal2.fire(
        'Debe seleccionar al menos una solicitud',
        '',
        'error'
        );
    } else {
      // tslint:disable-next-line: forin
      for (const prop in this.selectedSol) {

        const ids = this.selectedSol[prop].id;

        const params = {
          token: '',
          secret_key: '',
          attached: this.selectedSol[prop].attached
      };

        this._solicitudesservice.updateSolicitudes(ids, params).subscribe( );
      }
      // location.reload();
      swal2.fire({
        title: 'Los documentos seleccionados se actualizaron',
        text: 'Con exito',
        icon: 'success',
        showConfirmButton: true,
        showCancelButton: false,
        allowOutsideClick: false
      }). then ( res => {

        if ( res.value ) {
          window.location.reload();
        }

      } );
    }
  }

  subirdoc( sol ) {
    const file = sol.target.files[0];
    this.carpeta = this.foliosolicitud;
    this.nombrearchivosubido = this.foliosolicitud;
    const filepath = `${this.foliosolicitud}/${this.foliosolicitud}`;
    const fileRef = this._firestorage.ref(filepath);
    const task = this._firestorage.upload(filepath, file);
    this.uploadProgress = task.percentageChanges();
    task.snapshotChanges().pipe(
      finalize(() => this.uploadURL = fileRef.getDownloadURL())
    ).subscribe();
   // console.log(this.uploadURL);
  }

  subirurl(uploadURL) {
    const params = {
      token: '',
      secret_key: '',
      attached: ''
  };
    let urll = '';
    const storage = firebase.storage();
    storage.ref(`${this.carpeta}/${this.nombrearchivosubido}`).getDownloadURL()
    .then((url) => {
    // Do something with the URL ...
   // console.log(url);
    params.attached = url;
   // console.log(params);
   // console.log(this.idsolicitud);
    this._solicitudesservice.updateSolicitudes(this.idsolicitud, params).subscribe( resp => { swal2.fire({
      title: 'El archivo se guardo',
      text: 'Con exito',
      icon: 'success',
      showConfirmButton: true,
      showCancelButton: false,
      allowOutsideClick: false
    }). then ( res => {

      if ( res.value ) {
        window.location.reload();
      }

    } ); }, (err) => {
      console.log(err);
      swal2.fire({
        title: 'Ocurrio un error',
        text: err.error.errors[0],
        icon: 'error',
        showConfirmButton: true,
        showCancelButton: false,
        allowOutsideClick: false
      }). then ( res => {
        if ( res.value ) {
          location.reload();
        }
      } );
     } );
  });
   // console.log(urll);
  }

  borraArchivo(rowData) {

    swal2.fire({
      title: 'Desea borrar el archivo?',
        text: rowData.folio,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        allowOutsideClick: false
    }). then ( res => {
      if ( res.value ) {
        const params = {
          token: '',
          secret_key: '',
          attached: ''
      };
        // Create a reference to the file to delete
        const storage = firebase.storage();
       // console.log(rowData.folio);
       // storage.ref(`SF1601017342/`).delete();
        const task = this._firestorage.storage.ref(`${rowData.folio}/`);
        task.listAll().then(function(result) {
          result.items.forEach(function(referencia) {
            // And finally display them
           // this.displayImage(referencia)
           referencia.delete();
    
        });
         });
    
        params.attached = null;
        this._solicitudesservice.updateSolicitudes(rowData.id, params).subscribe( resp => { swal2.fire({
            title: 'El archivo se borro',
            text: 'Con exito',
            icon: 'success',
            showConfirmButton: true,
            showCancelButton: false,
            allowOutsideClick: false
          }). then ( res => {
      
            if ( res.value ) {
              window.location.reload();
            }
      
          } ); }, (err) => {
            console.log(err);
            swal2.fire({
              title: 'Ocurrio un error',
              text: err.error.errors[0],
              icon: 'error',
              showConfirmButton: true,
              showCancelButton: false,
              allowOutsideClick: false
            }). then ( res => {
              if ( res.value ) {
                location.reload();
              }
            } );
           } );
      }
    });

  }

  upload(event) {

    const file = event.target.files[0];

    const randomId = Math.random().toString(36).substring(2);
    const filepath = `facturas/${event.target.files[0].name}`;
    const fileRef = this._firestorage.ref(filepath);
    const task = this._firestorage.upload(filepath, file);
    this.uploadProgress = task.percentageChanges();
    task.snapshotChanges().pipe(
      finalize(() => this.uploadURL = fileRef.getDownloadURL())
    ).subscribe();
  }

}







