import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { Cursos } from '../../../model/Cursos';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CursosService } from '../../../services/cursos.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from '../../../material/material.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [MaterialModule, CommonModule, MatDialogModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './registrar.component.html',
  styleUrl: './registrar.component.css'
})
export class RegistrarComponent implements OnInit{
  idSave:boolean=false;
  idCurso:number;
  @Output() cerrarDialogo = new EventEmitter<void>();
  curso: Cursos;
  courseForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cursosService: CursosService,
  ) {   
    this.courseForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
  });
  this.idCurso=this.data;
}

  ngOnInit(): void {

    this.obtenerDatosElemento();  
  }

  obtenerDatosElemento() {
    this.cursosService.findByIdcurso(this.data).subscribe(
      (curso: Cursos) => {
        this.courseForm.patchValue({
          name: curso.name,
          description: curso.description
        });
        this.idSave=true;
      },
      error => {
        console.log('Error al obtener los datos del curso:', error);
      }
    );
  }
  

  onSubmit(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched(); // Marca los campos como tocados para mostrar errores
      return;
    }
  
    const c: Cursos = {
      name: this.courseForm.value.name,
      description: this.courseForm.value.description
    };
  
    if (this.idSave) {
      // Modo edición - Actualizar curso
      this.cursosService.updateCurso(this.idCurso, c).subscribe({
        next: (data) => {
          Swal.fire({
            title:"Curso",
            text:"Curso Acualizado Correctamente",
            icon:"success"
          });
          this.cerrarDialogo.emit();
          
        },
        error: (err) => {
          console.error('Error al actualizar el curso:', err);
        }
      });
    } else {
      // Modo creación - Guardar nuevo curso
      this.cursosService.saveCurso(c).subscribe({
        next: (data) => {
          Swal.fire({
            title:"Curso",
            text:"Curso Creado Correctamente",
            icon:"success"
          });
          this.cerrarDialogo.emit();
         
        },
        error: (err) => {
          console.error('Error al guardar el curso:', err);
        }
      });
    }
  }
  







  onCancel(): void {
    this.cerrarDialogo.emit();
  }
}
