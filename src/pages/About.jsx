import styled from 'styled-components';

const StyleDiv = styled.div`
  text-align: center;
  padding: 30px;
  display: flex;
  flex-direction: column;

  h2{
    margin-bottom:20px;
  }
`;

export default function About() {
  return (
    <StyleDiv>
      <h2>CTD TodoList Demo</h2>
      <h3>created by Yongting Shi</h3>
    </StyleDiv>
  );
}
