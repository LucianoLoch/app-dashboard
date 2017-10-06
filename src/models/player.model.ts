import { PlayerAttributes } from './playerAttributes.model';

export class Player {
	constructor(
		public id?: number,
		public name?: string,
		public position?: string,
		public baseId?: number,
		public rating?: number,
		public hasBid?:boolean,
		public attributes?: PlayerAttributes[],
        public clubName?:string,
        public height?: number,
        public weight?: number,
        public age?:number,
        public foot?:string,
        public atkWorkRate?: string,
        public defWorkRate?: string,
        public headshotImgUrl?:string){}
}


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

