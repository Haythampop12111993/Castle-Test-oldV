import { UserProfileService } from "./../services/event-bus/user-profile.service";
import { ErrorHandlerService } from "./../services/shared/error-handler.service";
import { UserServiceService } from "./../services/user-service/user-service.service";
import {
  Component,
  ViewChild,
  ElementRef,
  Renderer2,
  OnInit,
} from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import swal from "sweetalert2";
import { NotificationsService } from "../services/notifications/notifications.service";

declare var Fingerprint2: any;
declare function findLocalIp(logInfo): any;

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: [
    "../../assets/css/style.css",
    "../../assets/css/custom.css",
    "./login.component.css",
  ],
})
export class LoginComponent implements OnInit {
  userLogin: any = {
    email: "",
    password: "",
  };
  @ViewChild("sign_in_page") sign_in_page: ElementRef;
  @ViewChild("login_form") login_form: ElementRef;
  isLoading = false;

  cancelId;
  cancelFunction;

  murmur: any;

  constructor(
    private router: Router,
    private userService: UserServiceService,
    private cookieService: CookieService,
    private slimLoadingBarService: SlimLoadingBarService,
    public renderer2: Renderer2,
    public errorHandlerService: ErrorHandlerService,
    private userProfileService: UserProfileService,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit() {
    this.onEnterKey();
  }

  fingerprintReport() {
    return new Promise((resolve, reject) => {
      Fingerprint2.get(function (components) {
        const murmur = Fingerprint2.x64hash128(
          components
            .map(function (pair) {
              return pair.value;
            })
            .join(),
          31
        );
        resolve(murmur);
      });
    });
  }

  onEnterKey() {
    this.renderer2.listen(this.login_form.nativeElement, "keyup", (event) => {
      if (event.keyCode === 13) {
        if (this.userLogin.email && this.userLogin.password) {
          this.goToLead();
        }
      }
    });
  }

  async getFingerPrint() {
    return await this.fingerprintReport();
  }

  async goToLead() {
    this.slimLoadingBarService.start();
    this.isLoading = true;
    window.localStorage.clear();

    // if (!((<any>document).documentMode || /Edge/.test(navigator.userAgent))) {
    //   console.log('this is edgeeeeeeeeeeee');
    //   const localIPResponse = await findLocalIp(false);
    //   console.log('im here ', localIPResponse);
    // }

    // findLocalIp(false).then(
    //   ips => {
    //     let s = '';
    //     ips.forEach(ip => (s += ip));
    //     console.log(s);

    this.getFingerPrint()
      .then((fingerPrint) => {
        this.userLogin.browser_fingerprint = fingerPrint;
        return this.notificationsService.initPush();
      })
      .then((token) => {
        this.userLogin.fcm_token = token;
        // this.userLogin.local_ip = s;
        this.userService.login(this.userLogin).subscribe(
          (data: any) => {
            this.isLoading = false;
            this.cookieService.set("token", data.token);
            window.localStorage.setItem("token", data.token);
            // data.user.role = 'Moderator';
            window.localStorage.setItem(
              "userProfile",
              JSON.stringify(data.user)
            );
            window.localStorage.setItem("userPic", data.user_image);
            this.userProfileService.changeImage(data.user_image);
            this.userProfileService.changeUserProfile(data.user);
            // window.localStorage.setItem("role", 'Moderator');
            // window.localStorage.setItem("role", data.user.role);
            // if (data.user.role == 'MD') {
            //   this.router.navigate(["pages/daily-report"]);
            // } else {
            //   this.router.navigate(["pages"]);
            // }
            console.log(data);
            if (data.user.role == "Broker Incentive") {
              console.log(data.user.role);
              this.router.navigate(["pages/addLead/0"]);
            } else if (data.user.role == "Broker") {
              this.router.navigate(["pages/projects"]);
            } else {
              this.router.navigate(["pages"]);
            }
          },
          (err) => {
            console.log(err);
            swal("Error", "Invalid email or password", "error");
            // if (err.error.error == 'email or password is incorrect!') {
            // }
            // this.errorHandlerService.handleErorr(err);
            this.isLoading = false;
          },
          () => {
            this.slimLoadingBarService.complete();
          }
        );
      });
    //   },
    //   err => console.log(err)
    // );
  }
}
