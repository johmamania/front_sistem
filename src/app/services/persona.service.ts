import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  private url: string = `${environment.HOST}/dependencia`;

  constructor(private http: HttpClient) { }

  buscarSugerencias(buscar: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/buscarpornombes/${buscar}`);
  }


}
