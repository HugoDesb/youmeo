import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  @Output() researchSubmitted = new EventEmitter();
  
  private str;

  constructor() { 
    
  }

  ngOnInit() {

  }

  research(value: string){
    this.researchSubmitted.emit(value);
  }

}
