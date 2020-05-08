import { Component, OnInit,NgModule } from '@angular/core';
import { PlayerDataService } from '../services/player-data.service';
import { ResponseData } from '../Shared/ResponseData';

@Component({
  selector: 'app-api-response-dialog',
  templateUrl: './api-response-dialog.component.html',
  styleUrls: ['./api-response-dialog.component.css']
})
export class ApiResponseDialogComponent implements OnInit {
  public response :ResponseData;

  constructor(private playerService:PlayerDataService) { }

  ngOnInit() {
    this.response = this.playerService.response;
  }

}
