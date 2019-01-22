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

  
  constructor(private userService:UserService) { }

  ngOnInit() {

    console.log(this.user_id); 
    this.userService.getAllUsers(this.user_id,(data) => {
      this.users = data.data;
    })
  }

  updateAdmin(user){
    user.admin = !user.admin
   this.userService.updateAdmin(user)
  }

  updateActive(user){
    user.active = !user.active
    this.userService.updateActive(user)
  }

}
