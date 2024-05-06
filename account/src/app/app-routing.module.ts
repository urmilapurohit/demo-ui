import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './common/guards/auth.guard';
import { ROUTES } from './common/models/constant';

const routes: Routes = [
  {
    path: "",
    canActivateChild: [AuthGuard],
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule)
  },
  { path: '**', redirectTo: ROUTES.AUTH.ABSOLUTE_LOGIN },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
