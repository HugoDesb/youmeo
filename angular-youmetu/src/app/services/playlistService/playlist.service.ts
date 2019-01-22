import { Injectable } from '@angular/core';
import { Playlist } from '../../entity/playlist/playlist';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {



  constructor(private http:HttpClient) { }

  public createPlaylist(user_id,name,res){
    this.http.post('https://pilote-youmeo.herokuapp.com/api/playlist', {user_id:user_id, name:name},).subscribe(data => {
       res();
    })
  }

  public getPlaylistsByUser(user_id, res){
    this.http.get('https://pilote-youmeo.herokuapp.com/api/playlist/'+user_id).subscribe(data => {
      res(data)
    })
  }
  
  public getVideos(playlist_id, res){
    this.http.get('https://pilote-youmeo.herokuapp.com/api/'+playlist_id+'/videos').subscribe(data => {
      res(data)
    })
  }

  addVideo(playlist_id, platform, video_id){
    this.http.post('https://pilote-youmeo.herokuapp.com/api/'+playlist_id+'/videos', {platform:platform, video_id:video_id}).subscribe(data => {
      console.log(data)
    })
  }

  deletePlaylist(user_id,playlist_id,res){
    this.http.delete('https://pilote-youmeo.herokuapp.com/api/playlist/'+user_id+'/'+playlist_id).subscribe(data=>{
      res();
    });
  }

  deleteVideo(playlist_id, video_id, res){
    this.http.delete('https://pilote-youmeo.herokuapp.com/api/'+playlist_id+'/'+video_id).subscribe(data =>{
      res()
    }); 
  }
}
  