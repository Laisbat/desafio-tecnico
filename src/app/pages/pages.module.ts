import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PagesRoutingModule } from './pages-routing.module';
import { UsuariosComponent } from './usuarios/usuarios.component';

@NgModule({
  declarations: [UsuariosComponent],
  imports: [CommonModule, PagesRoutingModule],
})
export class PagesModule {}
