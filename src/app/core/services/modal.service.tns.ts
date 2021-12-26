import { Injectable } from '@angular/core';
import { ModalDialogService } from '@nativescript/angular';

@Injectable()
export class ModalService {
  constructor(
    private modalDialogService: ModalDialogService,
  ) {}

  open(component) {
    /*   const options: ModalDialogOptions = {
      //  viewContainerRef: this.vcRef,
      //  context: today.toDateString(),
        fullscreen: false,
    };
    return this.modalDialogService.showModal(component, options);
     */
    return {
      componentInstance: null,
      result: new Promise((a, b) => {}),
    }
  }
}
