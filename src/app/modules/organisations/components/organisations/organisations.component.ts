import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {Router} from "@angular/router";
import {IBreadcrumbItem} from "@shared/components/breadcrumb/breadcrumb.component";
import {OrganisationModel} from "@app/models";
import {MatTableDataSource} from "@angular/material/table";
import {OrganisationService} from "@services/organisation.service";
import {NbDialogService, NbToastrService} from "@nebular/theme";
import {MetaDataService} from "@services/meta-data.service";

@Component({
  selector: 'app-organisations',
  templateUrl: './organisations.component.html',
  styleUrls: ['./organisations.component.scss'],
})
export class OrganisationsComponent implements OnInit, OnDestroy {

  breadcrumbs: IBreadcrumbItem[] = [
    { title: 'Organisations' }
  ];

  page = 0;
  totalCount = 0;
  sort = null;
  dataSource: MatTableDataSource<OrganisationModel> = new MatTableDataSource();
  displayedColumns = ['name', 'activity', 'country', 'state', 'size', 'action'];

  constructor(
    private router: Router,
    private organisationSrv: OrganisationService,
    private metaDataSrv: MetaDataService,
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

    this.organisationSrv.search(filter).subscribe((res) => {
      this.totalCount = res.count;
      this.dataSource.data = res.results.map((item) => ({
        ...item,
        size_text: this.metaDataSrv.getSizeText(item.size),
      }));
    }, (err) => {
      this.toastSrv.danger(err.message || 'Loading organisations failed');
    });
  }

  onSortChange(e): void {
    if (!e.direction)
      this.sort = null;
    else
      this.sort = `${e.direction === 'asc' ? '' : '-'}${e.active}`;

    this.loadTableData();
  }

  onDelete(item, dialog: TemplateRef<any>): void {
    this.dialogSrv.open(dialog, { context: item }).onClose.subscribe((result) => {
      if (result) {
        this.organisationSrv.remove(item.id).subscribe(() => {
          this.toastSrv.success('Operation succeed', 'Delete');

          this.loadTableData();
        }, (err) => {
          this.toastSrv.danger(err.error?.detail ?? 'Operation failed', 'Delete');
        });
      }
    });
  }
}
