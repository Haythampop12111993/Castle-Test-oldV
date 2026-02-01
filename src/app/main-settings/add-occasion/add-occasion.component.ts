import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import swal from 'sweetalert2';
import { ProjectsService } from '../../services/projects/projects.service';
import { TeamService } from '../../services/settings-service/team/team.service';

@Component({
  selector: 'app-add-occasion',
  templateUrl: './add-occasion.component.html',
  styleUrls: ['./add-occasion.component.css']
})
export class AddOccasionComponent implements OnInit {

  occasion_form: FormGroup;
  type: any;
  id: any;
  is_edit: boolean = false;

  occasion_data: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private slimLoadingBarService: SlimLoadingBarService,
    private teamsService: TeamService,
    private router: Router
  ) { }

  ngOnInit() {
    this.createOccasionForm();
    this.route.queryParams.subscribe((res) => {
      console.log(res);
      this.id = res.id;
      this.type = res.type;
      if (res.id) {
        // this.createOccasionForm()
        this.is_edit = true;
        this.getOccasion(this.id);
      } else {
        this.createOccasionForm();
      }
    });
  }

  getOccasion(id) {
    this.slimLoadingBarService.start();
    this.teamsService.getSingleOccasion(id)
      .subscribe((res: any) => {
        this.occasion_data = res;
        let time = new Date(res.datetime);
        time.setMinutes(time.getMinutes() - time.getTimezoneOffset());
        this.occasion_form.patchValue({
          title: res.title,
          message: res.message,
          datetime: time.toISOString().slice(0,16)
        });
        this.slimLoadingBarService.complete();
      }, err => {
        this.slimLoadingBarService.reset();
      });
  }

  createOccasionForm() {
    this.occasion_form = this.formBuilder.group({
      title: ['', Validators.required],
      message: ['', Validators.required],
      datetime: ['', Validators.required]
    });
  }


  addOccasion() {
    console.log(this.occasion_form.value);
    this.slimLoadingBarService.start();
    this.teamsService.addOccasion(this.occasion_form.value)
      .subscribe((res: any) => {
        this.slimLoadingBarService.complete();
        swal('Success', 'Add custom occasion successfully', 'success');
        this.occasion_form.reset();
      }, err => {
        this.slimLoadingBarService.reset();
      });
  }

  updateOccasion() {
    this.slimLoadingBarService.start();
    this.teamsService.editOccasion(this.id, this.occasion_form.value)
      .subscribe((res: any) => {
        this.slimLoadingBarService.complete();
        swal('Success', 'Updated occasion successffully', 'success');
      }, err => {
        this.slimLoadingBarService.reset();
      });
  }

  reset() {
    this.getOccasion(this.id);
  }

}
