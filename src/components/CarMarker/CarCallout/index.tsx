import { useEffect, useState } from 'react'
import {
  CarCalloutArea,
  CarCalloutButton,
  CarCalloutContainer,
  CarCalloutText,
} from './style'
import { RTDB } from '../../../services/RTDB'
import { child, onValue, update } from 'firebase/database'

interface CarCalloutProps {
  plate: string
  showCallout: boolean
}

export function CarCallout({ plate, showCallout }: CarCalloutProps) {
  const [playAlarmSound, setPlayAlarmSound] = useState<boolean>()

  function handleClick() {
    update(child(RTDB.carsReference, plate), {
      playAlarmSound: !playAlarmSound,
    })
  }

  useEffect(() => {
    onValue(child(RTDB.carsReference, plate), (snapshot) => {
      setPlayAlarmSound(snapshot.val().playAlarmSound)
    })
  }, [plate])

  return showCallout ? (
    <CarCalloutContainer>
      <CarCalloutArea>
        <CarCalloutText>{plate}</CarCalloutText>
        <CarCalloutButton onClick={handleClick}>
          <CarCalloutText>
            {playAlarmSound ? 'CANCELAR ALARME' : 'Tocar Alarme'}
          </CarCalloutText>
        </CarCalloutButton>
      </CarCalloutArea>
    </CarCalloutContainer>
  ) : (
    <></>
  )
}
