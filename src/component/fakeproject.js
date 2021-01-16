const project = {
  projectList: {
    id: 5,
    username: "jjanddak",
    email: "opplane@gmail.com",
    profile: '/img/레킹볼.png',
    contributers: [
      {
        project_id: 0,
        user_id: 2,
        project: {
          id: 1,
          title: "더미 프로젝트0",
          description: "비회원 상태로 작성한 정보는 저장되지 않습니다",
          manager_id: 8,
          start_date: "2020-02-02",
          end_date: "2020-03-03",
          contributers: [
            {
              project_id: 0,
              user_id: 8,
              user: {
                profile: '/img/레킹볼.png',
                username: "kimcoding2"
              }
            },
            {
              project_id: 0,
              user_id: 1,
              user: {
                profile: '/img/레킹볼.png',
                username: "kimcoding2"
              }
            },
            {
              project_id: 0,
              user_id: 5,
              user: {
                profile: '/img/레킹볼.png',
                username: "kimcoding2"
              }
            }
          ],
          user: {
            profile: '/img/레킹볼.png'
          }
        }
      },
      {
        project_id: 1,
        user_id: 2,
        project: {
          id: 1,
          title: "더미 프로젝트1",
          description: "비회원 상태로 작성한 정보는 저장되지 않습니다",
          manager_id: 8,
          start_date: "2020-02-02",
          end_date: "2020-03-03",
          contributers: [
            {
              project_id: 1,
              user_id: 8,
              user: {
                profile: '/img/레킹볼.png',
                username: "kimcoding2"
              }
            },
            {
              project_id: 1,
              user_id: 1,
              user: {
                profile: '/img/레킹볼.png',
                username: "kimcoding2"
              }
            },
            {
              project_id: 1,
              user_id: 5,
              user: {
                profile: '/img/레킹볼.png',
                username: "kimcoding2"
              }
            }
          ],
          user: {
            profile: '/img/레킹볼.png'
          }
        }
      },
      {
        project_id: 2,
        user_id: 2,
        project: {
          id: 1,
          title: "더미 프로젝트2",
          description: "비회원 상태로 작성한 정보는 저장되지 않습니다",
          manager_id: 8,
          start_date: "2020-02-02",
          end_date: "완료날짜 미정",
          contributers: [
            {
              project_id: 2,
              user_id: 8,
              user: {
                profile: '/img/레킹볼.png',
                username: "kimcoding2"
              }
            },
            {
              project_id: 2,
              user_id: 1,
              user: {
                profile: '/img/레킹볼.png',
                username: "kimcoding2"
              }
            },
            {
              project_id: 2,
              user_id: 5,
              user: {
                profile: '/img/레킹볼.png',
                username: "kimcoding2"
              }
            }
          ],
          user: {
            profile: '/img/레킹볼.png'
          }
        }
      },

    ],
    taskCardCount: [
      {
        project_id: 0,
        done: 3,
        inprogress: 2,
        todo: 2
      },
      {
        project_id: 1,
        done: 7,
        inprogress: 1,
        todo: 1
      },
      {
        project_id: 2,
        done: 7,
        inprogress: 0,
        todo: 0
      }
    ]
  }

}

export default project