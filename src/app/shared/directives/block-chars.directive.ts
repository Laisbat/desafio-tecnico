import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appBlockChars]',
  standalone: false,
})
export class BlockCharsDirective {
  @Input('appBlockChars') blocked: string[] = [];

  constructor(private _control: NgControl) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.blocked.includes(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    if (!input) {
      return;
    }
    const regexp = new RegExp(`[${this.blocked.join('')}]`, 'g');
    const sanitize = input.value.replace(regexp, '');
    if (sanitize !== input.value) {
      input.value = sanitize;
      this._control.control?.setValue(sanitize);
    }
  }
}
