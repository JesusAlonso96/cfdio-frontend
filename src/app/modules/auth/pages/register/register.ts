import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-register',
  imports: [CommonModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule],
  standalone: true,
  templateUrl: './register.html',
  styleUrl: '../auth/auth.scss'
})
export class RegisterComponent {
  @Output() clicked = new EventEmitter<void>();
  changeForm() {
    this.clicked.emit();
  }
}
