import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  imports: [CommonModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  showRegister = signal(false);

  toggleRegistrationForm() {
    this.showRegister.set(!this.showRegister());
  }

}
