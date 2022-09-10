import styled from 'styled-components'

export const CarContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 10rem);
  grid-column-gap: 0.5rem;

  @media (max-width: 425px) {
    grid-template-columns: repeat(auto-fill, calc(100%));
  }

  @media (min-width: 426px) and (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, calc(50% - 0.25rem));
  }
`
