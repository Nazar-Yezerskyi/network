import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  photos: { url: string }[] = [];
  userId: Observable<string> = this.loginservice.getId();
  constructor(private loginservice: LoginService,private auth: AngularFireAuth, private storage: AngularFireStorage) {}
ngOnInit(): void {
  const storageRef = this.storage.ref('own_gallery');
  
  this.userId.subscribe((currentUserId) => {
    if (currentUserId) {
      storageRef.listAll().pipe(
        finalize(() => {
          // Операції, які повинні виконатися після завершення запиту.
        })
      ).subscribe(
        (result) => {
          // Створення масиву об'єктів, що містять URL та метадані файлів.
          const downloadInfoObservables = result.items.map((itemRef) => {
            // Одночасне отримання метаданих для кожного файлу.
            const metadataPromise = itemRef.getMetadata();
  
            // Одночасне отримання URL для кожного файлу.
            const downloadUrlPromise = itemRef.getDownloadURL();
  
            // Повернення об'єкта, який поєднує URL та метадані для кожного файлу.
            return Promise.all([metadataPromise, downloadUrlPromise]).then(([metadata, downloadUrl]) => {
              // Перевірка, чи співпадає userId з metadata.customMetadata
              if (metadata.customMetadata?.['uploadedBy'] === currentUserId) {
                const uploadedByValue = metadata.customMetadata?.['uploadedBy'];
                console.log(uploadedByValue);
                return { url: downloadUrl };
              } else {
                // Якщо userId не відповідає, повертайте null або ігноруйте файл.
                return null;
              }
            });
          });
  
          // Видалення недійсних значень (ті, які мають значення null) з масиву.
          Promise.all(downloadInfoObservables).then((downloadInfos) => {
            // Відфільтруйте значення null і призначте результат для this.photos.
            this.photos = downloadInfos.filter(info => info !== null) as { url: string; }[];
          }).catch((error) => {
            console.error('Помилка отримання URL та метаданих файлів:', error);
          });
        },
        (error) => {
          console.error('Помилка переліку фотографій:', error);
        }
      );
    } else {
      // Якщо користувач не автентифікований, виконайте відповідні дії (наприклад, очистіть this.photos).
      this.photos = [];
    }
  });
}
  
  
}
