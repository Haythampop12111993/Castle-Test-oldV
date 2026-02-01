import { UserProfileService } from './../services/event-bus/user-profile.service';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { ErrorHandlerService } from './../services/shared/error-handler.service';
import { UserServiceService } from './../services/user-service/user-service.service';
import swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userProfile: any;
  changeAvatarForm: FormGroup;
  updateProfileForm: FormGroup;
  userPic: any;
  active_tab: any = 'about';
  changePasswordForm: FormGroup;
  is_changing_password: boolean = false;

  user_picture: any = window.localStorage.getItem('userPic');

  constructor(private fb: FormBuilder, private userService: UserServiceService, private errorHandlerService: ErrorHandlerService, private slimLoadingBarService: SlimLoadingBarService, private userProfileService: UserProfileService) {
    this.userProfileService.currentUserProfile.subscribe(res => {
      this.userProfile = res;
    })
    console.log(this.userProfile);
    this.createChangePasswordForm();
    this.createAvatarForm();
    this.createUpdateProfileForm();
  }

  ngOnInit() {
    this.userProfileService.currentImage.subscribe(img => {
      this.user_picture = img;
    });

    this.userProfileService.currentUserProfile.subscribe(res => {
      this.userProfile = res;
    })
    
  }

  /***
   * start of change avatar modal
   */

  createAvatarForm() {
    this.changeAvatarForm = this.fb.group({
      image: ['', Validators.required]
    });
  }

  handleUploadImage(event) {
    console.log(event);
    console.log(event.target.files);
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      console.log(file);
      reader.onload = () => {
        this.changeAvatarForm.get('image').setValue({
          file_name: file.name,
          image: (reader.result as any).split(',')[1]
        })
      };
    }
  }

  changeAvatarModalSubmit(modal) {
    if (!this.changeAvatarForm.get('image').value) swal('Image must no be impty', '', 'error');
    else {
      let payload = {
        image: this.changeAvatarForm.get('image').value.image,
        file_name: this.changeAvatarForm.get('image').value.file_name
      }
      console.log(payload);
      this.slimLoadingBarService.start();
      this.userService.changeAvatar(payload).subscribe((res: string) => {
        swal('Avatar uploaded successfully', '', 'success');
        this.userProfileService.changeImage(res);
        modal.close();
      }, err => this.errorHandlerService.handleErorr(err)
        , () => this.slimLoadingBarService.complete());
      // let inputValue = (<HTMLInputElement>document.getElementById("image")).value;
      // inputValue = '';
    }
  }

  changeAvatarModalOpen() {
  }

  changeAvatarModalClose() {

  }

  /***
   * end of change avatar modal
   */


  /***
   * Start of update profile modal
   */

  updateProfileModalOpen() { }

  updateProfileModalClose() { }

  createUpdateProfileForm(){
    this.updateProfileForm = this.fb.group({
      name: [this.userProfile.name, Validators.required],
      phone: [this.userProfile.phone],
      other_phone: [this.userProfile.other_phone],
      about: [this.userProfile.about],
      facebook_url: [this.userProfile.facebook_url],
      twitter_url: [this.userProfile.twitter_url],
      instagram_url: [this.userProfile.instagram_url]
    })
  }

  updateProfileModalSubmit(modal) {
    console.log('testing');
    if(this.updateProfileForm.invalid) swal('Name is required', '', 'error');
    else {
      this.slimLoadingBarService.start();
      const payload = this.updateProfileForm.value;
      console.log(payload);
      this.userService.updateProfile(payload).subscribe(res => {
        this.userProfileService.changeUserProfile(res);
        swal('Profile updated successfully', '', 'success');
        modal.close();
      }, err => this.errorHandlerService.handleErorr(err)
      , () => this.slimLoadingBarService.complete());
    }
  }

  setActiveTab(tab) {
    this.active_tab = tab;
  }

  createChangePasswordForm() {
    this.changePasswordForm = this.fb.group({
      old_password: ['', Validators.required],
      new_password: ['', Validators.required]
    });
  }

  changePasswordMethod() {
    const formModel = this.changePasswordForm.value;
    if (!formModel.old_password || !formModel.new_password) {
      swal('Current Password and new Password can not be empty!', '', 'error');
    } else {
      this.is_changing_password = true;
      this.userService.changePassword(formModel).subscribe(
        data => {
          this.is_changing_password = false;
          console.log(data);
          swal('Woohoo!', 'Password Changed Successfully!', 'success');
        },
        err => {
          this.is_changing_password = false;
          this.errorHandlerService.handleErorr(err)
        }
      );
    }
  }

  /***
   * End of update profile modal
   */
}
