import styled from 'styled-components';

const NewButton = styled.button`
  padding: 5px 15px;
  background-color: #3366FF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2446AB;
  }
`;

export default NewButton;