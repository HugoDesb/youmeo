import { Component, OnInit, Input } from '@angular/core';
import { PlaylistService } from 'src/app/services/playlistService/playlist.service';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

  private playlist_id:any;
  private playlist_name:any;

  private videos = [];

  constructor(private playlistService:PlaylistService, private router:Router, private route:ActivatedRoute) { }

  ngOnInit() {

    this.route.queryParams.subscribe(data => {
      this.playlist_id = data.id
      this.playlist_name = data.name
    })

    this.loadVideos();  
  }

  loadVideos(){
    this.playlistService.getVideos(this.playlist_id,(data)=>{
      this.videos = data.res.videos;
    })
  }

  deleteVideo(video){
    this.playlistService.deleteVideo( this.playlist_id, video.video_id, ()=> {
      this.loadVideos();  
    })
  }
}
