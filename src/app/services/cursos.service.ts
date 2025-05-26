import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

import { Preguntas } from '../model/Preguntas';
import { Observable } from 'rxjs';
import { Cursos } from '../model/Cursos';
import { Nota } from '../model/Nota';


@Injectable({
  providedIn: 'root'
})
export class CursosService {

  private url: string = `${environment.HOST}/cursos`;

  constructor(private http: HttpClient) { }

  getListCursosAll(){
    return this.http.get<Cursos[]>(`${this.url}/list-all`, {});
  }
 
  getCursosByUser(username:String){
    return this.http.get<Cursos[]>(`${this.url}/list-cursos-user/${username}`, {});
  }

  listPreguntasByIdCurso(idCurso:number){
    return this.http.get<Preguntas[]>(`${this.url}/list-preguntas/${idCurso}`, {});
  }

  pageCursos(s: string, page: number, pageSize: number): Observable<any> {
    let params = new HttpParams()
      .set('s', s)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<Cursos>(`${this.url}/page`, { params: params });
  }

  findByIdcurso(idCurso:number){
    return this.http.get<Cursos>(`${this.url}/id/${idCurso}`, {});
  }
 
  saveCurso(c: Cursos) {
    return this.http.post(`${this.url}/save`, c)
  }

  updateCurso(idCurso:number,c: Cursos) {
    return this.http.put(`${this.url}/update/${idCurso}`, c)
  }

 
  deleteCurso(idCurso: number): Observable<any> {
    return this.http.delete(`${this.url}/delete/${idCurso}`, {});
  }

  saveNota(c: Nota) {
    return this.http.post(`${this.url}/save-nota`, c)
  }

  getlistNotas(idCurso:number){
    return this.http.get<Nota[]>(`${this.url}/list-all-notas/${idCurso}`, {});
  }

}
