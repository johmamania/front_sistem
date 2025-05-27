import { Component, OnInit, ViewChild } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment.development';
import { MaterialModule } from '../../material/material.module';
import { FormsModule } from '@angular/forms';
import {  RouterOutlet } from '@angular/router';
import { MenuService } from '../../services/menu.service';


import { CursosService } from '../../services/cursos.service';
import { Cursos } from '../../model/Cursos';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MaterialModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  username: string;
  cursos:Cursos[];

  constructor( 
    private menuService: MenuService,
    private cursosService:CursosService,

    ) {
   
  }

  ngOnInit(): void {
     /* const helper = new JwtHelperService();
      const token = sessionStorage.getItem(environment.TOKEN_NAME);
      const decodedToken = helper.decodeToken(token);
      this.username = decodedToken.sub;
      this.menuService.getMenusByUser(this.username).subscribe(data => this.menuService.setMenuChange(data));
    */
      this.listarCursos()
  }



  listarCursos() {
    this.cursosService.getListCursosAll().subscribe(data => {
      this.cursos=data;
    });
  }


  matricularme(){
    Swal.fire({
      
      title: 'NUEVA MATRICULA',
      text: `FUNCION EN DESARROLLO ...ESPERA UN POCO UNPOQUIITO MASSS  `,
      icon: 'success',
    });

















    
  }

















}
