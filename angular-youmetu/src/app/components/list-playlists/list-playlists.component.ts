import { Component, OnInit } from '@angular/core';
import { PlaylistService } from 'src/app/services/playlistService/playlist.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-playlists',
  templateUrl: './list-playlists.component.html',
  styleUrls: ['./list-playlists.component.css']
})
export class ListPlaylistsComponent implements OnInit {

  private playlists = [];

  private user_id = JSON.parse(localStorage.getItem('user_id'));

  constructor(private playlistService:PlaylistService,private router:Router) { }

  ngOnInit() {
    this.loadPlaylists();
  }

  loadPlaylists(){
    if(this.user_id){
      this.playlistService.getPlaylistsByUser(this.user_id,(data) => {
        this.playlists = data.data; 
      })
    }
  }

  createPlaylist(name:string){
    if(this.user_id)
      this.playlistService.createPlaylist(this.user_id,name,()=>{
        this.loadPlaylists();
      })
  }

  deletePlaylist(playlist){

    let user_id = JSON.parse(localStorage.getItem('user_id'))
    this.playlistService.deletePlaylist(user_id, playlist.playlist_id,()=> {
      this.loadPlaylists();
    })
  }

}
