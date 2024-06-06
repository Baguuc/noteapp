import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Modal from "./Modal";
import Card from "./Card";
import Button from "./Button";
import useNotes, { Note as NoteData } from "../lib/notes";
import { FormEvent, useState } from "react";
import Input from "./Input";

interface NoteProps extends NoteData {
  onRemove?: () => void;
  onUpdate?: () => void;
}

function Note({
  id,
  title,
  description,
  date_added,
  onRemove,
  onUpdate,
}: NoteProps) {
  const [titleUpdate, setTitleUpdate] = useState(title);
  const [descriptionUpdate, setDescriptionUpdate] = useState(description);

  const notesManager = useNotes();

  let descriptionShort = description;

  if (description.length > 200) {
    descriptionShort = description.slice(0, 199) + "...";
  }

  return (
    <Card
      title={title}
      description={
        <>
          <p className="font-bold text-sm">{date_added}</p>
          <Markdown remarkPlugins={[remarkGfm]}>{descriptionShort}</Markdown>
        </>
      }
      key={id}
      className="h-80 break-words"
    >
      <Modal
        modalContent={
          <Markdown remarkPlugins={[remarkGfm]}>{description}</Markdown>
        }
      >
        <Button variant="full" className="w-full">
          Read more
        </Button>
      </Modal>
      <Button
        variant="full"
        onClick={() => {
          notesManager.remove(id).then(() => {
            if (!onRemove) return;
            onRemove();
          });
        }}
      >
        Remove
      </Button>
      <Modal
        modalContent={
          <form
            onSubmit={(event) => {
              event.preventDefault();

              if (!description || !title) {
                return;
              }

              const data = {
                title: titleUpdate,
                description: descriptionUpdate,
                date_added,
              };

              notesManager.update(id, data).then(() => {
                if (!onUpdate) return;
                onUpdate();
              });
            }}
            className="flex flex-col *:w-full gap-2"
          >
            <Input
              type="text"
              placeholder="Note title"
              onInput={(event: FormEvent<HTMLInputElement>) =>
                setTitleUpdate((event.target as any).value)
              }
              value={titleUpdate}
            />
            <textarea
              placeholder="Note content"
              className="bg-transparent border-[1px] border-red-500 border-solid text-white p-2 h-[350px] "
              onInput={(event: FormEvent<HTMLTextAreaElement>) => {
                setDescriptionUpdate(
                  (event.target as any).value.replace("\n", "\r\n")
                );
              }}
              onDoubleClick={(event) => event.preventDefault()}
              value={descriptionUpdate}
            />
            <hr />
            <Button
              type="submit"
              variant="full"
              onDoubleClick={(event) => event.preventDefault()}
            >
              Save changes
            </Button>
          </form>
        }
      >
        <Button variant="full" className="w-full">
          Update
        </Button>
      </Modal>
    </Card>
  );
}

export default Note;
