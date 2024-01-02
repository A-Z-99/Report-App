import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { ReportListComponent } from './report-list/report-list.component';
import { ReportAddComponent } from './report-add/report-add.component';
import { RoutingModule } from './routing.module';
import { MainPageComponent } from './main-page/main-page.component';
import { ReportViewComponent } from './report-view/report-view.component';
import { ReportEntryComponent } from './report-entry/report-entry.component';
import { ReportService } from './report.service';
import { LocationShowComponent } from './location-show/location-show.component';
import { LocationSelectComponent } from './location-select/location-select.component';
import { StatusDisplayPipe } from './status-display.pipe';
import { ConsiseDatePipe } from './consise-date.pipe';
import { VerboseDatePipe } from './verbose-date.pipe';
import { PhoneNumberFormatPipe } from './phone-number-format.pipe';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    ReportListComponent,
    ReportAddComponent,
    MainPageComponent,
    ReportViewComponent,
    ReportEntryComponent,
    LocationShowComponent,
    LocationSelectComponent,
    StatusDisplayPipe,
    ConsiseDatePipe,
    VerboseDatePipe,
    PhoneNumberFormatPipe
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [ReportService],
  bootstrap: [AppComponent]
})
export class AppModule { }
