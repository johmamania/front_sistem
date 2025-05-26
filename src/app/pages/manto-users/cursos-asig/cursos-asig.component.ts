import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material/material.module';
import { Cursos } from '../../../model/Cursos';
import { CursosService } from '../../../services/cursos.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-cursos-asig',
  standalone: true,
  imports: [MaterialModule, FormsModule,],
  templateUrl: './cursos-asig.component.html',
  styleUrl: './cursos-asig.component.css'
})
export class CursosAsigComponent {
  

    cursos: Cursos[] = [];
    userCursos: Cursos[] = []; 
    username: string;
  
    @Output() cerrarDialogo = new EventEmitter<void>();
    
    constructor(
      private cursosService: CursosService,
      private usersService:UsersService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
    }
  
    ngOnInit(): void {
  
      this.cursosService.getListCursosAll().subscribe(data => {
        this.cursos = data;
        this.getAndMarkUserRoles(this.data.username);
      });
    }
  
    getAndMarkUserRoles(username:string ): void {
      this.cursosService.getCursosByUser(username).subscribe(data => {
        this.userCursos = data;
        this.cursos.forEach(c => {
          c.checked = this.userCursos.some(userCurso => userCurso.idCurso === c.idCurso);
        });
      });
    }
  
    
    cambiarRoles(): void {  
      const cursosId: number[] = [];  
      this.cursos.forEach(c => {
        if (c.checked) {
          cursosId.push(c.idCurso); 
        }    });  
      this.usersService.changeCursosUser(this.data.username, cursosId).subscribe(  data=>{
        Swal.fire({
          title:"Cursos",
          text:"Cursos Asignados Correctamente",
          icon:"success"
        })
      }

      );
  
      this.cerrarDialogo.emit();
    }

}
