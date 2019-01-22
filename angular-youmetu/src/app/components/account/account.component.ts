import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/userService/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  private user = [];

  constructor(private router:Router ,private userService:UserService) { }

  ngOnInit() {
    let user_id = JSON.parse(localStorage.getItem("user_id"))
      
      if(user_id){
      this.userService.getUserById(user_id,(response) => {
        this.user = response;
        })
      }
  }

  deleteAccount(){
    this.userService.deleteAccount(()=>{
      localStorage.removeItem('user_id')
      this.router.navigate(['/home'])
    })
  }

}
