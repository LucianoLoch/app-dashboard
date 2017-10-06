import { PlayerFilter } from './../models/playerFilter.model';
import { TransfermarketRest, Transfermarket } from './../models/transfermarket.model';
import { HttpUtilService } from './http-util.service';
import { BidinfoService } from './bidinfo.service';
import { PlayerService } from './player.service';
import { TeamService } from './team.service';
import { User } from './../models/user.model';
import { Team } from './../models/team.model';
import { Bidinfo } from './../models/bidinfo.model';
import { PlayerAttributes } from './../models/playerAttributes.model';
import { PlayerRest, Player } from './../models/player.model';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';


@Injectable()
export class TransfermarketService {


  public players: Array<Player>;
  public msgErro: string;
  public bidinfoService: BidinfoService;
  public playerService: PlayerService;
  public teamService: TeamService;
  public user: User;
  public team: Team;
  public bidInfo: Bidinfo;
  public playerRest: PlayerRest;


  constructor(_bidinfoService: BidinfoService,
    _playerService: PlayerService,
    _teamService: TeamService,
    public http: Http,
    public httpUtil: HttpUtilService) {
    this.bidinfoService = _bidinfoService;
    this.playerService = _playerService;
    this.teamService = _teamService;
    this.user = JSON.parse(sessionStorage.getItem('currentUser'));
    this.team = JSON.parse(sessionStorage.getItem('team'));
  }

  bid(rating: number): number {

    let bidvalue = 0;

    if (rating >= 90) {
      bidvalue = 5000;
    } else if (rating >= 86) {
      bidvalue = 2500;
    } else if (rating >= 81) {
      bidvalue = 1500;
    } else if (rating >= 76) {
      bidvalue = 600;
    } else if (rating >= 71) {
      bidvalue = 500;
    } else if (rating >= 61) {
      bidvalue = 300;
    } else {
      bidvalue = 200;
    }
    return bidvalue;
  }

  listarFilterObservable(playerFilter: PlayerFilter): Observable<Transfermarket[]> {
    return Observable.of(this.listarFilter(playerFilter, 0));
  }

