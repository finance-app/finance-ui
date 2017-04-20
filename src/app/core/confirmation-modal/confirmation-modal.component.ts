import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(public activeModal: NgbActiveModal) { }
}
