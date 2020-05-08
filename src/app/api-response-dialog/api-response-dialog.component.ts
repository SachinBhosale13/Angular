import { Component, OnInit,NgModule, Inject } from '@angular/core';
import { PlayerDataService } from '../services/player-data.service';
import { ResponseData } from '../Shared/ResponseData';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-api-response-dialog',
  templateUrl: './api-response-dialog.component.html',
  styleUrls: ['./api-response-dialog.component.css']
})
export class ApiResponseDialogComponent implements OnInit {
  public response :ResponseData;

  constructor(private playerService:PlayerDataService,@Inject(MAT_DIALOG_DATA) public data:any) {
    console.log("data received: "+ JSON.stringify(data));
   }

  ngOnInit() {
    //this.response = this.playerService.response;
  }

}
