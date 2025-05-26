import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { Cursos } from '../../model/Cursos';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Menu } from '../../model/menu';
import { MatDialog } from '@angular/material/dialog';
import { MenuService } from '../../services/menu.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CursosService } from '../../services/cursos.service';
import { UsersService } from '../../services/users.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment.development';
import Swal from 'sweetalert2';
import { RegistrarComponent } from './registrar/registrar.component';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './cursos.component.html',
  styleUrl: './cursos.component.css'
})
export class CursosComponent implements OnInit{

  dataSource: MatTableDataSource<Cursos>;
  displayedColumns: string[] = ['n', 'id', 'name',  'des','estado', 'edit', 'delete'];;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  buscador: string;
  allData: any[];
  menus: Menu[];
  username: string;
  loading: boolean;
  pdfData: Blob;
  totalElements: number = 0;
  tamano:number=1000000000;


  searchParam: string = '';
  page: number = 0;
  pageSize: number = 10;
  constructor(
    public dialog: MatDialog,
    private menuService: MenuService,
    private _snackBar: MatSnackBar,
    private cursosService:CursosService,
    private userService: UsersService,    ) { }


  ngOnInit(): void {
 /*   const helper = new JwtHelperService();
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);

    this.username = decodedToken.sub;
    this.menuService.getMenusByUser(this.username).subscribe(data => this.menuService.setMenuChange(data));
    this.userService.getMessageChange().subscribe(data => {
      this._snackBar.open(data, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' })
    });*/

    this.filterpage();
  }

  filterpage(): void {
    this.cursosService.pageCursos(this.searchParam, this.page, this.pageSize).subscribe(
      data => {
        this.allData = data;
        this.totalElements = data.totalElements;
        this.createTable(data.content);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error => {
        console.error('Error fetching data', error);
      }
    );
  }

  dinamicSearch(event: any): void {
    this.searchParam = event.target.value.trim();
    this.page = 0; // Reset to first page on new search
    this.filterpage();
  }

  createTable(data: Cursos[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
  }

  showMore(e: any) {
    this.cursosService.pageCursos(this.searchParam,e.pageIndex, e.pageSize).subscribe(data => {
      this.totalElements = data.totalElements;
      this.createTable(data.content);
    });
  }

  openRegistrarModal(idCurso: number, ): void {
    const dialogRef = this.dialog.open(RegistrarComponent, {
      width: '57%',
      data:idCurso
    });

    dialogRef.afterClosed().subscribe(result => {
      this.filterpage();
    });
    dialogRef.componentInstance.cerrarDialogo.subscribe(() => {
      dialogRef.close();
   
    });
  }
  eliminar(id: number) {
    Swal.fire({
      title: "Eliminar Curso",
      text: "¿Estás seguro de eliminar este Curso?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.cursosService.deleteCurso(id).subscribe((response) => {
          Swal.fire({
             title: "Curso eliminado!",
          icon: "success"
          })
          this.filterpage();
        });
      }
    });
  }
  convertirAMayusculas() {
    if (this.buscador){
      this.buscador = this.buscador.toUpperCase();
    }
  }

}
