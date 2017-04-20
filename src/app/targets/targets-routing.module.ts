import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TargetsComponent } from './targets.component';
import { TargetComponent } from './target/target.component';
import { TargetFormComponent }  from './target-form/target-form.component';

const targetsRoutes: Routes = [
  {
    path: '',
    component: TargetsComponent,
    data: {
      title: 'Targets',
    },
  },
  {
    path: 'new',
    component: TargetFormComponent,
    data: {
      title: 'New target',
    },
  },
  {
    path: ':id',
    component: TargetComponent,
    data: {
      title: 'Show target',
    },
  },
  {
    path: ':id/edit',
    component: TargetFormComponent,
    data: {
      title: 'Edit target',
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(targetsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class TargetsRoutingModule { }
