import { Component, OnInit } from '@angular/core';
import {FormControl,FormGroup,Validators} from '@angular/forms';
import {PlayerDataService} from '../services/player-data.service';
import {CustomValidators} from '../Shared/validator';
import {Player} from '../Shared/Player';
import { AbstractControl, ValidationErrors } from "@angular/forms";

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
  public thisTeamIndex: number = 0;
  public t1Positions: number[] = [];
  public t2Positions: number[] = [];

  //public SelectedTeamsIndx:number[]=[];

  constructor(private playerService:PlayerDataService) {
    
    this.player = this.playerService.editedPlayer;
   }

  ngOnInit() {
    this.playerForm = new FormGroup
    ({
        playerName:new FormControl(this.player.PlayerName,[Validators.required,Validators.minLength(2),Validators.maxLength(50),CustomValidators.alphabetOnly]),
        playerTeam:new FormControl(this.player.PlayerTeam,[Validators.required,Validators.maxLength(25)]),
        playerType:new FormControl(this.player.PlayerType,[Validators.required]),
        playerPosition:new FormControl(this.player.PlayerPosition,[Validators.required,Validators.maxLength(2),Validators.pattern("^([1-9]|1[01])"),this.rejectPosition()]),        
    });

    this.playerService.obsSelectedTeams.subscribe(result=>{
      this.SelectedTeams = result
    });

    this.playerService.obsT1Positions.subscribe(result => {
      this.t1Positions = result;
      //console.log("t1 Pos: "+ this.t1Positions);
    });

    this.playerService.obsT2Positions.subscribe(result => {
      this.t2Positions = result;
      //console.log(this.t2Positions);
    });
  }

  public UpdateThisPlayer()
  {  
      this.player = 
      {
        PlayerName:this.playerForm.get('playerName').value,
        PlayerTeam:this.playerForm.get('playerTeam').value,
        PlayerType:this.playerForm.get('playerType').value,
        PlayerPosition:parseInt(this.playerForm.get('playerPosition').value)        
      }

      this.playerService.UpdatePlayer(this.player);
  }

  public rejectPosition() {

    return (control: AbstractControl): ValidationErrors | null => {
      
      let value = parseInt(control.value);
      
      if(this.thisTeamIndex == 0)
      {
          //console.log("t1yes1");

          if(this.t1Positions.includes(value,0))
          {
              //console.log("t1yes2");
              return {rejectPosition:true};
          }
      }
      if(this.thisTeamIndex == 1)
      {
        //console.log("t2yes1");
          if(this.t2Positions.includes(value,0))
          {
            //console.log("t2yes2");
              return {rejectPosition:true};
          }
      }

      return null;
    }
  };

  public hasError = (controlName:string,errorName: string) =>
  {
    return this.playerForm.controls[controlName].hasError(errorName);
  }
}
