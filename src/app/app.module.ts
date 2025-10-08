import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { BaseComponent } from './layout/base/base.component';
import { HttpInterceptor } from './utils/interceptors/http.interceptor';

import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import ICONS from '../assets/custom-icons';
import { LoginComponent } from './pages/login/login.component';
registerLocaleData(localePt);

@NgModule({
  declarations: [AppComponent, BaseComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MatSidenavModule,
    MatToolbar,
    MatIconModule,
    LoginComponent,
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR',
    },
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'BRL',
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    private readonly _matIconRegistry: MatIconRegistry,
    private readonly _domSanitizer: DomSanitizer
  ) {
    for (const icon of ICONS) {
      this._matIconRegistry.addSvgIconLiteral(
        icon.name,
        this._domSanitizer.bypassSecurityTrustHtml(icon.value)
      );
    }
  }
}
