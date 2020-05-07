import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatchComponent } from './match/match.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialModule} from './material/material.module';
import { AddPlayerDialogComponent } from './add-player-dialog/add-player-dialog.component';
import { PlayerTableComponent } from './player-table/player-table.component';
import { MAT_DATE_LOCALE } from '@angular/material';
import { EditPlayerDialogComponent } from './edit-player-dialog/edit-player-dialog.component';



@NgModule({
  declarations: [
    AppComponent,
    MatchComponent,
    AddPlayerDialogComponent,
    PlayerTableComponent,
    EditPlayerDialogComponent
  ],
  entryComponents:[AddPlayerDialogComponent,EditPlayerDialogComponent],
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
