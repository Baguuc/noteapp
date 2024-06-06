import { FormEvent, useEffect, useState } from "react";
import useNotes, { Note } from "../lib/notes";
import Button from "./Button";
import Card from "./Card";
import Modal from "./Modal";
import Input from "./Input";

interface NoteAddCardProps {
  onAdd: (note: Note) => void;
}

function NoteAddCard(props: NoteAddCardProps) {
  const notesManager = useNotes();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {}, [description]);

  return (
    <Modal
      modalContent={
        <form
          onSubmit={(event) => {
            event.preventDefault();

            if (!description || !title) {
              return;
            }

            const data = {
              title,
              description,
              date_added: new Date().toISOString().split("T")[0],
            };

            setTitle("");
            setDescription("");

            notesManager.add(data).then(() => {
              props.onAdd(data as Note);
            });
          }}
          className="flex flex-col *:w-full gap-2"
        >
          <Input
            type="text"
            placeholder="Note title"
            onInput={(event: FormEvent<HTMLInputElement>) =>
              setTitle((event.target as any).value)
            }
            value={title}
          />
          <textarea
            placeholder="Note content"
            className="bg-transparent border-[1px] border-red-500 border-solid text-white p-2 h-[350px] "
            onInput={(event: FormEvent<HTMLTextAreaElement>) => {
              setDescription((event.target as any).value.replace("\n", "\r\n"));
            }}
            onDoubleClick={(event) => event.preventDefault()}
            value={description}
          />
          <hr />
          <Button
            type="submit"
            variant="full"
            onDoubleClick={(event) => event.preventDefault()}
          >
            Add
          </Button>
        </form>
      }
    >
      <Card
        description={
          <button className="grid place-content-center w-full h-full text-4xl font-bold rounded-lg duration-100 hover:text-neutral-700 hover:bg-neutral-500 active:opacity-50">
            +
          </button>
        }
      />
    </Modal>
  );
}

export default NoteAddCard;
