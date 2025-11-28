import { Injectable } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from '@angular/fire/auth';

import { 
  Firestore, 
  doc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from '@angular/fire/firestore';

import { LoadingController, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUser$ = new BehaviorSubject<User | null>(null);

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private loadingCtrl: LoadingController,
    private toast: ToastController
  ) {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser$.next(user);
    });
  }


  async registerUser(data: any): Promise<boolean> {
    const { name, lastname, phone, email, password } = data;

    const loading = await this.loadingCtrl.create({
      message: 'Creando cuenta...',
      spinner: 'crescent',
    });

    await loading.present();

    try {
      const phoneQuery = query(
        collection(this.firestore, 'users'),
        where('phone', '==', phone)
      );

      const phoneSnap = await getDocs(phoneQuery);

      if (!phoneSnap.empty) {
        await loading.dismiss();
        this.showToast('El teléfono ya está registrado', 'danger');
        return false;
      }

      const userCred = await createUserWithEmailAndPassword(this.auth, email, password);

      await updateProfile(userCred.user, {
        displayName: `${name} ${lastname}`,
      });

      await setDoc(doc(this.firestore, 'users', userCred.user.uid), {
        uid: userCred.user.uid,
        name,
        lastname,
        phone,
        email,
        photoURL: '',
        createdAt: new Date()
      });

      await signOut(this.auth);

      await loading.dismiss();
      this.showToast('Cuenta creada. Ahora inicia sesión.', 'success');
      return true;

    } catch (error: any) {
      console.log(error);
      await loading.dismiss();

      if (error.code === 'auth/email-already-in-use') {
        this.showToast('El correo ya está registrado', 'danger');
        return false;
      }

      this.showToast('Error al registrarse', 'danger');
      return false;
    }
  }


  async login(email: string, password: string): Promise<boolean> {
    const loading = await this.loadingCtrl.create({
      message: 'Ingresando...',
      spinner: 'crescent'
    });

    await loading.present();

    try {
      await signInWithEmailAndPassword(this.auth, email, password);

      await loading.dismiss();
      this.showToast('Bienvenido', 'success');
      return true;

    } catch (error: any) {
      console.log(error);

      await loading.dismiss();

      if (error.code === 'auth/invalid-credential') {
        this.showToast('Correo o contraseña incorrectos', 'danger');
        return false;
      }

      this.showToast('Error al iniciar sesión', 'danger');
      return false;
    }
  }


  async logout() {
    await signOut(this.auth);
    this.showToast('Sesión cerrada', 'success');
  }


  getUser() {
    return this.currentUser$.asObservable();
  }


  isLoggedIn() {
    return this.currentUser$;
  }

  private async showToast(message: string, color: string) {
    const t = await this.toast.create({
      message,
      duration: 2000,
      position: 'top',
      color
    });
    t.present();
  }

}
