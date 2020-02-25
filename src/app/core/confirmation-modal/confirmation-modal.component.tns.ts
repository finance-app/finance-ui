import { Component, Input } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/directives/dialogs';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent {
  @Input() settings: {
    name: string;
    action: string;
    objectType: string;
    buttonType: string;
    confirmText: string;
  };

  constructor(
    private params: ModalDialogParams,
  ) { }

  public close(result: boolean) {
    this.params.closeCallback(result);
  }
}
