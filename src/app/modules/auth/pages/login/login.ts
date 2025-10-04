import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  imports: [CommonModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: '../auth/auth.scss'
})
export class LoginComponent {
  @Output() clicked = new EventEmitter<void>();
  changeForm() {
    this.clicked.emit();
  }
}
