import React from 'react'
import { Link } from "react-router-dom";
import './css/ProjectListEntry.css'

function ProjectListEntry({content,taskCardCount}) {
  const {project} = content

  const { done, inprogress, todo} = taskCardCount
  const sum = Math.round(done/(inprogress+todo+done) *100) // 합계구하기

  let color //state 색상변경
  if(sum <= 75){
    color = {backgroundColor : 'red'}
  }else if(sum > 76 && sum <=99){
    color = {backgroundColor : 'yellow'}
  }else{
    color = {backgroundColor : 'blue'}
  }
  const teamList = content.project.contributers.map(ele=>{ //팀원프사
    return <img className='entry_teamimg'key={ele.user_id}src={ele.user.profile}></img>
  })

  return (
    <Link to={`/project/${content.project_id}`} className='entry' >
      <div className='entry_stateColor' style={color}></div>
      <div className='box'>
        <p className='entry_title'>{project.title}<br />{project.startDate}<br />{`~${project.endDate}`}</p>
        {/* <p className='entry_date'>{content.date}</p> */}
      </div>
      <img src={project.user.profile} className='entry_host'></img>
      <div className='box'>
        <p className='entry_kda'>{`${todo}/${inprogress}/${done}`}</p>
        <p className='entry_progress'>{`진행 ${sum}%`}</p>
      </div>
      <p className='entry_description'>{project.description}</p>
      <div className='entry_team'>
        {teamList}
      </div>
    </Link> 
  )
}

export default ProjectListEntry
