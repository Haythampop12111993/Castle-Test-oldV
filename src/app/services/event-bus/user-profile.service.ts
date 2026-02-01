import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class UserProfileService {

  private userImage = new BehaviorSubject<string>(window.localStorage.getItem('userPic'));
  currentImage = this.userImage.asObservable();
  private userProfile = new BehaviorSubject<any>(JSON.parse(window.localStorage.getItem('userProfile')));
  currentUserProfile = this.userProfile.asObservable();

  constructor() {}

  changeImage(img: string) {
    this.userImage.next(img);
  }

  changeUserProfile(data: any){
    this.userProfile.next(data);
  }
}
