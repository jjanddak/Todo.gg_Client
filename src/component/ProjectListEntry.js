import React from 'react'
import './css/ProjectListEntry.css'

function ProjectListEntry({content}) {
  const teamList = content.member.map(ele=>{
    return <img className='entry_teamimg'key={ele.id}src={ele.profile}></img>
  })
  return (
    <div className='entry'>
      <div className='entry_stateColor'></div>
      <div className='box'>
        <p className='entry_title'>{content.title}<br />{content.date}</p>
        {/* <p className='entry_date'>{content.date}</p> */}
      </div>
      <img src={content.hostImg} className='entry_host'></img>
      <div className='box'>
        <p className='entry_kda'>10/5/13</p>
        <p className='entry_progress'>진행 20%</p>
      </div>
      <p className='entry_description'>{content.description}</p>
      <div className='entry_team'>
        {teamList}
      </div>
    </div> 
  )
}

export default ProjectListEntry