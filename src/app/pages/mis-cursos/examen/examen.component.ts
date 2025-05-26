import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CursosService } from '../../../services/cursos.service';
import { Preguntas } from '../../../model/Preguntas';
import { MaterialModule } from '../../../material/material.module';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { IntentosComponent } from '../intentos/intentos.component';
import { subscribeOn } from 'rxjs';
import { Nota } from '../../../model/Nota';
@Component({
  selector: 'app-examen',
  standalone: true,
  imports: [MaterialModule,MatRadioModule,FormsModule],
  templateUrl: './examen.component.html',
  styleUrl: './examen.component.css'
})
export class ExamenComponent implements OnInit,OnDestroy {

  totalSeconds = 45 * 60; // 45 minutos
  remainingSeconds = this.totalSeconds;
  intervalId: any;
  fiveMinuteWarningShown = false;

 idCurso:number;
 preguntas:Preguntas[];

seleccionadas: { [idPregunta: number]: string } = {};
respondidas: number[] = [];
puntaje = 0;
acertadas = 0;
fallidas = 0;
mostrarResultados = false;
  @Output() cerrarDialogo = new EventEmitter<void>();

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
   private cursosService: CursosService,
   // private userService: UsersService,
  ) {this.idCurso=this.data }


  ngOnInit(): void {
 this.inicio();
    this.obtenerPreguntas();
    this.intervalId = setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;

        if (this.remainingSeconds === 5 * 60 && !this.fiveMinuteWarningShown) {
          this.fiveMinuteWarningShown = true;
          Swal.fire({
            icon: 'warning',
            title: '¡Atención!',
            text: 'Te quedan 5 minutos.',
            confirmButtonText: 'Ok'
          });
        }
      } else {
        clearInterval(this.intervalId);
        // Puedes hacer algo cuando se acaba el tiempo
        Swal.fire({
          icon: 'info',
          title: '¡Tiempo terminado!',
          text: 'Tu examen ha finalizado.',
        });
      }
    }, 1000);

  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;
    return `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
  obtenerPreguntas() {
    this.cursosService.listPreguntasByIdCurso(this.idCurso).subscribe(data => {
      // Mezclar preguntas
      const preguntasMezcladas = this.mezclarArray(data);
  
      // Mezclar respuestas dentro de cada pregunta
      this.preguntas = preguntasMezcladas.map(pregunta => ({
        ...pregunta,
        respuestas: this.mezclarArray(pregunta.respuestas)
      }));
    });
  }
  obtenerLetra(index: number): string {
    const letras = ['A', 'B', 'C', 'D', 'E'];
    return letras[index] || '?';
  }
  
/*
  obtenerPreguntas(){
    this.cursosService.listPreguntasByIdCurso(this.idCurso).subscribe(data=>{
      this.preguntas=data
    })
}*/

marcarComoRespondida(idPregunta: number): void {
  // Si se seleccionó una respuesta, agrega el ID como respondido
  if (this.seleccionadas[idPregunta] && !this.respondidas.includes(idPregunta)) {
    this.respondidas.push(idPregunta);
  }
}



private mezclarArray<T>(array: T[]): T[] {
  return array
    .map(item => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

terminarIntento(): void {
  // Verificar si todas las preguntas han sido respondidas
  const todasRespondidas = this.preguntas.every(p => this.seleccionadas[p.idPregunta]);

  if (!todasRespondidas) {
    Swal.fire({
      icon: 'warning',
      title: 'Faltan preguntas',
      text: 'Debes responder todas las preguntas antes de terminar el examen.'
    });
    return;
  }

  // Confirmar finalización
  Swal.fire({
    icon: 'question',
    title: '¿Estás seguro?',
    text: 'Una vez termines el intento no podrás cambiar tus respuestas.',
    showCancelButton: true,
    confirmButtonText: 'Sí, terminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      // Calcular resultados
      let correctas = 0;
      let incorrectas = 0;

      this.preguntas.forEach(p => {
        const seleccion = this.seleccionadas[p.idPregunta];
        const respuestaCorrecta = p.respuestas.find(r => r.es_correcta)?.texto_respuesta;

        if (seleccion === respuestaCorrecta) {
          correctas++;
        } else {
          incorrectas++;
        }
      });

      this.acertadas = correctas;
      this.fallidas = incorrectas;
      this.puntaje = correctas; // puedes multiplicar por 10 o el valor que desees
      this.mostrarResultados = true;

      Swal.fire({
        icon: 'success',
        title: 'Examen finalizado',
        text: `Tu puntaje es ${this.puntaje}`
      });
    }
  });
}

inicio(){
  Swal.fire({    
    title: 'CUESTIONARIO INICIADO',
    text: `TIENE 45 MINUTOS PARA RENDIR EL CUESTIONARIO`,
    icon: 'success',
  });
}
misintentossssssssssss(){
  Swal.fire({
    
    title: 'MIS INTENTOS',
    text: `FUNCION EN DESARROLLO`,
    icon: 'success',
  });
}

terminado(){
  const n:Nota={
    id_curso:this.idCurso,
    correctas:this.acertadas,
    incorrectas:this.fallidas
  }
  this.cursosService.saveNota(n).subscribe(data=>{
    Swal.fire({
      title: "Nota Guardada",
      text: "Sigue Estudiando tu Puedes",
      icon: "success",      
    });
    this.cerrarDialogo.emit(); //
  })
}

salir(){
  if(this.mostrarResultados){
    Swal.fire({
      title: "Nota Guardada",
      text: "Sigue Estudiando tu Puedes",
      icon: "success",      
    });
    this.cerrarDialogo.emit(); //
  }else{
    Swal.fire({
      title: "Salir del Cuestionario",
      text: "¿ Cuestionario no Terminado, Estás seguro de salir  ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Salir"
    }).then((result) => {
      if (result.isConfirmed) {
        this.cerrarDialogo.emit(); //
      }
    });
  }}


}
