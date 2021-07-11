import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {Router} from "@angular/router";
import {IBreadcrumbItem} from "@shared/components/breadcrumb/breadcrumb.component";
import {FeatureModel} from "@app/models";
import {MatTableDataSource} from "@angular/material/table";
import {FeatureService} from "@services/Feature.service";
import {NbDialogService, NbToastrService} from "@nebular/theme";

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
})
export class FeaturesComponent implements OnInit, OnDestroy {

  breadcrumbs: IBreadcrumbItem[] = [
    { title: 'Features' }
  ];

  page = 0;
  totalCount = 0;
  sort = null;
  dataSource: MatTableDataSource<FeatureModel> = new MatTableDataSource();
  displayedColumns = ['name', 'service_name', 'trial_period', 'monthly_fee', 'yearly_fee', 'action'];

  constructor(
    private router: Router,
    private featureSrv: FeatureService,
    private toastSrv: NbToastrService,
    private dialogSrv: NbDialogService,
  ) {
  }

  ngOnInit(): void {
    this.loadTableData();
  }

  ngOnDestroy(): void {
  }

  loadTableData(): void {
    const filter: any = {
      offset: this.page * 10,
      limit: 10,
    };
    if (this.sort)
      filter.order_by = this.sort;

    this.featureSrv.search(filter).subscribe((res) => {
      this.totalCount = res.count;
      this.dataSource.data = res.results;
    }, (err) => {
      this.toastSrv.danger(err.message || 'Loading features failed');
    });
  }

  onSortChange(e): void {
    if (!e.direction)
      this.sort = null;
    else
      this.sort = `${e.direction === 'asc' ? '' : '-'}${e.active}`;

    this.loadTableData();
  }

  onDeactive(item, dialog: TemplateRef<any>): void {
    this.dialogSrv.open(dialog, { context: item }).onClose.subscribe((result) => {
      if (result) {
        // TODO: deactive
        this.loadTableData();
        // this.organisationSrv.remove(item.id).subscribe(() => {
        //   this.toastSrv.success('Operation succeed', 'Delete');
        //
        //   this.loadTableData();
        // }, (err) => {
        //   this.toastSrv.danger(err.error?.detail ?? 'Operation failed', 'Delete');
        // });
      }
    });
  }
}
