import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="text-align:center">
      <h1>Angular + Express</h1>
      <p *ngIf="mensaje">{{ mensaje }}</p>
      <button (click)="obtenerDatos()">Llamar API</button>
    </div>
  `
})
export class AppComponent {
  mensaje = '';

  // Inyectamos HttpClient
  constructor(private http: HttpClient) {}

  obtenerDatos() {
    // Usamos una ruta relativa. En producción, Express manejará esto.
    this.http.get<any>('/api/mensaje').subscribe(data => {
      this.mensaje = data.texto;
    });
  }
}