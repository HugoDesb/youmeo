import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from '../../entity/user/user';
import { UserService } from '../../services/userService/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  @Output() login = new EventEmitter();

  user = new User();

  submitted = false;

  constructor(private router:Router, private userService:UserService) { }

  ngOnInit() {
  }

  onSubmit(){
    this.submitted = true;
    //this.userService.login(this.user);
    this.login.emit(this.user);
  }
  

}
