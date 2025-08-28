/* eslint-disable @angular-eslint/prefer-standalone */
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuariosService } from '../../../../utils/services/usuarios.service';

@Component({
  selector: 'app-modal-confirmacao',
  standalone: false,
  templateUrl: './modal-confirmacao.component.html',
  styleUrl: './modal-confirmacao.component.scss',
})
export class ModalConfirmacaoComponent {
  loading = false;

  private readonly _ref = inject(MatDialogRef<ModalConfirmacaoComponent>);
  private readonly _data = inject(MAT_DIALOG_DATA);
  private readonly _snackService = inject(MatSnackBar);

  private readonly _usuariosService = inject(UsuariosService);

  get name(): string {
    if (this._data.user) {
      return this._data.user.name;
    }
    return 'Error';
  }

  get email(): string {
    if (this._data.user) {
      return this._data.user.email;
    }
    return 'Error';
  }

  confirmar(): void {
    this.loading = true;
    this._usuariosService.deleteUser(this._data.id).subscribe({
      next: () => {
        this._ref.close(true);
        this._snackService.open('Usuário deletado com sucesso!', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
        });
        this.loading = false;
      },
      error: (error: unknown) => {
        this._ref.close(true);
        this._snackService.open(`Erro ao deletar usuário, ${error}`, 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
        });
        this.loading = false;
      },
    });
  }

  cancelar(): void {
    this._ref.close(true);
  }
}
