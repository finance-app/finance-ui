import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class ModalService {
  constructor(
    private ngbModalService: NgbModal,
  ) {}

  open(component) {
    return this.ngbModalService.open(component);
  }
}
