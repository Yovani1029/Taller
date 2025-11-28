import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/authservice';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onRegister(data: any) {
    const ok = await this.authService.registerUser(data);

    if (ok) {
      this.router.navigate(['/login']);
    }
  }

}
