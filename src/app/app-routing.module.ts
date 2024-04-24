import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { ForgotPasswortComponent } from './forgot-passwort/forgot-passwort.component';

const routes: Routes = [
  { path: '', component: StartScreenComponent},
  { path: 'login', component: LoginScreenComponent},
  { path: 'forgotpassword', component: ForgotPasswortComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
