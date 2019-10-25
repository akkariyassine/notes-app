import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Storage } from "@ionic/storage";

import { Observable } from "rxjs";

import { Note } from "../interfaces/note";
import * as NoteActions from "../actions/note.actions";
import { AppState, getAllNotes, getNoteById } from "../reducers";

@Injectable({
  providedIn: "root"
})
export class NotesService {
  public notes: Observable<Note[]>;

  constructor(private storage: Storage, private store: Store<AppState>) {
    this.notes = this.store.select(getAllNotes);
  }
  load(): Promise<boolean> {
    // Return a promise so that we know when this operation has completed
    return new Promise(resolve => {
      // Get the notes that were saved into storage
      this.storage.get("notes").then(notes => {
        // Only set this.notes to the returned value if there were values stored
        if (notes != null) {
          this.notes = notes;
        }

        // This allows us to check if the data has been loaded in or not
        resolve(true);
      });
    });
  }

  save(): void {
    // Save the current array of notes to storage
    this.storage.set("notes", this.notes);
  }

  getNote(id: string): Observable<Note> {
    return this.store.select(getNoteById, {
      id: id
    });
  }

  createNote(title): void {
    let id = Math.random()
      .toString(36)
      .substring(7);

    let note = {
      id: id.toString(),
      title: title,
      content: ""
    };

    this.store.dispatch(new NoteActions.CreateNote({ note: note }));
  }

  deleteNote(note): void {
    this.store.dispatch(new NoteActions.DeleteNote({ note: note }));
  }
}
