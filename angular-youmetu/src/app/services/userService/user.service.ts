import { Injectable } from '@angular/core';
import { User } from '../../entity/user/user';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdminPanelComponent } from 'src/app/components/admin-panel/admin-panel.component';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
  ) { }

  login(user:User,res){
    this.http.post('https://pilote-youmeo.herokuapp.com/api/users/connect',user).subscribe(data =>
    {
      
      if(data['success'] === true){
        //console.log(data)
        localStorage.setItem('user_id', JSON.stringify(data['user_id'])); 
        res();
      }

      else
        alert('Echec de la connexion')

    });
  }
     

  logout(){
    localStorage.removeItem('user_id')
    
  }

  getUserById(user_id, res){
    this.http.get("https://pilote-youmeo.herokuapp.com/api/users/"+user_id).subscribe(data => {
      res(data)
    })
  }

  getAllUsers(user_id, res){
    this.http.get('https://pilote-youmeo.herokuapp.com/api/log/users/'+user_id).subscribe(data => {
      res(data)
      //console.log(data)
    })
  }

  editUserAdmin(user_id, value,  res){
    this.http.put('https://pilote-youmeo.herokuapp.com/api/admin/users/'+user_id, 
    {
      field: 'admin',
      value: value,
    })
  }
  editUserActive(user_id, value,  res){
    this.http.put('https://pilote-youmeo.herokuapp.com/api/admin/users/'+user_id, 
    {
      field: 'active',
      value: value,
    })
  }

  setUser(user: User){

  }

  clearUser(){

  }

  signup(user:User){
    //console.log(user)
    this.http.post('https://pilote-youmeo.herokuapp.com/api/users',user).subscribe(data => { 
      //console.log(data)
    })

  }

  editPassword(user_id,password,res){

    this.http.get("https://pilote-youmeo.herokuapp.com/api/users/"+user_id).subscribe(data => {
      data['email']

      let user = {
        email: data['email'],
        password: password
      }

      this.http.put('https://pilote-youmeo.herokuapp.com/api/users',user).subscribe(data => {
        //console.log(data);
      })

    
    })
  }

  deleteAccount(res){
    let user_id = JSON.parse(localStorage.getItem('user_id'));

    this.http.delete('https://pilote-youmeo.herokuapp.com/api/users/'+user_id).subscribe(data =>{
      res()
    }) 
  }

  updateAdmin(user){
    console.log('oeode')
    let admin_id = JSON.parse(localStorage.getItem('user_id'))
    this.http.put('https://pilote-youmeo.herokuapp.com/api/users/'+user.user_id, {field:'admin',value:user.admin, user_id:admin_id}).subscribe();
  }

  updateActive(user){
    let admin_id = JSON.parse(localStorage.getItem('user_id'))
    this.http.put('https://pilote-youmeo.herokuapp.com/api/users/'+user.user_id, {field:'active',value:user.active, user_id:admin_id}).subscribe();

  }

}
