import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { Menu } from '../../model/menu';

import { environment } from '../../../environments/environment.development';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MenuService } from '../../services/menu.service';
import { LoginService } from '../../services/login.service';
import { UsersService } from '../../services/users.service';
import { FooterComponent } from '../footer/footer.component';
import { CambiarpasswordComponent } from './cambiarpassword/cambiarpassword.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MaterialModule, RouterLink, RouterOutlet, RouterLinkActive,FooterComponent ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit{
menus: Menu[];
selectedMenu: string = '';
roleuser:string;
fullname: string;
username: string;
estadouser:number;




  constructor(
    private menuService: MenuService,
    private loginService: LoginService,
    private userService: UsersService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ){}

  ngOnInit(): void {
    const helper = new JwtHelperService();
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
  
    if (token && !helper.isTokenExpired(token)) {
      const decodedToken = helper.decodeToken(token);
      this.username = decodedToken.sub;
  
      // Cargar el menú del usuario
      this.menuService.getMenusByUser(this.username).subscribe(data => {
        this.menuService.setMenuChange(data);
      });
  
      // Escuchar cambios del menú (ideal si otro componente lo actualiza)
      this.menuService.getMenuChange().subscribe(data => {
        this.menus = data;
      });
  
      // Obtener los datos del usuario
      this.userService.getByUsername(this.username).subscribe((response) => {
        this.username = response.username;
        this.roleuser = response.roles[0].name;
        this.estadouser = response.estado;
        this.userService.setUsuario(response);
        this.cambiasPasword(); // verifica si debe cambiar contraseña
      });
  
      // Notificaciones generales
      this.userService.getMessageChange().subscribe(data => {
        this._snackBar.open(data, 'INFO', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      });
  
    } else {
      // Redirigir a login si el token no es válido
      //this.router.navigate(['/login']);
    }
  }
  

    cambiasPasword(){
      if(this.estadouser===0){
     //   console.log(this.estadouser);
          const dialogRef = this.dialog.open(CambiarpasswordComponent, {
            disableClose: true,
            width: '35%',
            height:'650%',
            data:this.username
          });
        
          dialogRef.afterClosed().subscribe(result => {
           // this.filterpage();
          });
          dialogRef.componentInstance.cerrarDialogo.subscribe(() => {
            dialogRef.close();
            this.logout();
         
          });
        }
      
    }



    ngOnDestroy(): void {
      console.log('LayoutComponent destruido');
    }
    








  selectMenu(menuUrl: string) {
    this.selectedMenu = menuUrl;
    sessionStorage.setItem('selectedMenu', menuUrl);
  }
  logout(){
   this.loginService.logout();
  }

}
