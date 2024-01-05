import { Component, OnInit } from '@angular/core';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  name = ''
  user: any; // This will hold the current user information

  

  
  constructor (private functions: AngularFireFunctions, private fs : AngularFirestore,private autf : AngularFireAuth, private loginservise: LoginService){}
  login(){
    this.autf.signInWithEmailAndPassword(this.email, this.password)
    .then((userCredential) => {
      if (userCredential.user && userCredential.user.displayName) {
        
        console.log('Користувач успішно увійшов у систему', userCredential.user);
        console.log(userCredential.user.uid)
      
        this.loginservise.setName(userCredential.user.displayName);
        this.loginservise.setId(userCredential.user.uid);
      
      }
     
    })

  }

  ngOnInit(): void {
    
  }
  
}