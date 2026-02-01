import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import swal from 'sweetalert2';
import { ProjectsService } from '../services/projects/projects.service';

@Component({
  selector: 'app-add-rotation',
  templateUrl: './add-rotation.component.html',
  styleUrls: ['./add-rotation.component.css']
})
export class AddRotationComponent implements OnInit {
  @ViewChild('pause') pause: any;

  simpleList: any = [];

  campaigns: any;
  campaign_id: any = "all";

  users: any = [];
  selected: any = [];

  can_submit: boolean = false;

  addRotationForm: FormGroup;
  projects: any;
  sources: any;

  rotation_id: any;
  is_edit: boolean = false;

  isNextUserId: any;

  todayDate = new Date();

  projectsDropdownSettings = {
    singleSelection: false,
    idField: "id",
    textField: "name",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 3,
    allowSearchFilter: true,
  }

  sourceDropdownSettings = {
    singleSelection: false,
    idField: "id",
    textField: "name",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 3,
    allowSearchFilter: true,
  }

  userPeriodData = {
    date_from : '',
    date_to: '',
    user_id: ''
  }
  

  constructor(
    private projectService: ProjectsService,
    private slimLoadingBarService: SlimLoadingBarService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((res) => {
      console.log(res);
      if (res.id) {
        this.is_edit = true;
        this.rotation_id = res.id;
        this.getRotationData(this.rotation_id);
        this.getData(res.id);
      } else {
        this.createAddRotationForm();
        this.getData();
      }
    });
  }

  getRotationData(rotation_id) {
    this.slimLoadingBarService.start();
    this.projectService.getRotationData(this.rotation_id)
      .subscribe((res: any) => {
        console.log('sasa al3eeeeel2',res);
        
        this.slimLoadingBarService.complete();
        this.createAddRotationForm(res);
      }, err => {
        this.slimLoadingBarService.reset();
        console.log(err);
      });
  }

  ngOnInit() {
    this.getAllProjects();
    this.getAllSources();
    // this.getCampaigns();
    this.todayDate;
  }

  createAddRotationForm(data?) {
    if (data) {
      let source = [];
      let project_id = [];
      data.rotation_projects.forEach((elm) => {
        project_id.push({
          id: elm.id,
          name: elm.name
        });
      })
      data.rotation_sources.forEach((elm) => {
        source.push({
          id: elm.id,
          name: elm.name
        });
      });
      this.addRotationForm = this.formBuilder.group({
        name: [data.name || '', Validators.required],
        source: [source],
        project_id: [project_id],
        rotationIds: [[]]
      });
    } else {
      this.addRotationForm = this.formBuilder.group({
        name: ['', Validators.required],
        source: [[]],
        project_id: [[]],
        rotationIds: [[]]
      });
    }
  }

  getAllProjects() {
    this.projectService.getProjects().subscribe(
      (data: any) => {
        this.projects = data.data;
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.slimLoadingBarService.complete();
      }
    );
  }

  getAllSources() {
    this.projectService.getAllSources()
      .subscribe((res: any) => {
        this.sources = res;
      }, err => {
        console.log(err);
      });
  }

  getData(id?) {
    this.users = [];
    this.selected = [];
    this.slimLoadingBarService.start();
    if (id) {
      this.projectService.getUsersForRotation(id).subscribe(
        (res: any) => {
          // data.rotation_users.forEach((elm) => {
          //   this.selected.push({
          //     id: elm.user.id,
          //     name: elm.user.name,
          //   });
          // })
          this.isNextUserId = res.user_id_is_next;
          this.can_submit = true;
          console.log(res);
          this.users = res.allAgents;
          res.inRotationAgents.forEach(elm => {
            this.selected.push({
              id: elm.user.id,
              name: elm.user.name,
              teams: elm.user.teams[0],
              is_paused: elm.is_paused
            });
          });
          console.log(this.selected);
          this.slimLoadingBarService.complete();
        },
        err => {
          console.log(err);
          this.slimLoadingBarService.reset();
        }
      );
    } else {
      this.projectService.getUsersForRotation().subscribe(
        (res: any) => {
          this.can_submit = true;
          console.log(res);
          this.users = res.allAgents;
          res.inRotationAgents.forEach(elm => {
            this.selected.push({
              id: elm.user.id,
              name: elm.user.name,
              teams: elm.user.teams[0],
              is_paused: elm.is_paused
            });
          });
          console.log(this.selected);
          this.slimLoadingBarService.complete();
        },
        err => {
          console.log(err);
          this.slimLoadingBarService.reset();
        }
      );
    }
  }

