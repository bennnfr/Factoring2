import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import * as jsPDF from 'jspdf';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import * as firebase from 'firebase';
declare var $;

@Component({
  selector: 'app-cesionderechos',
  templateUrl: './cesionderechos.component.html',
  styles: []
})
export class CesionderechosComponent implements OnInit {
  @ViewChild('content', {static: true}) content: ElementRef;
  @ViewChild('content2', {static: true}) content2: ElementRef;
  nombredeudor = 'Copanalgas sa de cv';
  fechaa = '28/10/2020';
  fechab = '23/04/2019';
  tablapos = 110;
  tablafin = 110;
  uploadProgress: Observable<number>;
  uploadURL: Observable<string>;
  conttabla = [
    ['CLIMAS SA DE CV', 'SF1603827945', '3,000,000', '19/10/2020', '24/12/2020'],
    ['CLIMAS SA DE CV', 'SF1603827945', '1,000,000', '26/10/2020', '24/12/2020'],
    ['CLIMAS SA DE CV', 'SF1603827945', '3,000,000', '19/10/2020', '24/12/2020'],
    ['CLIMAS SA DE CV', 'SF1603827945', '1,000,000', '26/10/2020', '24/12/2020'],
    ['CLIMAS SA DE CV', 'SF1603827945', '3,000,000', '19/10/2020', '24/12/2020'],
    ['CLIMAS SA DE CV', 'SF1603827945', '1,000,000', '26/10/2020', '24/12/2020'],

    // ...
  ];
  constructor(private _firestorage: AngularFireStorage,) { }

