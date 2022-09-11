import { useEffect, useState } from 'react'
import {
  MarkerCalloutArea,
  MarkerCalloutButton,
  MarkerCalloutContainer,
  MarkerCalloutText,
} from './style'
import { RTDB } from '../../../services/RTDB'
import { child, onValue, update } from 'firebase/database'

interface MarkerCalloutProps {
  title: string
  subtitle?: string
  showCallout: boolean
}

export function MarkerCallout({
  title,
  subtitle,
  showCallout,
}: MarkerCalloutProps) {
  // const [playAlarmSound, setPlayAlarmSound] = useState<boolean>()

  /* function handleClick() {
    update(child(RTDB.carsReference, plate), {
      playAlarmSound: !playAlarmSound,
    })
  } */

  /* useEffect(() => {
    onValue(child(RTDB.carsReference, plate), (snapshot) => {
      setPlayAlarmSound(snapshot.val().playAlarmSound)
    })
  }, [plate]) */

  return (
    <div>
      {showCallout && (
        <MarkerCalloutContainer>
          <MarkerCalloutArea>
            <MarkerCalloutText fontWeight="bold">{title}</MarkerCalloutText>
            {subtitle && (
              <MarkerCalloutText fontWeight="normal">
                {subtitle}
              </MarkerCalloutText>
            )}
            {/* <MarkerCalloutButton onClick={handleClick}>
              <MarkerCalloutText>
                {playAlarmSound ? 'CANCELAR ALARME' : 'Tocar Alarme'}
              </MarkerCalloutText>
            </MarkerCalloutButton> */}
          </MarkerCalloutArea>
        </MarkerCalloutContainer>
      )}
    </div>
  )
}
