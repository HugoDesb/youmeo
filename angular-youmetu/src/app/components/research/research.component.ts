import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {Router} from '@angular/router'
import {SearchService} from '../../services/searchService/search.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.css']
})
export class ResearchComponent implements OnInit {

  private str:string;

  private youtube: boolean = true;
  private vimeo: boolean = true;
  
  private vimeoData = [];
  private youtubeData = [];

  constructor(private route:ActivatedRoute,private router:Router, private searchService:SearchService,private spinner: NgxSpinnerService) { 
    
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(params);
      this.str=params['str'];

      let platforms = 0;

      if(this.youtube && this.vimeo || !this.youtube && !this.vimeo)
        platforms = 0;
      else if (this.youtube)
        platforms = 1;
      else if (this.vimeo)
        platforms = 2;

      if(!this.str)
        console.log('string empty')
      else{
        this.spinner.show();
        this.searchService.search(this.str, platforms, (data) => {
          // console.log(data)
          this.spinner.hide();
          this.updateResult(data);
        });
      }
        
    })

  }

  updateResult(data){
    this.youtubeData = data.youtube;
    this.vimeoData = data.vimeo.data;
  }

  research(str:any){
    this.router.navigate(['/research',{str:str, yt:this.youtube, vm:this.vimeo}]);
  }


 
}
