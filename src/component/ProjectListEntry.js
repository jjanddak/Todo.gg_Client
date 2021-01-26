import overImg from '../avatars/overMember.png'
import React from 'react'
import { Link } from "react-router-dom";
import './css/ProjectListEntry.css'

function ProjectListEntry({content,taskCardCount}) {
  const {project} = content
  const {contributers} = project

  const taskdd= window.sessionStorage[`cnt${content.project_id}`]
  ?JSON.parse(window.sessionStorage[`cnt${content.project_id}`])
  :taskCardCount
  const { done, inprogress, todo} = taskdd
  const sum = Math.round(done/(inprogress+todo+done) *100) 
  const start_date = project.start_date.split(' ')[0]
  const end_date = project.end_date.split(' ')[0]

  let color //state 색상변경
  if(sum <= 65){
    color = {backgroundColor : 'red'}
  }else if(sum > 66 && sum <=99){
    color = {backgroundColor : 'yellow'}
  }else if(sum === 100){
    color = {backgroundColor : 'blue'}
  }
  const teamList = []
  for(let i = 0; i < contributers.length; i++){
    if(contributers.length > 6 && i === 5 ){
      teamList.push(<img className='entry_teamimg'key={contributers[i].user_id} src={overImg}></img>)
      break
    }
    teamList.push(<img className='entry_teamimg'key={contributers[i].user_id} src={contributers[i].user.profile}></img>)
  }
  
  return (
    <Link to={`/project/${content.project_id}`} className='entry' >
      <div className='entry_stateColor' style={color}></div>
      <div className='box'>
        <p className='entry_title'>{project.title}<br />{start_date}<br />{`~${end_date === '9999-01-01' ? '완료날짜미정' :end_date}`}</p>
      </div>
      <img src={project.user.profile} className='entry_host'></img>
      <div className='box'>
        <p className='entry_kda'>{`${todo}/${inprogress}/${done}`}</p>
        <p className='entry_progress'>{`진행 ${sum ? sum :0}%`}</p>
      </div>
      <p className='entry_description'>{project.description}</p>
      <div className='entry_team'>
        {teamList}
      </div>
    </Link> 
  )
}

export default ProjectListEntry
