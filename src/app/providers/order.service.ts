import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SettingsService, User } from '@core';
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private REST_API_SERVER = "http://185.111.54.55:10230/api/Orders/";
  user: User;
  constructor(public httpclient: HttpClient, settings: SettingsService) {

    this.user = settings.user;
  }


 public  sendFile(data,filename) : Observable<any> {
    const formData : FormData = new FormData() ;
    formData.append( 'file', new Blob([data], { type: 'text/csv' }), filename);

    return this.httpclient.post(this.REST_API_SERVER+'uploadFile',formData).pipe(
      map(this.extractData),
     
    );

  }

  public createOrder(data) : Observable<any> {

    return this.httpclient.post(this.REST_API_SERVER+"createOrder/"+  this.user.id,data).pipe(
      map(this.extractData)
    )
    
  }

  public getAllOrders() : Observable<any> {

    return this.httpclient.get(this.REST_API_SERVER+"allorders").pipe(
      map(this.extractData)
    )
    
  }
  private extractData(res: Response): any {
    console.log(res)
    const body = res;
    return body || { };
  }

}
