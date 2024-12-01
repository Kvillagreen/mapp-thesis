import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/userPages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuard } from './services/rest-api/auth.guard';
import { PreventLoginGuard } from './services/rest-api/prevent-login.guard';
import { MapViewerComponent } from './pages/userPages/map-viewer/map-viewer.component';
import { ApplicationFormComponent } from './pages/userPages/application-form/application-form.component';
import { TransactionComponent } from './pages/userPages/transaction/transaction.component';
import { SuccefulComponent } from './pages/userPages/succeful/succeful.component';
import { PreventKioskGuard } from './services/rest-api/prevent-kiosk.guard';
import { PreventApplicationGuard } from './services/rest-api/prevent-application.guard';
import { AdminDashboardComponent } from './pages/adminPages/admin-dashboard/admin-dashboard.component';
import { AdminGuard } from './services/rest-api/auth.adminGuard';
import { AdminTransactionComponent } from './pages/adminPages/admin-transaction/admin-transaction.component';
import { AdminEventsManageComponent } from './pages/adminPages/admin-events-manage/admin-events-manage.component';
import { AdminEventsCreateComponent } from './pages/adminPages/admin-events-create/admin-events-create.component';
import { AdminMapViewerComponent } from './pages/adminPages/admin-map-viewer/admin-map-viewer.component';
import { AdminHistoryComponent } from './pages/adminPages/admin-history/admin-history.component';
import { AdminReportsComponent } from './pages/adminPages/admin-reports/admin-reports.component';
import { AdminUserManageComponent } from './pages/adminPages/admin-user-manage/admin-user-manage.component';
import { AdminUserControlComponent } from './pages/adminPages/admin-user-control/admin-user-control.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'transaction', component: TransactionComponent, canActivate: [AuthGuard] },
  { path: 'map-viewer', component: MapViewerComponent, canActivate: [PreventKioskGuard] },//,
  { path: 'login', component: LoginComponent, canActivate: [PreventLoginGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [PreventLoginGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'dashboard-admin', component: AdminDashboardComponent, canActivate: [AdminGuard] },
  { path: 'transaction-admin', component: AdminTransactionComponent, canActivate: [AdminGuard] },
  { path: 'application-form', component: ApplicationFormComponent, canActivate: [PreventApplicationGuard] },
  { path: 'manage-events', component: AdminEventsManageComponent, canActivate: [AdminGuard] },
  { path: 'add-events', component: AdminEventsCreateComponent, canActivate: [AdminGuard] },
  { path: 'history', component: AdminHistoryComponent, canActivate: [AdminGuard] },
  { path: 'reports', component: AdminReportsComponent, canActivate: [AdminGuard] },
  { path: 'manage-user', component: AdminUserManageComponent, canActivate: [AdminGuard] },
  { path: 'user-control', component: AdminUserControlComponent, canActivate: [AdminGuard] },
  { path: 'map-viewer-admin', component: AdminMapViewerComponent, canActivate: [AdminGuard] },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],  // Make sure useHash is false unless required
  exports: [RouterModule]
})
export class AppRoutingModule { }
