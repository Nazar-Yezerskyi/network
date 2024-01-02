import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';

  constructor(private auth: AngularFireAuth) {}

  register() {
    this.auth.createUserWithEmailAndPassword(this.email, this.password)
      .then((userCredential) => {
        if (userCredential.user) {
          
          const user = userCredential.user;
  
         
          user.updateProfile({
            displayName: this.name + ' ' + this.lastName
          }).then(() => {
           
            console.log('Користувач успішно зареєстрований з іменем та прізвищем:', user);
  

          
          }).catch((error) => {
            console.error('Помилка оновлення профілю: ', error);
          });
        }
      })
      .catch((error) => {
        console.error('Помилка реєстрації: ', error);
      });
}
}
