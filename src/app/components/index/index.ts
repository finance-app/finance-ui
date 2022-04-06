import { IndexCommonDirective } from './index.common';
import { Directive } from '@angular/core';

@Directive()
export class IndexDirective extends IndexCommonDirective {
  constructor() {
    super();
  }
}
