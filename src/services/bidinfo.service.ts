import { HttpUtilService } from './http-util.service';

import { Bidinfo, BidInfoRest } from './../models/bidinfo.model';

import { Observable } from 'rxjs/Rx';

import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';




@Injectable()
export class BidinfoService {

	public path = 'bidinfo';
	public msgErro: string;
	public bidinfos: Bidinfo[];
	public pathApi = 'market';
	public obBidInfo: Bidinfo;

	constructor(public http: Http, public httpUtil: HttpUtilService) {
	}


	/**
 * Retorna listagem de todos os teams.
 *
 * @return Bidinfo[] Bidinfo
 */
	listarTodosBids(): Observable<BidInfoRest[]> {

		return this.http.get(this.httpUtil.url(this.pathApi + '/list'), this.httpUtil.headers())
			.map(this.httpUtil.extrairDadosContent)
			.catch(this.httpUtil.processarErros);
	}

	initialBid(bidInfo: Bidinfo): Observable<Bidinfo> {
		console.log(bidInfo);
		let params = JSON.parse(JSON.stringify(bidInfo || null));

		return this.http.post(this.httpUtil.url(this.pathApi + '/initialBid'), params,
			this.httpUtil.headers())
			.map(this.httpUtil.extrairDadosBidInfo)
			.catch(this.httpUtil.processarErros);

	}

	placeBid(bidInfo: Bidinfo) {
		let params = JSON.stringify(bidInfo || null);

		return this.http.post(this.httpUtil.url(this.pathApi + '/placeBid'), params,
			this.httpUtil.headers())
			.map(this.httpUtil.extrairDadosBidInfo)
			.catch(this.httpUtil.processarErros);
	}

	buscarPorIdPlayers(id: number): Observable<Bidinfo> {
		let bidinfoPath = 'market/player/getBid';
		return this.http.get(this.httpUtil.url(bidinfoPath + '/' + id),
			this.httpUtil.headers())
			.map(this.httpUtil.extrairDadosBid)
			.catch(this.httpUtil.processarErros);
	}

	closeMarket(): Observable<Bidinfo> {
		console.log('close');
		let bidinfoPath = this.pathApi + '/close';
		return this.http.post(this.httpUtil.url(bidinfoPath),
			this.httpUtil.headers())
			.map(this.httpUtil.extrairDados)
			.catch(this.httpUtil.processarErros);
	}

	openMarket(): Observable<Bidinfo> {
		let bidinfoPath = 'market/open';
		return this.http.get(this.httpUtil.url(bidinfoPath),
			this.httpUtil.headers())
			.map(this.httpUtil.extrairDadosMarket)
			.catch(this.httpUtil.processarErros);
	}

	isOpen(): Observable<Boolean> {
		let bidinfoPath = 'market/isopen';
		return this.http.get(this.httpUtil.url(bidinfoPath),
			this.httpUtil.headers())
			.map(this.httpUtil.extractBoolean)
			.catch(this.httpUtil.processarErros);
	}

	buscarPorTeam(id: number, page: number): Observable<BidInfoRest> {
		let bidinfoPath = '/market/team/getBid';
		return this.http.get(this.httpUtil.url(bidinfoPath + '/' + id + '?page='+page),
			this.httpUtil.headers())
			.map(this.httpUtil.extrairDados)
			.catch(this.httpUtil.processarErros);
	}

	/**
	 * Cadastra um novo bidinfo.
	 *
	 * @param Bidinfo bidinfo
	 */
	cadastrarHttp(bidinfo: Bidinfo): Observable<Bidinfo> {
		let params = JSON.stringify(bidinfo);

		return this.http.post(this.httpUtil.url(this.path), params,
			this.httpUtil.headers())
			.map(this.httpUtil.extrairDados)
			.catch(this.httpUtil.processarErros);
	}





}
