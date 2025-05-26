import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators ,AbstractControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material.module';
import Swal from 'sweetalert2';
import { ChangePassword } from '../../../model/ChangePassword';

@Component({
  selector: 'app-cambiarpassword',
  standalone: true,
  imports: [MaterialModule, CommonModule, MatDialogModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './cambiarpassword.component.html',
  styleUrl: './cambiarpassword.component.css'
})
export class CambiarpasswordComponent {

  username:string;

  @Output() cerrarDialogo = new EventEmitter<void>();
  passwordForm!: FormGroup;
  matchpassword: boolean = true;
  constructor(   
    private dialogRef: MatDialogRef<CambiarpasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UsersService,  
    private fb: FormBuilder,
    ){ this.username=this.data }



    ngOnInit(): void {
      this.passwordForm = this.fb.group({
        username: [{ value: this.username, disabled: true }],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      }, {
        validators: this.passwordsMatch
      });
      this.passwordForm.valueChanges.subscribe(() => {
        this.verificarCoincidencia();
      });
      this.intentosalir();
    }

    passwordsMatch(form: AbstractControl) {
      const pass = form.get('newPassword')?.value;
      const confirm = form.get('confirmPassword')?.value;
      if (pass !== confirm) {
        return { mismatch: true };
      }
      return null;
    }


  datasuser(){
    this.userService.getByUsername(this.username).subscribe((response) => {
      this.username = response.username;
  });
  }

  onSubmit() {
    const newpassword :ChangePassword={
      username:this.username,
      newPassword:this.passwordForm.value.newPassword,//this.passwordForm.get('newPassword')?.value;
      confirmNewPasword:this.passwordForm.value.confirmPassword,
    }
    if (this.passwordForm.valid) {
      this.userService.changePassword(newpassword).subscribe(rep=>{
        Swal.fire({
          title:"Contraseña Cambiada",
          text:"Su Contraseña Fue Cambiada Con Exito, Inicie Sesion Con Su Nueva Contraseña",
          icon:"success"

        });
      })

      this.cerrarDialogo.emit();
    }
  }

  verificarCoincidencia() {
    const pass = this.passwordForm.get('newPassword')?.value;
    const confirm = this.passwordForm.get('confirmPassword')?.value;
    this.matchpassword = pass === confirm;
  }

  intentosalir(){
    this.dialogRef.backdropClick().subscribe(() => {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Debes cambiar la contraseña antes de continuar',
        confirmButtonText: 'Entendido'
      });
    });
  }
  onCancel() {
    this.cerrarDialogo.emit();
  }

}

