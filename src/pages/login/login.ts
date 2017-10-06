import { Team } from './../../models/team.model';
import { User } from './../../models/user.model';
import { TeamService } from './../../services/team.service';
import { AuthenticationService } from './../../services/authentication.service';
import { HomePage } from './../home/home';
import { Component, OnInit } from '@angular/core';

import { IonicPage, NavController, ToastController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

    public usuario: string;
    public senha: string;



    constructor(public navCtrl: NavController,
                public authenticationService: AuthenticationService,
                public toastCtrl: ToastController,
                public teamService: TeamService){

    }

    login(){
        this.authenticationService.logout();
        let user = new User();
        user.login = this.usuario;
        user.senha = this.senha;

        this.authenticationService.login(user)
        .subscribe((user) => {
            let team: Team;
            let userLogged = user;
            if (userLogged && userLogged.keyAuth) {
                this.navCtrl.push(HomePage);
                let toast = this.toastCtrl.create({
                    message: 'Usuário Logado com Sucesso.',
                    duration: 3000,
                    position: 'top'
                  });
                  toast.present();

            } else {
                let toast = this.toastCtrl.create({
                    message: 'Usuário inválido ou senha incorreta.',
                    duration: 3000,
                    position: 'top'
                  });
                  toast.present();                
            }

        },
        error => { 
            let toast = this.toastCtrl.create({
                message: 'Usuário inválido ou senha incorreta.',
                duration: 3000,
                position: 'top'
              });
              toast.present();});       

    }




}