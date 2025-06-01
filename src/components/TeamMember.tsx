import React from 'react'
import styles from './TeamMember.module.css'

function TeamMemberCard({
  memberName,
  avatar,
  role,
  href,
}: {
  memberName: string
  avatar: string
  role: string
  href: string
}) {
  return (
    <a className={`col col--4 ${styles.card}`} href={href}>
      <div className="text--center">
        <img className={styles.avtr} alt={memberName} src={avatar} />
      </div>
      <div className="text--center padding-horiz--md">
        <h2>{memberName}</h2>
        <p>{role}</p>
      </div>
    </a>
  )
}

export default TeamMemberCard
