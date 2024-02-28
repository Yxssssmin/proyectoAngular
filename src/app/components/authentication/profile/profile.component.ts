import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { UsersService } from '../../../services/users.service';
import { IUser } from '../../../interfaces/user';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  
  constructor(private formBuilder: FormBuilder, private userService: UsersService) {
    this.crearFormulario();
  }

  formulario!: FormGroup;


  ngOnInit(): void {
    this.userService.isLogged().then((logged: any) => {
      if (logged) {
        this.userService.userSubject
          .pipe(
            map((p: IUser) => {
              return {
                id: p.id,
                username: p.username,
                full_name: p.full_name,
                avatar_url: p.avatar_url,
                website: p.website,
              };
            })
          )
          .subscribe((profile: any) => this.formulario.setValue(profile));
        }
    });
  }

  // // Metodo para guardar los cambios en el perfil
  // guardarPerfil() {
  //   if (this.formulario.valid) {
  //     const updatedProfile: IUser = this.formulario.value;

  //     // Llamamos al service para actualizar el perfil
  //     this.userService
  //       .updateProfile(
  //         updatedProfile.id,
  //         updatedProfile.username,
  //         updatedProfile.full_name
  //       )
  //       .then((response) => {
  //         console.log('Perfil actualizado', response);
  //         this.profileUpdated = true;

  //         // Almacenar en localStorage para verificar en ngOnInit()
  //         localStorage.setItem('profileUpdated', 'true');

  //         // Puedes restablecer el estado después de mostrar el mensaje si es necesario
  //         setTimeout(() => {
  //           this.profileUpdated = false;
  //           localStorage.removeItem('profileUpdated');
  //         }, 3000);
  //       })
  //       .catch((error) => {
  //         console.error('Error al actualizar el perfil', error);
  //       });
  //   }
  // }

  onSubmit() {
    if (this.formulario.valid) {
      this.userService.setProfile(this.formulario);
    } else {
      console.error('El formulario no es válido');
    }
  }

  crearFormulario() {
    this.formulario = this.formBuilder.group({
      id: [''],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern('.*[a-zA-Z].*'),
        ],
      ],
      full_name: [
        '', 
        [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern('.*[a-zA-Z].*'),
        ]
      ],
      avatar_url: [''],
      website: ['', websiteValidator('http.*')],
    });
  }

  get usernameNoValid() {
    return (
      this.formulario.get('username')!.invalid &&
      this.formulario.get('username')!.touched
    );
  }

  get fullNameNoValid() {
    return (
      this.formulario.get('full_name')!.invalid &&
      this.formulario.get('full_name')!.touched
    );
  }

  chargeAvatar(event: Event) {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.formulario.patchValue({ avatar_url: reader.result });
          this.formulario.get('avatar_url')?.updateValueAndValidity();
        };
        reader.readAsDataURL(file);
      }
    }
}

  function websiteValidator(pattern: string): ValidatorFn {
    return (c: AbstractControl): { [key: string]: any } | null => {
      if (c.value) {
        let regexp = new RegExp(pattern);
  
        return regexp.test(c.value) ? null : { website: c.value };
      }
      return null;
    };
}

