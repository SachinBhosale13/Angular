import { Component, OnInit } from '@angular/core';
import {FormControl,FormGroup,Validators} from '@angular/forms';
import {PlayerDataService} from '../services/player-data.service';
import {CustomValidators} from '../Shared/validator';
import {Player} from '../Shared/Player';

@Component({
  selector: 'edit-player-dialog',
  templateUrl: './edit-player-dialog.component.html',
  styleUrls: ['./edit-player-dialog.component.css']
})
export class EditPlayerDialogComponent implements OnInit {
  public playerForm:FormGroup;
  public player:Player;
  public SelectedTeams:string[]=[];
  public pIndx:number;

  //public SelectedTeamsIndx:number[]=[];

  constructor(private playerService:PlayerDataService) {
    
    this.player = this.playerService.editedPlayer;
   }

  ngOnInit() {
    this.playerForm = new FormGroup
    ({
        playerName:new FormControl(this.player.PlayerName,[Validators.required,Validators.minLength(2),Validators.maxLength(50),CustomValidators.alphabetOnly]),
        playerType:new FormControl(this.player.PlayerType,[Validators.required]),
        playerPosition:new FormControl(this.player.PlayerPosition,[Validators.required,Validators.maxLength(2),Validators.pattern("^([1-9]|1[01])")]),
        playerTeam:new FormControl(this.player.PlayerTeam,[Validators.required,Validators.maxLength(25)])
    });

    this.playerService.obsSelectedTeams.subscribe(result=>{
      this.SelectedTeams = result
    });
  }

  public UpdateThisPlayer()
  {  
      this.player = 
      {
        PlayerName:this.playerForm.get('playerName').value,
        PlayerType:this.playerForm.get('playerType').value,
        PlayerPosition:parseInt(this.playerForm.get('playerPosition').value),
        PlayerTeam:this.playerForm.get('playerTeam').value
      }

      this.playerService.UpdatePlayer(this.player);
  }

  public hasError = (controlName:string,errorName: string) =>
  {
    return this.playerForm.controls[controlName].hasError(errorName);
  }
}
