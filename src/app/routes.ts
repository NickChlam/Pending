import { Routes } from '@angular/router';
import { PendDetailComponent } from './pend-detail/pend-detail.component';
import { PendEditComponent } from './pend-edit/pend-edit.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth-guard.guard';
import { UserFormComponent } from './user-form/user-form.component';
import { UserResolverService } from './_resolvers/user-resolver.service';
import { GetUsersResolver } from './_resolvers/get-users-resolver.service';

export const appRoutes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'home', component: HomeComponent},
    { path: 'signUp', component: UserFormComponent},
    { path: 'detail', component: PendDetailComponent, canActivate: [AuthGuard], resolve: { users: GetUsersResolver, data: UserResolverService}}, 
    { path: 'app-pend-edit', component: PendEditComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'home', pathMatch: 'full'},
];