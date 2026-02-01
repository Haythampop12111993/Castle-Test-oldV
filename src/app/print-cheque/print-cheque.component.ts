import { Component, OnInit } from "@angular/core";

import { ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import swal from "sweetalert2";
import { ProjectsService } from "../services/projects/projects.service";
import { environment } from "../../environments/environment";

// import Tafgeet from '../../assets/js/tafqeet.js';

// Tafgeet;

declare var Tafgeet: any;

@Component({
  selector: "app-print-cheque",
  templateUrl: "./print-cheque.component.html",
  styleUrls: ["./print-cheque.component.css"],
})
export class PrintChequeComponent implements OnInit {
  bank_image: any;
  // bank_image: any = 'https://s1.freechequewriter.com/image/cheque/CommercialInternationalBank_CIB_EG.jpg';

  name: any = environment.statics.projectName;
  date: any = "01-01-21";
  amount_text: any = "";
  amountAfterFormat: any = "";
  uploadLayoutForm: FormGroup;
  liner_text: any = "";

  check_amount: any = "";
  amount: any;

  currentPositions: any = {
    date: {
      left: "66px",
      top: "26px",
      width: "100px",
      right: "auto",
    },
  };

  payload = {
    type: "",
    bank: {
      fileType: "",
      bank_name: "",
      fileName: "",
      file: "",
    },
    date: {
      value: "",
      top: "",
      left: "",
      right: "",
      bottom: "",
    },
    beneficiary_name: {
      value: "",
      top: "",
      left: "",
      right: "",
      bottom: "",
    },
    amount: {
      value: "",
      top: "",
      left: "",
      right: "",
      bottom: "",
    },
    amount_text: {
      amountAfterFormat: "",
      value: "",
      top: "",
      left: "",
      right: "",
      bottom: "",
    },
    linear: {
      value: "",
      selected: true,
    },
  };

  saved_bank_id: any;
  saved_banks: any;
  saved_bank_detailes: any;

  constructor(
    private formBuilder: FormBuilder,
    private slimLoadingBarService: SlimLoadingBarService,
    private projectsService: ProjectsService
  ) {
    this.createNewLayoutForm();
  }

  ngOnInit() {
    this.getBankCheques();
  }

  ngAfterViewInit() {
    // if (this.payload.type) {
    //   setTimeout(() => {
    //     this.handleDrag();
    //   }, 200);
    // }
  }

  onBankTypeChange(event) {
    console.log(`bank type ${event}`);
    console.log(this.payload.type);
    if (this.payload.type == "new") {
      this.bank_image = null;
    } else {
      this.bank_image = "../../assets/cheques-images/cib.jpg";
    }
    setTimeout(() => {
      this.handleDrag();
    }, 200);
  }

  toEN(string = this.amount) {
    console.log(string);
    return string
      .replace(/[\u0660-\u0669]/g, function (c) {
        return c.charCodeAt(0) - 0x0660;
      })
      .replace(/[\u06f0-\u06f9]/g, function (c) {
        return c.charCodeAt(0) - 0x06f0;
      });
  }

  updateAmount(val, cur) {
    val = this.toEN(val);
    if (parseFloat(val) > 0) {
      this.amountAfterFormat = "#" + this.formatMoney(parseFloat(val)) + "#";
      console.log("val, cur");
      this.amount_text = new Tafgeet(val, cur).parse();
      console.log(this.amount_text);
    }
    // vm.currency = cur;
  }

  createNewLayoutForm() {
    this.uploadLayoutForm = this.formBuilder.group({
      bank_name: [],
      file: [null, Validators.required],
    });
  }

  uploadNewLayoutMethod(modal) {}

  handleUploadNewBank(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (this.payload.type == "new") {
          console.log((reader.result as any as any).split(",")[1]);
          document.getElementById(
            "check"
          ).style.backgroundImage = `url('data:image/png;base64,${
            (reader.result as any as any).split(",")[1]
          }')`;
        }
        this.uploadLayoutForm.get("file").setValue({
          filename: file.name,
          filetype: file.type,
          value: (reader.result as any as any).split(",")[1],
        });
      };
    }
  }

  getBankCheques() {
    this.slimLoadingBarService.start();
    this.projectsService.getBankCheques().subscribe(
      (res: any) => {
        this.saved_banks = res;
        this.slimLoadingBarService.complete();
      },
      (err) => {
        this.slimLoadingBarService.reset();
      }
    );
  }

  saveBankCheuqe() {
    console.log(this.payload);
    this.getBankData();
    if (this.payload.type == "new") {
      console.log("adding new bank");
      this.slimLoadingBarService.start();
      this.projectsService.addBankCheque(this.payload).subscribe(
        (res: any) => {
          this.slimLoadingBarService.complete();
          swal("Success", "Added Bank Cheque Successfully", "success");
          this.getBankCheques();
        },
        (err) => {
          this.slimLoadingBarService.reset();
        }
      );
    } else {
      console.log("updating saved bank");
      console.log(this.payload);
      this.slimLoadingBarService.start();
      this.projectsService
        .updateBankCheque(this.saved_bank_id, this.payload)
        .subscribe(
          (res: any) => {
            swal("success", "update bank cheque successfully", "success");
            this.slimLoadingBarService.complete();
          },
          (err) => {
            this.slimLoadingBarService.reset();
          }
        );
    }
  }

  onSavedBankChange(event) {
    console.log(this.saved_bank_id);
    this.saved_banks.forEach((bank) => {
      if (bank.id == this.saved_bank_id) {
        this.saved_bank_detailes = bank;
      }
    });
    this.prepareBankCheque();
    console.log(this.saved_bank_detailes);
  }

  prepareBankCheque() {
    this.payload.type = "saved";
    this.payload.bank.bank_name = this.saved_bank_detailes.bank_name;
    this.bank_image = this.saved_bank_detailes.full_url;
    this.amount = this.saved_bank_detailes.variables.amount.value;
    this.date = this.saved_bank_detailes.variables.date.value;
    this.amountAfterFormat =
      this.saved_bank_detailes.variables.amount_text.amountAfterFormat;
    this.name = this.saved_bank_detailes.variables.beneficiary_name.value;
    this.amount_text = this.saved_bank_detailes.variables.amount_text.value;
    this.liner_text = this.saved_bank_detailes.variables.linear.value;
    console.log(`amountAfterFormat ${this.amountAfterFormat}`);
    console.log(`amount_text ${this.amount_text}`);
    this.handleDrag(this.saved_bank_detailes.variables);
  }

  getBankData() {
    let check_liner = document.getElementById(`check_liner`);
    let check_date = document.getElementById("check_date");
    let check_amount = document.getElementById("check_amount");
    let check_to = document.getElementById("check_to");
    let check_amount_text = document.getElementById("check_amount_text");
    this.payload.linear.value = this.liner_text;
    this.payload.amount_text.amountAfterFormat = this.amountAfterFormat;
    this.payload.amount_text.value = this.amount_text;
    this.payload.amount_text.top =
      this.getElementPositions(check_amount_text).top;
    this.payload.amount_text.left =
      this.getElementPositions(check_amount_text).left;
    this.payload.amount_text.bottom =
      this.getElementPositions(check_amount_text).bottom;
    this.payload.amount_text.right =
      this.getElementPositions(check_amount_text).right;
    this.payload.date.value = this.date;
    this.payload.date.top = this.getElementPositions(check_date).top;
    this.payload.date.left = this.getElementPositions(check_date).left;
    this.payload.date.bottom = this.getElementPositions(check_date).bottom;
    this.payload.date.right = this.getElementPositions(check_date).right;
    this.payload.beneficiary_name.value = this.name;
    this.payload.beneficiary_name.top = this.getElementPositions(check_to).top;
    this.payload.beneficiary_name.left =
      this.getElementPositions(check_to).left;
    this.payload.beneficiary_name.bottom =
      this.getElementPositions(check_to).bottom;
    this.payload.beneficiary_name.right =
      this.getElementPositions(check_to).right;
    this.payload.amount.value = this.amount;
    this.payload.amount.top = this.getElementPositions(check_amount).top;
    this.payload.amount.left = this.getElementPositions(check_amount).left;
    this.payload.amount.bottom = this.getElementPositions(check_amount).bottom;
    this.payload.amount.right = this.getElementPositions(check_amount).right;
    console.log(this.payload);
    if (this.payload.type == "new") {
      console.log("uploading new bank");
      let formvalue = this.uploadLayoutForm.value;
      this.payload.bank.bank_name = formvalue.bank_name;
      if (formvalue.file) {
        this.payload.bank.fileName = formvalue.file.filename;
        this.payload.bank.fileType = formvalue.file.filetype;
        this.payload.bank.file = formvalue.file.value;
      }
    } else {
      console.log("updating old bank");
    }
  }

  getElementPositions(element: HTMLElement) {
    let computedStyle = window.getComputedStyle(element);
    return {
      top: computedStyle.top,
      left: computedStyle.left,
      bottom: computedStyle.bottom,
      right: computedStyle.right,
    };
  }

  handleDrag(data?) {
    this.dragElement(document.getElementById("check_to"), "right");
    this.dragElement(document.getElementById("check_date"), "right");
    this.dragElement(document.getElementById("check_amount"), "left");
    this.dragElement(document.getElementById("check_amount_text"), "right");

    if (data) {
      document.getElementById("check_date").style.right = data.date.right;
      document.getElementById("check_date").style.left = data.date.left;
      document.getElementById("check_date").style.top = data.date.top;
      document.getElementById("check_date").style.bottom = data.date.bottom;
      document.getElementById("check_to").style.right =
        data.beneficiary_name.right;
      document.getElementById("check_to").style.left =
        data.beneficiary_name.left;
      document.getElementById("check_to").style.top = data.beneficiary_name.top;
      document.getElementById("check_to").style.bottom =
        data.beneficiary_name.bottom;
      document.getElementById("check_amount_text").style.right =
        data.amount_text.right;
      document.getElementById("check_amount_text").style.left =
        data.amount_text.left;
      document.getElementById("check_amount_text").style.top =
        data.amount_text.top;
      document.getElementById("check_amount_text").style.bottom =
        data.amount_text.bottom;
      document.getElementById("check_amount").style.right = data.amount.right;
      document.getElementById("check_amount").style.left = data.amount.left;
      document.getElementById("check_amount").style.top = data.amount.top;
      document.getElementById("check_amount").style.bottom = data.amount.bottom;
      console.log(data.amount.top);
    } else {
      document.getElementById("check_date").style.right =
        this.currentPositions.date.right;
      document.getElementById("check_date").style.left =
        this.currentPositions.date.left;
      document.getElementById("check_date").style.top =
        this.currentPositions.date.top;
      document.getElementById("check_date").style.maxWidth =
        this.currentPositions.date.width;
    }
  }

  dragElement(elmnt, diir) {
    console.log(elmnt);
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
      /* if present, the header is where you move the DIV from:*/
      document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
      /* otherwise, move the DIV from anywhere inside the DIV:*/
      elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = elmnt.offsetTop - pos2 + "px";
      elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
      if (diir == "right") {
        elmnt.style.right = "auto";
      }
    }

    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  formatMoney(x) {
    return x.toFixed(2);
  }
}
