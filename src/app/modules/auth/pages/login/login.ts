import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  imports: [MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  isDark = false;
  constructor() {
    console.log("entre")
  }
  toggleTheme() {
    this.isDark = !this.isDark;


    document.body.classList.toggle('dark-theme');

  }
}
