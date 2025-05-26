import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { User } from '../model/users';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { Persona } from '../model/persona';
import { UserSave } from '../model/usesave';
import { UserUpdate } from '../model/userupdate';

import { Rol } from '../model/rol';
import { ChangePassword } from '../model/ChangePassword';


export interface Role {
  idRole: number;
  name: string;
  description: String;
  checked?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private url: string = `${environment.HOST}/users`;

  private userChange: Subject<User[]> = new Subject<User[]>();
  private messageChange: Subject<string> = new Subject<string>();
 ///
 private usuarioSubject = new BehaviorSubject<User | null>(null);
 public usuario$ = this.usuarioSubject.asObservable();

 // Guarda los datos del usuario cuando los obtienes
 setUsuario(usuario: User): void {
   this.usuarioSubject.next(usuario);
 }

 // Obtener el valor actual sin suscribirse
 getUsuarioActual(): User | null {
   return this.usuarioSubject.value;
 }
  constructor(private http: HttpClient) { }



   
  














  filteruserslist(s: string, page: number, pageSize: number): Observable<any> {
    let params = new HttpParams()
      .set('s', s)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<User>(`${this.url}/page`, { params: params });
  }

 
  saveUser(user: UserSave, idsRoles: number[]): Observable<any> {
    const url = `${this.url}?idsRoles=${idsRoles.join(',')}`;
    const userToSend = {
      ...user,
 
    };
    return this.http.post(url,userToSend);
  }

  updateUser(idUser: number, user: UserUpdate, roleIds: number[]): Observable<any> {
    return this.http.put<any>(`${this.url}/update/${idUser}?idsRoles=${roleIds.join(',')}`, user);
  }

  changeRoles(username: string, rolesIds: number[]): Observable<any> {
    const url = `${this.url}/roles/${username}`;
    return this.http.put(url, rolesIds);
  }

  changeEstado(username: string, estado: number): Observable<any> {
    return this.http.put(`${this.url}/estado/${username}/${estado}`, {});
  }

  changePassword(newPassword: ChangePassword ): Observable<any> {
    return this.http.put(`${this.url}/change-password`, newPassword);
  }

  eliminarUsuario(username: string): Observable<any> {
    return this.http.delete(`${this.url}/${username}`, {});
  }

  getByUsername(username: string) {
    return this.http.get<User>(`${this.url}/${username}`);
  }


  changeCursosUser(username: string, isCursos: number[]): Observable<any> {
    const url = `${this.url}/cursos-update-user/${username}`;
    return this.http.put(url, isCursos);
  }

  buscarporname(fullname: string): Observable<string[]> {
    return this.http.get<any[]>(`${this.url}/names?term=${fullname}`).pipe(
      map(response => response.map(person => person.fullName))
    );





    ///
    
  }












  //buscar por cip registrar
  getByCip(cip: string) {
    return this.http.get<Persona>(`${this.url}/cip/${cip}`);
  }

  setUserChange(data: User[]) {
    this.userChange.next(data);
  }

  getUserChange() {
    return this.userChange.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.url}/roles`);
  }

  getRolesForUser(id: string): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.url}/roles/${id}`);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  findAll() {
    return this.http.get<User[]>(this.url);
  }

  /*
  usersreportPdf(): Observable<Blob> {
    return this.http.get(`${this.url}/export-pdfUsers`, { responseType: 'blob' })
  }
*/









}

