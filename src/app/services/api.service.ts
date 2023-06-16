import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent } from '@angular/common/http';
import { configuration } from '../configration';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SpinnerService } from './spinner.service';
import {ToastrService} from 'ngx-toastr';



@Injectable({
  providedIn: 'root'
})
export class ApiService {


  constructor(public http: HttpClient,private toastrService: ToastrService, public router: Router,public spinner: SpinnerService,) { }

  logout(status=false) {
    localStorage.removeItem('authDetail');
    localStorage.removeItem('token');
    localStorage.removeItem('auth');
    localStorage.removeItem('login');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('eventId');
    localStorage.removeItem('setting');
    
    console.log(status)
    //localStorage.clear();
    if(status == false){
    
      this.router.navigate(['/']);
     
    }
  }


  get(request: Request) {
    return this.http.get(configuration.BASE_URL + request['path'], {
      headers: this.getHeader(request)
    }).pipe(
      retry(1),
      catchError(this.handleError.bind(this))
    );
  }

  getwithHeader(request: Request) {
    return this.http.get(configuration.BASE_URL + request['path'], {
      headers: this.getHeaderWithHeader(request)
    }).pipe(
      retry(1),
      catchError(this.handleError.bind(this))
    );
  }
  getUrl(request: Request) {
    return this.http.get(request['path'], {
    }).pipe(
      retry(1),
      catchError(this.handleError.bind(this))
    );
  }
  delete(request: Request) {
    return this.http.delete(configuration.BASE_URL + request.path, {
      headers: this.getHeader(request)
    }).pipe(
      retry(1),
      catchError(this.handleError.bind(this))
    );
  }

  postWithoutToken(request): Observable<any[]> {
    return this.http.post<any[]>(configuration.BASE_URL + request['path'], request['data'], {
      headers: this.getHeaderWithoutHeader(request)

    }).pipe(
      retry(1),
      catchError(this.handleError.bind(this))
    );
  }


  // async ExportService(request): Observable<HttpEvent<Blob>> {
  //   // return this.http.post<any[]>(configuration.BASE_URL + request['path'], request['data'], {
  //   //   headers: this.getHeaderWithoutHeader(request)
  //   // });
  //   const file =  await this.http.get<Blob>(
  //     //configuration.BASE_URL + request['path'] + this.ZIP_URL + '/' + id,
  //    // {responseType: 'blob' as 'json'}).toPromise();
  //    return file;
  // }


