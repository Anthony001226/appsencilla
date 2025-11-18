import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// Interfaz para dar tipado a la respuesta de la DB
interface Tarea {
    id: number;
    descripcion: string;
    completada: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="text-align:center">
        <h1>Gestor de Tareas (CRUD en PostgreSQL)</h1>

        <hr>

        <h2>Registros de la Base de Datos</h2>
        
        <div *ngIf="tareas.length === 0">
            Cargando tareas o no hay registros.
        </div>

        <ul style="list-style-type: none; padding: 0;">
            <li *ngFor="let tarea of tareas" style="margin: 10px; padding: 5px; border: 1px solid #ccc;">
                <span [style.text-decoration]="tarea.completada ? 'line-through' : 'none'">
                    ID {{ tarea.id }}: {{ tarea.descripcion }}
                </span>
                <span style="color: gray; font-size: 0.8em;"> ({{ tarea.completada ? 'Completada' : 'Pendiente' }})</span>
            </li>
        </ul>
        
    </div>
  `
})
// ¡IMPORTANTE! El nombre de la clase es AppComponent
export class AppComponent implements OnInit { 
    // Lista para almacenar las tareas de la DB
    tareas: Tarea[] = []; 
    // mensaje: string = ''; // Mantener si quieres el mensaje simple

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        // Al iniciar, llama a la función para cargar la lista
        this.cargarTareas(); 
    }

    cargarTareas(): void {
        // Llama al nuevo endpoint del CRUD /api/tareas
        this.http.get<Tarea[]>('/api/tareas').subscribe({
            next: (data) => {
                this.tareas = data;
                console.log('Tareas cargadas exitosamente.');
            },
            error: (err) => {
                console.error('Error al cargar la lista de tareas', err);
                // this.mensaje = 'Error al cargar la DB.';
            }
        });
    }
}