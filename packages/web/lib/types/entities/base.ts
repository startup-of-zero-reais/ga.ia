export interface Timestamps {
	created_at: Date;
	updated_at: Date;
	deleted_at: Date | null;
}

export interface PK {
	id: string;
}
