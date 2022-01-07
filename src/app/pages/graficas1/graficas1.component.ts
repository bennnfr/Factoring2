import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/service.index';

@Component({
  selector: 'app-graficas1',
  templateUrl: './graficas1.component.html',
  styles: []
})
export class Graficas1Component implements OnInit {

  usuarios: string;

  graficos: any = {
    'grafico1': {
      'labels': ['etiqueta1', 'etiqueta2', 'etiqueta3', 'etiqueta4'],
      'data':  [24, 30, 46, 35],
      'type': 'doughnut',
      'leyenda': 'Una grafica con datos'
    },
    'grafico2': {
      'labels': ['Hombres', 'Mujeres'],
      'data':  [4500, 6000],
      'type': 'doughnut',
      'leyenda': 'Usuarios por Genero'
    },
    'grafico3': {
      'labels': ['Activos', 'Inactivos'],
      'data':  [95, 5],
      'type': 'doughnut',
      'leyenda': 'Clientes con Creditos'
    },
    'grafico4': {
      'labels': ['Activos', 'Inactivos', 'Suspendidos'],
      'data':  [85, 15, 30],
      'type': 'doughnut',
      'leyenda': 'Lista de usuarios por estatus'
    },
  };

  constructor(public _usuarioservice: UsuarioService) { }

  ngOnInit() {

  }

}
