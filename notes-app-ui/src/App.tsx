import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import NoteItem from "./components/Note";
import { Note } from "./components/types/Note";

import "./App.css";

function App() {
  const [notes, setNotes] = useState<Note[]>([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [hoveredNoteId, setHoveredNoteId] = useState<number | null>(null);

  const [, drop] = useDrop({
    accept: "NOTE",
    drop: (item: { id: number }) => {
      // Find the indices of the dropped note and the target note
      const droppedNoteIndex = notes.findIndex((note) => note.id === item.id);
      const targetNoteIndex = notes.findIndex(
        (note) => note.id === selectedNote?.id
      );

      // Ensure both indices are valid
      if (droppedNoteIndex === -1 || targetNoteIndex === -1) {
        return;
      }

      // Create a new array with the notes in their swapped positions
      const updatedNotes = [...notes];
      [updatedNotes[droppedNoteIndex], updatedNotes[targetNoteIndex]] = [
        updatedNotes[targetNoteIndex],
        updatedNotes[droppedNoteIndex],
      ];

      // Update the state with the new array to swap the notes
      setNotes(updatedNotes);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
    hover: (item: { id: number }, monitor) => {
      if (monitor.isOver()) {
        setHoveredNoteId(item.id); // Set hoveredNoteId when a note is being hovered over
      } else {
        setHoveredNoteId(null); // Clear hoveredNoteId when the note is no longer hovered over
      }
    },
  });

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const url = "http://localhost:4000/api/notes"

        const response = await fetch(url);

        const notes: Note[] = await response.json()

        setNotes(notes)
      } catch (error) {
        console.log(error)
      }
    }
    fetchNotes();
  }, [])

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };
  //on submit
  const handleAddNote = (event: React.FormEvent) => {
    event.preventDefault();
    // console.log("title", title);
    // console.log("content", content);

    const newNote: Note = {
      id: notes.length + 1,
      title: title,
      content: content,
    };

    setNotes([newNote, ...notes]);
    setTitle("");
    setContent("");
  };
  //on submit
  const handleUpdateNote = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedNote) {
      return;
    }

    const updatedNote: Note = {
      id: selectedNote.id,
      title: title,
      content: content,
    };

    const updatedNotesList = notes.map((note) =>
      note.id === selectedNote.id ? updatedNote : note
    );

    setNotes(updatedNotesList);
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  const handleDeleteNote = (event: React.MouseEvent, noteId: number) => {
    event.stopPropagation();

    const updatedNotes = notes.filter((note) => note.id !== noteId);

    setNotes(updatedNotes);
  };

  return (
    <div className="app-container">
      <form
        action=""
        className="note-form"
        onSubmit={(event) =>
          selectedNote ? handleUpdateNote(event) : handleAddNote(event)
        }
      >
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          type="text"
          placeholder="title"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          name=""
          id=""
          rows={10}
          required
        ></textarea>
        {selectedNote ? (
          <div className="edit-buttons">
            <button type="submit">Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        ) : (
          <button type="submit">Add Note</button>
        )}
      </form>
      <div className="notes-grid" ref={drop}>
        {notes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            onClick={handleNoteClick}
            onDelete={handleDeleteNote}
            className={hoveredNoteId === note.id ? "hovered" : ""}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
