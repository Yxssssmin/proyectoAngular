import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm!: FormGroup;


  constructor(
    private usersService: UsersService, 
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      email: [
        '', 
        [
          Validators.required, 
          Validators.email
        ]
      ],
      username: [
        '', 
        [
          Validators.required, 
          Validators.minLength(2)
        ]
      ],
      password: [
        '', 
        [
          Validators.required,
          Validators.minLength(8)
        ]
      ],
      confirmpassword: [
        '', 
        [
          Validators.required,
        ]
      ],
    }, 
    { 
      validators: this.passwordMatchValidator.bind(this) 
    }
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmpassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  email: string = '';
  password: string = '';
  error: string = '';
  fullname: string = '';
  username: string = '';
  confirmpassword: string = '';

  async register() {
    let registered = await this.usersService.register(
      this.email,
      this.password,
      this.username,
      this.fullname,
    );
      
    if (registered) {
      this.router.navigate(['userManagement', 'login']);
    } else {
      alert('Por favor, valida tu cuenta antes de iniciar sesión.');
    }
  }

}
