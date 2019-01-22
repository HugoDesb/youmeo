import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor( private http: HttpClient,) { }

  public getHistorique(user_id, res){
    this.http.get('https://pilote-youmeo.herokuapp.com/api/log/historique/'+user_id).subscribe(data => {
      res(data)
    })
  }
}
