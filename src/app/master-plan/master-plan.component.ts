import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { ErrorHandlerService } from './../services/shared/error-handler.service';
import { ProjectsService } from './../services/projects/projects.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import swal from 'sweetalert2';

@Component({
  selector: 'app-master-plan',
  templateUrl: './master-plan.component.html',
  styleUrls: ['./master-plan.component.css']
})
export class MasterPlanComponent implements OnInit {

  paths: any;
  sub: any;
  projectId: any;
  mode: any;
  readyToRender: boolean = false;
  img: any;
  stage: string;
  chosenUnit: any;
  arrSearch: any;
  dataFromSearch: any;
  current_unit: any;
  current_path: any;
  current_unit_id: any;
  district_path: any;

  constructor(private route: ActivatedRoute, private projectService: ProjectsService, private errorHandlerService: ErrorHandlerService, private slimLoadingBarService: SlimLoadingBarService, private http: HttpClient, private router: Router) { }


  ngOnInit() {
    this.sub = this.route.queryParamMap.subscribe((params: any) => {
      console.log(params);
      this.projectId = params.params.id;
      this.mode = params.params.mode
      this.getDistricts(this.projectId);
    });
  }

  pathClicked(path) {
    // console.log(id);
    this.district_path = path;
    let payload = {
      path_id: path,
      project_id: this.projectId
    }
    this.slimLoadingBarService.start();
    this.projectService.getMasterPlanUnits(payload)
      .subscribe((res: any) => {
        this.slimLoadingBarService.complete();
        console.log(res);
        this.img = res.img;
        this.paths = res.pathes;
        this.stage = 'units';
      }, err => this.errorHandlerService.handleErorr(err));
  }

  getDistricts(id) {
    this.projectService.getMasterPlanDistrict(id)
      .subscribe((res: any) => {
        console.log(res);
        this.paths = res.pathes;
        console.log(this.paths);
        this.img = res.img
        this.stage = 'districts';
      }, err => this.errorHandlerService.handleErorr(err));
  }

  showOverlay(ev){
    console.log(ev);
  }

  assignSerialOpen() {

  }

  assignSerialClose() {

  }

  assignSerialSubmit(modal) {
    console.log(this.chosenUnit);
    if (this.chosenUnit) {
      let foundTheUnit = false;
      this.arrSearch.forEach(e => {
        if (e ==  this.chosenUnit) {
          foundTheUnit = true;
          // console.log('entered here');
          this.dataFromSearch.forEach(e => {
            console.log(e);
            if(e.serial === this.chosenUnit) {
              this.current_unit_id = e.id;
            }
          })
        }
      })
      if (foundTheUnit) {
        this.assignUnitToPath(modal);
      } else {
        swal('Unit does not exist in this project', '', 'error');
      }
    } else {
      swal('You have to choose a unit to assign.', '', 'error');
    }
  }

  observableSource = (keyword: any): any => {
    let baseUrl: string =
      environment.api_base_url
    if (keyword) {
      let payload = {
        project_id: this.projectId,
        serial: keyword
      }
      return this.http.post(`${baseUrl}masterplan/search`, JSON.stringify(payload)).map((res: any) => {
        console.log(res.length);
        if (res.length == 0) {
          return Observable.of([]);
        }
        else {
          this.arrSearch = [];
          this.dataFromSearch = res;
          res.forEach(e => {
            this.arrSearch.push(e.serial);
          });
          console.log(this.arrSearch);
          return this.arrSearch;
        }
      });
    } else {
      return Observable.of([]);
    }
  }

  launchSerialModal(modal, unit, path) {
    this.current_unit = null;
    this.current_path = path;
    if (unit) {
      this.current_unit = unit;
    }
    modal.open();
  }

  assignUnitToPath(modal) {
    let payload = {
      unit_id : this.current_unit_id,
      path_id: this.current_path
    }
    this.slimLoadingBarService.start();
    this.projectService.assignUnitToPath(payload)
      .subscribe((res: any) => {
        modal.close();
        swal(`Assigned successfully`, '', 'success');
        let units_payload = {
          path_id: this.district_path,
          project_id: this.projectId
        }
        this.projectService.getMasterPlanUnits(units_payload)
          .subscribe((res: any) => {
            this.slimLoadingBarService.complete();
            console.log(res);
            this.paths = res.pathes;
            this.stage = 'units';
          }, err => this.errorHandlerService.handleErorr(err));
      }, err => this.errorHandlerService.handleErorr(err));
  }

  close(){
    console.log(this.stage);
    if(this.stage == 'districts'){
      this.router.navigateByUrl('pages/projects');
    } else if (this.stage == 'units') {
      this.stage = 'districts';
      this.getDistricts(this.projectId);
    }
  }
}
