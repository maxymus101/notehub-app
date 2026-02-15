import { useState } from "react";
import NoteList from "../NoteList/NoteList";
import css from "./App.module.css";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createNote,
  fetchNotes,
  type GetNotesResponse,
  type PostNote,
} from "../../services/noteService";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

export default function App() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [newNote, setNewNote] = useState<PostNote | null>(null);

  const queryClient = useQueryClient();

  const { data, error, isLoading, isSuccess, isError } =
    useQuery<GetNotesResponse>({
      queryKey: ["notes", searchQuery, currentPage],
      queryFn: () => fetchNotes(searchQuery, currentPage),
      placeholderData: keepPreviousData,
    });

  const mutation = useMutation({
    mutationFn: async (newNote: PostNote) => {
      const res = await createNote(newNote);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const totalPages = data?.totalPages ?? 0;

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleNoteAdd = (formValues: PostNote | null) => {
    if (!formValues) return null;

    setNewNote(formValues);
    mutation.mutate(formValues);
    handleModalClose();
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <button className={css.button} onClick={handleModalOpen}>
          Create note +
        </button>
      </header>
      {isModalOpen && (
        <Modal onClose={handleModalClose}>
          <NoteForm onSubmit={handleNoteAdd} />
        </Modal>
      )}
      {isLoading && <p>Loading notes...</p>}
      {isError && <p>An error occurred: {error.message}</p>}
      {isSuccess && data && data.notes.length > 0 ? (
        <NoteList notes={data?.notes} />
      ) : (
        <p>Sorry, no notes found by name "${searchQuery}"</p>
      )}
      <Pagination
        pageCount={totalPages}
        onPageChange={({ selected }) => setCurrentPage(selected + 1)}
        forcePage={currentPage - 1}
      />
    </div>
  );
}
