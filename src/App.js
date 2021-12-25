import React, { useState, useReducer } from "react";
import { v4 as uuid } from "uuid";

const initialAppState = {
  lastNoteCreated: null,
  totalNotes: 0,
  notes: [],
};

const notesReducer = (prevState, action) => {
  switch (action.type) {
    case "ADD_NOTE": {
      const newState = {
        lastNoteCreated: new Date().toTimeString().slice(0, 8),
        totalNotes: prevState.notes.length + 1,
        notes: [...prevState.notes, action.payload],
      };

      console.log("After ADD_NOTE", newState);
      return newState;
    }
    case "DELETE_NOTE": {
      let newState = {
        ...prevState,
        totalNotes: prevState.notes.length - 1,
        notes: prevState.notes.filter((each) => each.id !== action.payload.id),
      };
      console.log("After DELETE_NOTE", newState);
      return newState;
    }
  }
};

export function App() {
  const [noteInput, setNoteInput] = useState("");
  const [notesState, dispatch] = useReducer(notesReducer, initialAppState);
  const addNote = (event) => {
    event.preventDefault();

    if (!noteInput) return;

    const newNote = {
      id: uuid(),
      text: noteInput,
      rotate: Math.floor(Math.random() * 20),
      date: new Date().toTimeString().slice(0, 8),
    };

    dispatch({ type: "ADD_NOTE", payload: newNote });
    setNoteInput("");
  };

  const dropNote = (e) => {
    e.target.style.left = `${e.pageX - 50}px`;
    e.target.style.top = `${e.pageY - 50}px`;
  };
  const dragOver = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div className="app" onDragOver={dragOver}>
      <h1>
        Eslatma Notelar ({notesState.totalNotes})
        <span>
          {notesState.totalNotes > 0
            ? `Oxirgi yaratilgan: ${notesState.lastNoteCreated}`
            : ""}
        </span>
      </h1>

      <form onSubmit={addNote} className="note-form">
        <textarea
          placeholder="Yangi note qo'shish..."
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
        ></textarea>
        <button className="button" style={{ verticalAlign: "middle" }}>
          <span>Qo'shish </span>
        </button>
      </form>

      {notesState.notes.map((note) => (
        <div
          className="note"
          style={{ transform: `rotate(${note.rotate}deg)` }}
          draggable="true"
          onDragEnd={dropNote}
          key={note.id}
        >
          <div
            className="close"
            onClick={() => dispatch({ type: "DELETE_NOTE", payload: note })}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <pre className="text">
            {note.text}
            <br/>
            <span style={{fontSize: '12px'}}>{`yaratildi: ${note.date}`}</span>
          </pre>
        </div>
      ))}
    </div>
  );
}
