import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ContribuyentesService, FundersService, MantenimientoContribuyentesService } from '../../services/service.index';
import { NavigationEnd, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
// import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styles: []
})
export class ProgressComponent implements OnInit {

  layoutbase: any[] = [];
  primerRow  = [];
  segundoRow = [];
  detalles = [];
  ligaguardar = '';
  constructor( private fundersservice: FundersService, private _firestorage: AngularFireStorage, ) { }
  fileName = 'ListaDeUsuarios.xlsx';
  ngOnInit() {

  this.fundersservice.getBaseLayout(12).subscribe( resp => {
    this.layoutbase = resp;

    this.ligaguardar =  resp.resumen[0].numero_acuse + '/' + resp.resumen[0].numero_acuse;
    this.primerRow.push(resp.resumen[0].epo);
    this.primerRow.push(resp.resumen[0].monto_descuento_mn);
    this.primerRow.push(resp.resumen[0].monto_intereses_mn);
    this.primerRow.push(resp.resumen[0].monto_operar_mn);
    this.primerRow.push(resp.resumen[0].monto_descuento_usd);
    this.primerRow.push(resp.resumen[0].monto_intereses_usd);
    this.primerRow.push(resp.resumen[0].monto_operar_usd);
    this.segundoRow.push(resp.resumen[0].numero_acuse);
    this.segundoRow.push(resp.resumen[0].fecha_carga);
    this.segundoRow.push(resp.resumen[0].hora_carga);
    this.segundoRow.push(resp.resumen[0].usuario_captura);
    console.log(resp.detalles);
    this.detalles.push(resp.detalles);
    console.log(this.detalles[0]);
  } );

}

exportexcell() {
  let numberrow = 8;
  const Excel = require('exceljs');
  let workbook = new Excel.Workbook();
  let worksheet = workbook.addWorksheet('Movimientos_Descontados');
  let header=['EPO', 'Monto Descuento M.N.', 'Monto de Intereses M.N.', 'Monto a Operar M.N.', 'Monto Descuento USD', 'Monto de Intereses USD', 'Monto a Operar USD'];
  console.log(header);
  let headerRow = worksheet.addRow(header);
  worksheet.addRow(this.primerRow);
  worksheet.addRow([]);
  worksheet.addRow(['Numero de Acuse', 'Fecha de Carga', 'Hora de Carga', 'Usuario de Captura']);
  worksheet.addRow(this.segundoRow);
  worksheet.addRow([]);
  let header3 = ['No. Cliente SIRAC', 'Proveedor',	'Numero de documento',	'Fecha de Emision',	'Fecha de Vencimiento',
  'Moneda',	'Monto', 	'Monto Descuento', 	'Monto Interés', 	'Monto a Operar', 	'Tasa',	'Plazo',	'Folio',
  'No. Proveedor',	'Porcentaje de Descuento',	'Recurso en Garantia'
]
  worksheet.addRow(header3);
  // tslint:disable-next-line: forin
  for (const prop in this.detalles[0]) {
    console.log()
    worksheet.addRow([this.detalles[0][prop].sirac, this.detalles[0][prop].proveedor, this.detalles[0][prop].funding_invoice_group, this.detalles[0][prop].fecha_emision, this.detalles[0][prop].fecha_vencimiento,
                      this.detalles[0][prop].moneda, this.detalles[0][prop].monto, this.detalles[0][prop].monto_descuento, this.detalles[0][prop].monto_intereses, this.detalles[0][prop].monto_operar,
                      this.detalles[0][prop].tasa, this.detalles[0][prop].plazo, this.detalles[0][prop].folio, this.detalles[0][prop].no_proveedor, this.detalles[0][prop].porcentaje_descuento, this.detalles[0][prop].recurso_garantia ]);
    worksheet.getCell('A' + numberrow).alignment = { vertical: 'bottom', horizontal: 'right' };
    worksheet.getCell('C' + numberrow).alignment = { vertical: 'bottom', horizontal: 'right' };
    worksheet.getCell('D' + numberrow).alignment = { vertical: 'bottom', horizontal: 'right' };
    worksheet.getCell('E' + numberrow).alignment = { vertical: 'bottom', horizontal: 'right' };
    worksheet.getCell('G' + numberrow).alignment = { vertical: 'bottom', horizontal: 'right' };
    worksheet.getCell('H' + numberrow).alignment = { vertical: 'bottom', horizontal: 'right' };
    worksheet.getCell('I' + numberrow).alignment = { vertical: 'bottom', horizontal: 'right' };
    worksheet.getCell('J' + numberrow).alignment = { vertical: 'bottom', horizontal: 'right' };
    worksheet.getCell('K' + numberrow).alignment = { vertical: 'bottom', horizontal: 'right' };
    worksheet.getCell('L' + numberrow).alignment = { vertical: 'bottom', horizontal: 'right' };
    worksheet.getCell('M' + numberrow).alignment = { vertical: 'bottom', horizontal: 'right' };
    worksheet.getCell('N' + numberrow).alignment = { vertical: 'bottom', horizontal: 'right' };
    worksheet.getCell('O' + numberrow).alignment = { vertical: 'bottom', horizontal: 'right' };
    worksheet.getCell('P' + numberrow).alignment = { vertical: 'bottom', horizontal: 'right' };
    numberrow = numberrow + 1;
  }
  // FORMATEAR CELDAS ///////////////////////////
  worksheet.getCell('A2').alignment = { vertical: 'bottom', horizontal: 'right' };
  worksheet.getCell('B2').alignment = { vertical: 'bottom', horizontal: 'right' };
  worksheet.getCell('C2').alignment = { vertical: 'bottom', horizontal: 'right' };
  worksheet.getCell('D2').alignment = { vertical: 'bottom', horizontal: 'right' };
  worksheet.getCell('E2').alignment = { vertical: 'bottom', horizontal: 'right' };
  worksheet.getCell('F2').alignment = { vertical: 'bottom', horizontal: 'right' };
  worksheet.getCell('G2').alignment = { vertical: 'bottom', horizontal: 'right' };
  worksheet.getCell('B5').alignment = { vertical: 'bottom', horizontal: 'right' };
  worksheet.getCell('C5').alignment = { vertical: 'bottom', horizontal: 'right' };
  worksheet.columns = [
    { header: 'EPO', width: 21 }, { header: 'Monto Descuento M.N.', width: 21 }, { header: 'Monto de Intereses M.N.', width: 22 }, { header: 'Monto a Operar M.N.', width: 21 },
    { header: 'Monto Descuento USD', width: 21 }, { header: 'Monto de Intereses USD', width: 22 }, { header: 'Monto a Operar USD', width: 23 }, { header: '', width: 16 },
    { header: '', width: 15 }, { header: '', width: 14 }, { header: '', width: 7 }, { header: '', width: 7 }, { header: '', width: 7 }, { header: '', width: 15 }, { header: '', width: 23 },
    { header: '', width: 19 },
  ];
  //////////////////////////////////////////////
  workbook.xlsx.writeBuffer().then((data) => {
  let blob = new Blob([data], { type: '.xlsx' });
  const file = blob;
  const filepath = this.ligaguardar;
  const fileRef = this._firestorage.ref(filepath);
  this._firestorage.upload(filepath, file).then(() => { fileRef.getDownloadURL().subscribe( resp => {
    console.log(resp);
    } ); });
});

}


  }







