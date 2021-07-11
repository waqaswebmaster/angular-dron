import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LogsComponent} from '@modules/logs/components/logs/logs.component';
import {LogDetailComponent} from "@modules/logs/components/log-detail/log-detail.component";
import {LogUploadComponent} from "@modules/logs/components/log-upload/log-upload.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LogsComponent,
  },
  {
    path: 'upload',
    pathMatch: 'full',
    component: LogUploadComponent,
  },
  {
    path: ':id',
    component: LogDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogsRoutingModule {
}
