import { Component, EventEmitter, Output } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { NgFor, NgIf } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../../environments/environment.development';
import Swal from 'sweetalert2';
import { UserSave } from '../../../model/usesave';

import { Rol } from '../../../model/rol';
import { PersonaService } from '../../../services/persona.service';
import { UsersService } from '../../../services/users.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MaterialModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  message: string;
  error: string;

  usuarioChasqui: string;
  usernames: string;
  usuarioChasquiDisabled: boolean = true;
  status_qr: number = 0;
  cipSuper: string;

  selectedNucleo: any;
  selectedBrigada: any;
  selectedDependencia: any;



  cip: string;
  username: string;
  usernamereg:string;
  grado: string;
  fullname: string;
  arma: string;
  nucleouser: string;
  brigadauser:string;
  unidaduser:string;

  idnucleo:string;
  idbrigada:string;
  idunidad:string;

  estado: number;

  dni: string;
  telefono: string;
  nivel: number;

  roles:      Rol[] = [];


  selectedrole: any;
  categoria:number;
  selectedcategoria;

  idsRoles: number[] = [];
  userForm: FormGroup;
  @Output() cerrarDialogo = new EventEmitter<void>();

  constructor(
    private personaService: PersonaService,
    private userService: UsersService,


  ) { }

  ngOnInit(): void {
    const helper = new JwtHelperService();
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);
    this.usernames = decodedToken.sub;

    //this.findallcategorias();
  }



/*
  findallcategorias() {
    this.categoriaService.listcategoria().subscribe(cat => {
      this.categorialist = cat;
    });
  }*/
  crearUsuario() {
    if (this.camposLlenos()) {
      const newUser: UserSave = {
        username: this.usernamereg,
        dni: this.dni,
        fullname: this.fullname,
        telefono:this.telefono,
        estado: 1,

      //  nucleo:this.idnucleo,
      //  brigada:this.idbrigada,
      //  dependencia:this.idunidad,


      };

      if (this.nivel == 1) {
        this.idsRoles = [1];        // 1	ADMINISTRADOR
      } else if(this.nivel == 2){
        this.idsRoles = [2];        // USER
      }
      this.userService.saveUser(newUser, this.idsRoles).subscribe(data => {
        Swal.fire({
          title: "Usuario",
          text: "Usuario registrado correctamente!",
          icon: "success"
        });

        this.cip = null;
        this.usuarioChasqui = '';
        this.grado = '';
        this.arma = '';
        this.fullname = '';
        this.telefono = '';
        this.nucleouser= '';
        this.brigadauser= '';
        this.unidaduser= '';
        this.nivel = null;

        this.cerrarDialogo.emit();
      });
    }
  }

  camposLlenos(): boolean {
    return !!this.dni &&
    !!this.nivel



    //!!this.nivel;
  }

  //buscar por cip  para registrar
  getbyCip(cip: string) {
    this.userService.getByCip(this.cip).subscribe(data => {
      const resultado = data.chasqui.replace('@ejercito.mil.pe', '')
      this.usuarioChasqui = resultado.toUpperCase();
      this.grado = data.grado;
      this.arma = data.arma;
      this.fullname = data.apellidoPaterno + " " + data.apellidoMaterno + " " + data.nombres;
      this.dni = data.dni;
      this.nucleouser = data.nucleo,
      this.brigadauser= data.brigada,
      this.unidaduser= data.unidad,

      this.idnucleo = data.idnucleo,
      this.idbrigada= data.idbrigada,
      this.idunidad= data.idunidad
    });
  }







  validarNumero(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.charCode);
    if (!/^\d+$/.test(inputChar)) {
      event.preventDefault();
    }
  }

  validarLongitud() {
    if (this.cip && this.cip.length > 9) {
      this.cip = this.cip.slice(0, 9);
    }
  }
  limpiarCampo() {
    this.cip = null;
    this.usuarioChasqui = '';
    this.grado = '';
    this.arma = '';
    this.fullname = '';
    this.telefono = '';
    this.selectedNucleo = '';
    this.selectedBrigada = '';
    this.cipSuper = '';
    this.selectedrole = '';
    this.nivel = null;
    this.brigadauser='';
    this.nucleouser='';
    this.unidaduser='';
  }









}
