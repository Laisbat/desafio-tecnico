import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { UserAuthService } from '../../utils/services/user-auth';
import { UsuariosService } from '../../utils/services/usuarios.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginErrorMessage = '';

  // Formulário de Login
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  private readonly _usuariosService = inject(UsuariosService);
  private readonly _userAuthService = inject(UserAuthService);
  private readonly _router = inject(Router);

  login() {
    if (this.loginForm.invalid) return;

    this._usuariosService
      .login(this.loginForm.value.email!, this.loginForm.value.password!)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.loginErrorMessage = '';
          // Armazena o token no localStorage
          this._userAuthService.setUserToken(response.data.token);
          // Redireciona para a página de usuários
          this._router.navigate(['/usuarios']);
        },
        error: (err) => {
          console.error('Erro ao fazer login:', err);
          this.loginErrorMessage = `Falha no login. ${
            err.error.message || 'Tente novamente mais tarde.'
          }`;
        },
      });
  }
}
