import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth/authservice';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {

  Name: string = '';


  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController


  ) { }

  async ngOnInit() {
    const user: any = await new Promise(resolve => {
      this.authService.getUser().subscribe(u => resolve(u));
    });

    this.Name = user?.displayName || user?.email || 'Usuario';
  }

  async confirmLogout() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar sesión',
      message: '¿Seguro que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Salir',
          handler: () => {
            this.authService.logout().then(() => {
              this.router.navigate(['/login']);
            });
          }
        }
      ]
    });

    await alert.present();
  }


}
