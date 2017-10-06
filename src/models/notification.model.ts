export class Notification {
	constructor(
		public id?: number,
		public playerName?: string,
		public notification?: string,
        public teamId?: number,
		public read?: boolean){}
}