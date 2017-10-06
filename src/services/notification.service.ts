import { Notification } from './../models/notification.model';
import { HttpUtilService } from './http-util.service';
import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';


@Injectable()
export class NotificationService {

    public path = 'notification/getByTeam';
    public msgErro: string;
    public notifications: Notification[];

    constructor(public http: Http, public httpUtil: HttpUtilService) {
    }

    listarTodos(): Observable<Notification[]> {
        return this.http.get(this.httpUtil.url(this.path), this.httpUtil.headers())
            .map(this.httpUtil.extrairDadosContent)
            .catch(this.httpUtil.processarErros);
    }   

    buscarPorId(id: number): Observable<Notification[]> {
        return this.http.get(this.httpUtil.url(this.path + '/' + id),
            this.httpUtil.headers())
            .map(this.httpUtil.extrairDadosContent)
            .catch(this.httpUtil.processarErros);
    }  

    getLastNotifications(id: number): Observable<Notification[]> {
        return this.http.get(this.httpUtil.url('notification/getLasts/' + id),
            this.httpUtil.headers())
            .map(this.httpUtil.extrairDadosContent)
            .catch(this.httpUtil.processarErros);
    }  

    

}