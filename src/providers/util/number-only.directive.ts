import { Directive, ElementRef, HostListener, Input } from '@angular/core';


@Directive({
  selector: '[appIntegerInput]'
})
export class NumberDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('keypress', ['$event'])
  onInput(event: any) {
    const pattern = /[0-9]/; // without ., for integer only
    let inputChar = String.fromCharCode(event.which ? event.which : event.keyCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
      return false;
    }
    return true;
  }

}