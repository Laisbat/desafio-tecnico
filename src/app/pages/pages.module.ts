import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PagesRoutingModule } from './pages-routing.module';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuariosEditarComponent } from './usuarios-editar/usuarios-editar.component';

@NgModule({
  declarations: [UsuariosComponent, UsuariosEditarComponent],
  imports: [CommonModule, PagesRoutingModule],
})
export class PagesModule {}
