import { UserProfileService } from "./../../services/event-bus/user-profile.service";
import { UserServiceService } from "./../../services/user-service/user-service.service";
import { CookieService } from "ngx-cookie-service";
import { element } from "protractor";
import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  Renderer2,
  OnInit,
} from "@angular/core";
import { Router } from "@angular/router";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { environment } from "../../../environments/environment";

@Component({
  selector: "navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  envStatics = environment.statics;
  title = "navbar";
  @Output() sidebarCollapsed = new EventEmitter();
  menuOpen = true;
  userData: any = window.localStorage.getItem("userProfile");
  userPic: any;
  @ViewChild("crm_a") crm_a: ElementRef;
  @ViewChild("crm_ul") crm_ul: ElementRef;
  @ViewChild("projects_a") projects_a: ElementRef;
  @ViewChild("projects_ul") projects_ul: ElementRef;
  // crm: boolean = true;
  @ViewChild("finance_a") finance_a: ElementRef;
  @ViewChild("finance_ul") finance_ul: ElementRef;

  @ViewChild("marketing_ul") marketing_ul: ElementRef;

  @ViewChild("cold_calls") cold_calls: ElementRef;
  role: any = JSON.parse(window.localStorage.getItem("userProfile")).role;
  userInfo: any = JSON.parse(window.localStorage.getItem("userProfile"));

  disappear: boolean = false;
  constructor(
    private router: Router,
    public cookieService: CookieService,
    public renderer2: Renderer2,
    public userService: UserServiceService,
    private userProfileService: UserProfileService,
    public breakpointObserver: BreakpointObserver
  ) {
    // this.userPic = window.localStorage.getItem('userPic');
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit() {
    console.log("role: ", this.role);
    console.log(this.userData.role != "Facility");
    // call center role

    // if (this.role == "Call Center") this.router.navigate(["/pages/add-ticket"]);

    this.breakpointObserver
      .observe(["(min-width: 800px)"])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          console.log("Viewport is 600px or over!");
        } else {
          console.log("Viewport is getting smaller!");
          if (!this.menuOpen) {
            this.sidebarCollapse("ham");
          }
        }
      });

    this.userProfileService.currentImage.subscribe((img) => {
      this.userPic = img;
      if (this.userPic == "null") {
        this.userPic = 0;
      }
    });

    this.userProfileService.currentUserProfile.subscribe((data) => {
      this.userData = data;
    });
    // this.notificationService.create('test', 'a7la klam da wla eh');
    // const toast = this.notificationService.success('Item created!', 'Click to undo...', {
    //   timeOut: 3000,
    //   showProgressBar: true,
    //   pauseOnHover: true,
    //   clickToClose: false,
    //   clickIconToClose: true
    // });
  }

  ngAfterViewInit() {
    // this.crm.nativeElement.setAttribute('aria-expanded', true);
    // console.log(this.crm);
  }

  logout() {
    this.userService.logout().then(() => {
      this.router.navigate(["login"]);
    });
  }

  addLead() {
    this.router.navigate(["./pages/addLead", 0]);
  }

  goToTeambuilder() {
    this.router.navigate(["/pages/settings/teams/build", 0]);
  }

  Dashboard() {
    this.router.navigate(["./leads"]);
  }

  collapseAllElementsInMenu() {
    // console.log(this.userData);
    this.renderer2.removeClass(this.crm_ul.nativeElement, "in");
    this.crm_a.nativeElement.setAttribute("aria-expanded", false);
    if (
      this.userData.role == "A.R Accountant" ||
      this.userData.role == "G.L Accountant" ||
      this.userData.role == "Treasury Accountant" ||
      this.userData.role == "CFO" ||
      this.userData.role == "Admin" ||
      this.userData.role == "Super Development"
    ) {
      // this.renderer2.removeClass(this.finance_ul.nativeElement, 'in');
      // this.finance_a.nativeElement.setAttribute('aria-expanded', false);
    }
    if (
      this.userData.role == "Admin" ||
      this.userData.role == "Super Development"
    ) {
      this.renderer2.removeClass(this.projects_ul.nativeElement, "in");
      this.projects_a.nativeElement.setAttribute("aria-expanded", false);
    } else if (
      this.userData.role != "A.R Accountant" &&
      this.userData.role != "G.L Accountant" &&
      this.userData.role != "Treasury Accountant" &&
      this.userData.role == "Contractor"
    ) {
      this.renderer2.removeClass(this.projects_ul.nativeElement, "in");
      this.projects_a.nativeElement.setAttribute("aria-expanded", false);
    } else if (this.userData.is_sales_team) {
      this.renderer2.removeClass(this.projects_ul.nativeElement, "in");
      this.projects_a.nativeElement.setAttribute("aria-expanded", false);
    }
    // if(this.userData.role == 'ADmin')
  }

  sidebarCollapse(element) {
    /**
     * Toggle Menu
     *
     * @param {String | undefined} return the element which triggerd the menu ('li'), or undifiend if it the menu icon
     *
     * */
    // console.log('nav before ', this.menuOpen);
    if (!element) {
      element = "ham";
    }
    if (element == "li") {
      if (this.menuOpen == true) {
        this.menuOpen = !this.menuOpen;
        // console.log('here');
      }
    } else if (element == "ham") {
      element = "ham";
      this.menuOpen = !this.menuOpen;
      if (this.menuOpen) {
        this.collapseAllElementsInMenu();
      }
    }
    // console.log('nav after ', this.menuOpen);
    this.sidebarCollapsed.emit(element);
  }

  canSeeAddTicket() {
    return (
      this.userData.role == "Helpdesk Supervisor" ||
      this.userData.role == "Helpdesk Agent"
    );
  }

  isHelpDeskUser() {
    // return this.userData.role == "Helpdesk Supervisor" || this.userData.role == "Helpdesk Agent"
    return this.userData.role == "Helpdesk Agent";
  }

  isProjectsViewer() {
    return this.userData && this.userData.role == "Broker";
  }
}
