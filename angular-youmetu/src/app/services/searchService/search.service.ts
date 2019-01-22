import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private user_id = JSON.parse(localStorage.getItem('user_id'));

  constructor(private http:HttpClient) {
  }

  public search(str:string, platformId = 0, res){

    this.http.get('https://pilote-youmeo.herokuapp.com/api/search/'+this.user_id+'/'+platformId+'/'+str).subscribe(data =>{
      res(data);
    });
  }

  public getVideo(platformId, videoId, res){
    this.http.get('https://pilote-youmeo.herokuapp.com/api/video/'+this.user_id+'/'+platformId+'/'+videoId).subscribe(data =>{
      res(data);
    })
  }
}
