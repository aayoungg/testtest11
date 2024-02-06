import React from 'react';
import styled from 'styled-components';

const Nav = styled.nav`
  padding: 20px;
  text-align: center;
  position: fixed;
  bottom: 40px;
  left: 0;
  width: 100%;
`;

const Ul = styled.ul`
  list-style: none;
  display: inline-flex;
`;

const Li = styled.li`
  margin: 0 5px;
  a {
    padding: 10px 15px;
    text-decoration: none;
    color: #333;
    border-radius: 4px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #ddd;
    }
  }

  &.active a {
    color: #fff;
    background-color: #3366FF;
  }
`;

const A = styled.a``;

const Pagination = ({ currentPage, itemsPerPage, totalItems, paginate }) => {   //페이지 번호를 생성
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }


  return (
    <Nav>
      <Ul>
        {pageNumbers.map(number => (
          <Li key={number} className={currentPage === number ? 'active' : ''}>
            <A onClick={(e) => {
              paginate(number);
            }}
              href='#'>
              {number}
            </A>
          </Li>
        ))}
      </Ul>
    </Nav >
  );
};



export default Pagination;