  //============================== Export Service  pradip kor | 29-04-2020 ===========================
  ExportReqBody(request:Request,filename:string){
    let header:HttpHeaders = new HttpHeaders({'Access-Control-Allow-Origin' : '*','Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',"Content-Type":"application/json","Accept":"application/json"});
    //header = header.append("Authorization","Bearer "+this.auth.details.accessToken);

    let token = JSON.parse(localStorage.getItem("token"));

      header = header.append("Access-Key", ["E9VHN9R-0ZP4HYE-QEK5CHY-49F3Y6D"]);
      if(token != null){
        header = header.append("TOKEN", [token]);
      }


    let fileType='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    return this.http.post(`${configuration.BASE_URL+request.path}`,
      request.data,{
      responseType: 'arraybuffer',
      headers:header}
    ).subscribe(response =>{
      this.downLoadFile(response,fileType,filename,'.xlsx');
    }
     );

  }
  getPDF(request: Request){
    let header:HttpHeaders = new HttpHeaders({'Access-Control-Allow-Origin' : '*','Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',"Content-Type":"application/json","Accept":"application/json"});
    let token = JSON.parse(localStorage.getItem("token"));

    header = header.append("Access-Key", ["E9VHN9R-0ZP4HYE-QEK5CHY-49F3Y6D"]);
    if(token != null){
      header = header.append("TOKEN", [token]);
    }
    let fileType='application/pdf';
    this.spinner.show();
    return this.http.get(`${configuration.BASE_URL+request.path}`,{
        responseType: 'arraybuffer',
        headers:header}
    ).subscribe(response =>  {
      this.previewFile(response,fileType,"filename",'.pdf')
      this.spinner.hide();
    },error => {
      this.spinner.hide();
    });
  }
  ExportPdf(request:Request,filename:string){
    let header:HttpHeaders = new HttpHeaders({'Access-Control-Allow-Origin' : '*','Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',"Content-Type":"application/json","Accept":"application/json"});
    //header = header.append("Authorization","Bearer "+this.auth.details.accessToken);

    let token = JSON.parse(localStorage.getItem("token"));

    header = header.append("Access-Key", ["E9VHN9R-0ZP4HYE-QEK5CHY-49F3Y6D"]);
    if(token != null){
      header = header.append("TOKEN", [token]);
    }
    let fileType='application/pdf';
    this.spinner.show();
    return this.http.post(`${configuration.BASE_URL+request.path}`,
      request.data,{
        responseType: 'arraybuffer',
        headers:header}
    ).subscribe(response =>  {
      this.previewFile(response,fileType,filename,'.pdf')
      this.spinner.hide();
    },error => {
      this.spinner.hide();
    });


  }
  previewFile(data: any, type: string,filename:string,fileExe:string) {
    var a = document.createElement("a");
    document.body.appendChild(a);
   // a.style = "display: none";
    let blob = new Blob([data], { type: type});
    let url = window.URL.createObjectURL(blob);
    window.open(url,'_blank');
  }

  downLoadFile(data: any, type: string,filename:string,fileExe:string) {
    var a = document.createElement("a");
    document.body.appendChild(a);
   // a.style = "display: none";
    let blob = new Blob([data], { type: type});
    let url = window.URL.createObjectURL(blob);
    //let pwa = window.open(url);
    a.href = url;
    //a.download = Math.random().toString(36).substring(7)+fileExe+'Excel.'+fileExe;
    a.download = filename+fileExe;
    a.click();
    window.URL.revokeObjectURL(url);
    // if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
    //     alert( 'Please disable your Pop-up blocker and try again.');
    // }
  }


  //======================================================================================================

  postWithToken(request): Observable<any[]> {
    return this.http.post<any[]>(configuration.BASE_URL + request['path'], request['data'], {
      headers: this.getHeaderWithHeader(request)
    }).pipe(
      retry(1),
      catchError(this.handleError.bind(this))
    );
  }

  post(request): Observable<any[]> {
    return this.http.post<any[]>(configuration.BASE_URL + request['path'], request['data'], {
      headers: this.getHeader(request)
    }).pipe(
      retry(1),
      catchError(this.handleError.bind(this))
  );
  }
  login(request): Observable<any[]> {
    return this.http.post<any[]>(configuration.BASE_URL + request['path'], request['data'], {
    });
  }

  handleError(error) {

    if(error['error']['status']['code'] && error['error']['status']['code'] == "UNAUTHORIZED"){
      localStorage.removeItem('authDetail');
      localStorage.removeItem('token');
      localStorage.removeItem('eventId');
      localStorage.removeItem('setting');
      window.location.href ='/';
    }
    if(error['error']['error'] !=   undefined)
    {
      this.toastrService.error(error['error']['error']);
    }
    this.spinner.hide();
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
     // this.toastrService.error(error['error']['error']);
      // client-side error
      errorMessage = error;//`Error: ${error.error.message}`;
    } else {
    // this.toastrService.error(error['error']['error']);
      // server-side error
      errorMessage = error;//`Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  // post(request:Request){
  //   return this.http.post(configuration.BASE_URL+request.path,request.data,{
  //     headers:this.getHeader(request),
  //     observe:"response",
  //   });
  // }

  put(request: Request) {
    return this.http.put(configuration.BASE_URL + request.path, request.data, {
      headers: this.getHeader(request)
    }).pipe(
      retry(1),
      catchError(this.handleError.bind(this))
    );
  }

  postImage(request: Request) {
    let headers = new HttpHeaders();
    let token = JSON.parse(localStorage.getItem("token"));
     if(request.isAuth && token){
       headers = new HttpHeaders({"TOKEN":token});
     }
    //console.log(token);
    return this.http.post(configuration.BASE_URL + request.path, request.data, {
      headers: headers
    }).pipe(
      retry(1),
      catchError(this.handleError.bind(this))
    );
  }

  // postImage(request:Request){
  //   let headers = new HttpHeaders();
  //   if(request.isAuth){
  //     headers = new HttpHeaders({"Authorization":"Bearer "+this.auth.details.accessToken});
  //   }
  //   return this.http.post(configuration.BASE_URL+request.path,request.data,{
  //     headers: headers
  //   });
  // }

  private getHeaderWithoutHeader(request: Request) {
    let token = JSON.parse(localStorage.getItem("token"));
    let header: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    return header;
  }

  private getHeaderWithHeader(request: Request) {
    let header: HttpHeaders ;
    let token = JSON.parse(localStorage.getItem("token"));
    if(token){
      header = new HttpHeaders({
        "TOKEN": token
      });
    }else{
      header = new HttpHeaders({
      });
    }

    return header;
  }

  private getHeader(request: Request) {
    let token = JSON.parse(localStorage.getItem("token"));
    let header: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Access-Control-Allow-Origin": "*",
    });

    if (request.isAuth) {
      header = header.append("Access-Key", ["E9VHN9R-0ZP4HYE-QEK5CHY-49F3Y6D"]);
      if(token != null){
        header = header.append("TOKEN", [token]);
      }
    }
    return header;
  }

}

export interface Request {
  path: string,
  data?: any,
  isAuth?: boolean;
}
