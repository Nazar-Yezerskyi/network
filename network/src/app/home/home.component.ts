import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, ref ,listAll } from "firebase/storage";
import { UploadMetadata } from '@angular/fire/storage';
import { finalize } from "rxjs/operators";
import { UserCredential } from '@firebase/auth-types';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Timestamp } from 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as firebase from 'firebase/compat/app';
import 'firebase/compat/database';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  userData: any;
  constructor( private storage: AngularFireStorage, private loginservice: LoginService,  private fireStore: AngularFirestore,private auth: AngularFireAuth){
    
    
  }
  
  downloadURL$: Observable<string | null> | undefined;
 
  
  name: Observable<string> = this.loginservice.getName();
  userId: Observable<string> = this.loginservice.getId();
  public posts: any[] = [];
   photos: { url: string }[] = [];
  ngOnInit(): void {

    const storageRef = this.storage.ref('profile_photo');
    this.auth.authState.subscribe((user) => {
      if (user) {
        const currentUserId = user.uid;
    
        storageRef.listAll().pipe(
          finalize(() => {
            // Operations to be performed after the request is completed.
          })
        ).subscribe(
          (result) => {
            // Create an array of objects containing URL and file metadata.
            const downloadInfoObservables = result.items.map((itemRef) => {
              // Parallelly get metadata for each file.
              const metadataPromise = itemRef.getMetadata();
              
              // Parallelly get URL for each file.
              const downloadUrlPromise = itemRef.getDownloadURL();
    
              // Return an object that combines URL and metadata for each file.
              return Promise.all([metadataPromise, downloadUrlPromise]).then(([metadata, downloadUrl]) => {
                // Check if userId matches with metadata.customMetadata
                if (metadata.customMetadata?.['uploadedBy'] === currentUserId) {
                  const uploadedByValue = metadata.customMetadata?.['uploadedBy'];
                  console.log(uploadedByValue)
                  return { url: downloadUrl };
                } else {
                  // If userId doesn't match, return null or ignore the file.
                  return null;
                }
              });
            });
    
            // Remove invalid values (those with null) from the array.
            Promise.all(downloadInfoObservables).then((downloadInfos) => {
              // Filter out null values and assign the result to this.photos.
              this.photos = downloadInfos.filter(info => info !== null) as { url: string; }[];
            }).catch((error) => {
              console.error('Error fetching download URLs and metadata:', error);
            });
          },
          (error) => {
            console.error('Error listing photos:', error);
          }
        );
      } else {
        // If the user is not authenticated, take appropriate actions (e.g., clear this.photos).
        this.photos = [];
      }
    });
    



    
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
    
        // Підписка на ім'я
        this.name.subscribe(name => {
          console.log('Name:', name);
        });
      }
      showModal: boolean = false;

      openModal() {
        this.showModal = true;
      }
    
      closeModal() {
        this.showModal = false;
      }
      title: string = '';
      text: string = '';
      
      
      // deletePost(postId: string) {
      //   this.fireStore.collection('/post/').doc(postId).delete()
      //     .then(() => {
      //       console.log('Document successfully deleted');
      //     })
      //     .catch((error) => {
      //       console.error('Error deleting document: ', error);
      //     });
      // }
      deletePost(documentId: string) {
        console.log(documentId)
        const postRef = this.fireStore.collection('/post/').doc(documentId);
        postRef.delete().then(() => console.log('Document successfully deleted'))
          .catch(error => console.error('Error deleting document: ', error));
      }
    
      addPost() {
        const now = Timestamp.now();
     
        this.userId.subscribe((userId: string) => {
          // Now, userId contains the actual value
          const idPost = `${userId}` + `${now}`
         
          this.fireStore.collection('post').doc(idPost).set({
            id: userId,
            title: this.title,
            text: this.text,
            date: now,
            postId: idPost
            // Додайте інші дані для документу
            // Other data for the post
          })
          .then(() => {
            console.log('Пост успішно додано з ідентифікатором:', idPost);

            this.title = '';
            this.text = '';
          })
          .catch((error) => {
            console.error('Помилка додавання поста:', error);
          });
        });
      
      
      
        
  }
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const path = `profile_photo/${file.name}`;
    const ref = this.storage.ref(path);
    
    // Отримати ідентифікатор поточного користувача, який ввійшов в систему
    this.auth.user.subscribe(user => {
      const userId = user?.uid; // Може бути `null`, якщо користувач не ввійшов в систему

      // Параметри метаданих (можете додати інші поля за необхідності)
      const metadata: UploadMetadata = {
        customMetadata: {
          uploadedBy: userId || '' // Якщо userId є `undefined`, встановлюємо порожній рядок
          // Додайте інші поля, які вам потрібні
        }
      };

      const task = ref.put(file, metadata);

     
      task.then(snapshot => {
        console.log('File uploaded successfully!');
      });
    });
    
  }
}
