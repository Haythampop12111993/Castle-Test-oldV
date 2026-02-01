import { Component } from "@angular/core";

@Component({
  selector: "main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"],
})
export class MainComponent {
  title = "app";
  menuOpen: boolean = false;

  handleSidebarCollapsed(event) {
    /**
     * responding to the event fired from the child component to toggle the menu
     *
     * @param {String | undefined} return the element which triggerd the menu ('li'), or undifiend if it the menu icon
     *
     */
    // console.log(event);
    // console.log('main after ', this.menuOpen);
    if (event == "li") {
      if (!this.menuOpen) this.menuOpen = !this.menuOpen;
    } else if (event == "ham") {
      this.menuOpen = !this.menuOpen;
    }
    // console.log('main after ', this.menuOpen);
  }
}
