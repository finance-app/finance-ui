import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[autofocus]'
})

export class AutoFocusDirective implements AfterViewInit {

  private _autofocus;

  constructor(
    private elementRef: ElementRef
  ) {}

  ngAfterViewInit() {
    if (!this._autofocus) {
      return;
    }

    const el: HTMLInputElement = this.elementRef.nativeElement;

    if (!el.focus) {
      console.warn('AutofocusDirective: There is no .focus() method on the element:', el);

      return;
    }

    el.focus();
  }

  @Input()
  public set autofocus(value: any) {
    this._autofocus = value !== false
                   && value !== null
                   && value !== undefined
                   && value !== 0
                   && value !== 'false'
                   && value !== 'null'
                   && value !== 'undefined'
                   && value !== '0'
    ;
  }
}
