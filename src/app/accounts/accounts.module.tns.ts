import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { IMPORTS, DECLARATIONS, EXPORTS, PROVIDERS, ENTRY_COMPONENTS } from './accounts.common';

@NgModule({
  imports: [
    ...IMPORTS
  ],
  declarations: [
    ...DECLARATIONS
  ],
  exports: [
    ...EXPORTS
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ]
})
export class AccountsModule { }
