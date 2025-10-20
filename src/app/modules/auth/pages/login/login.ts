import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-login',
  imports: [CommonModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatCheckboxModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['login.scss', '../auth/auth.scss']
})
export class LoginComponent {
  @Output() clicked = new EventEmitter<void>();
  changeForm() {
    this.clicked.emit();
  }
}
