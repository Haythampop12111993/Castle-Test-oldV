import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(public router: Router, private cookieService: CookieService) {
    // console.log('interceptor hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // console.info('req.headers =', req.headers, ';');
    let token = window.localStorage.getItem("token") || "";
    req = req.clone({
      setHeaders: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
    return next
      .handle(req)
      .map((event: HttpEvent<any>) => {
        // console.log('interceoting rquest');
        //  console.log(event);
        if (event instanceof HttpResponse && event.status == 401) {
          // test response with valid version instead of error
        }

        return event;
      })
      .catch((err: any, caught) => {
        console.log(err);
        if (err instanceof HttpErrorResponse) {
          if (err.status != 400) {
            if (
              err.error.message === "token_expired" ||
              err.error.message == "Token has expired" ||
              (err.error &&
                err.error.message &&
                err.error.message.includes("Token"))
            ) {
              window.localStorage.clear();
              this.router.navigate(["login"]);
              // console.info('err.error =', err.error, ';');
            }
          }
          return Observable.throw(err);
        }
      });
  }
}
