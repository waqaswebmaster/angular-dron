import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MissionsComponent} from '@modules/missions/components/missions/missions.component';
import {MissionFormComponent} from "@modules/missions/components/mission-form/mission-form.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: MissionsComponent,
  },
  {
    path: 'create',
    pathMatch: 'full',
    component: MissionFormComponent,
    data: { mode: 'create' },
  },
  {
    path: ':uuid',
    pathMatch: 'full',
    component: MissionFormComponent,
    data: { mode: 'view' },
  },
  {
    path: ':uuid/edit',
    pathMatch: 'full',
    component: MissionFormComponent,
    data: { mode: 'edit' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MissionsRoutingModule {
}
