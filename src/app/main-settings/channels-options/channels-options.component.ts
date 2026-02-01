import { Component, OnInit } from '@angular/core';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import swal from 'sweetalert2';

import { ErrorHandlerService } from '../../services/shared/error-handler.service';
import { MarketingService } from '../../services/marketing/marketing.service';

@Component({
  selector: 'app-channels-options',
  templateUrl: './channels-options.component.html',
  styleUrls: ['./channels-options.component.css']
})
export class ChannelsOptionsComponent implements OnInit {
  actions: any[];

  channels: any;

  channel_name: any;
  current_channel: any;

  source_list_add: any = [];
  source_name: any;

  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private errorHandlerService: ErrorHandlerService,
    private marketingService: MarketingService
  ) {}

  ngOnInit() {
    this.getChannels();
  }

  getChannels() {
    this.slimLoadingBarService.start();
    this.marketingService.getChannels().subscribe(
      (res: any) => {
        this.channels = res;
      },
      err => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  editChannel(modal, channel) {
    modal.open();
    this.source_list_add = [];
    this.current_channel = channel;
    this.channel_name = channel.name;
    channel.sources.forEach(e => {
      this.source_list_add.push(e.name);
    });
  }

  deleteChannel(channel) {
    swal({
      title: 'Are you sure?',
      text: 'You will Delete this channel!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then(result => {
      if (result.value) {
        this.slimLoadingBarService.start();
        this.marketingService.deleteChannel(channel.id).subscribe(
          (res: any) => {
            this.getChannels();
          },
          err => this.errorHandlerService.handleErorr(err),
          () => this.slimLoadingBarService.complete()
        );
      } else if (result.dismiss) {
        swal('Cancelled', '', 'error');
      }
    });
  }

  addChannelModalOpen() {

  }

  addChannelModalClose() {
    this.channel_name = '';
    this.source_list_add = [];
  }

  addChannelModalSubmit(modal) {
    const payload = {
      channel_name: this.channel_name,
      channel_sources: this.source_list_add
    };
    console.log(payload);
    this.slimLoadingBarService.start();
    this.marketingService.addChannel(payload).subscribe(
      (res: any) => {
        console.log(res);
        modal.close();
        this.getChannels();
      },
      err => this.errorHandlerService.handleErorr(err),
      () => this.slimLoadingBarService.complete()
    );
  }

  editChannelListModalOpen() {

  }

  editChannelListModalClose() {
    this.channel_name = '';
    this.source_list_add = [];
  }

  editChannelListModalSubmit(modal) {
    console.log(this.current_channel);
    const payload = {
      channel_name: this.channel_name,
      channel_sources: this.source_list_add
    };
    console.log(payload);
    this.slimLoadingBarService.start();
    this.marketingService
      .editChannel(this.current_channel.id, payload)
      .subscribe(
        (res: any) => {
          modal.close();
          this.getChannels();
          swal('', 'Edit channel successfully', 'success');
        },
        err => this.errorHandlerService.handleErorr(err),
        () => this.slimLoadingBarService.complete()
      );
  }

  addSource() {
    if (this.source_name) {
      this.source_list_add.push(this.source_name);
      this.source_name = '';
    }
  }

  deleteSource(index) {
    this.source_list_add.splice(index, 1);
  }
}
