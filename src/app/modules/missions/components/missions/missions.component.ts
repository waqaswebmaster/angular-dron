import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {Router} from "@angular/router";
import {IBreadcrumbItem} from "@shared/components/breadcrumb/breadcrumb.component";
import {MissionModel} from "@app/models";
import {MatTableDataSource} from "@angular/material/table";
import {MissionService} from "@services/mission.service";
import {NbDialogService, NbToastrService} from "@nebular/theme";

@Component({
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.scss'],
})
export class MissionsComponent implements OnInit, OnDestroy {

  breadcrumbs: IBreadcrumbItem[] = [
    { title: 'Missions' }
  ];

  page = 0;
  totalCount = 0;
  sort = null;
  dataSource: MatTableDataSource<MissionModel> = new MatTableDataSource();
  displayedColumns = ['thumbnail', 'name', 'location', 'distance', 'duration', 'owner', 'actions'];

  constructor(
    private router: Router,
    private missionSrv: MissionService,
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

    this.missionSrv.search(filter).subscribe((res) => {
      this.totalCount = res.count;
      this.dataSource.data = res.results;
    }, (err) => {
      this.toastSrv.danger(err.message || 'Loading Missions failed');
    });
  }

  onSortChange(e): void {
    if (!e.direction)
      this.sort = null;
    else
      this.sort = `${e.direction === 'asc' ? '' : '-'}${e.active}`;

    this.loadTableData();
  }

  onDeleteMission(item: MissionModel, dialog: TemplateRef<any>): void {
    this.dialogSrv.open(dialog, { context: item }).onClose.subscribe((result) => {
      if (result) {
        this.missionSrv.remove(item.uuid).subscribe(() => {
          this.toastSrv.success('Operation succeed', 'Delete');

          this.loadTableData();
        }, (err) => {
          this.toastSrv.danger(err.error?.detail ?? 'Operation failed', 'Delete');
        });
      }
    });
  }
}
