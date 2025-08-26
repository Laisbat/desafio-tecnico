import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from '../../utils/services/usuarios.service';

@Component({
  selector: 'app-usuarios-adicionar',
  standalone: false,
  templateUrl: './usuarios-adicionar.component.html',
  styleUrl: './usuarios-adicionar.component.scss',
})
export class UsuariosAdicionarComponent implements OnInit {
  userForm: FormGroup;
  isLoading = false;
  id: number | null = null;
  blockedCharacters: string[] = [' ', '*'];

  constructor(
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private snackBar: MatSnackBar,
    private _usuariosService: UsuariosService
  ) {
    this.userForm = this._fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-ZÀ-ÿÁÉÍÓÚáéíóúÂÊÎÔÛâêîôûÃÕãõÇç\s]+$/),
        ],
      ],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(12),
          Validators.pattern(/^[a-z0-9_]+$/),
        ],
      ],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(100)],
      ],
      status: ['active', Validators.required],
      phone: [
        '',
        [
          Validators.required,
          Validators.minLength(15),
          Validators.maxLength(15),
          Validators.pattern(/^\(\d{2}\)\s\d{5}-\d{4}$/),
        ],
      ],
      website: [''],

      address: this._fb.group({
        street: [''],
        suite: [''],
        city: [''],
        zipcode: ['', Validators.pattern(/^\d{5}-\d{3}$/)],
        geo: this._fb.group({
          lat: ['', Validators.pattern(/^-?\d+\.?\d*$/)],
          lng: ['', Validators.pattern(/^-?\d+\.?\d*$/)],
        }),
      }),

      company: this._fb.group({
        name: [''],
        catchPhrase: [''],
        bs: [''],
      }),
    });
  }

  get address(): FormGroup {
    return this.userForm.get('address') as FormGroup;
  }

  get geo(): FormGroup {
    return this.address.get('geo') as FormGroup;
  }

  get company(): FormGroup {
    return this.userForm.get('company') as FormGroup;
  }

  get isEdit(): boolean {
    return this.id !== null;
  }

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      const id = Number(params['id']);

      if (!isNaN(id)) {
        this.id = id;

        this.getUsuarioById(this.id);
      }
    });
  }

  getUsuarioById(userId: number) {
    this._usuariosService.getUsuario(userId).subscribe({
      next: (userData) => {
        this.userForm.patchValue(userData);
      },
      error: (error: any) => {
        this.snackBar.open(
          `Erro ao carregar dados do usuário, ${error}`,
          'Fechar',
          {
            duration: 3000,
            panelClass: ['error-snackbar'],
          }
        );
      },
    });
  }

  onSubmit(): void {
    this.userForm.markAllAsTouched();
    if (this.userForm.valid) {
      this.isLoading = true;
      if (this.id !== null) {
        this._usuariosService
          .updateUser(this.id, this.userForm.value)
          .subscribe({
            next: () => {
              this.snackBar.open('Usuário atualizado com sucesso!', 'Fechar', {
                duration: 3000,
                panelClass: ['success-snackbar'],
              });
              this._router.navigate(['/usuarios']);
            },
            error: (error: any) => {
              this.snackBar.open(
                `Erro ao atualizar usuário, ${error}`,
                'Fechar',
                {
                  duration: 3000,
                  panelClass: ['error-snackbar'],
                }
              );
              this.isLoading = false;
            },
          });
      } else {
        this._usuariosService.addUsuario(this.userForm.value).subscribe({
          next: () => {
            this.snackBar.open('Usuário cadastrado com sucesso!', 'Fechar', {
              duration: 3000,
              panelClass: ['success-snackbar'],
            });
            this._router.navigate(['/usuarios']);
          },
          error: (error: any) => {
            this.snackBar.open(
              `Erro ao cadastrar usuário, ${error}`,
              'Fechar',
              {
                duration: 3000,
                panelClass: ['error-snackbar'],
              }
            );
            this.isLoading = false;
          },
        });
      }
    } else {
      this.snackBar.open(
        'Por favor, preencha todos os campos obrigatórios',
        'Fechar',
        {
          duration: 3000,
          panelClass: ['warning-snackbar'],
        }
      );
    }
  }

  onCancel(): void {
    this._router.navigate(['/usuarios']);
  }
}
