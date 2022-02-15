import { NoteEntity } from "../entities/note.entity";

export interface NoteDto {
  title: string;
  text: string;
  password: string;
  expirationDate?: string;
}

export interface FlatNote {
  id: string;
  title: string;
  createdAt: string;
}

export interface FullNote {
  id: string;
  title: string;
  text: string;
  expirationDate: string;
  updatedAt: string;
  createdAt: string;
}

export interface INotesRepository {
  getById(id: string): Promise<NoteEntity | undefined>;
  getItems(): Promise<Array<FlatNote>>;
  createItem(note: NoteEntity): Promise<void>;
  removeItem(id: string): Promise<void>;
  updateItemHash(id: string, newHash: string): Promise<void>;
}
