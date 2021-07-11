import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {Router} from "@angular/router";
import {IBreadcrumbItem} from "@shared/components/breadcrumb/breadcrumb.component";
import {ManufacturerModel} from "@app/models";
import {MatTableDataSource} from "@angular/material/table";
import {ManufacturerService} from "@services/manufacturer.service";
import {NbDialogService, NbToastrService} from "@nebular/theme";

@Component({
  selector: 'app-manufacturers',
  templateUrl: './manufacturers.component.html',
  styleUrls: ['./manufacturers.component.scss'],
})
export class ManufacturersComponent implements OnInit, OnDestroy {

  breadcrumbs: IBreadcrumbItem[] = [
    { title: 'Manufacturers' }
  ];

  page = 0;
  totalCount = 0;
  sort = null;
  dataSource: MatTableDataSource<ManufacturerModel> = new MatTableDataSource();
  displayedColumns = ['name', 'email', 'limit', 'value', 'actions'];

  editingManufacturer: ManufacturerModel;
  searchEmail = '';
  searchedUser: {
    email: string;
    is_manufacturer: boolean;
  };

  constructor(
    private router: Router,
    private manufacturerSrv: ManufacturerService,
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

    this.manufacturerSrv.search(filter).subscribe((res) => {
      this.totalCount = res.count;
      this.dataSource.data = res.results;
    }, (err) => {
      this.toastSrv.danger(err.message || 'Loading manufacturers failed');
    });
  }

  onSortChange(e): void {
    if (!e.direction)
      this.sort = null;
    else
      this.sort = `${e.direction === 'asc' ? '' : '-'}${e.active}`;

    this.loadTableData();
  }

  onOpenSetLimitModal(item: ManufacturerModel, dialog: TemplateRef<any>): void {
    this.editingManufacturer = new ManufacturerModel(item);
    this.dialogSrv.open(dialog);
  }

  onSetLimit(ref): void {
    if (!this.editingManufacturer.limit || this.editingManufacturer.limit < 0)
      return;

    // TODO: set limit
    ref.close();
    this.editingManufacturer = null;

    this.loadTableData();
  }

  onOpenManageManufacturerModal(item: ManufacturerModel, dialog: TemplateRef<any>): void {
    if (item) {
      this.searchEmail = item.email;
      this.searchedUser = {
        email: item.email,
        is_manufacturer: true,
      };
    } else {
      this.searchEmail = '';
      this.searchedUser = null;
    }

    this.dialogSrv.open(dialog);
  }

  onSearchManufacturer(): void {
    if (/^(([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+)?$/.test(this.searchEmail)) {
      this.searchedUser = {
        email: this.searchEmail,
        is_manufacturer: Math.random() > 0.5,
      };
    } else {
      this.searchedUser = null;
    }
  }

  onToggleManufacturer(ref): void {
    // @TODO: Toggle manufacturer
    this.searchedUser = null;
    this.searchEmail = '';
    ref.close();

    this.loadTableData();
  }
}