  ngOnInit() {

}

htmltoPDF() {
  let incremetotabla = (this.conttabla.length * 10) + 10;
 // console.log(this.conttabla);
  // tslint:disable-next-line: forin
  // tslint:disable-next-line: no-conditional-assignment
 // console.log(this.tablapos + incremetotabla);

  let doc = new jsPDF();

  doc.setFont('arial', 'bold');
  doc.text('ANEXO 1', 105, 20, 'center');
  doc.setFontSize(10);
  doc.text('RELACIÓN DE DOCUMENTOS QUE CONTIENEN LOS DERECHOS DE CRÉDITO QUE SE TRANSMITEN', 102, 30, 'center');
  doc.setFont('arial', 'normal');
  doc.text('Chihuahua, Chihuahua a ' + this.fechaa, 188, 40, 'right');
  doc.setFont('arial', 'bold');
  doc.text('Nombre del Deudor', 16, 50, 'left');
  doc.text('P R E S E N T E :', 16, 60, 'left');
  doc.setFont('arial', 'normal');
  doc.text('De conformidad a lo establecido en el contrato de Cadenas a Proveedores celebrados con ustedes en fecha ' + this.fechab, 16, 70, 'justify');
  doc.text('hacemos de su conocimiento relación de los Documentos que contienen los Derechos de crédito que se transmiten a', 16, 75, 'justify');
  doc.text('a nuestro favor, mismos que derivan de productos y/o servicios que recibió de sus proveedores Proveedor(es), mismos', 16, 80, 'justify');
  doc.text('que se abonaran a la(s) cuenta(s) señalada(s) previamente por el(los) Proveedor(es) en el Contrato Único de Factoraje ', 16, 85, 'justify');
  doc.text('y/o Descuento.', 16, 90, 'justify');
  doc.autoTable({
    head: [['PROVEEDOR', 'No. DOCTO', 'VALOR NOMINAL', 'FECHA EMISIÓN', 'FECHA DE VENCIMIENTO']],
    body: this.conttabla, startY: 95
  });

  /* doc.fromHTML(content.innerHTML, 16, 95, {
    'width': 20,
    'elementHandlers' : specialElementHandlers
  }); */

  doc.addPage();

  doc.text('Chihuahua, Chihuahua a ' + this.fechaa, 188, 20, 'right');
  doc.setFont('arial', 'bold');
  doc.text('Nombre del Deudor', 16, 30, 'left');
  doc.text('Direccion', 16, 35, 'left');
  doc.text('P R E S E N T E ', 16, 50, 'left');
  doc.setFont('arial', 'normal');
  doc.text('En mi calidad de representante legal de la sociedad SOCIEDAD', 16, 60, 'justify');
  doc.text('por medio de la presente les notificamos que hemos transmitido los derechos de crédito de los Documentos que se', 16, 65, 'justify');
  doc.text('indican a continuación, mismos que derivan de los productos y/o servicios que recibió, afavor de Factor GFC Global', 16, 70, 'justify');
  doc.text('Sociedad Anónima de Capital Variable, Sociedad Financiera de Objeto Múltiple Entidad No Regulada, y con motivo de lo', 16, 75, 'justify');
  doc.text('anterior les instruimos a ustedes, efectuar el pago total de dichos Documentos a la cuenta de cheques a nombre de', 16, 80, 'justify');
  doc.text('Factor GFC Global, Sociedad Anónima de Capital Variable, Sociedad Financiera de Objeto Múltiple Entidad No Regulada', 16, 85, 'justify');
  doc.text('identificada con el número 0857275314 en la institución bancaria denominada Banco Mercantil del Norte, Sociedad Anónima,', 16, 90, 'justify');
  doc.text('Institución de Banca Múltiple, Grupo Financiero Banorte, o mediante transferencia electrónica de fondos interbancarios,', 16, 95, 'justify');
  doc.text('a la misma cuenta, cuya Clave Bancaria Estandarizada (CLABE) es 072150008572753147.', 16, 100, 'justify');
  doc.autoTable({
    head: [['PROVEEDOR', 'No. DOCTO', 'VALOR NOMINAL', 'FECHA EMISIÓN', 'FECHA DE VENCIMIENTO']],
    body: this.conttabla, startY: this.tablapos
  });
  doc.text('En consecuencia a lo anterior, le notificamos que la presente instrucción sólo se podrá modificar con la autorización previa', 16, this.tablapos + incremetotabla, 'justify');
  doc.text('y por escrito de un apoderado con facultades suficientes de Factor GFC Global, Sociedad Anónima de Capital Variable, Sociedad', 16, (this.tablapos + incremetotabla) + 5, 'justify');
  doc.text('Financiera de Objeto Múltiple Entidad No Regulada.', 16, (this.tablapos + incremetotabla) + 10, 'justify');
  doc.setFont('arial', 'bold');
  doc.text('A T E N T A M E N T E', 16, (this.tablapos + incremetotabla) + 30, 'justify');
  doc.setFont('arial', 'normal');
  doc.text('ALGUIEN', 16, (this.tablapos + incremetotabla) + 35, 'justify');
  doc.setLineWidth(.5);
  doc.line(80, (this.tablapos + incremetotabla) + 45, 16, (this.tablapos + incremetotabla) + 45); // horizontal line
  doc.text('OTRO ALGUIEN', 16, (this.tablapos + incremetotabla) + 50, 'justify');
  doc.setFont('arial', 'bold');
  doc.text('R E C I B I D O', 16, (this.tablapos + incremetotabla) + 60, 'justify');
  doc.setFont('arial', 'normal');
  doc.text('UN ALGUIEN', 16, (this.tablapos + incremetotabla) + 65, 'justify');
  doc.line(80, (this.tablapos + incremetotabla) + 75, 16, (this.tablapos + incremetotabla) + 75); // horizontal line
  // doc.save('nalgas.pdf');
  // console.log(doc.output());
  this.subirdoc(doc.output('blob'));

}

subirdoc( sol ) {
  const file = sol;
  console.log(file);
  const filepath = `prueba/001`;
  const fileRef = this._firestorage.ref(filepath);
  this._firestorage.upload(filepath, file).then(() => { fileRef.getDownloadURL().subscribe( resp => this.uploadURL = resp ); }); // this.subirurl(); });
 // this.subirurl();
 // this.uploadProgress = task.percentageChanges();
 // task.snapshotChanges().pipe(
 //   finalize(() => this.uploadURL = fileRef.getDownloadURL())
 // ).subscribe();
//  console.log(this.uploadURL);
}

subirurl() {

  const storage = firebase.storage();
  storage.ref(`prueba/001`).getDownloadURL()
  .then((url) => {
  // Do something with the URL ...
  console.log(url);
});
}


}
