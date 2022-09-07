import { ReactNode } from 'react'
import { CarContainer } from './style'

interface CarAreaSliderProps {
  children: ReactNode
}

export function CarAreaSlider({ children }: CarAreaSliderProps) {
  return <CarContainer>{children}</CarContainer>
}
