import React from 'react'
import ProjectListEntry from './ProjectListEntry'
import fakeproject from './fakeproject.js'

function ProjectList(){
    const list = fakeproject.List.map(ele=>{
        return <ProjectListEntry key={ele.id} content={ele}></ProjectListEntry>
    })
    return(
        <>
        {list}
        </>
    )
}

export default ProjectList