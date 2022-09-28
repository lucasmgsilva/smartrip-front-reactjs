import { Icon } from '../CustomMarker/style'
import { CarItemContainer, CarItemRow } from './style'

interface CarItemProps {
  plate: string
  speed: number
  onPress: () => void
}

export function CarItem({ plate, speed, onPress }: CarItemProps) {
  return (
    <CarItemContainer onClick={onPress}>
      <Icon size={35} src={'/assets/car.png'} />
      <CarItemRow>Placa: {plate}</CarItemRow>
      <CarItemRow>{`${speed?.toFixed(2)} km/h`}</CarItemRow>
    </CarItemContainer>
  )
}
