import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from "@angular/router";
import {SafeHtmlPipe} from "@shared/pipes/safe-html.pipe";
import {SafeUrlPipe} from "@shared/pipes/safe-url.pipe";
import {SafeStylePipe} from "@shared/pipes/safe-style.pipe";
import {InvalidPipe} from "@shared/pipes/invalid.pipe";
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";
import {PaginatorComponent} from "@shared/components/paginator/paginator.component";
import {SearchInputComponent} from "@shared/components/search-input/search-input.component";
import {FormsModule} from "@angular/forms";
import {
  NbAutocompleteModule,
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbTagModule
} from "@nebular/theme";
import {ChartCardComponent} from "@shared/components/chart-card/chart-card.component";
import {ChartModule} from "angular-highcharts";
import {AvatarEditorComponent} from "@shared/components/avatar-editor/avatar-editor.component";
import {NgxDropzoneModule} from "ngx-dropzone";
import {UserAutocompleteComponent} from "@shared/components/user-autocomplete/user-autocomplete.component";
import {BokehChartComponent} from "@shared/components/bokeh-chart/bokeh-chart.component";
import {UserCellComponent} from "@shared/components/user-cell/user-cell.component";
import {OrganisationCellComponent} from "@shared/components/organisation-cell/organisation-cell.component";

@NgModule({
  declarations: [
    SafeHtmlPipe,
    SafeUrlPipe,
    SafeStylePipe,
    InvalidPipe,
    BreadcrumbComponent,
    PaginatorComponent,
    SearchInputComponent,
    ChartCardComponent,
    AvatarEditorComponent,
    UserAutocompleteComponent,
    BokehChartComponent,
    UserCellComponent,
    OrganisationCellComponent,
  ],
  exports: [
    SafeHtmlPipe,
    SafeUrlPipe,
    SafeStylePipe,
    InvalidPipe,
    BreadcrumbComponent,
    PaginatorComponent,
    SearchInputComponent,
    ChartCardComponent,
    AvatarEditorComponent,
    UserAutocompleteComponent,
    BokehChartComponent,
    UserCellComponent,
    OrganisationCellComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    NbIconModule,
    NbInputModule,
    NbCardModule,
    ChartModule,
    NgxDropzoneModule,
    NbButtonModule,
    NbAutocompleteModule,
    NbTagModule,
  ],
  providers: [],
})
export class SharedModule {
}
