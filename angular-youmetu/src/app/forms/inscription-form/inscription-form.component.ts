import { Component, OnInit } from '@angular/core';
import { User } from '../../entity/user/user';
import { UserService } from '../../services/userService/user.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'inscription-form',
  templateUrl: './inscription-form.component.html',
  styleUrls: ['./inscription-form.component.css']
})
export class InscriptionFormComponent implements OnInit {

  user = new User();

  submitted = false;

  constructor(private router:Router, private userService:UserService) { }

  ngOnInit() {
  }

  onSubmit(){
    this.submitted = true;
    this.userService.signup(this.user);
    this.router.navigate(['/home']);
  }

}
