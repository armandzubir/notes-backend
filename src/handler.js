const { nanoid } = require ('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload;
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
        title, tags, body, id, createdAt, updatedAt
    }

    notes.push(newNote);

    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'catatan berhasil ditambah',
            data: {
                noteId: id
            }
        });
        response.code(201);
        console.log(response);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'catatan gagal ditambah',
        data: {
            noteId: id
        }
    });
    console.log(response);
    response.code(500);
    return response;
}

const getAllNoteHandler = (request, h) => {
    const response = h.response({
        status: 'success',
        data: {
            notes
        }
    });
    console.log(notes);
    response.code(200);
    return response;
}

const getNoteByIdHandler = (request, h) => {
    const { id } = request.params;
    const note = notes.filter((n) => n.id === id)[0];
    if (note === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'notes tidak ditemukan'
        });
        response.code(404);
        return response;
    }
    
    const response = h.response({
        status: 'success',
        data: { note }
    });
    response.code(200);
    return response;    
}

const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const { title, tags, body } = request.payload;

    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((note) => note.id === id);
    console.log('edit index:',index);
    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt
        }

        const response = h.response({
            status: 'success',
            message: 'catatan berhasil diperbaharui'
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'notes gagal diperbaharui'
    });

    response.code(500);
    return response;
}

const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params;
    
    const index = notes.findIndex((note) => note.id === id);
    console.log('delete index:',index, id);
    if (index !== -1) {
        notes.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'catatan berhasil dihapus'
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'notes gagal dihapus'
    });

    response.code(500);
    return response;
}

module.exports = { 
    addNoteHandler,
    getAllNoteHandler ,
    editNoteByIdHandler,
    deleteNoteByIdHandler,
    getNoteByIdHandler
};