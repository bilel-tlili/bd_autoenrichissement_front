import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { environment } from '@env/environment';

import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../authentication/token.service';
import { SettingsService } from '@core/bootstrap/settings.service';

@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private token: TokenService,
    private settings: SettingsService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add server host
    const url = environment.SERVER_ORIGIN + req.url;
    

    // Only intercept API url
    if (!url.includes('/api/') ) {
      return next.handle(req);
    }
     
    // All APIs need JWT authorization
    const headers = {
      'Accept': 'application/json',
       'Accept-Language': this.settings.language,
       'Access-Control-Allow-Credentials': 'true',
      'Authorization': `Bearer ${this.token.get().token}`,
    };

    let newReq = req.clone({ url, setHeaders: headers, withCredentials: true });
    if (url.includes('/Authentification/login') ) {
      newReq = req.clone({ url});
    }
  
    
    return next.handle(newReq).pipe(
      mergeMap((event: HttpEvent<any>) => this.handleOkReq(event)),
      catchError((error: HttpErrorResponse) => this.handleErrorReq(error))
    );
  }

  private goto(url: string) {
    setTimeout(() => this.router.navigateByUrl(url));
  }

  private handleOkReq(event: HttpEvent<any>): Observable<any> {
    // if (event instanceof HttpResponse) {
    //   const body: any = event.body;
    //   console.log("body "+ JSON.stringify(event))
    //   //failure: { code: **, msg: 'failure' }
    //   //success: { code: 0,  msg: 'success', data: {} }
    //   if (body && body.code !== 0) {
    //     if (body.msg && body.msg !== '') {
    //       this.toastr.error(body.msg);
    //     }
    //     return throwError([]);
    //   } else {
    //     console.log(event)
    //     return of(event);
    //   }
    // }
    //Pass down event if everything is OK
    return of(event);
    
  }

  private handleErrorReq(error: HttpErrorResponse): Observable<never> {
    console.error('ERROR', error);
    switch (error.status) {
     
      case 401:
        this.goto(`/auth/login`);
        break;
        case 0:
          this.goto(`/sessions/500`);
          break;
      case 403:
      case 404:
      case 500:
        this.goto(`/sessions/${error.status}`);
        break;
      default:
        if (error instanceof HttpErrorResponse) {
         
          this.toastr.error(` ${error.error.ERROR_REASON}`,error.error.msg || `${error.status} ${error.statusText} ` ,  {
         
            "positionClass": "toast-bottom-center",
         
            "timeOut": 1500,
            "extendedTimeOut": 1000,
            "closeButton": true,
            "progressBar": true,
            
          });
        }
        break;
    }
    return throwError(error);
  }
}
