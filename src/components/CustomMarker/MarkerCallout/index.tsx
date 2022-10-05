import {
  MarkerCalloutArea,
  MarkerCalloutContainer,
  MarkerCalloutText,
} from './style'
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
          </MarkerCalloutArea>
        </MarkerCalloutContainer>
      )}
    </div>
  )
}