  listarFilterObservableRest(playerFilter: PlayerFilter, page: number): Observable<TransfermarketRest> {
    return Observable.of(this.listarFilter2(playerFilter, page));
  }
  listarFilter(playerFilter: PlayerFilter, page: number): Transfermarket[] {
    let playerList: Player[] = [];
    let shops: Transfermarket[] = [];


    this.playerService.listarFiltro(playerFilter, page)
      .subscribe((players) => {
        this.players = players;
        for (let player of this.players) {

          let shop = new Transfermarket();
          shop.name = player.name;
          shop.position = player.position;
          shop.rating = player.rating;
          shop.idPlayer = player.id;
          shop.team = this.team;
          shop.attributes = player.attributes;
          if (!player.hasBid) {
            shop.idBid = 0;
            shop.bidValue = this.bid(player.rating);
            shop.originalValue = this.bid(player.rating);
            shop.teamId = this.team.id;
            shop.hasBid = false;
            shop.bidAproved = false;
            shops.push(shop);
          } else {

            this.bidinfoService.buscarPorIdPlayers(player.id)
              .subscribe((bidInfo) => {
                this.bidInfo = bidInfo;
                let bid: Bidinfo = this.bidInfo;
                if (this.bidInfo) {
                  shop.idBid = bid.id;
                  shop.originalValue = bid.originalValue;
                  shop.bidValue = bid.bidValue + (bid.originalValue * 0.05);
                  shop.teamId = this.team.id;
                  shop.hasBid = player.hasBid;
                  shop.bidAproved = (bid.teamID === this.team.id);
                } else {
                  shop.idBid = 0;
                  shop.bidValue = this.bid(player.rating);
                  shop.originalValue = this.bid(player.rating);
                  shop.teamId = this.team.id;
                  shop.hasBid = false;
                  shop.bidAproved = false;
                }

                shops.push(shop);
              });
          }
        }



      },

      error => this.msgErro = error);
    return shops;


  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  carregarPlayerRest(playerFilter: PlayerFilter, page: number) {
    let params = JSON.parse(JSON.stringify(playerFilter || null));
    this.http.post(this.httpUtil.url('player/getPlayers?page=' + page), params)
      .toPromise().then(response => {
        return JSON.stringify(response.json()) as PlayerRest;
      }).catch(this.handleError).then(playerParam => {
        this.playerRest = playerParam;
      }).catch(this.handleError);
    
  }

  carregarTime(id: number) {

  }


  listarFilter2(playerFilter: PlayerFilter, page: number): Promise<TransfermarketRest> {
    return new Promise((resolve, reject) => {
      let playerList: Player[] = [];
      let shops: Transfermarket[] = [];
      let rest = new TransfermarketRest();
      let playerRest = new PlayerRest();

      this.playerService.listarFiltroRest(playerFilter, page)
        .subscribe((players) => {
          this.players = players.content;
          rest.first = players.first;
          rest.last = players.last;
          rest.number = players.number;
          rest.numberOfElements = players.numberOfElements;
          rest.size = players.size;
          rest.sort = players.sort;
          rest.totalElements = players.totalElements;
          rest.totalPages = players.totalPages;

          let array: Array<any> = [];

      

          let arrayDePromises: Array<Promise<any>> = [];
          arrayDePromises.push(new Promise((resolve, reject) => {
            this.http.get(this.httpUtil.url('team/getByUser/' + this.team.id)).toPromise().then(response => {
              return response.json() as Team;
            }).catch(this.handleError).then(timesParam => {
              this.team = timesParam;
              resolve();              
            }).catch(this.handleError);
          }));
         
          this.players.map(player => {
            let shop = new Transfermarket();
            shop.name = player.name;
            shop.player = player;
            shop.clubName = player.clubName;
            shop.position = player.position;
            shop.rating = player.rating;
            shop.idPlayer = player.id;
            shop.team = this.team;
            shop.attributes = player.attributes;
            if (!player.hasBid) {
              shop.idBid = 0;
              shop.bidValue = this.bid(player.rating);
              shop.originalValue = this.bid(player.rating);
              shop.teamId = this.team.id;
              shop.hasBid = false;
              shop.bidAproved = false;
              array.push(shop);
            } else {
              arrayDePromises.push(new Promise((resolve, reject) => {
                this.bidinfoService.buscarPorIdPlayers(player.id).subscribe((bidInfo) => {
                  this.bidInfo = bidInfo;
                  let bid: Bidinfo = this.bidInfo;
                  if (this.bidInfo) {
                    shop.idBid = bid.id;
                    shop.originalValue = bid.originalValue;
                    shop.bidValue = bid.bidValue + (bid.originalValue * 0.05);
                    shop.teamId = this.team.id;
                    shop.hasBid = player.hasBid;
                    shop.bidAproved = (bid.teamID === this.team.id);
                  } else {
                    shop.idBid = 0;
                    shop.bidValue = this.bid(player.rating);
                    shop.originalValue = this.bid(player.rating);
                    shop.teamId = this.team.id;
                    shop.hasBid = false;
                    shop.bidAproved = false;
                  }
                  array.push(shop);
                  resolve();
                });
              }));
            }
          });
          

          Promise.all(arrayDePromises).then(() => {
            shops = array;
            rest.transfermarkets = shops;
            resolve(rest);
          });
        },

        error => this.msgErro = error);
    });
  }

  getTeam() {
    return this.team;
  }


  buscarPorPlayerId(id: number): Observable<Bidinfo> {
    let bidinfoPath = 'market/getBidFromPlayerId';
    return Observable.create(observer => {
      this.http.get(this.httpUtil.url(bidinfoPath + '/' + id),
        this.httpUtil.headers())
        .map(this.httpUtil.extrairDados)
        .catch(this.httpUtil.processarErros)
        .subscribe((data) => {
          this.bidInfo = data
          observer.next(this.bidInfo);
          observer.complete();
        });
    });
  }








}