import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { ReportAddComponent } from './report-add/report-add.component';
import { ReportViewComponent } from './report-view/report-view.component';

const appRoutes:Routes = [
  {path: 'main-page', component:MainPageComponent},
  {path: 'report/add', component:ReportAddComponent},
  {path: 'report/:time', component:ReportViewComponent},
  {path: '', redirectTo: '/main-page', pathMatch: 'full'}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class RoutingModule { }
