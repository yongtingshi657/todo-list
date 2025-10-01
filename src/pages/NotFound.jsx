import { Link } from 'react-router';
import styled from 'styled-components';

const StyleDiv= styled.div`
    text-align: center; 
    padding: 30px;
    display: flex;
    flex-direction: column;
`
const StyleLink= styled(Link)`
    text-decoration: none;
    padding:20px;
    background-color: #8aa8c1;
    color: white;
    border-radius:5px;
    margin-top:60px;
    cursor:pointer;

    &:hover {
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
        color:black
    }
`


export default function NotFound(){
    return (
        <StyleDiv>
        <h2>Page Not Found</h2>
        <StyleLink to="/">Go back to Home</StyleLink>
        </StyleDiv>
    )
}