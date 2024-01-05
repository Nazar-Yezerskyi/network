import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from '../login.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit{

  name: Observable<string> = this.loginservice.getName();
  userId: Observable<string> = this.loginservice.getId();
  public posts: any[] = [];
  constructor(private loginservice: LoginService, private fireStore: AngularFirestore){}
  ngOnInit(): void {
    this.name.subscribe(name => {
      console.log(name);})  
      this.userId.subscribe(userId => {
        console.log('User ID:', userId);
  
        // Підписка на зміни в колекції "posts"
        this.fireStore.collection('post').valueChanges().subscribe((posts: any[]) => {
          console.log('All Posts:', posts);
  
          // Фільтрація постів за ідентифікатором користувача
          this.posts = posts
          this.userId.subscribe(userId => {
            this.fireStore.collection('post').valueChanges().subscribe((posts: any[]) => {
              this.posts = posts.filter(post => post.id === userId);
          
              // Sort posts by timestamp in descending order (latest first)
              this.posts.sort((a, b) => {
                const timestampA = a.date ? a.date.seconds : 0; // Assuming your timestamp field is 'date'
                const timestampB = b.date ? b.date.seconds : 0;
                return timestampB - timestampA;
              });
                                             
              console.log('User Posts:', this.posts);
            });
          });
          console.log('User Posts:', this.posts);
        });
      });
  }

}
