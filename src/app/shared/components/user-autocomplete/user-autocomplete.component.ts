import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output, ViewChild,
} from '@angular/core';
import {UserModel} from "@app/models";
import {UserService} from "@services/user.service";

@Component({
  selector: 'app-user-autocomplete',
  templateUrl: './user-autocomplete.component.html',
  styleUrls: ['./user-autocomplete.component.scss'],
})
export class UserAutocompleteComponent implements OnInit, OnDestroy {
  @Input() value: number | number[];
  @Input() initialUser: UserModel | UserModel[];
  @Input() multiple = false;
  @Input() invalid = false;

  @HostBinding() class = '';

  @Output() valueChange: EventEmitter<number | number[]> = new EventEmitter();

  @ViewChild('searchInput') searchInput: ElementRef<HTMLInputElement>;

  selectedUser: UserModel;
  selectedUsers: UserModel[];

  searchedUsers: UserModel[] = [];
  search: string;

  timer;

  constructor(
    private userSrv: UserService,
  ) {
  }

  ngOnInit(): void {
    this.initSelectedUsers();
  }

  ngOnDestroy(): void {
  }

  initSelectedUsers(): void {
    if (this.multiple) {
      this.selectedUsers = this.initialUser as UserModel[];
      this.searchedUsers = [...this.selectedUsers];
    } else {
      this.selectedUser = this.initialUser as UserModel;
      this.search = this.selectedUser?.full_name || this.selectedUser?.email;
      this.searchedUsers = [this.selectedUser];
    }
  }

  onSearchFinish(): void {
    const user = this.searchedUsers.find((item) => {
      return (item?.full_name || item?.email)?.toLowerCase() === this.search?.toLowerCase();
    });

    if (!this.multiple) {
      this.selectedUser = user;
      this.value = user?.id;
      this.valueChange.emit(this.value);
    } else if (user) {
      this.selectedUsers.push(user);
      (this.value as number[]).push(user.id);
      this.valueChange.emit(this.value);
      this.search = '';
      this.searchInput.nativeElement.value = this.search;
    }
  }

  searchUsers(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.userSrv.search({
        order_by: 'full_name',
        limit: 20,
        search: this.search,
      }, false).subscribe((data) => {
        if (this.multiple) {
          this.searchedUsers = data.results.filter((item) => {
            return !(this.value as number[]).includes(item.id);
          });
        } else {
          this.searchedUsers = data.results;
        }
      }, () => {
        this.searchedUsers = [];
      }, () => {
        this.timer = null;
      });
    }, 500);
  }

  onRemoveUser(user: UserModel): void {
    this.selectedUsers = this.selectedUsers.filter((item) => item !== user);
    this.value = this.selectedUsers.map((item) => item.id);
    this.valueChange.emit(this.value);
  }

  onSelectUser(userName: string): void {
    const user = this.searchedUsers.find((item) => {
      return (item?.full_name || item?.email) === userName;
    });

    if (this.multiple) {
      if (user) {
        this.selectedUsers.push(user);
        (this.value as number[]).push(user.id);
        this.valueChange.emit(this.value);
      }
      this.search = '';
      this.searchInput.nativeElement.value = this.search;
    } else {
      this.selectedUser = user;
      this.value = user?.id;
      this.valueChange.emit(this.value);
    }
  }
}
