import { Component } from '@angular/core';
import { UserService } from './services/userService/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private user = [];

  constructor(private router:Router, private userService:UserService){}
  
  private logged = JSON.parse(localStorage.getItem('user_id'));


  ngOnInit(){
    this.userService.getUserById(this.logged,(response) => {
      this.user = response;
      console.log(this.user)
    })
  }

  onSubmit(){  
  }

  login(user){
    this.userService.login(user,() => {
      this.logged = JSON.parse(localStorage.getItem('user_id'));
      console.log(this.logged)
     
    })
    
    
  }

  logout(){
    this.userService.logout()
    this.logged = JSON.parse(localStorage.getItem('user_id'));
    this.router.navigate(['/home'])
  }

}
