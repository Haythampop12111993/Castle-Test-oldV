import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from '../services/projects/projects.service';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { ErrorHandlerService } from '../services/shared/error-handler.service';
import swal from 'sweetalert2';

type Image = {
  id: number
  url: string
  created_at: string
  updated_at: string
}

type Media = {
  id: number
  project_id: number
  image_id: number
  created_at: string
  updated_at: string
  type: string
  name: string
  user_id: number
  img_type: string
  image: Image
}

@Component({
  selector: 'app-consturction-updates',
  templateUrl: './consturction-updates.component.html',
  styleUrls: ['./consturction-updates.component.css']
})
export class ConsturctionUpdatesComponent implements OnInit {

  project_id: number;

  @ViewChild('mediaFileInput') private mediaFileInput:ElementRef;

  addConstructions: {image_type: string; image_value: string; image_name: string}[] = [];

  media_type: string = 'image';

  media: Media[];

  album_name: string;

  albums: any;

  current_album: any;

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private slimLoadingBarService: SlimLoadingBarService,
    private errorHandlerService: ErrorHandlerService
  ) { 
    this.route.params.subscribe((params) => {
      console.log(params);
      this.project_id = +params.id;
    })
  }

  ngOnInit() {
    this.getAlbums();
    this.getConstructionUpdates();
  }

  getAlbums() {
    this.projectsService.getAlbums(this.project_id)
      .subscribe((res) => {
        this.albums = res;
      });
  }

  getConstructionUpdates() {
    this.projectsService.getConstuctionUpdates(this.project_id)
      .subscribe((res: any) => {
        this.media = res.media;
        console.log(this.media);
      });
  }

  private resetFields()
  {
    this.mediaFileInput.nativeElement.value = "";
    // this.addFeedback = {
    //   description: "",
    //   attachments: [],
    // };
  }

  async onConstructionMediaUpload(event) {
    let selectedFiles = event.target.files;
    for (let i = 0; i < selectedFiles.length; i++) {
      let file = selectedFiles[i];
      let reader = new FileReader();
      await reader.readAsDataURL(file);
      reader.onload = async () => {
        let attach = {
          image_name: file.name,
          image_type: this.media_type,
          image_value: ((reader.result as any) as any).split(",")[1],
        };
        // await this.addFeedback.attachments.push(attach);
        console.log(this.addConstructions);
        await this.addConstructions.push(attach);
      };
    }
  }

  uploadConstruction(modal) {
    console.log(this.addConstructions);
    const payload = {
      media: [...this.addConstructions],
      album_id: this.current_album.id
    };
    this.slimLoadingBarService.start();
    this.projectsService.addConstructionUpdates(this.project_id, payload)
      .subscribe((res: any) => {
        this.slimLoadingBarService.complete();
        modal.close();
        swal('Woohoo!', 'Added Construction update successfully!', 'success');
        this.getAlbums();
      }, err => {
        this.slimLoadingBarService.reset();
        this.errorHandlerService.handleErorr(err);
      });
  }

  addAlbum(modal) {
    const payload = {
      name: this.album_name,
      project_id: this.project_id
    };
    this.slimLoadingBarService.start();
    this.projectsService.addAlbum(payload)
      .subscribe((res: any) => {
        this.slimLoadingBarService.complete();
        modal.close();
        swal('Woohoo!', 'Added Album successfully!', 'success');
        this.getAlbums();
      }, err => {
        this.slimLoadingBarService.reset();
        this.errorHandlerService.handleErorr(err);
      });
  }

  openMedia(album, modal) {
    this.current_album = album;
    modal.open();
  }

  uploadConstructionToAlbum(album, modal) {
    this.current_album = album;
    modal.open();
  }

}
