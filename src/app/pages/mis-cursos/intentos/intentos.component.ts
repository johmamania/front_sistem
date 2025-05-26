import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { Intento } from '../../../model/Intento';
import { CursosService } from '../../../services/cursos.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Nota } from '../../../model/Nota';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-intentos',
  standalone: true,
  imports: [MaterialModule,CommonModule],
  templateUrl: './intentos.component.html',
  styleUrl: './intentos.component.css'
})
export class IntentosComponent implements OnInit {
  intentos: boolean=false;
   notas:Nota[]=[];

  @Output() cerrarDialogo = new EventEmitter<void>();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    //public dialog: MatDialog,
  //  private menuService: MenuService,
   // private _snackBar: MatSnackBar,    
    private cursosService:CursosService,
   // private userService: UsersService,
       ) { }


  ngOnInit(): void {
    // Datos de ejemplo
    this.cargarintentos();
  }


  cargarintentos(){
    this.cursosService.getlistNotas(this.data).subscribe(data=>{
      this.notas=data;
      if (!data || data.length === 0) {
        this.intentos=true;
      }
    })
  }
}
