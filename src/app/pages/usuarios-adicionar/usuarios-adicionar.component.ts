/* eslint-disable @angular-eslint/prefer-standalone */
import { Component, inject, OnInit } from '@angular/core';
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
  blockedCharacterName: string[] = [
    '*',
    '&',
    ';',
    ',',
    'ˆ',
    '!',
    '?',
    '{',
    '}',
    ']',
    '[',
    '(',
    ')',
    '+',
    '=',
    '/',
    '%',
    '$',
    '#',
    '@',
    '<',
    '>',
  ];

  private _fb = inject(FormBuilder);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private _usuariosService = inject(UsuariosService);

  constructor() {
    this.userForm = this._fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-ZÀ-ÿÁÉÍÓÚáéíóúÂÊÎÔÛâêîôûÃÕãõÇç\s]+$/),
        ],
      ],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(15),
          Validators.pattern(/^[a-zA-Z0-9_]+$/),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.minLength(10),
          Validators.maxLength(100),
        ],
      ],
      phone: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(15),
          Validators.pattern(/^\(\d{2}\)\s\d{5}-\d{4}$/),
        ],
      ],
      website: [
        '',
        [
          Validators.pattern(
            /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/
          ),
          Validators.minLength(10),
          Validators.maxLength(100),
        ],
      ],

      address: this._fb.group({
        street: ['', [Validators.minLength(3), Validators.maxLength(100)]],
        suite: ['', [Validators.minLength(3), Validators.maxLength(100)]],
        city: ['', [Validators.minLength(3), Validators.maxLength(100)]],
        zipcode: ['', [Validators.pattern(/^\d{5}-\d{3}$/)]],
        geo: this._fb.group({
          lat: ['', Validators.pattern(/^-?\d+\.?\d*$/)],
          lng: ['', Validators.pattern(/^-?\d+\.?\d*$/)],
        }),
      }),

      company: this._fb.group({
        name: ['', [Validators.minLength(3), Validators.maxLength(100)]],
        catchPhrase: ['', [Validators.minLength(3), Validators.maxLength(100)]],
        bs: ['', [Validators.minLength(3), Validators.maxLength(100)]],
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
      error: (error: unknown) => {
        this.snackBar.open(
          `Erro ao carregar dados do usuário, ${error}`,
          'Fechar',
          {
            duration: 3000,
            panelClass: ['error-snackbar'],
            verticalPosition: 'top',
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
                verticalPosition: 'top',
              });
              this._router.navigate(['/usuarios']);
            },
            error: (error: unknown) => {
              this.snackBar.open(
                `Erro ao atualizar usuário, ${error}`,
                'Fechar',
                {
                  duration: 3000,
                  panelClass: ['error-snackbar'],
                  verticalPosition: 'top',
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
              verticalPosition: 'top',
            });
            this._router.navigate(['/usuarios']);
          },
          error: (error: unknown) => {
            this.snackBar.open(
              `Erro ao cadastrar usuário, ${error}`,
              'Fechar',
              {
                duration: 3000,
                panelClass: ['error-snackbar'],
                verticalPosition: 'top',
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
          verticalPosition: 'top',
        }
      );
    }
  }

  onCancel(): void {
    this._router.navigate(['/usuarios']);
  }
}
