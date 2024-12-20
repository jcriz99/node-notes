const fs = require('fs');
const path = require('path');

// File path for the notes.json
const notesFilePath = path.join(__dirname, 'notes.json');

// Load existing notes from notes.json
function loadNotes() {
    try {
        const dataBuffer = fs.readFileSync(notesFilePath);
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (e) {
        // If file doesn't exist or is malformed, return an empty array
        return [];
    }
}

// Save notes to notes.json
function saveNotes(notes) {
    fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2));
}

// Add a new note
function addNote(content) {
    const notes = loadNotes();
    // Each note is a simple object with content and a timestamp
    const newNote = {
        content,
        timestamp: new Date().toISOString()
    };
    notes.push(newNote);
    saveNotes(notes);
    console.log('Note added:', content);
}

// List all notes
function listNotes() {
    const notes = loadNotes();
    if (notes.length === 0) {
        console.log('No notes found.');
        return;
    }

    console.log('Your Notes:');
    notes.forEach((note, index) => {
        console.log(`${index + 1}. ${note.content} (Created: ${note.timestamp})`);
    });
}

// Remove a note by matching its content
function removeNote(content) {
    let notes = loadNotes();
    const initialLength = notes.length;
    notes = notes.filter(note => note.content !== content);
    if (notes.length < initialLength) {
        saveNotes(notes);
        console.log('Note removed:', content);
    } else {
        console.log('No note found with that content.');
    }
}

// Parse command-line arguments
const command = process.argv[2];
const argument = process.argv.slice(3).join(' ');

switch (command) {
    case 'add':
        if (!argument) {
            console.log('Please provide note content: node app.js add "Note content"');
            break;
        }
        addNote(argument);
        break;
    case 'list':
        listNotes();
        break;
    case 'remove':
        if (!argument) {
            console.log('Please provide the content of the note to remove: node app.js remove "Note content"');
            break;
        }
        removeNote(argument);
        break;
    default:
        console.log('Usage:');
        console.log('  node app.js add "Note content"');
        console.log('  node app.js list');
        console.log('  node app.js remove "Note content"');
        break;
}
