import { share, finalize } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subject, Observable, ReplaySubject } from 'rxjs';

// Services
import { AlertsService } from '../alerts/alerts.service';
import { SessionService } from './session.service';
import { StorageService } from './storage.service';

// Environmental settings
import { environment } from '../../../environments';

@Injectable()
export class FinanceApiService {

  readonly apiUrl = environment.apiUrl;
  private available = true;
  private queue: Array<any> = [];
  private debug: boolean = false;

  constructor(
    private http: HttpClient,
    private alertsService: AlertsService,
    private sessionService: SessionService,
    private storageService: StorageService,
    private router: Router,
    private location: Location,
  ) {
    this.sessionService.sessionStatus.subscribe(
      status => {
        this.available = status;
        // If API became available, flush queue.
        if (status) {
          this.queue.forEach(function (i) {
            i['response'].subscribe(
              next => i['client'].next(next),
              error => i['client'].error(error),
            );
          });
          this.queue = [];
        }
      }
    );
  }

  public post(url: string, body: any, params?: string): Observable<HttpResponse<Object>> {
    return this.http.post(this.apiUrl + url, body, {params: this.stringToHttpParams(params), observe: 'response'});
  }

  public get(url: string, params?: string): Observable<HttpResponse<Object>> {
    return this.request('GET', url, null, params);
  }

  public delete(url: string, params?: string): Observable<HttpResponse<Object>> {
    return this.http.delete(this.apiUrl + url, {params: this.stringToHttpParams(params), observe: 'response'});
  }

  public put(url: string, body: any, params?: string): Observable<HttpResponse<Object>> {
    return this.http.put(this.apiUrl + url, body, {params: this.stringToHttpParams(params), observe: 'response'});
  }

  private request(method: string, url: string, body: any, params?: string): Observable<HttpResponse<Object>> {
    const subject = new ReplaySubject<HttpResponse<Object>>(1);
    const cache_key = method + url + JSON.stringify(body) + params;
    this.debug && console.log("finance api: body: ", body);
    this.debug && console.log("fiannce_api: params: ", params);

    // If we do get request, try to use cache
    if (method === 'GET') {
      let cache = this.storageService.getItem(cache_key);
      // If cache available for specific request, we can return it, but we don't close the subscribtion.
      if (cache !== null && cache !== undefined) {
        this.debug && console.log("finance api: cache found for key: ", cache_key);
        this.debug && console.log("finance api: cache: ", cache);
        subject.next(cache);
      }
    }

    let _params: HttpParams = this.stringToHttpParams(params);

    // Create http observable, but don't subscribe yet
    let response = (function (http, apiUrl) {
      if (method == 'POST') {
        return http.post(apiUrl + url, body, {params: _params, observe: 'response'});
      } else if (method == 'PUT') {
        return http.put(apiUrl + url, body, {params: _params, observe: 'response'});
      } else if (method == 'DELETE') {
        return http.delete(apiUrl + url, {params: _params, observe: 'response'});
      } else {
        return http.get(apiUrl + url, {params: _params, observe: 'response'});
      }
    })(this.http, this.apiUrl).pipe(share());

    // If API is available, subscribe to request.
    // If API is NOT available, subscribe to queued response.
    ((this.available ? response : this.queueResponse(response)) as Observable<HttpResponse<Object>>).pipe(finalize(() => subject.complete())).subscribe(
      data => {
        // If request is successful, refresh token in global storage
        const token = data.headers.get('authorization');
        token && this.storageService.setGlobalItem('token', token);

        // Cache received response
        if (method === 'GET') {
          this.storageService.setItem(cache_key, JSON.stringify(data));
        }

        // Pass received data to subject
        subject.next(data);
      },
      error => {
        // DEAD CODE?
        // Handle situation when user is not logged in.
        if (error == 'Error: No JWT present or has expired') {
          this.available = false;
          this.sessionService.expireSession(true);
          response = this.queueResponse(response);
        } else {
          console.log(error);
        }
      }
    );

    return subject;
  }

  queueResponse(response: Observable<HttpResponse<Object>>) {
    const client = new Subject<any>();
    this.queue.push({
      'response': response,
      'client': client,
    });
    return client;
  }

  stringToHttpParams(params?: string): HttpParams {
    if (params) {
      return new HttpParams({fromString: params});
    }
  }
}
