import axios from "axios";
import type { Note, NoteTag } from "../types/note";

export interface GetNotesResponse {
  notes: Note[];
  page: number;
  perPage: number;
  totalPages: number;
}

export interface PostNote {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface DeleteNote {
  id: string;
}

const token = import.meta.env.VITE_NOTEHUB_TOKEN;
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASEURL,
  timeout: 5000,
  headers: {
    "Content-type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

// --GET Notes--
export async function fetchNotes(
  query: string = "",
  page: number = 1,
  perPage: number = 12,
): Promise<GetNotesResponse> {
  try {
    const res = await api.get<GetNotesResponse>("/notes", {
      params: { search: query, page: page, perPage: perPage },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching note: ", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
    } else {
      console.error("Unexpected error fetching note:", error);
    }
    throw error;
  }
}
// --POST Note--
export async function createNote(newNote: PostNote): Promise<Note> {
  try {
    const res = await api.post<Note>("/notes", newNote);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error creating note:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
    } else {
      console.error("Unexpected error creating note:", error);
    }
    throw error;
  }
}

// --Delete Note--
export async function deleteNote(id: string): Promise<DeleteNote> {
  try {
    const res = await api.delete<DeleteNote>(`/note/${id}`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error deleting note:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
    } else {
      console.error("Unexpected error deleting note:", error);
    }
    throw error;
  }
}
