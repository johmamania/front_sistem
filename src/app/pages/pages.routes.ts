import { Routes } from '@angular/router';
import { Not403Component } from './not403/not403.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { certGuard } from '../guard/cert.guard';
import { ManualComponent } from './manual/manual.component';
import { MantoUsersComponent } from './manto-users/manto-users.component';
import { RegisterComponent } from './manto-users/register/register.component';
import { MisCursosComponent } from './mis-cursos/mis-cursos.component';
import { CursosComponent } from './cursos/cursos.component';

export const pagesRoutes: Routes = [

  { path: 'home', component: DashboardComponent, canActivate: [certGuard] },
  { path: 'mis-cursos', component: MisCursosComponent, canActivate: [certGuard] },
  { path: 'cursos', component: CursosComponent, canActivate: [certGuard] },
  { path: 'manual', component: ManualComponent, canActivate: [certGuard] },
  { path: 'usuarios', component: MantoUsersComponent,
    children: [
            { path: 'register-user', component: RegisterComponent },
    ],
  },

  { path: 'not-403', component: Not403Component },


];
