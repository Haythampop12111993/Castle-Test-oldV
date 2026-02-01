import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import swal, { SweetAlertType } from "sweetalert2";
import { Clipboard } from "ts-clipboard";

@Injectable()
export class ErrorHandlerService {
  constructor() {}
  /**
   * this will fetch the correct error message.
   * log the whole error to the console.
   * show the correct message to the user
   * enable the user to copy error and send it to us from production
   */
  handleErorr(err: HttpErrorResponse) {
    console.log(err);
    console.log(typeof err.error);
    if (typeof err.error == "string") {
      this.alert(err.error, " ", "error", err);
    }
    ///usually this is a business logic error with descriptive message
    else if (err.status == 400) {
      this.alert(err.error.message, "Code: 400", "info");
    } else if (err.status == 404) {
      this.alert(
        "Server error happened!\nContact your admin",
        `Code: ${err.status}`,
        "error",
        err
      );
    } else if (err.status == 405) {
      this.alert(
        "Server error happened!\nContact your admin",
        `Code: ${err.status}`,
        "error",
        err.message
      );
    } else if (err.error && err.error.message == "Token has expired") {
      this.alert("Token has been expired, please try login again", "", "error");
    } else if (err.status == 500) {
      this.alert(
        "Server error happened!\nContact your admin",
        "Code: 500",
        "error",
        err
      );
    } else if (err.error.error) {
      this.alert(err.error.error, " ", "error", err);
    } else if (err.status == 422) {
      const errMsgs = this.extractValidationErrors(err).join("\n");
      this.alert(errMsgs, "Validation error", "error", err);
    } else if (typeof err.error.message == "string" && err.status != 500) {
      this.alert(err.error.message, "", "error", err);
    } else if (err.error) {
      if (err.error.errors) {
        if (Object.keys(err.error.errors)) {
          let keys = Object.keys(err.error.errors);
          console.log(keys);
          this.alert(err.error.errors[keys[0]][0], "", "error", err);
        }
      }
    } else {
      this.alert(
        "Something went wrong, please try again later or contact the admin",
        `Code ${err.status}`,
        "error",
        err
      );
    }
  }

  private alert(title: string, message?: string, type?: SweetAlertType, err?) {
    swal({
      title: title,
      type: type,
      text: message,
      allowEnterKey: true,
      showConfirmButton: true,
      confirmButtonText: "Ok",
      showCancelButton: err,
      cancelButtonText: "Copy error",
      cancelButtonColor: "#286090",
    }).then((result) => {
      const isConfirmClicked = result == true;
      const isCancelClicked = result.dismiss == swal.DismissReason.cancel;
      if (isConfirmClicked) {
      } else if (isCancelClicked) {
        Clipboard.copy(JSON.stringify(err));
      }
    });
  }

  private extractValidationErrors(errorResponse: HttpErrorResponse) {
    // 1 - Create empty array to store errors
    const errors = [];
    // 2 - check if the error object is present in the response
    if (errorResponse.error) {
      // 3 - Push the main error message to the array of errors
      errors.push(errorResponse.error.message);
      // 4 - Check for Laravel form validation error messages object
      if (errorResponse.error.errors) {
        // 5 - For each error property (which is a form field)
        for (const property in errorResponse.error.errors) {
          if (errorResponse.error.errors.hasOwnProperty(property)) {
            // 6 - Extract it's array of errors
            const propertyErrors: Array<string> =
              errorResponse.error.errors[property];
            // 7 - Push all errors in the array to the errors array
            propertyErrors.forEach((error) => errors.push(error));
          }
        }
      }
    }
    return errors;
  }

  private _alert(title: string, message?: string, type?: SweetAlertType, err?) {
    let counter = 10;
    let timerInterval;

    swal({
      title: "New Version Updated",
      type: "error",
      html: `system will reload in <strong id="counter">${counter}</strong> seconds.`,
      allowEnterKey: false,
      showConfirmButton: false,
      confirmButtonText: "Reload",
      showCancelButton: false,
      cancelButtonText: "Cancel",
      cancelButtonColor: "#286090",
      timer: counter * 1000,
      onBeforeOpen: () => {
        swal.showLoading();
      },
      onClose: () => {
        clearInterval(timerInterval);
        // window.location.reload();
      },
    }).then((result) => {
      if (result.value) {
        // hard reload
        window.location.reload();
      }
    });
  }
}
