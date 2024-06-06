import { invoke } from "@tauri-apps/api";

interface Note {
  id: number;
  title: string;
  description: string;
  date_added: string;
}

let notes: Note[] = [];

async function get() {
  const retrieved: Note[] = await invoke("get_notes");
  notes = retrieved;

  return notes;
}

async function add(
  data: {
    title: string;
    description: string;
    date_added: string;
  },
  id?: number
) {
  let maxID = 1;
  notes.forEach((note) => {
    if (note.id > maxID) maxID = note.id;
  });

  const noteData: Note = {
    id: id ? id : maxID + 1,
    title: data.title,
    description: data.description,
    date_added: data.date_added,
  };

  await invoke("add_notes", {
    notes: [noteData],
  });

  // refresh notes to avoid id duplication issues
  await get();
}

async function remove(id: number) {
  await invoke("remove_notes", {
    notesIds: [id],
  });

  // refresh notes to avoid id duplication issues
  await get();
}

async function update(
  id: number,
  data: { title: string; description: string; date_added: string }
) {
  await remove(id);

  await add(
    {
      title: data.title,
      description: data.description,
      date_added: data.date_added,
    },
    id
  );
}

type useNotesFunctions = {
  get(): Promise<Note[]>;
  add(data: {
    title: string;
    description: string;
    date_added: string;
  }): Promise<void>;
  remove(id: number): Promise<void>;
  update(
    id: number,
    data: { title: string; description: string; date_added: string }
  ): Promise<void>;
};

function useNotes(): useNotesFunctions {
  return { get, add, remove, update };
}

export default useNotes;
export type { Note };
