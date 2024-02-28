import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ValidationErrors, Validators } from '@angular/forms';

import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  mode: string = 'login';
  loginForm!: FormGroup;
  
  constructor(
    private usersService: UsersService, 
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8)
        ]
      ],
    });
  }

  email: string = '';
  password: string = '';
  error: string = '';
 
  async login() {
    let logged = await this.usersService.login(this.email, this.password);
    if (logged) {
      this.router.navigate(['favorites']);
    } else {
      this.error = 'Bad Email or Password';
    }
  }


  async logout() {
    this.usersService.logout();
    this.router.navigate(['userManagement', 'register']);
  }
  
}
