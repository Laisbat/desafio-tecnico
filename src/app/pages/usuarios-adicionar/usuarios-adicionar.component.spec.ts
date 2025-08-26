import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosAdicionarComponent } from './usuarios-adicionar.component';

describe('UsuariosAdicionarComponent', () => {
  let component: UsuariosAdicionarComponent;
  let fixture: ComponentFixture<UsuariosAdicionarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsuariosAdicionarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuariosAdicionarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
