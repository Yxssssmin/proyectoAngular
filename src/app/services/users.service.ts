import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, from, tap } from 'rxjs';
import { IUser } from '../interfaces/user';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { FormGroup } from '@angular/forms';

const emptyUser: IUser = {id: '0', avatar_url: 'none', full_name: 'none', username: 'none', website: 'nome'}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  supaClient: any = null;
  defaultAvatarUrl: string  = 'default.png';

  constructor() {
    this.supaClient = createClient(
      environment.SUPABASE_URL, 
      environment.SUPABASE_KEY
    );  
  }

  userSubject: BehaviorSubject<IUser> = new BehaviorSubject<IUser>(emptyUser);
  favoritesSubject: Subject<{id:number, uid:string, artwork_id:string}[]> = new Subject;
  
  async login(email: string, password: string):Promise<boolean>{
    
    const { data, error } = await this.supaClient.auth.signInWithPassword({
        email, 
        password
      });

      if (error) {
        console.error('Error en el inicio de sesión:', error);
  
        if (error.message.includes('invalid format')) {
          console.error('El formato del correo electrónico es inválido');
        } else if (error.message.includes('rate limit exceeded')) {
          console.error('Se ha excedido el límite de velocidad para enviar correos electrónicos');
        }
  
        return false;
      }
      
      if(data) {
        const sessionToken = data.session.user.id;

        localStorage.setItem('uid', sessionToken);
        this.getProfile(sessionToken);
        return true;
      }

      return false;
    }

    async register(email: string, password: string, username: string, fullname: string): Promise<boolean> {
      try {
        const { data, error } = await this.supaClient.auth.signUp({
          email,
          password,
          username,
          fullname
        });
    
        if (error) {
          console.error('Error en el registro:', error.message);
          return false;
        }
    
      if (data) {
           const sessionToken = data.session.user.id;
    
         localStorage.setItem('id', sessionToken);
          this.getProfile(sessionToken);
           return true;
       }
    
        return false;
      } catch (error) {
        console.error('Error en el registro:', error);
        return false;
      }
    }
  
  async getProfile(uid: string): Promise<any> {
    // const uid = localStorage.getItem('uid');

    let profilePromise: Promise<{data: IUser[]}> = this.supaClient
    .from('profiles')
    .select("*")
    .eq('id', uid);

    from(profilePromise).pipe(
      tap(data => console.log(data)))
      .subscribe(async (profile:{data: IUser[]}) => {

      this.userSubject.next(profile.data[0]);

      // if(profile.data[0].avatar_url !== null) {

      //   const avatarFile = profile.data[0].avatar_url.split('/').at(-1);
      //   const { data, error } = await this.supaClient.storage
      //     .from('avatars')
      //     .download(avatarFile);
      //   const url = URL.createObjectURL(data);
      //   profile.data[0].avatar_url = url;
      // }

      // this.userSubject.next(profile.data[0]);
    }
    );
  }

async setProfile(formulario: FormGroup) {
    const formData = formulario.value;
    console.log('Se guardaran los datos==>');

    // Revisa si el perfil existe
    const { data: profileData, error: profileError } = await this.supaClient
      .from('profiles')
      .select()
      .eq('id', formData.id)
      .single();

    if (profileError) {
      //sino existe crear uno
      console.log('procede a insertarlos por primera vez');
      // Inserta un nuevo perfil
      const { data: insertedData, error: insertError } = await this.supaClient
        .from('profiles')
        .insert([
          {
            uid: formData.id,
            username: formData.username,
            full_name: formData.full_name,
            avatar_url: formData.avatar_url,
            website: formData.website,
          },
        ]);
    }

    if (profileData) {
      console.log('procede a actualizar los datos');

      // Actualiza el perfil existente
      const { data: updatedData, error: updateError } = await this.supaClient
        .from('profiles')
        .update({
          username: formData.username,
          full_name: formData.full_name,
          avatar_url: formData.avatar_url,
          website: formData.website,
        })
        .eq('id', formData.id);
    }
  }

  // async updateProfile(uid: string, username: string, fullName: string): Promise<boolean> {
  
  //   try {
  //      // Consultar el perfil existente
  //   const existProfile = await this.supaClient
  //   .from('profiles')
  //   .select('avatar_url')
  //   .eq('id', uid)
  //   .single();

  //   // Actualizar el perfil
  //   const { error } = await this.supaClient
  //   .from('profiles')
  //   .update({
  //     username: username,
  //     full_name: fullName,
  //     avatar_url: existProfile.data.avatar_url,
  //   })
  //   .eq('id', uid);

  //       if (error) {
  //         console.error('Error al actualizar el perfil:', error);
  //         return false;
  //       }
  
  //       return true;
  //     } catch (error) {
  //       console.error('Error al actualizar el perfil:', error);
  //       return false;
  //     }
  //   }
  
  
  async getFavorites(uid: string): Promise<any> {
    if (uid) {
      let promiseFavorites: Promise<{
        data: {
          id: number,
          uid: string,
          artwork_id: string
        }[];
      }> = this.supaClient
        .from('favorites')
        .select("artwork_id")
        .eq('uid', uid); 
  
      promiseFavorites.then((data) => {
        this.favoritesSubject.next(data.data);
      });
    }
  }
  

  async setFavorite(artwork_id: string): Promise<any> {
    console.log('setfavorite', artwork_id);
  
    let { data, error } = await this.supaClient.auth.getSession();
  
    if (data && data.session && data.session.user && data.session.user.id) {
      let promiseFavorites: Promise<boolean> = this.supaClient
        .from('favorites')
        .insert({ uid: data.session.user.id, artwork_id });
  
      // promiseFavorites.then(() => this.getFavorites(data.session.user.id));
      await promiseFavorites;
    } else {
      console.error('Error obtaining user session data:', data, error);
    }
  }
  

  async removeFavorite(artwork_id: string): Promise<any> {
    console.log('removeFavorite', artwork_id);
  
    let { data, error } = await this.supaClient.auth.getSession();
  
    if (data && data.session && data.session.user && data.session.user.id) {
      let promiseRemoveFavorite: Promise<boolean> = this.supaClient
        .from('favorites')
        .delete()
        .eq('uid', data.session.user.id)
        .eq('artwork_id', artwork_id);
  
      promiseRemoveFavorite.then(() => this.getFavorites(data.session.user.id));
    }
  }

  async isLogged(): Promise<boolean> {
  
    let { data, error } = await this.supaClient.auth.getSession();

    if (data.session) {
      this.getProfile(data.session.user.id);
      return true;
    }

    return false;
  }

  
  async logout(){
    const { error } = await this.supaClient.auth.signOut();
    this.userSubject.next(emptyUser);
  }
}
