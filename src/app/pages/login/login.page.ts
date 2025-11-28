import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth/authservice';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  constructor(
    private auth: AuthService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.auth.getUser().subscribe(user => {
      if (user) {
        this.navCtrl.navigateRoot('/home');
      }
    });
  }

  async onLogin(data: any) {
    const ok = await this.auth.login(data.email, data.password);
    if (ok) {
      this.navCtrl.navigateRoot('/home');
    }
  }
}
