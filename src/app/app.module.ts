import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PendEditComponent } from './pend-edit/pend-edit.component';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PendDetailComponent } from './pend-detail/pend-detail.component';
import { HomeComponent } from './home/home.component';
import { environment } from '../environments/environment';

// 3rd party 
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';



import { AngularFireAuthModule } from '@angular/fire/auth';
import { UserFormComponent } from './user-form/user-form.component';

import { DataService } from './services/data-service.service';
import { AuthGuard } from './auth-guard.guard';
import { RouterModule } from '@angular/router';
import { appRoutes } from './routes';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './login/login.component';




@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PendEditComponent,
    PendDetailComponent,
    HomeComponent,
    UserFormComponent,
    LoginComponent,
    
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase, 'Pending'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    RouterModule.forRoot(appRoutes)

  ],
  providers: [DataService, AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
