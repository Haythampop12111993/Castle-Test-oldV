import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MenuItem } from "primeng/api";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-main-settings",
  templateUrl: "./main-settings.component.html",
  styleUrls: ["./main-settings.component.css"],
})
export class MainSettingsComponent implements OnInit {
  settingsMenuItems: MenuItem[];
  userData: any = JSON.parse(window.localStorage.getItem("userProfile"));

  constructor(private router: Router) {}

  checkActiveState(givenLink) {
    console.log(this.router.url);

    if (this.router.url.indexOf(givenLink) === -1) {
      return false;
    } else {
      return true;
    }
  }

  ngOnInit() {
    if (this.userData.role == "Admin") {
      this.settingsMenuItems = [
        {
          label: "General Settings",
          icon: "pi pi-pw pi-file",
          routerLink: ["/pages/settings/general"],
          expanded: this.checkActiveState("/pages/settings/general"),
        },
        {
          label: "Call Center Scripts",
          icon: "pi pi-pw pi-file",
          routerLink: ["/pages/settings/call-center-scripts"],
          expanded: this.checkActiveState(
            "/pages/settings/call-center-scripts"
          ),
        },
        {
          label: "Activity Options",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/activity"],
          expanded: this.checkActiveState("/pages/settings/activity"),
        },
        {
          label: "Feedback Questions",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/feedback-questions"],
          expanded: this.checkActiveState("/pages/settings/feedback-questions"),
        },
        {
          label: "Qualified Feedback Questions",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/qualified-feedback-questions"],
          expanded: this.checkActiveState(
            "/pages/settings/qualified-feedback-questions"
          ),
        },
        {
          label: "Districts",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/districts"],
          expanded: this.checkActiveState("/pages/settings/districts"),
        },
        {
          label: "Events And Expedition",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/events"],
          expanded: this.checkActiveState("/pages/settings/events"),
        },
        {
          label: "Lead Campaigns",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/lead-campaigns"],
          expanded: this.checkActiveState("/pages/settings/lead-campaigns"),
        },
        {
          label: "Lead Ticket Types",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/lead-ticket-types"],
          expanded: this.checkActiveState("/pages/settings/lead-ticket-types"),
        },
        {
          label: "Reminder Options",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/reminders-options"],
          expanded: this.checkActiveState("/pages/settings/reminders-options"),
        },
        {
          label: "Channels Options",
          icon: "pi pi-fw pi-question",
          routerLink: ["/pages/settings/channels"],
          expanded: this.checkActiveState("/pages/settings/channels"),
        },
        {
          label: "Payment Terms",
          icon: "pi pi-fw pi-question",
          routerLink: ["/pages/settings/payment-terms"],
          expanded: this.checkActiveState("/pages/settings/payment-terms"),
        },
        {
          label: "Setup Payment Plan",
          icon: "pi pi-fw pi-question",
          routerLink: ["/pages/settings/setup-payment-plan"],
          expanded: this.checkActiveState("/pages/settings/setup-payment-plan"),
        },
        {
          label: "Finance manager Pin",
          icon: "pi pi-fw pi-question",
          routerLink: ["/pages/settings/cfo-pin"],
          expanded: this.checkActiveState("/pages/settings/cfo-pin"),
        },
        {
          label: "Manage Contracts",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/contracts"),
          items: [
            {
              label: "View Contracts",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/contracts"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "add Contract",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/add-contract"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Legal Affairs",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/legal-affairs"),
          items: [
            {
              label: "Document Types",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/legal-affairs/document-types"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Case Categories",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/legal-affairs/case-categories"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Case Statuses",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/legal-affairs/case-statuses"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Courts",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/legal-affairs/courts"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Legal Mission",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/legal-mission"),
          items: [
            {
              label: "Mission Categories",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/legal-mission/mission-categories"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Mission Statuses",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/legal-mission/mission-statuses"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Mission Side",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/legal-mission/missoin-sides"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Contact Statuses",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/contact-statuses"],
          routerLinkActiveOptions: { exact: true },
        },
        {
          label: "Manage All Occasions",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/occasions"),
          items: [
            {
              label: "View System Occasions",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/occasions"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "View Custom Occasions",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/custom-occasions"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        // {
        //   label: "Roles",
        //   icon: "pi pi-fw pi-cog",
        //   expanded: this.checkActiveState("/pages/settings/roles"),
        //   items: [
        //     {
        //       label: "View Roles",
        //       icon: "pi pi-fw pi-pencil",
        //       routerLink: ["/pages/settings/roles"],
        //       routerLinkActiveOptions: { exact: true },
        //     },
        //     {
        //       label: "Add Role",
        //       icon: "pi pi-fw pi-tags",
        //       routerLink: ["/pages/settings/roles/add"],
        //       routerLinkActiveOptions: { exact: true },
        //     },
        //   ],
        // },
        {
          label: "Developers",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/developers"),
          items: [
            {
              label: "View Developers",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/developers"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Developer",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/developers/add"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Store Banks",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/store_banks"),
          items: [
            {
              label: "View Store Banks",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/store_banks"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Store Bank",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/store_banks/add"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Brokers",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/brokers"),
          items: [
            {
              label: "View Brokers",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/brokers"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Brokers",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/brokers/add"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Ambassadors",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/ambassadors"),
          items: [
            {
              label: "View Ambassador",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/ambassadors"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Ambassador",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/ambassadors/add"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Targets",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/targets"),
          items: [
            {
              label: "View Targets",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/targets"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Target Year",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/targets/add"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Branches",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/branches"),
          items: [
            {
              label: "View Branches",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/branches"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Branch",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/branches/add/0"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        ...(this.userData.is_full_access
          ? [
              {
                label: "Teams",
                icon: "pi pi-fw pi-cog",
                expanded: this.checkActiveState("/pages/settings/teams"),
                items: [
                  {
                    label: "View Teams",
                    icon: "pi pi-fw pi-pencil",
                    routerLink: ["/pages/settings/teams"],
                    routerLinkActiveOptions: { exact: true },
                  },
                  {
                    label: "Add Team",
                    icon: "pi pi-fw pi-tags",
                    routerLink: ["/pages/settings/teams/add/0"],
                    routerLinkActiveOptions: { exact: true },
                  },
                ],
              },
              {
                label: "Accounts",
                icon: "pi pi-fw pi-cog",
                expanded: this.checkActiveState("/pages/settings/accounts"),
                items: [
                  {
                    label: "View Accounts",
                    icon: "pi pi-fw pi-pencil",
                    routerLink: ["/pages/settings/accounts"],
                    routerLinkActiveOptions: { exact: true },
                  },
                  {
                    label: "Add Account",
                    icon: "pi pi-fw pi-tags",
                    routerLink: ["/pages/settings/accounts/add/0"],
                    routerLinkActiveOptions: { exact: true },
                  },
                ],
              },
            ]
          : []),
        // {
        //   label: "Roles and Permissions",
        //   icon: "pi pi-fw pi-cog",
        //   expanded: this.checkActiveState("/pages/settings/roles"),
        //   items: [
        //     {
        //       label: "View Roles",
        //       icon: "pi pi-fw pi-pencil",
        //       routerLink: ["/pages/settings/roles"],
        //       routerLinkActiveOptions: { exact: true },
        //     },
        //     {
        //       label: "Add Role",
        //       icon: "pi pi-fw pi-tags",
        //       routerLink: ["/pages/settings/roles/add"],
        //       routerLinkActiveOptions: { exact: true },
        //     },
        //   ],
        // },
        {
          label: "HelpDesk",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState(
            "/pages/settings/add-ticket-settings"
          ),
          items: [
            {
              label: "View Ticket Settings",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/add-ticket-settings"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Department",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/add-department"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Departments",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/departments"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
      ];
    } else if (
      this.userData.role == "Super Development" &&
      this.userData.email != environment.statics.support_mail
    ) {
      this.settingsMenuItems = [
        {
          label: "Activity Options",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/activity"],
          expanded: this.checkActiveState("/pages/settings/activity"),
        },
        {
          label: "Events And Expedition",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/events"],
          expanded: this.checkActiveState("/pages/settings/events"),
        },
        {
          label: "Channels Options",
          icon: "pi pi-fw pi-question",
          routerLink: ["/pages/settings/channels"],
          expanded: this.checkActiveState("/pages/settings/channels"),
        },
        {
          label: "Payment Terms",
          icon: "pi pi-fw pi-question",
          routerLink: ["/pages/settings/payment-terms"],
          expanded: this.checkActiveState("/pages/settings/payment-terms"),
        },
        {
          label: "Brokers",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/brokers"),
          items: [
            {
              label: "View Brokers",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/brokers"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Brokers",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/brokers/add"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Ambassadors",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/ambassadors"),
          items: [
            {
              label: "View Ambassador",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/ambassadors"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Ambassador",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/ambassadors/add"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        ...(this.userData.is_full_access
          ? [
              {
                label: "Accounts",
                icon: "pi pi-fw pi-cog",
                expanded: this.checkActiveState("/pages/settings/accounts"),
                items: [
                  {
                    label: "View Accounts",
                    icon: "pi pi-fw pi-pencil",
                    routerLink: ["/pages/settings/accounts"],
                    routerLinkActiveOptions: { exact: true },
                  },
                  {
                    label: "Add Account",
                    icon: "pi pi-fw pi-tags",
                    routerLink: ["/pages/settings/accounts/add/0"],
                    routerLinkActiveOptions: { exact: true },
                  },
                ],
              },
            ]
          : []),
      ];
    } else if (this.userData.email == environment.statics.support_mail) {
      this.settingsMenuItems = [
        {
          label: "General Settings",
          icon: "pi pi-pw pi-file",
          routerLink: ["/pages/settings/general"],
          expanded: this.checkActiveState("/pages/settings/general"),
        },
        {
          label: "Call Center Scripts",
          icon: "pi pi-pw pi-file",
          routerLink: ["/pages/settings/call-center-scripts"],
          expanded: this.checkActiveState(
            "/pages/settings/call-center-scripts"
          ),
        },
        {
          label: "Activity Options",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/activity"],
          expanded: this.checkActiveState("/pages/settings/activity"),
        },
        {
          label: "Feedback Questions",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/feedback-questions"],
          expanded: this.checkActiveState("/pages/settings/feedback-questions"),
        },
        {
          label: "Qualified Feedback Questions",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/qualified-feedback-questions"],
          expanded: this.checkActiveState(
            "/pages/settings/qualified-feedback-questions"
          ),
        },
        {
          label: "Cities",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/cities"],
          expanded: this.checkActiveState("/pages/settings/cities"),
        },
        {
          label: "Districts",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/districts"],
          expanded: this.checkActiveState("/pages/settings/districts"),
        },
        {
          label: "Events And Expedition",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/events"],
          expanded: this.checkActiveState("/pages/settings/events"),
        },
        {
          label: "Lead Campaigns",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/lead-campaigns"],
          expanded: this.checkActiveState("/pages/settings/lead-campaigns"),
        },
        {
          label: "Lead Ticket Types",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/lead-ticket-types"],
          expanded: this.checkActiveState("/pages/settings/lead-ticket-types"),
        },
        {
          label: "Legal Affairs",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/legal-affairs"),
          items: [
            {
              label: "Document Types",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/legal-affairs/document-types"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Case Categories",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/legal-affairs/case-categories"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Case Statuses",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/legal-affairs/case-statuses"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Courts",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/legal-affairs/courts"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Legal Mission",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/legal-mission"),
          items: [
            {
              label: "Mission Categories",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/legal-mission/mission-categories"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Mission Statuses",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/legal-mission/mission-statuses"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Mission Side",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/legal-mission/missoin-sides"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Contact Statuses",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/contact-statuses"],
          routerLinkActiveOptions: { exact: true },
        },
        {
          label: "Reminder Options",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/reminders-options"],
          expanded: this.checkActiveState("/pages/settings/reminders-options"),
        },
        {
          label: "Channels Options",
          icon: "pi pi-fw pi-question",
          routerLink: ["/pages/settings/channels"],
          expanded: this.checkActiveState("/pages/settings/channels"),
        },
        {
          label: "Payment Terms",
          icon: "pi pi-fw pi-question",
          routerLink: ["/pages/settings/payment-terms"],
          expanded: this.checkActiveState("/pages/settings/payment-terms"),
        },
        {
          label: "Setup Payment Plan",
          icon: "pi pi-fw pi-question",
          routerLink: ["/pages/settings/setup-payment-plan"],
          expanded: this.checkActiveState("/pages/settings/setup-payment-plan"),
        },
        {
          label: "Finance manager Pin",
          icon: "pi pi-fw pi-question",
          routerLink: ["/pages/settings/cfo-pin"],
          expanded: this.checkActiveState("/pages/settings/cfo-pin"),
        },
        {
          label: "Manage Contracts",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/contracts"),
          items: [
            {
              label: "View Contracts",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/contracts"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "add Contract",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/add-contract"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Manage All Occasions",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/occasions"),
          items: [
            {
              label: "View System Occasions",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/occasions"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "View Custom Occasions",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/custom-occasions"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Roles",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/roles"),
          items: [
            {
              label: "View Roles",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/roles"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Role",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/roles/add"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Developers",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/developers"),
          items: [
            {
              label: "View Developers",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/developers"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Developer",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/developers/add"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Store Banks",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/store_banks"),
          items: [
            {
              label: "View Store Banks",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/store_banks"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Store Bank",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/store_banks/add"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Brokers",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/brokers"),
          items: [
            {
              label: "View Brokers",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/brokers"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Brokers",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/brokers/add"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Ambassadors",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/ambassadors"),
          items: [
            {
              label: "View Ambassador",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/ambassadors"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Ambassador",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/ambassadors/add"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Targets",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/targets"),
          items: [
            {
              label: "View Targets",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/targets"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Target Year",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/targets/add"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Branches",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/branches"),
          items: [
            {
              label: "View Branches",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/branches"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Branch",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/branches/add/0"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Teams",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/teams"),
          items: [
            {
              label: "View Teams",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/teams"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Team",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/teams/add/0"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Accounts",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/accounts"),
          items: [
            {
              label: "View Accounts",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/accounts"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Account",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/accounts/add/0"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "HelpDesk",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState(
            "/pages/settings/add-ticket-settings"
          ),
          items: [
            {
              label: "View Ticket Settings",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/add-ticket-settings"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Department",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/add-department"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Departments",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/departments"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "System Version",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/system-version"),
          items: [
            {
              label: "Add Version",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/system-version"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
      ];
    } else if (this.userData.role == "Helpdesk Supervisor") {
      this.settingsMenuItems = [
        {
          label: "Manage All Occasions",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/occasions"),
          items: [
            {
              label: "View System Occasions",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/occasions"],
              routerLinkActiveOptions: { exact: true },
            },
            // {
            //   label: 'View Custom Occasions',
            //   icon: 'pi pi-fw pi-tags',
            //   routerLink: ['/pages/settings/custom-occasions'],
            //   routerLinkActiveOptions: { exact: true }
            // }
          ],
        },
        {
          label: "HelpDesk",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState(
            "/pages/settings/add-ticket-settings"
          ),
          items: [
            {
              label: "View Ticket Settings",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/add-ticket-settings"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Department",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/add-department"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Departments",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/departments"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Manage All Occasions",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/occasions"),
          items: [
            {
              label: "View System Occasions",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/occasions"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
      ];
    } else if (
      this.userData.role == "CCO" ||
      this.userData.role == "Development Director"
    ) {
      this.settingsMenuItems = [
        {
          label: "Activity Options",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/activity"],
          expanded: this.checkActiveState("/pages/settings/activity"),
        },
        {
          label: "Feedback Questions",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/feedback-questions"],
          expanded: this.checkActiveState("/pages/settings/feedback-questions"),
        },
        {
          label: "Qualified Feedback Questions",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/qualified-feedback-questions"],
          expanded: this.checkActiveState(
            "/pages/settings/qualified-feedback-questions"
          ),
        },
        {
          label: "Payment Terms",
          icon: "pi pi-fw pi-question",
          routerLink: ["/pages/settings/payment-terms"],
          expanded: this.checkActiveState("/pages/settings/payment-terms"),
        },
        {
          label: "Manage Contracts",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/contracts"),
          items: [
            {
              label: "View Contracts",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/contracts"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Manage All Occasions",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/occasions"),
          items: [
            {
              label: "View System Occasions",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/occasions"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "View Custom Occasions",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/custom-occasions"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Roles",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/roles"),
          items: [
            {
              label: "View Roles",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/roles"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Brokers",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/brokers"),
          items: [
            {
              label: "View Brokers",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/brokers"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Ambassadors",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/ambassadors"),
          items: [
            {
              label: "View Ambassador",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/ambassadors"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Targets",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/targets"),
          items: [
            {
              label: "View Targets",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/targets"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Branches",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/branches"),
          items: [
            {
              label: "View Branches",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/branches"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Teams",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/teams"),
          items: [
            {
              label: "View Teams",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/teams"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Accounts",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/accounts"),
          items: [
            {
              label: "View Accounts",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/accounts"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Roles and Permissions",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/roles"),
          items: [
            {
              label: "View Roles",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/roles"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "HelpDesk",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState(
            "/pages/settings/add-ticket-settings"
          ),
          items: [
            {
              label: "View Ticket Settings",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/add-ticket-settings"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Departments",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/departments"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
      ];
    } else if (this.userData.role == "Moderator") {
      this.settingsMenuItems = [
        // {
        //   label: 'General Settings',
        //   icon: 'pi pi-pw pi-file',
        //   routerLink: ['/pages/settings/general'],
        //   expanded: this.checkActiveState('/pages/settings/general')
        // },
        {
          label: "Brokers",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/brokers"),
          routerLink: ["/pages/settings/brokers"],

          items: [
            {
              label: "View Brokers",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/brokers"],
              routerLinkActiveOptions: { exact: true },
              // expanded: this.checkActiveState('/pages/settings/brokers'),
            },
            {
              label: "Add Brokers",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/brokers/add"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Ambassadors",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/ambassadors"),
          items: [
            {
              label: "View Ambassador",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/ambassadors"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Ambassador",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/ambassadors/add"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Accounts",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/accounts"),
          items: [
            {
              label: "View Accounts",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/accounts"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Account",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/accounts/add/0"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
      ];
    } else if (this.userData.role == "Legal Head") {
      this.settingsMenuItems = [
        {
          label: "Manage Contracts",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/contracts"),
          items: [
            {
              label: "View Contracts",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/contracts"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "add Contract",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/add-contract"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Legal Affairs",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/legal-affairs"),
          items: [
            {
              label: "Document Types",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/legal-affairs/document-types"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Case Categories",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/legal-affairs/case-categories"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Case Statuses",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/legal-affairs/case-statuses"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Courts",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/legal-affairs/courts"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Legal Mission",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/legal-mission"),
          items: [
            {
              label: "Mission Categories",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/legal-mission/mission-categories"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Mission Statuses",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/legal-mission/mission-statuses"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Mission Side",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/legal-mission/missoin-sides"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
      ];
    } else if (
      this.userData.role == "A.R Accountant" ||
      this.userData.role == "Treasury Accountant"
    ) {
      this.settingsMenuItems = [
        {
          label: "Brokers",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/brokers"),
          items: [
            {
              label: "View Brokers",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/brokers"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
      ];
    } else if (this.userData.role == "Super Moderator") {
      this.settingsMenuItems = [
        {
          label: "General Settings",
          icon: "pi pi-pw pi-file",
          routerLink: ["/pages/settings/general"],
          expanded: this.checkActiveState("/pages/settings/general"),
        },
        {
          label: "Call Center Scripts",
          icon: "pi pi-pw pi-file",
          routerLink: ["/pages/settings/call-center-scripts"],
          expanded: this.checkActiveState(
            "/pages/settings/call-center-scripts"
          ),
        },
        {
          label: "Activity Options",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/activity"],
          expanded: this.checkActiveState("/pages/settings/activity"),
        },
        {
          label: "Feedback Questions",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/feedback-questions"],
          expanded: this.checkActiveState("/pages/settings/feedback-questions"),
        },
        {
          label: "Accounts",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/accounts"),
          items: [
            {
              label: "View Accounts",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/accounts"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Account",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/accounts/add/0"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Qualified Feedback Questions",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/qualified-feedback-questions"],
          expanded: this.checkActiveState(
            "/pages/settings/qualified-feedback-questions"
          ),
        },
        {
          label: "Districts",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/districts"],
          expanded: this.checkActiveState("/pages/settings/districts"),
        },
        {
          label: "Events And Expedition",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/events"],
          expanded: this.checkActiveState("/pages/settings/events"),
        },
        {
          label: "Lead Campaigns",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/lead-campaigns"],
          expanded: this.checkActiveState("/pages/settings/lead-campaigns"),
        },
        {
          label: "Lead Ticket Types",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/lead-ticket-types"],
          expanded: this.checkActiveState("/pages/settings/lead-ticket-types"),
        },
        {
          label: "Reminder Options",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/reminders-options"],
          expanded: this.checkActiveState("/pages/settings/reminders-options"),
        },
        {
          label: "Channels Options",
          icon: "pi pi-fw pi-question",
          routerLink: ["/pages/settings/channels"],
          expanded: this.checkActiveState("/pages/settings/channels"),
        },
        {
          label: "Finance manager Pin",
          icon: "pi pi-fw pi-question",
          routerLink: ["/pages/settings/cfo-pin"],
          expanded: this.checkActiveState("/pages/settings/cfo-pin"),
        },
        {
          label: "Manage Contracts",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/contracts"),
          items: [
            {
              label: "View Contracts",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/contracts"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "add Contract",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/add-contract"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Legal Affairs",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/legal-affairs"),
          items: [
            {
              label: "Document Types",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/legal-affairs/document-types"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Case Categories",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/legal-affairs/case-categories"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Case Statuses",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/legal-affairs/case-statuses"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Courts",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/legal-affairs/courts"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Legal Mission",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/legal-mission"),
          items: [
            {
              label: "Mission Categories",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/legal-mission/mission-categories"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Mission Statuses",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/legal-mission/mission-statuses"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Mission Side",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/legal-mission/missoin-sides"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Contact Statuses",
          icon: "pi pi-fw pi-pencil",
          routerLink: ["/pages/settings/contact-statuses"],
          routerLinkActiveOptions: { exact: true },
        },
        {
          label: "Manage All Occasions",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/occasions"),
          items: [
            {
              label: "View System Occasions",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/occasions"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "View Custom Occasions",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/custom-occasions"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Developers",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/developers"),
          items: [
            {
              label: "View Developers",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/developers"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Developer",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/developers/add"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Store Banks",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/store_banks"),
          items: [
            {
              label: "View Store Banks",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/store_banks"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Store Bank",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/store_banks/add"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Brokers",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/brokers"),
          items: [
            {
              label: "View Brokers",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/brokers"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Brokers",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/brokers/add"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Ambassadors",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/ambassadors"),
          items: [
            {
              label: "View Ambassador",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/ambassadors"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Ambassador",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/ambassadors/add"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Targets",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/targets"),
          items: [
            {
              label: "View Targets",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/targets"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Target Year",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/targets/add"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Branches",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/branches"),
          items: [
            {
              label: "View Branches",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/branches"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Branch",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/branches/add/0"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "Teams",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState("/pages/settings/teams"),
          items: [
            {
              label: "View Teams",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/teams"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Team",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/teams/add/0"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
        {
          label: "HelpDesk",
          icon: "pi pi-fw pi-cog",
          expanded: this.checkActiveState(
            "/pages/settings/add-ticket-settings"
          ),
          items: [
            {
              label: "View Ticket Settings",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/add-ticket-settings"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Add Department",
              icon: "pi pi-fw pi-pencil",
              routerLink: ["/pages/settings/add-department"],
              routerLinkActiveOptions: { exact: true },
            },
            {
              label: "Departments",
              icon: "pi pi-fw pi-tags",
              routerLink: ["/pages/settings/departments"],
              routerLinkActiveOptions: { exact: true },
            },
          ],
        },
      ];
    } else {
      this.settingsMenuItems = [
        {
          label: "Payment Terms",
          icon: "pi pi-fw pi-question",
          routerLink: ["/pages/settings/payment-terms"],
          expanded: this.checkActiveState("/pages/settings/payment-terms"),
        },
        {
          label: "Setup Payment Plan",
          icon: "pi pi-fw pi-question",
          routerLink: ["/pages/settings/setup-payment-plan"],
          expanded: this.checkActiveState("/pages/settings/setup-payment-plan"),
        },
      ];
    }
  }
}
