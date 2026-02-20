import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote, type PostNote } from "../services/noteService";
import toast from "react-hot-toast";

export const usePostNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newNote: PostNote) => {
      const res = await createNote(newNote);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note added succesfully!");
    },
    onError: (error) => {
      toast.error(`Failed to add note. ${error.message}`);
    },
  });
};
