import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { ForgotPasswortComponent } from './forgot-passwort/forgot-passwort.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { MainScreenComponent } from './main-screen/main-screen.component';

import { PlayFilmComponent } from './play-film/play-film.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { DatenschutzComponent } from './datenschutz/datenschutz.component';
import { AuthGuardService } from './auth-guard.service';

const routes: Routes = [
  { path: '', component: StartScreenComponent},
  { path: 'login', component: LoginScreenComponent},
  { path: 'forgotpassword', component: ForgotPasswortComponent},
  { path: 'signup', component: SignUpComponent},
  { path: 'newPassword', component: NewPasswordComponent},
  { path: 'main', component: MainScreenComponent,canActivate: [AuthGuardService]}, 
  { path: 'play', component: PlayFilmComponent,canActivate: [AuthGuardService]},
  { path: 'impressum', component: ImpressumComponent},
  { path: 'datenschutz', component: DatenschutzComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
