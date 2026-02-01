import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CilService } from './../cil.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ErrorHandlerService } from './../services/shared/error-handler.service';




@Component({
  selector: 'app-cli',
  templateUrl: './cli.component.html',
  styleUrls: ['./cli.component.css']
})
export class CliComponent implements OnInit {
  cils: any[];
  brokersName: any[] = [];
  filter = {
    status:'',
    broker_name: ''
  }
  pagination: any;
  last_page_url: any;
  prev_page_url: any;
  current_page: any;
  clis_raw_data: any;
  lg: any = 'lg';
  pageTest: any = 1;

  coming_soon: boolean = true;

  constructor(
    private cilService: CilService,
    private http:HttpClient,
    public errorHandlerService: ErrorHandlerService
  ) { }




  getAllCils() {
    this.cilService.getAllCils()
    .subscribe((response: any)=> {
      console.log('my response is: ', response);
      this.clis_raw_data = response;
      this.cils = response.data;
      this.pagination = [];
      this.current_page = 1;
      this.last_page_url = response.last_page_url;
      let selected = true;
      for (let i =0; i < response.last_page; i++) {
        if(i > 1) selected = false;
        this.pagination.push({number: i, selected: selected});
        console.log(i);
      }
      response.data.forEach((element, index) => {
        if(element.broker){
          this.brokersName[index] = element.broker.name;
        }
      });
      console.log('brokers is ' , this.brokersName);
    },(error)=> {
      console.log(error);
      this.errorHandlerService.handleErorr(error);
    })
  }

  infinite(url) {
    this.cilService.infinit(url)
    .subscribe((response: any)=> {
      this.clis_raw_data = response;
      this.cils = response.data;
      this.last_page_url = response.last_page_url;
    },(error) => {
      this.errorHandlerService.handleErorr(error);
    })
  }

  pageChange(event) {
    console.log(event);
    console.log(this.last_page_url);
    let arr = this.last_page_url.split('?');
    let selectedUrl = `${arr[0]}?page=${event}`;
    this.infinite(selectedUrl);
  }

  paginate(number) {
    this.pagination.forEach(element => {
      if(element.number == number) {
        element.selected == true;
        let arr = this.last_page_url.split('?');
        if(this.current_page != number) {
          let selectedUrl = `${arr[0]}?page=${number}`;
          this.current_page = number;
          this.infinite(selectedUrl);
        }
        else element.selected = false;
      }
    });
  }

  decline(cil) {
    this.cilService.cilDecline(cil)
    .subscribe(response => {
      let index = this.cils.indexOf(cil);
      this.cils[index].status = "Decline";
    },(error: HttpErrorResponse)=> {
      console.log("error" , error);
      console.log("error" , error.error.message);
      this.errorHandlerService.handleErorr(error);
    })
  }
  approve(cil) {
    this.cilService.cilApprove(cil)
    .subscribe(response => {
      let index = this.cils.indexOf(cil);
      this.cils[index].status = "Accept";
    },(error: HttpErrorResponse)=> {
      console.log("error" , error);
      console.log("error" , error.error.message);
      this.errorHandlerService.handleErorr(error);
    })
  }

  filterCils(f) {
    let filter = {
      broker_name: this.filter.broker_name,
      status: f.status
    }
    console.log(filter);
    console.log(f)
    this.cilService.filterCils(filter)
    .subscribe((response: any)=> {
      console.log(response);
      this.cils = response.data;
    })
  }


  ngOnInit() {
    this.getAllCils();
  }



}

