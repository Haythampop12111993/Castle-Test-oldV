import { LeadsService } from './../lead-service/lead-service.service';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Validators, FormBuilder } from '@angular/forms';
import { ErrorHandlerService } from './../shared/error-handler.service';
import { ReservationService } from './../reservation-service/reservation.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import swal from 'sweetalert2';

@Injectable()

/** Helper Clas For Reservation Logic */
export class ReservationHelperService {

  constructor(private reservationService: ReservationService, public errorHandlerService: ErrorHandlerService, private fb: FormBuilder,private slimLoadingBarService: SlimLoadingBarService, private leadsService : LeadsService) { }


  valueChanged(event, dataFromSearch, chosenAgent) {
    dataFromSearch.forEach(e => {
      if (e.name == event) chosenAgent = e;
    });
    return chosenAgent
  }

  getreservations(reservation_raw_data, pagination, next_page_url, current_page, per_page, total, totalRec, reservations) :Observable<Object>{
    return Observable.create(observer => {
      this.reservationService.getReservations().subscribe((data: any) => {
        reservation_raw_data = data;
        pagination = [];
        next_page_url = data.next_page_url;
        current_page = 1;
        per_page = data.per_page;
        total = data.total;
        let selected = true;
        for (var i = 1; i <= data.last_page; i++) {
          if (i > 1) selected = false;
          pagination.push({ number: i, selected: selected });
        }
        totalRec = data.total;
        reservations = data.data;
        data = {
          reservation_raw_data: data,
          pagination: pagination,
          next_page_url: data.next_page_url,
          current_page: 1,
          per_page: data.per_page,
          total: data.total,
          totalRec: data.total,
          reservations: data.data
        }
        console.log(data);
        observer.next(data);
      }, err => this.errorHandlerService.handleErorr(err));
    })

  }

  createFilesUpload(filesForm, filterForm, uploadExcel) {
    filesForm = this.fb.group({
      receipt: [null, Validators.required],
      signed: [null, Validators.required]
    });
    filterForm = this.fb.group({
      serial: [''],
      agent: [''],
      lead_name: ['']
    })
    uploadExcel = this.fb.group({
      file: [null, Validators.required]
    })
    return {
      filesForm: filesForm,
      filterForm: filterForm,
      uploadExcel: uploadExcel
    }
  }

  filterReservations(formModel, reservation_raw_data, pagination, next_page_url, current_page, reservations):Observable<Object>{
    return Observable.create(observe => {
      return this.reservationService.filterReservations(formModel).subscribe((data: any) => {
        reservation_raw_data = data;
        pagination = [];
        next_page_url = data.next_page_url;
        current_page = 1;
        let selected = true;
        for (var i = 1; i <= data.last_page; i++) {
          if (i > 1) selected = false;
          pagination.push({ number: i, selected: selected });
        }
        reservations = data.data;
        this.slimLoadingBarService.complete();
        let return_data: any = {
          reservation_raw_data: reservation_raw_data,
          pagination: pagination,
          next_page_url: next_page_url,
          current_page: current_page,
          reservations: reservations
        };
        observe.next(return_data);
      }), err => {
        this.errorHandlerService.handleErorr(err)
        this.slimLoadingBarService.complete();
      };
    })
  }

  handleReceiptFile(event, file_name, filesForm) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      console.log(file);
      file_name = file.name;
      reader.onload = () => {
        filesForm.get('receipt').setValue({
          filename: file.name,
          filetype: file.type,
          value: (reader.result as any).split(',')[1]
        })
        let data: any = {
          file_name: file_name,
          filesForm: filesForm
        }
        return data;
      };
    }
  }

  infinite(url, number, reservation_raw_data, totalRec, reservations, current_page, per_page, total):Observable<any>{
    return Observable.create(observe => {
      return this.leadsService.infinit(url).subscribe((data: any) => {
        reservation_raw_data = data;
        totalRec = data.total;
        reservations = data.data;
        current_page = number;
        per_page = data.per_page;
        total = data.total;
        this.slimLoadingBarService.complete();
        let returnData = {
          reservation_raw_data: reservation_raw_data,
          totalRec: totalRec,
          reservations: reservations,
          current_page: current_page,
          per_page: per_page,
          total: total
        }
        observe.next(returnData);
      }, err => {
        this.errorHandlerService.handleErorr(err)
        this.slimLoadingBarService.complete();
      });
    })
  }

  handleSignedFile(event, file_name2, filesForm) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      console.log(file);
      file_name2 = file.name;
      reader.onload = () => {
        filesForm.get('signed').setValue({
          filename: file.name,
          filetype: file.type,
          value: (reader.result as any).split(',')[1]
        })
        return {
          file_name2: file_name2,
          filesForm: filesForm
        }
      };
    }
  }

  actionOnSubmit(reservationId, modal, filesForm): Observable<Object>{
    return Observable.create(observer => {
      this.slimLoadingBarService.start(() => {
        console.log('Loading complete');
      });
      let formModel = filesForm.value;
      console.log(formModel);
      if (!formModel.receipt || !formModel.signed) {
        swal('Oops...', 'Files can not be empty!', 'error');
        observer.error('Fles can not be empty');
      } else {
        let data = {
          receipt: formModel.receipt.value,
          scan_url: formModel.signed.value,
          id: reservationId,
          file_name2: formModel.signed.filename,
          file_name: formModel.receipt.filename,
        }
        console.log(data);
        return this.reservationService.contractorApproved(data).subscribe(data => {
          console.log(data);
          this.slimLoadingBarService.complete();
          modal.close();
          swal('Woohoo!', 'Contractor Approved!', 'success');
        }, err => {
          this.errorHandlerService.handleErorr(err)
          this.slimLoadingBarService.complete();
        });
      }
    });
  }
}
