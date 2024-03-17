import React from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Typography from '@mui/material/Typography';
import Pagination2 from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import TablePagination from '@mui/material/TablePagination';

const Pagination = ({ postsPerPage, totalPosts, paginate }) => {
  const [page, setPage] = React.useState(1);
  const handleChange = (event, value) => {
    paginate(value)
    setPage(value);
  };
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <nav>
      <br/>
      <Stack spacing={2} >

      <Pagination2 style={{dispay:'flex',justifyContent:'center'}} count={pageNumbers.length} page={page} onChange={handleChange} showFirstButton showLastButton />
    </Stack>


    </nav>
  );
};

export default Pagination;
