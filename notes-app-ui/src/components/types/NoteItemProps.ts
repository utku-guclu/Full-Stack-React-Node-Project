import { Note } from "./Note";

export type NoteItemProps = {
  note: Note;
  onClick: (note: Note) => void; // Include onClick prop
  onDelete: (event: React.MouseEvent, id: number) => void;
  className?: string; // Add className property
};