  // getData() {
  //   this.users = [];
  //   this.selected = [];
  //   console.log(this.campaign_id);
  //   this.slimLoadingBarService.start();
  //   this.projectService.getRotations(this.campaign_id).subscribe(
  //     (res: any) => {
  //       this.can_submit = true;
  //       console.log(res);
  //       this.users = res.allAgents;
  //       res.inRotationAgents.forEach(elm => {
  //         this.selected.push({
  //           id: elm.user.id,
  //           name: elm.user.name,
  //           teams: elm.user.teams[0]
  //         });
  //       });
  //       console.log(this.selected);
  //       // this.simpleList = [[], []];
  //       // res.allAgents.forEach((agent) => {
  //       //   this.simpleList[0].push({
  //       //     name: agent.name,
  //       //     id: agent.id
  //       //   })
  //       // })
  //       // res.inRotationAgents.forEach((elm) => {
  //       //   this.simpleList[1].push({
  //       //     name: elm.user.name,
  //       //     id: elm.user.id
  //       //   })
  //       // })
  //       this.slimLoadingBarService.complete();
  //     },
  //     err => {
  //       console.log(err);
  //       this.slimLoadingBarService.reset();
  //     }
  //   );
  // }

  public removeUser(item: any, list: any[]): void {
    list.splice(list.indexOf(item), 1);
  }

  public removeSelected(item: any, list: any[]): void {
    list.splice(list.indexOf(item), 1);
  }

  getCampaigns() {
    this.slimLoadingBarService.start();
    this.projectService.getCampaigns().subscribe(
      (res: any) => {
        this.campaigns = res;
        console.log(res);
        this.slimLoadingBarService.complete();
      },
      err => {
        console.log(err);
        this.slimLoadingBarService.reset();
      }
    );
  }

  public removeItem(item: any, list: any[]): void {
    list.splice(list.indexOf(item), 1);
  }

  submit() {
    swal({
      title: "Are you sure?",
      text: "You will add new Rotation!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, add it!",
      cancelButtonText: "No."
    }).then(result => {
      if (result.value) {
        console.log(this.addRotationForm.value);
        let rotationForm = this.addRotationForm.value;
        let payload = {
          name: rotationForm.name, 
          source: [], 
          project_id: [],
          rotationIds: []
        };
        this.selected.forEach(item => {
          payload.rotationIds.push(item.id);
        });
        rotationForm.source.forEach((source) => {
          payload.source.push(source.name);
        })
        rotationForm.project_id.forEach((project) => {
          payload.project_id.push(project.id);
        })
        console.log(payload);
        this.slimLoadingBarService.start();
        this.projectService
          .addRotation(payload)
          .subscribe(
            (res: any) => {
              this.slimLoadingBarService.complete();
              swal("Woohoo!", "Add rotation successfully!", "success");
              this.goToRotationsPage();
            },
            err => {
              console.log(err);
              this.slimLoadingBarService.reset();
            }
          );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  update() {
    swal({
      title: "Are you sure?",
      text: "You will update this rotation!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No."
    }).then(result => {
      if (result.value) {
        console.log(this.addRotationForm.value);
        let rotationForm = this.addRotationForm.value;
        let payload = {
          name: rotationForm.name, 
          source: [], 
          project_id: [],
          rotationIds: []
        };
        this.selected.forEach(item => {
          payload.rotationIds.push(item.id);
        });
        rotationForm.source.forEach((source) => {
          payload.source.push(source.name);
        })
        rotationForm.project_id.forEach((project) => {
          payload.project_id.push(project.id);
        })
        console.log(payload);
        this.slimLoadingBarService.start();
        this.projectService
          .updateRotation(this.rotation_id, payload)
          .subscribe(
            (res: any) => {
              this.slimLoadingBarService.complete();
              swal("Woohoo!", "updated rotation successfully!", "success");
              this.goToRotationsPage();
            },
            err => {
              console.log(err);
              this.slimLoadingBarService.reset();
            }
          );
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }

  goToRotationsPage() {
    this.router.navigateByUrl('/pages/rotations');
  }

  onItemSelect(item: any) {
    console.log(item);
  }

  onSelectAll(items: any) {
  }

  removeUserFromRotation(user, index) {
    swal({
      title: "Are you sure?",
      text: "You will remove the user from the rotation!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "No."
    }).then(result => {
      if (result.value) {
       this.users.push(user);
       this.selected.splice(index, 1);
      } else if (result.dismiss) {
        swal("Cancelled", "", "error");
      }
    });
  }
  open(pauseModal){
    pauseModal.open();
  }

  closeModal(pauseModal){
    pauseModal.close();
    this.userPeriodData = {
      date_from : '',
      date_to: '',
      user_id: ''
    }
  }

  setUserPeriod(userId, modal){
    this.userPeriodData.user_id = userId;
    this.projectService.setUserPeriod(this.rotation_id,this.userPeriodData ).subscribe((res: any)=>{
      console.log(res);
      this.closeModal(modal);
      this.getData(this.rotation_id);
      swal("Woohoo!", "Period Add Successfully!", "success");
    }, (err)=>{
      console.log(err);
      swal("Oops!", err.error.message , "error");
      this.closeModal(modal);
    });
  }

  resetDateTo(){
    this.userPeriodData.date_to = '';
  }

  
}
