import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { SearchService } from 'src/app/services/searchService/search.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PlaylistService } from 'src/app/services/playlistService/playlist.service';


@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.css']
})
export class WatchComponent implements OnInit {

  private plateforme:any;
  private id:any;
  private video = [];
  private link:any;

  private playlists = [];

  private youtube: boolean = false;
  private vimeo: boolean = false;

  constructor(private searchService:SearchService, private router:Router, private route:ActivatedRoute, private sanitizer:DomSanitizer, private playlistService:PlaylistService) { }


  ngOnInit() {

    let user_id = JSON.parse(localStorage.getItem('user_id'));

    if(user_id)
      this.playlistService.getPlaylistsByUser(user_id,(data) => {
        this.playlists = data.data; 
      })

    this.route.queryParams.subscribe(data => {

      this.plateforme = data.plateforme;
    
      this.searchService.getVideo(data.plateforme,data.id, (data) => {
        
        this.video= data;

        if(this.plateforme == 2){
        this.link = this.video['link'].split('/').pop();
        this.vimeo = true;
        
        }
        else{
          this.link = this.video['id'];
          this.youtube = true;
        }
       
      });
    })
  }

  sanitizeYoutube(){
    return this.sanitizer.bypassSecurityTrustResourceUrl('http://www.youtube.com/embed/'+this.link+'?autoplay=1')
  }

  sanitizeVimeo(){
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://player.vimeo.com/video/'+this.link+'?badge=0&autopause=0&player_id=0&app_id=140784')
  }

  research(str:any){
    console.log('papa'+str)
   this.router.navigate(['/research',{str:str}]);
  }

  addVideoToPlaylist(playlist:any){

    let platform;
    if(this.vimeo)
      platform = 2;
    else
      platform = 1;

    this.playlistService.addVideo(playlist.playlist_id, platform, this.link)
  }

}
