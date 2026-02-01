import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { ProjectsService } from '../services/projects/projects.service';

@Component({
  selector: 'app-rotations-list',
  templateUrl: './rotations-list.component.html',
  styleUrls: ['./rotations-list.component.css']
})
export class RotationsListComponent implements OnInit {

  rotations: any;
  userData: any = JSON.parse(window.localStorage.getItem("userProfile"));
  
  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private router: Router,
    private projectsService: ProjectsService
  ) { }

  ngOnInit() {
    this.getAllRotations();
  }

  getAllRotations() {
    this.slimLoadingBarService.start();
    this.projectsService.getAllRotations()
      .subscribe((res: any) => {
        this.slimLoadingBarService.complete();
        this.rotations = res;
      }, err => {
        this.slimLoadingBarService.reset();
        console.log(err);
      });
  }

  editRotation(rotation_id) {
    this.router.navigate(['/pages/rotation/add'], {
      queryParams: {
        id: rotation_id
      }
    });
  }
}
