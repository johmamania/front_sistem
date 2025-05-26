import { Component } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment.development';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-manual',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './manual.component.html',
  styleUrl: './manual.component.css'
})
export class ManualComponent {



username: string;
pdfSrc: string;


constructor(
  private menuService: MenuService,
 ) { }

ngOnInit(): void {
  /*
  const helper = new JwtHelperService();
  const token = sessionStorage.getItem(environment.TOKEN_NAME);
  const decodedToken = helper.decodeToken(token);
  this.username = decodedToken.sub;
  this.menuService.getMenusByUser(this.username).subscribe(data => this.menuService.setMenuChange(data));
*/
}
}
