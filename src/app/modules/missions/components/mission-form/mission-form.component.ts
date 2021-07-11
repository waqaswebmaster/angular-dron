import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MissionService} from "@services/mission.service";
import {NbToastrService} from "@nebular/theme";
import {MissionModel} from "@app/models";

declare function initMissionMapData(mission: MissionModel, mode: string);

@Component({
  selector: 'app-mission-form',
  templateUrl: './mission-form.component.html',
  styleUrls: ['./mission-form.component.scss'],
})
export class MissionFormComponent implements OnInit, OnDestroy {

  mode: 'view' | 'edit' | 'create';
  mission: MissionModel;
  featureMapDataActive = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private missionSrv: MissionService,
    private toastSrv: NbToastrService,
  ) {
  }

  ngOnInit(): void {
    this.mode = this.route.snapshot.data.mode;
    const uuid = this.route.snapshot.params.uuid;
    if (uuid) {
      this.loadMission(uuid);
    } else {
      this.mission = new MissionModel();
      this.onViewReady();
    }
  }

  ngOnDestroy(): void {
  }

  loadMission(uuid: string): void {
    this.missionSrv.find(uuid).subscribe((mission) => {
      this.mission = mission;
      this.onViewReady();
    }, (err) => {
      this.toastSrv.danger(err.message || 'Operation failed', 'Load mission');
    });
  }

  onSubmit(e): void {
    e.preventDefault();

    console.log('onSubmit');
  }

  onViewReady(): void {
    setTimeout(() => {
      initMissionMapData(this.mission, this.mode);
    }, 500);
  }
}
