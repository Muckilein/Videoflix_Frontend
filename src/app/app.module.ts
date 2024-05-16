import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { ForgotPasswortComponent } from './forgot-passwort/forgot-passwort.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { FormsModule } from '@angular/forms';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { HeaderComponent } from './header/header.component';

import { UrlcheckerPipe } from './urlchecker.pipe';
import { WatchVideoComponent } from './watch-video/watch-video.component';
import { PlayFilmComponent } from './play-film/play-film.component';

@NgModule({
  declarations: [
    AppComponent,
    StartScreenComponent,
    LoginScreenComponent,
    ForgotPasswortComponent,
    SignUpComponent,
    NewPasswordComponent,
    MainScreenComponent,
    HeaderComponent,
    UrlcheckerPipe,
    WatchVideoComponent,
    PlayFilmComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
