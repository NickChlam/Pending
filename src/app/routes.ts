import { Routes } from '@angular/router';
import { PendDetailComponent } from './pend-detail/pend-detail.component';
import { PendEditComponent } from './pend-edit/pend-edit.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth-guard.guard';
import { UserFormComponent } from './user-form/user-form.component';

export const appRoutes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'home', component: HomeComponent},
    { path: 'signUp', component: UserFormComponent},
    { path: 'detail', component: PendDetailComponent, canActivate: [AuthGuard]}, 
    { path: 'app-pend-edit', component: PendEditComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'home', pathMatch: 'full'},
];