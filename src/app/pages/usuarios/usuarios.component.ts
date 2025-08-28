/* eslint-disable @angular-eslint/prefer-standalone */
import {
  AfterViewInit,
  Component,
  inject,
  Injectable,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Usuario } from '../../shared/interfaces/usuarios.interface';
import { UsuariosService } from '../../utils/services/usuarios.service';
import { ModalConfirmacaoComponent } from './components/modal-confirmacao/modal-confirmacao.component';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Itens por página:';
  override nextPageLabel = 'Próxima página';
  override previousPageLabel = 'Página anterior';
  override firstPageLabel = 'Primeira página';
  override lastPageLabel = 'Última página';

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  };
}

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
  providers: [{ provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }],
})
export class UsuariosComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'username', 'actions'];
  dataSource = new MatTableDataSource<Usuario>([]);
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private readonly _usuariosService = inject(UsuariosService);
  private readonly _dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private loadUsers(): void {
    this.isLoading = true;

    this._usuariosService.getUsuarios().subscribe({
      next: (data: Usuario[]) => {
        const users: Usuario[] = data.map((user) => ({
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          address: user.address,
          phone: user.phone,
          website: user.website,
          company: user.company,
        }));

        this.dataSource.data = users;
        this.isLoading = false;
      },
      error: (error: unknown) => {
        console.error('Erro ao listar usuários:', error);
        this.isLoading = false;
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  reloadUsers(): void {
    this.loadUsers();
  }

  deleteUser(userData: Usuario): void {
    const modal = this._dialog.open(ModalConfirmacaoComponent, {
      data: {
        user: userData,
      },
    });
    modal.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.dataSource.data = this.dataSource.data.filter(
            (item) => item.id !== userData.id
          );
        }
      },
    });
  }
}
