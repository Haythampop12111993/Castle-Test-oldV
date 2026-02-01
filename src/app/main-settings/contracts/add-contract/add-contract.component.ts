import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import swal from "sweetalert2";
import { ProjectsService } from "../../../services/projects/projects.service";
import { ReservationService } from "../../../services/reservation-service/reservation.service";
import { ErrorHandlerService } from "../../../services/shared/error-handler.service";

@Component({
  selector: "app-add-contract",
  templateUrl: "./add-contract.component.html",
  styleUrls: ["./add-contract.component.css"],
})
export class AddContractComponent implements OnInit {
  addContractForm: FormGroup;
  contract_types: String[] = ["contract", "extension"];
  contracts: any;
  contract_id: any;
  is_edit: boolean = false;
  contract_data: any;
  variables_groups: any;

  active_grp_btn: any;
  variables: any;
  dropdownSettings = {};
  dropdownList = [];
  projects: any;

  constructor(
    private router: Router,
    private slimLoadingBarService: SlimLoadingBarService,
    private formBuilder: FormBuilder,
    private reservationService: ReservationService,
    private errorHandlerService: ErrorHandlerService,
    private route: ActivatedRoute,
    private projectService: ProjectsService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.contract_id = +params["contract_id"];
      if (this.contract_id) {
        this.getContractData(this.contract_id);
      } else {
        this.createAddContractForm();
      }
    });

    this.dropdownSettings = {
      singleSelection: false,
      text:"Select Contracts",
      selectAllText:'Select All',
      unSelectAllText:'UnSelect All',
      enableSearchFilter: true,
      classes:"myclass custom-class",
      labelKey:"name"
    };

  }

  ngOnInit() {
    this.getParentTemplates();
    this.getVariablesByGroup();
    this.getAllProjects();
  }

  getAllProjects() {
    this.projectService.getProjects().subscribe(
      (data: any) => {
        this.projects = data.data;
      }
    );
  }

  getVariablesByGroup() {
    this.slimLoadingBarService.start();
    this.reservationService.variablesContracts()
      .subscribe((res: any) => {
        this.variables_groups = res;
        this.variables_groups.forEach((group, index) => {
          if (index == 0) {
            group.active = true;
            this.variables = group.variables;
          } else {
            group.active = false;
          }
        })
        this.slimLoadingBarService.complete();
      }, err => {
        this.slimLoadingBarService.reset();
        this.errorHandlerService.handleErorr(err);
      });
  }

  setActiveGroup(group, index) {
    this.variables_groups.forEach((group) => {
      group.active = false;
    })
    this.variables = group.variables;
    this.variables_groups[index].active = true;
  }

  copy(variable) {
    const permissionName = "clipboard-write" as any;
    (navigator as any).permissions.query({name: permissionName}).then((result) => {
      if (result.state == "granted" || result.state == "prompt") {
        /* write to the clipboard now */
        console.log('granted permisssion to write to clipboard');
        this.updateClipboard(variable.name);
      }
    })
  }

  updateClipboard(newClip) {
    (navigator as any).clipboard.writeText(newClip).then(function() {
      /* clipboard successfully set */
      console.log('write clip successfully');
    }, function() {
      /* clipboard write failed */
      console.log('ddeniedd');
    });
  }

  getContractData(id) {
    this.is_edit = true;
    this.slimLoadingBarService.start();
    this.reservationService.getContractData(id).subscribe(
      (res: any) => {
        this.contract_data = res;
        console.log('contract : ', res)
        this.createAddContractForm(res);
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  createAddContractForm(data?) {
    if (data) {
      this.addContractForm = this.formBuilder.group({
        name: [data.name, Validators.required],
        file: [""],
        contract_type: [data.template_type.toLowerCase(), Validators.required],
        parent_id: [data.parent_id ],
        project_id: [data.project_id]
        // parents: [data.parents],
      });
    } else {
      this.addContractForm = this.formBuilder.group({
        name: ["", Validators.required],
        file: ["", Validators.required],
        contract_type: ["", Validators.required],
        parent_id: [""],
        project_id: ['']
      });
    }
  }

  get parents() {
    return this.addContractForm.get('parents')
  }


  getParentTemplates() {
    this.reservationService.getContractsTemplates().subscribe(
      (res: any) => {
        this.contracts = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  get contract_type() {
    return this.addContractForm.get("contract_type").value;
  }

  onContractTypeChange(event) {

    if (this.contract_type == "contract") {
      this.addContractForm.get("parent_id").patchValue("");
    } else if (this.contract_type == "extension") {
      this.addContractForm.get("parent_id").patchValue("");
    }
  }

  onFileUpload(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.addContractForm
          .get("file")
          .patchValue((reader.result as any).split(",")[1]);
      };
    }
  }

  addContract() {
    this.bindParentControlFromForm();
    let formValue = this.addContractForm.value;
    console.log(formValue);

    if (this.is_edit) {
      this.slimLoadingBarService.start();
      this.reservationService.updateContractdata(this.contract_id, formValue).subscribe(
        (res: any) => {
          swal("Success", "Update contract successfully", "success");
          this.slimLoadingBarService.complete();
          this.router.navigate(["/pages/settings/contracts"]);
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
          this.slimLoadingBarService.reset();
        }
      );
    } else {
      this.slimLoadingBarService.start();
      this.reservationService.addContractTemplate(formValue).subscribe(
        (res: any) => {
          swal("Success", "Added contract successfully", "success");
          this.slimLoadingBarService.complete();
          this.router.navigate(["/pages/settings/contracts"]);
        },
        (err) => {
          this.errorHandlerService.handleErorr(err);
          this.slimLoadingBarService.reset();
        }
      );
    }
  }

  bindParentControlFromForm(){
    // let ids = [];
    // if (this.selectedItems) {
    //   ids = this.selectedItems.map(a=>a.id);
    // }
    // this.parents.setValue(ids);
  }

  bindParentControlFromObject(ids){
    this.parents.setValue(ids);

  }

  //#region Contract DDL
  onItemSelect(item:any){
    console.log(item);
    // console.log(this.selectedItems);
  }
  OnItemDeSelect(item:any){

      console.log(item);
      // console.log(this.selectedItems);
  }
  onSelectAll(items: any){
      console.log(items);
  }
  onDeSelectAll(items: any){
      console.log(items);
  }
  //#endregion
}
