import React from "react";
import { NoteItemProps } from "./types/NoteItemProps";
import { useDrag } from "react-dnd";

const NoteItem: React.FC<NoteItemProps> = ({ note, onClick, onDelete, className }) => {
  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onDelete(event, note.id);
  };

  const handleNoteClick = () => {
    onClick(note); // Call onClick prop when the component is clicked
  };

  const [, ref] = useDrag({
    type: "NOTE",
    item: { id: note.id },
  });

  return (
    <div className={`note-item ${className || ''}`} onClick={handleNoteClick} ref={ref}>
      <div className="notes-header">
        <button onClick={handleDeleteClick}>x</button>  
      </div>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
    </div>
  );
};

export default NoteItem;
