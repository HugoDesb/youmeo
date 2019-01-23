import { Component, OnInit } from '@angular/core';
import {LogService} from '../../services/logService/log.service';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueComponent implements OnInit {

  private historiques = [];
  private newdate:any;
  constructor(private logService:LogService) { }

  ngOnInit() {
    let user_id = JSON.parse(localStorage.getItem("user_id"))

    if(user_id){
      this.logService.getHistorique(user_id,(response) => {
        this.historiques = response.data;
        
        // pour obtenir la date et l'heure
        var n = this.historiques.length
        for(var i=0;i<n;i++){
          this.historiques[i]['date'] =this.historiques[i]['date'].split('T');

          this.historiques[i]['date'][0] = this.historiques[i]['date'][0].split('-').reverse().join('/');
          this.historiques[i]['date'][1] = this.historiques[i]['date'][1].split('.')[0];
        }

      })
    }
  }

}
