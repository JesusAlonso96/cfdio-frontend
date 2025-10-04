import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { LoginComponent } from '../login/login';
import { RegisterComponent } from '../register/register';

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
    console.log("entre aqui")
    this.showRegister.set(!this.showRegister());
  }
}
