import { Component, OnInit } from '@angular/core';
import { EventsExpeditionService } from '../../services/settings-service/events-expedition.service';
import { ErrorHandlerService } from '../../services/shared/error-handler.service';
import swal from 'sweetalert2';
import { ReservationService } from '../../services/reservation-service/reservation.service';

@Component({
  selector: 'app-events-expedition',
  templateUrl: './events-expedition.component.html',
  styleUrls: ['./events-expedition.component.css']
})
export class EventsExpeditionComponent implements OnInit {

  add_action: any;

  actions: any[];

  current_selected_action: any;
  raw_data: any;
  last_page_url: any;
  prev_page_url: any;
  current_page: any;
  pagination: any = [];
  per_page: any;
  total: any;
  totalRec: number;
  pageTest: any = 1;

    constructor(private reservationService: ReservationService, private errorHandlerService: ErrorHandlerService ){}
  ngOnInit() {
    this.getAllActivites();
  }  



  addActionToActivity() {
    const actionData = {
      name: this.add_action,
    };
    this.reservationService.addEvent(actionData).subscribe(
      (data: any) => {
        this.getAllActivites();
        this.add_action = '';
        swal('Event added successfully', '', 'success');
      },
      err => this.errorHandlerService.handleErorr(err),
      
    );
  }

  deleteAction(id) {
    this.reservationService.deleteEvent(id).subscribe(
      (data: any) => {
        swal('Event deleted successfully', '', 'success');
        this.getAllActivites();
      },
      err => this.errorHandlerService.handleErorr(err),
      
    );
  }

  getAllActivites(page?) {
    this.reservationService.getAllEventsPaginated(page).subscribe(
      (data: any) => {
        this.raw_data = data;
        console.log(this.raw_data);
        console.log(this.raw_data.last_page);
        this.pagination = [];
        this.last_page_url = data.last_page_url;
        this.current_page = 1;
        this.per_page = data.to;
        this.total = data.total;
        let selected = true;
        for (var i = 1; i <= data.last_page; i++) {
          if (i > 1) selected = false;
          this.pagination.push({ number: i, selected: selected });
        }
        this.totalRec = data.total;
        this.actions = data.data;
        console.log(data);
        
      },
      err => this.errorHandlerService.handleErorr(err)
    );
  }

  editAction(action) {
    this.current_selected_action = action;
    this.add_action = this.current_selected_action.name;
  }

  updateActivity() {
    const actionData = {
      name: this.add_action,
    };
    this.reservationService.editEvent(this.current_selected_action.id, actionData)
      .subscribe((res: any) => {
        this.current_selected_action = undefined;
        this.add_action = '';
        this.getAllActivites();

        swal('Success', 'Edited Event successfully', 'success');
      }, err => {
        console.log(err);
      });
  }

  cancelUpdate() {
    this.current_selected_action = undefined;
  }

  pageChange(page) {
    this.current_page = page;
    this.getAllActivites(page);
  }

}
