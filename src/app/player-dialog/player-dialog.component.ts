import { Component, OnInit,NgModule } from '@angular/core';
import {FormControl,FormGroup,Validators} from '@angular/forms';
import {PlayerDataService} from '../services/player-data.service';


@Component({
  selector: 'player-dialog',
  templateUrl: './player-dialog.component.html',
  styleUrls: ['./player-dialog.component.css']
})
export class PlayerDialogComponent implements OnInit {
  public playerForm:FormGroup;
  public player:Player;

  constructor(private playerService:PlayerDataService) { }

  ngOnInit() {
    this.playerForm = new FormGroup
    ({
        playerName:new FormControl('',[Validators.required,Validators.maxLength(50)]),
        playerType:new FormControl('',[Validators.required]),
        playerPosition:new FormControl('',[Validators.required,Validators.maxLength(2)]),
        playerTeam:new FormControl('',[Validators.required,Validators.maxLength(25)])
    });
  }

  // mat-error
  public hasError = (controlName:string,errorName: string) =>
  {
    return this.playerForm.controls[controlName].hasError(errorName);
  }

  public AddThisPlayer()
  {  
      this.player = 
      {
        PlayerName:this.playerForm.get('playerName').value,
        PlayerType:this.playerForm.get('playerType').value,
        PlayerPosition:parseInt( this.playerForm.get('playerPosition').value),
        PlayerTeam:this.playerForm.get('playerTeam').value
      }
      
      this.playerService.AddPlayer(this.player);
  }
}

export interface Player
{
  PlayerName:string;
  PlayerType:string;
  PlayerPosition:number;
  PlayerTeam:string;
}
