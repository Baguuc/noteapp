"use client";

import Note from "./components/Note";
import NoteAddCard from "./components/NoteAddCard";
import useNotes, { Note as NoteData } from "./lib/notes";
import { useEffect, useState } from "react";

export default function App() {
  const [notes, setNotes] = useState([] as NoteData[]);
  const notesManager = useNotes();

  function refreshData() {
    notesManager.get().then(setNotes);
  }

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="p-4 grid place-content-center">
      <div className="w-fit grid grid-cols-3 gap-2 overflow-y-auto overflow-x-hidden">
        {notes.map((noteData: NoteData) => {
          return (
            <Note
              {...noteData}
              key={noteData.id}
              onRemove={() => {
                refreshData();
              }}
              onUpdate={() => {
                refreshData();
              }}
            ></Note>
          );
        })}
        <NoteAddCard
          onAdd={(note) => {
            setNotes([...notes, note]);
          }}
        />
      </div>
    </div>
  );
}
