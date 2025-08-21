import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ModalConfirmacaoComponent } from './components/modal-confirmacao/modal-confirmacao.component';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosComponent } from './usuarios.component';

@NgModule({
  declarations: [UsuariosComponent, ModalConfirmacaoComponent],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatPaginatorModule,
  ],
})
export class UsuariosModule {}
