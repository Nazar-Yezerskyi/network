import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private name = new BehaviorSubject<string>('');

  private userId = new BehaviorSubject<string>('');
  

  setName(username: string) {
    this.name.next(username);
    console.log(username)
  }
  setId(UserId: string) {
    this.userId.next(UserId);
    console.log(UserId)
  }
  getId(): Subject<string>{
    return this.userId;
  }
  getName(): Subject<string> {
    return this.name;
    
  }
  constructor() { }
}
