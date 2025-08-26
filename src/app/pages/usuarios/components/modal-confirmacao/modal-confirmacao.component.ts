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
  loading: boolean = false;

  private _ref = inject(MatDialogRef<ModalConfirmacaoComponent>);
  private _data = inject(MAT_DIALOG_DATA);
  private _snackService = inject(MatSnackBar);

  constructor(private readonly _usuariosService: UsuariosService) {}

  get name(): string {
    if (!!this._data.user) {
      return this._data.user.name;
    }
    return 'Error';
  }

  get email(): string {
    if (!!this._data.user) {
      return this._data.user.email;
    }
    return 'Error';
  }

  confirmar(): void {
    this.loading = true;
    this._usuariosService.deleteUser(this._data.id).subscribe({
      next: () => {
        this._ref.close(true);
        this._snackService.open('Usuário deletado com sucesso', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
        });
      },
      error: (error: any) => {
        this._ref.close(true);
        this._snackService.open(`Erro ao deletar usuário, ${error}`, 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
        });
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  cancelar(): void {
    this._ref.close(true);
  }
}
