import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { UserAuthService } from '../utils/services/user-auth';
import { UsuariosService } from '../utils/services/usuarios.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const _userService = inject(UsuariosService);
  const _userAuthService = inject(UserAuthService);
  const _router = inject(Router);

  // Não possui token no localstorage
  const HAS_TOKEN = _userAuthService.getUserToken();

  if (!HAS_TOKEN) {
    return _router.navigate(['/login']);
  }

  try {
    // Tenta validar o token no backend
    await firstValueFrom(_userService.validateUser());
    if (state.url === '/login') {
      // Se o token é válido e a rota é a de login, redireciona para a página de usuários.
      return _router.navigate(['/usuarios']);
    }
    // Se o token é válido e a rota não é a de login, permite o acesso para a rota desejada.
    return true;
  } catch (error) {
    console.error('Erro ao validar usuário', error);
    // Se a requisição de validação falhar (token inválido), redireciona para o login.
    return _router.navigate(['/login']);
  }
};
