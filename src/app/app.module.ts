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
import { PlayFilmComponent } from './play-film/play-film.component';
import { VideoComponentComponent } from './video-component/video-component.component';
import { DetailViewComponent } from './detail-view/detail-view.component';
import { DatenschutzComponent } from './datenschutz/datenschutz.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

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
    PlayFilmComponent,
    VideoComponentComponent,
    DetailViewComponent,
    DatenschutzComponent,
    ImpressumComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,

  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
