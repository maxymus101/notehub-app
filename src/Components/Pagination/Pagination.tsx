import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number;
  forcePage: number;
  onPageChange: ({ selected }: { selected: number }) => void;
}

export default function Pagination({
  pageCount,
  forcePage,
  onPageChange,
}: PaginationProps) {
  if (pageCount <= 0) {
    return null;
  }
  return (
    <ReactPaginate
      pageClassName={css.pagination_page}
      pageLinkClassName={css.pagination_link}
      activeClassName={css.active}
      activeLinkClassName={css.active_link}
      pageCount={pageCount}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={onPageChange}
      forcePage={forcePage}
      containerClassName={css.pagination}
      nextLabel="→"
      previousLabel="←"
    />
  );
}
