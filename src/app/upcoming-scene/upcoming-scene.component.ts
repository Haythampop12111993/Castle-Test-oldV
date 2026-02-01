import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-upcoming-scene',
  templateUrl: './upcoming-scene.component.html',
  styleUrls: ['./upcoming-scene.component.css']
})
export class UpcomingSceneComponent implements OnInit {

  @Input() name;

  constructor() { }

  ngOnInit() {
  }

}
