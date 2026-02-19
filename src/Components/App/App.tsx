import { useState } from "react";
import NoteList from "../NoteList/NoteList";
import css from "./App.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createNote,
  deleteNote,
  type PostNote,
} from "../../services/noteService";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useNotes } from "../../hooks/useNotes";

export default function App() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { data, error, isSuccess, isFetching, isLoading, isError, refetch } =
    useNotes(searchQuery, currentPage);
  const [isRetrying, setIsRetrying] = useState(false);

  const queryClient = useQueryClient();

  const usePostMutation = useMutation({
    mutationFn: async (newNote: PostNote) => {
      const res = await createNote(newNote);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note added succesfully!");
    },
    onError: (error) => {
      toast.error(`Failed to add note: ${error.message}`);
    },
  });

  const useDeleteMutation = useMutation({
    mutationFn: async (id: string) => deleteNote(id),
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

  const handleError = async () => {
    setIsRetrying(true);
    await refetch();
    setIsRetrying(false);
  };

  const handleNoteAdd = (formValues: PostNote | null) => {
    if (!formValues) return null;

    usePostMutation.mutate(formValues);
    handleModalClose();
  };

  const handleNoteDelete = (id: string) => {
    useDeleteMutation.mutate(id);
  };

  return (
    <div className={css.app}>
      <Toaster />
      <header className={css.toolbar}>
        <button className={css.button} onClick={handleModalOpen}>
          Create note +
        </button>
        <SearchBox value={searchQuery} onChange={setSearchQuery} />
      </header>
      {isModalOpen && (
        <Modal onClose={handleModalClose}>
          <NoteForm onSubmit={handleNoteAdd} onClose={handleModalClose} />
        </Modal>
      )}
      {isLoading && isFetching && <Loader />}
      {isError && (
        <ErrorMessage
          message={error.message}
          onClick={handleError}
          isRetrying={isRetrying}
        />
      )}
      {isSuccess && data && data.notes.length > 0 ? (
        <NoteList notes={data?.notes} onDelete={handleNoteDelete} />
      ) : (
        <ErrorMessage
          message="Sorry, no notes found"
          onClick={handleError}
          isRetrying={isRetrying}
        />
      )}
      <Pagination
        pageCount={totalPages}
        onPageChange={({ selected }) => setCurrentPage(selected + 1)}
        forcePage={currentPage - 1}
      />
    </div>
  );
}
