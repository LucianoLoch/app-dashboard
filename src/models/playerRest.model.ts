import { Player } from './player.model';
export class PlayerRest {
	constructor(
       public content?: Player[],
       public first?: boolean,
       public last?: boolean,
       public number?: number,
       public numberOfElements?: number,
       public size?: number,
       public sort?: null,
       public totalElements?: number,
       public totalPages?: number){}
}

