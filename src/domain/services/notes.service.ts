import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";
import type { Logger } from "pino";

import { NoteEntity } from "../entities/note.entity";
import type { Config } from "../../shared/config";
import { checkPassword, hashPassword } from "./crypto.service";
import { NotFoundError } from "../../shared/errors/not-found.error";
import { UnauthorizedError } from "../../shared/errors/unauthorized.error";
import { FlatNote, FullNote, INotesRepository, NoteDto } from "../interfaces/note";

export class NotesService {
  constructor(private repository: INotesRepository, private config: Config, private logger: Logger) {}

  async getNote(id: string, password: string): Promise<FullNote> {
    const note = await this.repository.getById(id);
    if (!note) {
      throw new NotFoundError("Note not found");
    }

    const isValidPassowrd = await checkPassword(password, note.hash);
    if (!isValidPassowrd) {
      throw new UnauthorizedError();
    }

    this.logger.info(`Password successfully verified for a note with [${id}]`);

    const noteDto: FullNote = {
      id: note.id,
      title: note.title,
      text: note.text,
      expirationDate: note.expirationDate,
      updatedAt: note.updatedAt,
      createdAt: note.createdAt,
    };

    return noteDto;
  }

  async getNotes(): Promise<Array<FlatNote>> {
    const notes = await this.repository.getItems();
    this.logger.info(`[${notes.length}] items were received`);

    return notes;
  }

  async createNote(note: NoteDto): Promise<string> {
    const expirationDate = note.expirationDate ?? DateTime.now().plus({ years: 3 }).toISO();
    const hash = await hashPassword(note.password);
    const entity: NoteEntity = {
      id: uuid(),
      text: note.text,
      title: note.title,
      hash,
      expirationDate,
      createdAt: DateTime.now().toISO(),
      updatedAt: DateTime.now().toISO(),
    };

    await this.repository.createItem(entity);

    this.logger.info(`Note with id [${entity.id}] correctly created`);
    return entity.id;
  }

  async removeNote(id: string, password: string) {
    const { id: noteId } = await this.getNote(id, password);
    await this.repository.removeItem(noteId);
    this.logger.info(`Note with id [${id}] has been deleted`);
  }

  async changePassword(id: string, oldPassword: string, newPassword: string) {
    const { id: noteId } = await this.getNote(id, oldPassword);
    const newHash = await hashPassword(newPassword);
    this.repository.updateItemHash(noteId, newHash);
    this.logger.info(`The password for the note with id [${id}] has been changed`);
  }
}
