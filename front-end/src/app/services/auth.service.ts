import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth'
import { Observable } from 'rxjs/observable'
import * as firebase from 'firebase/app'
import { auth } from 'firebase/app';
import { tokenKey } from '@angular/core/src/view/util';
import { AsyncLocalStorage } from 'angular-async-local-storage/src/service/lib.service';

@Injectable()
export class AuthService {


  constructor(
    private afAuth: AngularFireAuth,
    protected localStorage: AsyncLocalStorage

  ) { }


  login(email: string, password: string) {
    return new Promise((resolve, reject) =>{
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then(userData => resolve(userData),
      err => reject(err))
    });
  }

  register(email: string, password: string) {
    return new Promise((resolve, reject) =>{
      this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(userData => resolve(userData),
      err => reject(err))
    });
  }

  getAuth() {
    return this.afAuth.authState.map(auth => auth);
  }

  logout() {
    this.afAuth.auth.signOut();
  }


}
