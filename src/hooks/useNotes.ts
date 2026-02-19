import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../services/noteService";

export const useNotes = (searchQuery: string, currentPage: number) => {
  return useQuery({
    queryKey: ["notes", searchQuery, currentPage],
    queryFn: () => fetchNotes(searchQuery, currentPage),
    placeholderData: keepPreviousData,
  });
};
