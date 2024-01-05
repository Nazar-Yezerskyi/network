import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { LoginService } from './login.service';
import { HomeComponent } from './home/home.component';





const firebaseConfig = {
  apiKey: "AIzaSyDza_fhryeTE4QEEn8HxD5WdpjkpPYPwQo",
  authDomain: "network-67e45.firebaseapp.com",
  databaseURL: "https://network-67e45-default-rtdb.firebaseio.com",
  projectId: "network-67e45",
  storageBucket: "network-67e45.appspot.com",
  messagingSenderId: "375109332842",
  appId: "1:375109332842:web:d42c0d9d6586922ca47f13",
  storegeBucket: 'gs://network-67e45.appspot.com'
};

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    FormsModule
  ],
  providers: [LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }