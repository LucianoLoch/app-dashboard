export class Bidinfo {
	constructor(
		public id?: number,
		public bidValue?: number,
		public teamID?: number,
		public originalValue?: number,
		public playerID?: number,
		public playerName?: string,
        public bidAproved?: boolean,
        public position?: string,
        public bidTime?: Date){}
}


export class BidInfoRest {
	constructor(
       public content?: Bidinfo[],
       public first?: boolean,
       public last?: boolean,
       public number?: number,
       public numberOfElements?: number,
       public size?: number,
       public sort?: null,
       public totalElements?: number,
       public totalPages?: number){}
}
