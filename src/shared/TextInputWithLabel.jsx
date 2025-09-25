import styled from "styled-components";

const StyleInput = styled.input`
  font-size: 1.25rem;
  border-radius: 5px;
  border: none;
`

function TextInputWithLabel({ elementId, labelText, onChange, ref, value }) {
  return (
    <>
      <label htmlFor={elementId}>{labelText}</label>
      <StyleInput
        type="text"
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
      />
    </>
  );
}

export default TextInputWithLabel;
