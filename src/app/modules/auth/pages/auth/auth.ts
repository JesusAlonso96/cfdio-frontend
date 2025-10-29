import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { LoginComponent } from '../../components/login/login';
import { RegisterComponent } from '../../components/register/register';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, LoginComponent, RegisterComponent],
  standalone: true,
  templateUrl: './auth.html',
  styleUrl: './auth.scss'
})
export class AuthComponent {
  showRegister = signal(false);

  toggleRegistrationForm() {

    const form = document.querySelector('.form-panel');
    if (form) {
      form.classList.add('fade-out');
      setTimeout(() => {
        this.showRegister.set(!this.showRegister());
      }, 200);
    } else {
      this.showRegister.set(!this.showRegister());
    }
  }
}
