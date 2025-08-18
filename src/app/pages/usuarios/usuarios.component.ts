import { Component } from '@angular/core';
import { UsuariosService } from '../../utils/services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
})
export class UsuariosComponent {
  constructor(private readonly _usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this._usuariosService.listarUsuarios().subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.error('Erro ao listar usuários:', error);
      },
    });
  }
}
