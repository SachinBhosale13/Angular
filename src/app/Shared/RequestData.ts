import { Player } from "./Player";


export interface RequestData
{
  MatchName:string;
  MatchDate:string;
  TeamOne:string;
  TeamTwo:string;
  StartTime:string;
  MatchAddress:string;
  lstPlayers:Player[]
}