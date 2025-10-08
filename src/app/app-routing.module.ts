import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { authGuard } from './guards/auth-guard';
import { BaseComponent } from './layout/base/base.component';
// import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/usuarios',
  },
  {
    path: '',
    component: BaseComponent,
    // canActivate: [authGuard],
    children: [
      {
        path: 'usuarios',
        loadChildren: () =>
          import('./pages/usuarios/usuarios.module').then(
            (m) => m.UsuariosModule
          ),
      },
      {
        path: 'usuarios/:id',
        loadChildren: () =>
          import('./pages/usuarios-adicionar/usuarios-adicionar.module').then(
            (m) => m.UsuariosAdicionarModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
