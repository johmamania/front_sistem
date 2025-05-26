import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../model/users';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RolesMenuComponent } from './roles-menu/roles-menu.component';
import { MatDialog } from '@angular/material/dialog';
import { MenuService } from '../../services/menu.service';
import { Menu } from '../../model/menu';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment.development';
import Swal from 'sweetalert2';
import { RegisterComponent } from './register/register.component';
import { EditComponent } from './edit/edit.component';
import { UsersService } from '../../services/users.service';
import { CursosService } from '../../services/cursos.service';
import { CursosAsigComponent } from './cursos-asig/cursos-asig.component';


@Component({
  selector: 'app-manto-users',
  standalone: true,
  imports: [MaterialModule, RouterOutlet],
  templateUrl: './manto-users.component.html',
  styleUrl: './manto-users.component.css'
})
export class MantoUsersComponent implements OnInit{

  dataSource: MatTableDataSource<User>;
  displayedColumns: string[] = ['n', 'dni', 'username',  'fullname','estado', 'cursos', 'edit', 'delete'];;

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
    /*
    const helper = new JwtHelperService();
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);

    this.username = decodedToken.sub;
    this.menuService.getMenusByUser(this.username).subscribe(data => this.menuService.setMenuChange(data));

    this.userService.getMessageChange().subscribe(data => {
      this._snackBar.open(data, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' })
    });
*/
    this.filterlistusers();
  }

  filterlistusers(): void {
    this.userService.filteruserslist(this.searchParam, this.page, this.pageSize).subscribe(
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
    this.filterlistusers();
  }

  createTable(data: User[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
  }

  showMore(e: any) {
    this.userService.filteruserslist(this.searchParam,e.pageIndex, e.pageSize).subscribe(data => {
      this.totalElements = data.totalElements;
      this.createTable(data.content);
    });
  }



  openRegistrarModal(): void {
    const dialogRef = this.dialog.open(RegisterComponent, {
      width: '57%',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refreshTable();
    });
    dialogRef.componentInstance.cerrarDialogo.subscribe(() => {
      dialogRef.close();
      Swal.fire({
        title: "Usuario registrado con éxito!!",
        icon: "success"
      });
    });
  }

  eliminarUsuario(username: string) {
    Swal.fire({
      title: "Eliminar usuario",
      text: "¿Estás seguro de eliminar este usuario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.eliminarUsuario(username).subscribe((response) => {
          Swal.fire({
             title: "¡Usuario eliminado!",
          icon: "success"
          })
          this.ngOnInit();
        });
      }
    });
  }

  openEditarModal(idUser: number, username: string): void {
    const dialogRef = this.dialog.open(EditComponent, {
      width: '57%',
      data: { idUser: idUser, username: username }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
    dialogRef.componentInstance.cerrarDialogo.subscribe(() => {
      dialogRef.close();
      this.refreshTable();
      Swal.fire({
        title: "Usuario Actualizado Correctamente!",
        icon: "success"
      });
    });
  }


  cursosMatriculados(id: string, username: string): void {
    const dialogRef = this.dialog.open(CursosAsigComponent, {
      data: {
        idUser: id,
        username: username
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
    dialogRef.componentInstance.cerrarDialogo.subscribe(() => {
      dialogRef.close();     
    });
  }

  changeEstado( id: number) {
    Swal.fire({
      title: "Estado",
      text: "Estas seguro de cambiar estado",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, cambiar"
    }).then((result) => {
      if (result.isConfirmed) {

        this.userService.delete(id).subscribe();
        Swal.fire({
          title: "Cambiado!",
          icon: "success"
        });
      }
    });
  }
/*
  usersreportPdf():void {
    this.loading = true;
    this.userService.usersreportPdf().subscribe(
      (response: Blob) => {
        this.pdfData = response;
        this.loading = false;
        this.openPdf();
      },
      error => {
        console.error('Error:', error);
      }
    )
  }*/
  openPdf() {
    const fileURL = URL.createObjectURL(this.pdfData);
    window.open(fileURL, '_blank');
  }


  refreshTable(): void {
    this.userService.filteruserslist(this.searchParam, this.page, this.pageSize).subscribe(data => {
      this.totalElements = data.totalElements;
      this.createTable(data.content);
    });
  }

  convertirAMayusculas() {
    if (this.buscador){
      this.buscador = this.buscador.toUpperCase();
    }
  }
}
