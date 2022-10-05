import { useContext } from 'react'
import { Identity } from '../components/Identity'
import { AuthContext } from '../contexts/AuthContext'

export function Home() {
  const { user } = useContext(AuthContext)

  return (
    <div>
      <Identity
        name={user.name}
        email={user.email}
        cellPhone={user.cellPhone}
        educationalInstitution={user.educationalInstitution}
        type={user.type}
      />
    </div>
  )
}
