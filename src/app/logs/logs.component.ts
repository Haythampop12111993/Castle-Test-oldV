import { Component, OnInit } from '@angular/core';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { ProjectsService } from '../services/projects/projects.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {

  coming_soon: boolean = true;

  constructor(private slimLoadingBarService: SlimLoadingBarService, private projectsService: ProjectsService) { }

  ngOnInit() {
  }

}
