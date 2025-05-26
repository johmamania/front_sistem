import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment.development';
import { MatDialog } from '@angular/material/dialog';
import { MenuService } from '../../services/menu.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../services/users.service';
import { CursosService } from '../../services/cursos.service';
import { Cursos } from '../../model/Cursos';
import { ExamenComponent } from './examen/examen.component';
import Swal from 'sweetalert2';
import { IntentosComponent } from './intentos/intentos.component';

@Component({
  selector: 'app-mis-cursos',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './mis-cursos.component.html',
  styleUrl: './mis-cursos.component.css'
})
export class MisCursosComponent implements OnInit{

  username:string;
  miscursos:Cursos[];
  constructor(
    public dialog: MatDialog,
    private menuService: MenuService,
    private _snackBar: MatSnackBar,    
    private cursosService:CursosService,
    private userService: UsersService,    ) { }

  ngOnInit(): void {
    /*const helper = new JwtHelperService();
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);

    this.username = decodedToken.sub;
    this.menuService.getMenusByUser(this.username).subscribe(data => this.menuService.setMenuChange(data));

    this.userService.getMessageChange().subscribe(data => {
      this._snackBar.open(data, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' })
    });
*/const usuario = this.userService.getUsuarioActual();
this.username = usuario.username;
/*
this.userService.usuario$.subscribe(usuario => {
  if (usuario) {
    this.username = usuario.username;
   // this.roleuser = usuario.roles[0].name;
  //  this.estadouser = usuario.estado;
  }
});*/
   this.listcursosUser();
  }

  cursos = [
    { nombre: 'Reglamentos', descripcion: 'Curso sobre reglamentos oficiales.' },
    { nombre: 'T/COMP INFO', descripcion: 'Tecnología y computación.' },
    { nombre: 'Matemáticas', descripcion: 'Curso de matemáticas avanzadas.' },
    { nombre: 'Historia', descripcion: 'Historia universal.' },
    { nombre: 'Biología', descripcion: 'Estudio de seres vivos.' },
    // ... agrega más cursos si quieres
  ];

  listcursosUser(){
    this.cursosService.getCursosByUser(this.username).subscribe(data=>{
      this.miscursos=data;
    })

  }

  accederExamen(idCurso:number){
    Swal.fire({
      title: "Empezar Cuestionario",
      text: "¿Estás seguro de Empezar este Cuestionario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Empezar"
    }).then((result) => {
      if (result.isConfirmed) {
      
          const dialogRef = this.dialog.open(ExamenComponent, {  
            disableClose: true,
            width: '110%',
            height: '98%',
            data:idCurso
          });
          dialogRef.afterClosed().subscribe(result => {
            this.ngOnInit();
          });
          dialogRef.componentInstance.cerrarDialogo.subscribe(() => {
            dialogRef.close();
          
          }   );
        
      
      }
    });
    
  }
  misintentos(idCurso:number ): void {
    const dialogRef = this.dialog.open(IntentosComponent, {
      width: '57%',
      data:idCurso
    });
  
    dialogRef.afterClosed().subscribe(result => {
     // this.filterpage();
    });
    dialogRef.componentInstance.cerrarDialogo.subscribe(() => {
      dialogRef.close();
   
    });
  }

  

}
