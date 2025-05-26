import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { FormGroup, FormsModule } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../../environments/environment.development';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../../model/users';
import { UserUpdate } from '../../../model/userupdate';
import { Rol } from '../../../model/rol';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [MaterialModule, FormsModule, ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent {

  message: string;
  error: string;
  usuarioChasqui: string;
  usernames: string;
  usuarioChasquiDisabled: boolean = true;
  cipSuper: string;

  id:  number;
  dni: string;
  username: string;
  telefono: string;
  fullname: string;
  nivel: number;
  cursos:number;
  selectednivel:any;
  roles: Rol[] = [];
  categoria:number;
  idsRoles: number[] = [];
  userForm: FormGroup;
  @Output() cerrarDialogo = new EventEmitter<void>();
  user: User;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UsersService,
  ) { }

  ngOnInit(): void {
    const helper = new JwtHelperService();
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);
    this.usernames = decodedToken.sub;
    this.obtenerDatosElemento();  
  }

  obtenerDatosElemento() {
    this.userService.getByUsername(this.data.username).subscribe(
      (user: User) => {
        this.id = this.data.id,
        this.dni = user.dni,
        this.username = user.username,
        this.fullname = user.fullname,
        this.telefono= user.telefono
      }, error => {
        console.log('Error al obtener los datos de la experiencia:', error);
      }
    );
  }

  actualizarUsuario() {
    if (this.camposLlenos()) {
      const newUser: UserUpdate = {
        username: this.username,
        dni: this.dni,
        fullname: this.fullname,
        estado: 1,
        telefono:this.telefono
      };
      if (this.nivel == 1) {
        this.idsRoles = [1];        // 1	ADMINISTRADOR
      } else if(this.nivel == 2){
        this.idsRoles = [2];        
      }else if (this.nivel == 3) {
        this.idsRoles = [3];       
      }
      this.userService.updateUser(this.data.idUser , newUser, this.idsRoles).subscribe(data => {
        Swal.fire({
          title: "Usuario",
          text: "Usuario actualizado correctamente!",
          icon: "success" });
        this.fullname = '';
        this.telefono = '';    
        this.dni = '';
        this.nivel = null;
        this.cerrarDialogo.emit(); //
      });     
    }
  }

  camposLlenos(): boolean {
    return !!this.dni &&
      !!this.fullname &&
      !!this.telefono &&
      !!this.username &&
      !!this.nivel;
  }

}
