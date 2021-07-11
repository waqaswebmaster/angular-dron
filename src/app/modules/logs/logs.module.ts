import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '@shared/shared.module';
import {NbButtonModule, NbCardModule, NbInputModule, NbSelectModule, NbTagModule} from "@nebular/theme";
import {LogsComponent} from '@modules/logs/components/logs/logs.component';
import {LogsRoutingModule} from '@modules/logs/logs.routing.module';
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {LogDetailComponent} from "@modules/logs/components/log-detail/log-detail.component";
import {LogUploadComponent} from "@modules/logs/components/log-upload/log-upload.component";
import {ReactiveFormsModule} from "@angular/forms";
import {NgxDropzoneModule} from "ngx-dropzone";

@NgModule({
  declarations: [
    LogsComponent,
    LogDetailComponent,
    LogUploadComponent,
  ],
  imports: [
    CommonModule,
    LogsRoutingModule,
    SharedModule,
    NbTagModule,
    MatTableModule,
    MatSortModule,
    NbButtonModule,
    NbCardModule,
    ReactiveFormsModule,
    NbInputModule,
    NbSelectModule,
    NgxDropzoneModule,
  ],
  providers: [],
})
export class LogsModule {
}
