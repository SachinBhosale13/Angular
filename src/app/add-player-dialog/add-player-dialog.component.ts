import { Component, OnInit, NgModule } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PlayerDataService } from '../services/player-data.service';
import { CustomValidators } from '../Shared/validator';
import { Player } from '../Shared/Player';
import { AbstractControl, ValidationErrors } from "@angular/forms";


@Component({
  selector: 'add-player-dialog',
  templateUrl: './add-player-dialog.component.html',
  styleUrls: ['./add-player-dialog.component.css']
})
export class AddPlayerDialogComponent implements OnInit {
  public playerForm: FormGroup;
  public player: Player;
  public SelectedTeams: string[] = [];
  public thisTeamIndex: number = 0;
  public t1Positions: number[] = [];
  public t2Positions: number[] = [];
  public enableLockTeam:boolean=false;
  public lockTeam : boolean=false;
  public enableLockPlayerType:boolean=false;
  public lockPlayerType : boolean=false;

  //public SelectedTeamsIndx:number[]=[];

  constructor(private playerService: PlayerDataService) { }

  ngOnInit() {
    this.SelectedTeams = [];
    this.playerService.obsSelectedTeams.subscribe(result => { this.SelectedTeams = result });

    this.playerService.obsT1Positions.subscribe(result => {
      this.t1Positions = result;
      //console.log("t1 Pos: "+ this.t1Positions);
    });

    this.playerService.obsT2Positions.subscribe(result => {
      this.t2Positions = result;
      //console.log(this.t2Positions);
    });

    this.playerForm = new FormGroup
      ({
        playerName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50), CustomValidators.alphabetOnly]),
        playerTeam: new FormControl('', [Validators.required, Validators.maxLength(25)]),
        playerType: new FormControl('', [Validators.required]),        
        playerPosition: new FormControl('', [Validators.required, Validators.maxLength(2), Validators.pattern("^([1-9]|1[01])"), this.rejectPosition()])
      });
  }

  public AddThisPlayer() {

    this.player =
    {
      PlayerName: this.playerForm.get('playerName').value,
      PlayerTeam: this.playerForm.get('playerTeam').value,
      PlayerType: this.playerForm.get('playerType').value,
      PlayerPosition: parseInt(this.playerForm.get('playerPosition').value)
    }

    this.playerService.AddPlayer(this.player);

    this.playerForm.get('playerName').reset();
    if(!this.lockTeam)
    {
      this.playerForm.get('playerTeam').reset();
    }
    if(!this.lockPlayerType)
    {
      this.playerForm.get('playerType').reset();
    }
    this.playerForm.get('playerPosition').reset();      
    
    //TODO
    // if(this.playerService.playerData.some)
1    // {
    //  // this.playerId = this.playerService.playerData.;
    // }

    //this.playerId = this.playerId + 1;
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

  public onChangeTeam(value: string) {

    this.enableLockTeam = true;

    this.playerForm.get('playerPosition').reset();

    //console.log("team changed: " + value);
    //let thisTeam = this.playerForm.get('playerTeam').value;
    if (value == this.SelectedTeams[0]) {
      this.thisTeamIndex = 0;
      //console.log("Index 0");
    }
    if (value == this.SelectedTeams[1]) {
      this.thisTeamIndex = 1;
      //console.log("Index 1");
    }
  }

  public onChangePlayerType(value:string)
  {
    this.enableLockPlayerType = true;
  }

  // mat-error
  public hasError = (controlName: string, errorName: string) => {
    return this.playerForm.controls[controlName].hasError(errorName);
  }

}



// export interface Player
// {
//   PlayerName:string;
//   PlayerType:string;
//   PlayerPosition:number;
//   PlayerTeam:string;
// }
