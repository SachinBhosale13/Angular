import { Component, OnInit, Inject } from '@angular/core';
import {FormControl,FormGroup,Validators} from '@angular/forms';
import {PlayerDataService} from '../services/player-data.service';
import {CustomValidators} from '../Shared/validator';
import {Player} from '../Shared/Player';
import { AbstractControl, ValidationErrors } from "@angular/forms";
import {MAT_DIALOG_DATA,MatDialogRef} from "@angular/material";
import { inject } from '@angular/core/testing';


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
  public EditPlayer:Player;
  public thisTeamIndex: number = 0;
  public t1Positions: number[] = [];
  public t2Positions: number[] = [];
  private dialogRef:MatDialogRef<EditPlayerDialogComponent>;

  //public SelectedTeamsIndx:number[]=[];

  constructor(private playerService:PlayerDataService,@Inject (MAT_DIALOG_DATA) public data:any) {    
    //this.player = this.playerService.editedPlayer;
   }

  ngOnInit() {
    this.playerForm = new FormGroup
    ({
        playerName:new FormControl(this.data.pl.PlayerName,[Validators.required,Validators.minLength(2),Validators.maxLength(50),CustomValidators.alphabetOnly]),
        playerTeam:new FormControl(this.data.pl.PlayerTeam,[Validators.required,Validators.maxLength(25)]),
        playerType:new FormControl(this.data.pl.PlayerType,[Validators.required]),
        playerPosition:new FormControl(this.data.pl.PlayerPosition,[Validators.required,Validators.maxLength(2),Validators.pattern("^([1-9]|1[01])"),this.rejectPosition()]),        
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

    this.playerService.obsEditPlayer.subscribe(result=>{
        this.EditPlayer = result;
        //console.log("EditPlayer:"+this.EditPlayer);
    });
  }

  public UpdateThisPlayer()
  {  
      let result:boolean;
      this.player = 
      {
        PlayerName:this.playerForm.get('playerName').value,
        PlayerTeam:this.playerForm.get('playerTeam').value,
        PlayerType:this.playerForm.get('playerType').value,
        PlayerPosition:parseInt(this.playerForm.get('playerPosition').value)        
      }

      result = this.playerService.UpdatePlayer(this.player);

      if(result)
      {
        //this.dialogRef.close();
      }

  }

  public onEditChangeTeam()
  {
    
    let changedTeam = this.playerForm.get('playerTeam').value;
    console.log("Changed Team:" + changedTeam);

    if(changedTeam == this.SelectedTeams[0]){      
      this.thisTeamIndex = 0;
      console.log("Changed Team Index: 0 ");
    }
    else if(changedTeam == this.SelectedTeams[1]){
      this.thisTeamIndex = 1;
      console.log("Changed Team Index: 1 ");
    }
  }

  public rejectPosition() {

    return (control: AbstractControl): ValidationErrors | null => {
      
      let value = parseInt(control.value);
      
      if(this.thisTeamIndex == 0)
      {
          console.log("t1yes1");

          if(this.t1Positions.includes(value,0) && this.EditPlayer.PlayerPosition != control.value)
          {
              console.log("t1yes2");
              return {rejectPosition:true};
          }
      }
      if(this.thisTeamIndex == 1)
      {
        console.log("t2yes1");
          if(this.t2Positions.includes(value,0))
          {
            console.log("t2yes2");
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
