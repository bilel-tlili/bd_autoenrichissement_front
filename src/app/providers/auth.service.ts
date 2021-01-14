import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { SettingsService, User } from '@core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private REST_API_SERVER = "http://185.111.54.55:10230/api/Authentification/";

  user: User;
  constructor(public httpclient: HttpClient, settings: SettingsService) {

    this.user = settings.user;
  }


  public login(data): Observable<any> {
    return this.httpclient.post(this.REST_API_SERVER + 'login', data).pipe(
      map(this.extractData),

    );

  }

  public me(): Observable<any> {
    return this.httpclient.get(this.REST_API_SERVER + 'me').pipe(
      map(this.extractData),
      catchError(this.handleError)
    );

  }

  public createUser(data: any): Observable<any> {
    return this.httpclient.post(this.REST_API_SERVER + 'createUser', data).pipe(
      map(this.extractData),

    );

  }
  public getUsers(): Observable<any> {
    return this.httpclient.get(this.REST_API_SERVER + 'allusers').pipe(
      map(this.extractData)

    );

  }


  public updatePassword(data): Observable<any> {
    return this.httpclient.put(this.REST_API_SERVER + "updatePassword/" + this.user.id, data).pipe(
      map(this.extractData)
    )

  }

  public generatePassword(id): Observable<any> {
    return this.httpclient.get(this.REST_API_SERVER + "sendPasswordByMail/" + id).pipe(
      map(this.extractData)
    )

  }

  public updateStatus(id): Observable<any> {
    return this.httpclient.get(this.REST_API_SERVER + "updateStatus/" + id).pipe(
      map(this.extractData)
    )

  }
  private extractData(res: Response): any {
    console.log(res)
    const body = res;
    return body || {};
  }


  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

}
