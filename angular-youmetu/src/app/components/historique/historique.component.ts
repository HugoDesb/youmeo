import { Component, OnInit } from '@angular/core';
import {LogService} from '../../services/logService/log.service';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueComponent implements OnInit {

  constructor(private logService:LogService) { }

  ngOnInit() {
    let user_id = JSON.parse(localStorage.getItem("user_id"))

    if(user_id){
      this.logService.getHistorique(user_id,(response) => {
         console.log(response);
        })
      }

  }

}
