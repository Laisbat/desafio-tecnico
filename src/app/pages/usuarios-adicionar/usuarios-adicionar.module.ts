import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { UsuariosAdicionarRoutingModule } from './usuarios-adicionar-routing.module';
import { UsuariosAdicionarComponent } from './usuarios-adicionar.component';
@NgModule({
  declarations: [UsuariosAdicionarComponent],
  imports: [
    CommonModule,
    UsuariosAdicionarRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
})
export class UsuariosAdicionarModule {}
