import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/entity/user/user';
import { listenToElementOutputs } from '@angular/core/src/view/element';
import {UserService} from '../../services/userService/user.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  private users = [];
  private user_id = JSON.parse(localStorage.getItem('user_id'));
  private historiques = [];
  
  constructor(private userService:UserService) { }

  ngOnInit() {

    console.log(this.user_id); 
    this.userService.getAllUsers(this.user_id,(data) => {
      this.users = data.usersStats;
      console.log(data.usersStats)
    })

  }

  updateAdmin(user){
    console.log('avant'+user.is_admin)
    user.is_admin = !user.is_admin
    console.log('apres'+user.is_admin)
   this.userService.updateAdmin(user,(response) => {
    console.log(response)
  })
  }

  updateActive(user){

    user.is_active = !user.is_active
    this.userService.updateActive(user,(response) => {
      console.log(response)
    })
  }

}
