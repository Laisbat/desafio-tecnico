import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { By, DomSanitizer } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BaseComponent } from './base.component';

class MockMatIconRegistry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getNamedSvgIcon(): any {
    return of(document.createElement('svg'));
  }
}

describe('#BaseComponent', () => {
  let component: BaseComponent;
  let fixture: ComponentFixture<BaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseComponent],
      imports: [
        RouterTestingModule,
        MatToolbarModule,
        MatIconModule,
        MatSidenavModule,
        MatButtonModule,
      ],
      providers: [
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        {
          provide: DomSanitizer,
          useValue: {
            sanitize: () => 'some-url',
            bypassSecurityTrustResourceUrl: () => 'some-url',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve renderizar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve renderizar a barra de ferramentas com o título correto', () => {
    const toolbarSpan = fixture.debugElement.query(By.css('mat-toolbar span'));
    expect(toolbarSpan.nativeElement.textContent).toContain(
      'Desafio técnico - Angular'
    );
  });

  it('deve renderizar o link do GitHub com os atributos corretos', () => {
    const githubLink = fixture.debugElement.query(
      By.css('.github-button')
    ).nativeElement;
    expect(githubLink.getAttribute('href')).toBe(
      'https://github.com/Laisbat/desafio-tecnico'
    );
    expect(githubLink.getAttribute('target')).toBe('_blank');
    expect(githubLink.getAttribute('aria-label')).toBe('GitHub Repository');
  });

  it('deve renderizar o ícone do GitHub', () => {
    const githubIcon = fixture.debugElement.query(
      By.css('mat-icon[svgIcon="github"]')
    );
    expect(githubIcon).toBeTruthy();
  });

  it('deve conter mat-sidenav-container e mat-sidenav-content', () => {
    const sidenavContainer = fixture.debugElement.query(
      By.css('.app-container')
    );
    const sidenavContent = fixture.debugElement.query(By.css('.app-content'));
    expect(sidenavContainer).toBeTruthy();
    expect(sidenavContent).toBeTruthy();
  });
});
