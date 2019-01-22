import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/userService/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.css']
})
export class EditPasswordComponent implements OnInit {

  constructor(private router:Router, private userService:UserService) { }

  ngOnInit() {

  }

  editPassword(password:string){
    let user_id = JSON.parse(localStorage.getItem('user_id'))

    this.userService.editPassword(user_id,password,function(){   
    })

    this.router.navigate(['/account'])
  }

}
