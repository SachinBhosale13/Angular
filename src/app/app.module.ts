import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatchComponent } from './match/match.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialModule} from './material/material.module';
import { PlayerDialogComponent } from './player-dialog/player-dialog.component';
import { PlayerTableComponent } from './player-table/player-table.component';
import { MAT_DATE_LOCALE } from '@angular/material';


@NgModule({
  declarations: [
    AppComponent,
    MatchComponent,
    PlayerDialogComponent,
    PlayerTableComponent
  ],
  entryComponents:[PlayerDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
