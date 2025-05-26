import { Cursos } from "./Cursos";
import { Rol } from "./rol";

export class User {
  idUser?: any;
  username?: string;
  dni?: string;
  fullname?: string;
  telefono?: string;
  estado?:number;
  roles: Rol;
  cursos?:Cursos;

}
