import { useState } from "react";
import NoteList from "../NoteList/NoteList";
import css from "./App.module.css";
import { type PostNote } from "../../services/noteService";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useNotes } from "../../hooks/useNotes";
import { useDeleteNote } from "../../hooks/useDeleteNote";
import { usePostNote } from "../../hooks/usePostNote";

export default function App() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { data, error, isSuccess, isFetching, isLoading, isError, refetch } =
    useNotes(searchQuery, currentPage);
  const [isRetrying, setIsRetrying] = useState(false);

  const postNoteMutation = usePostNote();

  const deleteNoteMutation = useDeleteNote();

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

    postNoteMutation.mutate(formValues);
    handleModalClose();
  };

  const handleNoteDelete = (id: string) => {
    deleteNoteMutation.mutate(id);
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
