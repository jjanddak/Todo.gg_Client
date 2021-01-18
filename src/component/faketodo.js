export default [
  { //! [0]
    projectInfo: {
      id: 0,
      title: "더미 프로젝트0",
      description: "비회원 상태로 작성한 정보는 저장되지 않습니다",
      start_date: "2020-02-02",
      end_date: "2020-03-03",
      contributers: [ //* member
        {
          id: 0,
          project_id: 0,
          taskCard_id: 0,
          user_id: 1,
          user: {
            id: 1,
            profile: "../avatars/avt_15.png",
            username: "아무개1"
          }
        },
        {
          id: 1,
          project_id: 0,
          taskCard_id: 0,
          user_id: 2,
          user: {
            id: 2,
            profile: "../avatars/avt_13.png",
            username: "아무개2"
          }
        },
        {
          id: 2,
          project_id: 0,
          taskCard_id: 0,
          user_id: 3,
          user: {
            id: 3,
            profile: "../avatars/avt_9.png",
            username: "아무개3"
          }
        },
        {
          id: 3,
          project_id: 0,
          taskCard_id: 0,
          user_id: 4,
          user: {
            id: 4,
            profile: "../avatars/avt_5.png",
            username: "아무개4"
          }
        },
        {
          id: 4,
          project_id: 0,
          taskCard_id: 0,
          user_id: 5,
          user: {
            id: 5,
            profile: "../avatars/avt_11.png",
            username: "아무개5"
          }
        },
        {
          id: 5,
          project_id: 0,
          taskCard_id: 0,
          user_id: 6,
          user: {
            id: 6,
            profile: "../avatars/avt_10.png",
            username: "아무개6"
          }
        },
      ],
      taskCards:
        [
          {
            id: 1,
            content: "task_card_01",
            state: "done",
            project_id: 0,
            contributers: [] //TODO 태스크 맡은 사람, 복수 가능
          },
          {
            id: 4,
            content: "task_card_04",
            state: "done",
            project_id: 0,
            contributers: []
          },
          {
            id: 5,
            content: "task_card_05",
            state: "done",
            project_id: 0,
            contributers: []
          },
          {
            id: 2,
            content: "task_card_02",
            state: "inprogress",
            project_id: 0,
            contributers: []
          },
          {
            id: 6,
            content: "task_card_06",
            state: "inprogress",
            project_id: 0,
            contributers: [
              {
                id: 5,
                project_id: null,
                taskCard_id: 3,
                user_id: 4,
                user: {
                  id: 4,
                  profile: "../avatars/avt_9.png",
                  username: "아무개4"
                }
              },
              {
                id: 4,
                project_id: 0,
                taskCard_id: 3,
                user_id: 1,
                user: {
                  id: 1,
                  profile: "../avatars/avt_15.png",
                  username: "아무개1"
                }
              }
            ]
          },
          {
            id: 3,
            content: "task_card_03",
            state: "todo",
            project_id: 0,
            contributers: []
          },
          {
            id: 8,
            content: "task_card_08",
            state: "todo",
            project_id: 0,
            contributers: [
              {
                id: 2,
                project_id: 0,
                taskCard_id: 1,
                user_id: 3,
                user: {
                  id: 3,
                  profile: "../avatars/avt_9.png",
                  username: "아무개3"
                }
              }
            ]
          },
        ],
    },
    taskCardCount: {
      todo: 2,
      inprogress: 2,
      done: 3,
      project_id: 0
    },
  },
  { //! [1]
    projectInfo: {
      id: 1,
      title: "더미 프로젝트1",
      description: "비회원 상태로 작성한 정보는 저장되지 않습니다",
      start_date: "2020-02-02",
      end_date: "2020-03-03",
      contributers: [
        {
          id: 0,
          project_id: 0,
          taskCard_id: 0,
          user_id: 1,
          user: {
            id: 1,
            profile: "../avatars/avt_15.png",
            username: "아무개1"
          }
        },
        {
          id: 1,
          project_id: 0,
          taskCard_id: 0,
          user_id: 2,
          user: {
            id: 2,
            profile: "../avatars/avt_13.png",
            username: "아무개2"
          }
        },
        {
          id: 2,
          project_id: 0,
          taskCard_id: 0,
          user_id: 3,
          user: {
            id: 3,
            profile: "../avatars/avt_9.png",
            username: "아무개3"
          }
        },
        {
          id: 3,
          project_id: 0,
          taskCard_id: 0,
          user_id: 4,
          user: {
            id: 4,
            profile: "../avatars/avt_5.png",
            username: "아무개4"
          }
        },
        {
          id: 4,
          project_id: 0,
          taskCard_id: 0,
          user_id: 5,
          user: {
            id: 5,
            profile: "../avatars/avt_11.png",
            username: "아무개5"
          }
        },
        {
          id: 5,
          project_id: 0,
          taskCard_id: 0,
          user_id: 6,
          user: {
            id: 6,
            profile: "../avatars/avt_10.png",
            username: "아무개6"
          }
        },
        {
          id: 6,
          project_id: 0,
          taskCard_id: 0,
          user_id: 7,
          user: {
            id: 7,
            profile: "../avatars/avt_10.png",
            username: "아무개7"
          }
        },
        {
          id: 7,
          project_id: 0,
          taskCard_id: 0,
          user_id: 8,
          user: {
            id: 8,
            profile: "../avatars/avt_10.png",
            username: "아무개8"
          }
        },
      ],
      taskCards:
        [
          {
            id: 1,
            content: "task_card_01",
            state: "done",
            project_id: 0,
            contributers: []
          },
          {
            id: 4,
            content: "task_card_04",
            state: "done",
            project_id: 0,
            contributers: []
          },
          {
            id: 5,
            content: "task_card_05",
            state: "done",
            project_id: 0,
            contributers: []
          },
          {
            id: 2,
            content: "task_card_02",
            state: "todo",
            project_id: 0,
            contributers: []
          },
          {
            id: 6,
            content: "task_card_06",
            state: "inprogress",
            project_id: 0,
            contributers: [
              {
                id: 5,
                project_id: null,
                taskCard_id: 3,
                user_id: 4,
                user: {
                  id: 4,
                  profile: "../avatars/avt_9.png",
                  username: "아무개4"
                }
              },
              {
                id: 4,
                project_id: 0,
                taskCard_id: 3,
                user_id: 1,
                user: {
                  id: 1,
                  profile: "../avatars/avt_15.png",
                  username: "아무개1"
                }
              }
            ]
          },
          {
            id: 3,
            content: "task_card_03",
            state: "done",
            project_id: 0,
            contributers: []
          },
          {
            id: 0,
            content: "task_card_03",
            state: "done",
            project_id: 0,
            contributers: []
          },
          {
            id: 7,
            content: "task_card_03",
            state: "done",
            project_id: 0,
            contributers: []
          },
          {
            id: 8,
            content: "task_card_08",
            state: "done",
            project_id: 0,
            contributers: [
              {
                id: 2,
                project_id: 0,
                taskCard_id: 1,
                user_id: 3,
                user: {
                  id: 3,
                  profile: "../avatars/avt_9.png",
                  username: "아무개3"
                }
              }
            ]
          },
        ],
    },
    taskCardCount: {
      todo: 1,
      inprogress: 1,
      done: 7,
      project_id: 1
    },
  },
  { //! [2]
    projectInfo: {
      id: 2,
      title: "더미 프로젝트2",
      description: "비회원 상태로 작성한 정보는 저장되지 않습니다",
      start_date: "2020-02-02",
      end_date: "완료날짜 미정",
      contributers: [
        {
          id: 0,
          project_id: 0,
          taskCard_id: 0,
          user_id: 1,
          user: {
            id: 1,
            profile: "../avatars/avt_15.png",
            username: "아무개1"
          }
        },
        {
          id: 1,
          project_id: 0,
          taskCard_id: 0,
          user_id: 2,
          user: {
            id: 2,
            profile: "../avatars/avt_13.png",
            username: "아무개2"
          }
        },
        {
          id: 2,
          project_id: 0,
          taskCard_id: 0,
          user_id: 3,
          user: {
            id: 3,
            profile: "../avatars/avt_9.png",
            username: "아무개3"
          }
        },
        {
          id: 3,
          project_id: 0,
          taskCard_id: 0,
          user_id: 4,
          user: {
            id: 4,
            profile: "../avatars/avt_5.png",
            username: "아무개4"
          }
        },
        {
          id: 4,
          project_id: 0,
          taskCard_id: 0,
          user_id: 5,
          user: {
            id: 5,
            profile: "../avatars/avt_11.png",
            username: "아무개5"
          }
        },
        {
          id: 5,
          project_id: 0,
          taskCard_id: 0,
          user_id: 6,
          user: {
            id: 6,
            profile: "../avatars/avt_10.png",
            username: "아무개6"
          }
        },
      ],
      taskCards:
        [
          {
            id: 1,
            content: "task_card_01",
            state: "done",
            project_id: 0,
            contributers: []
          },
          {
            id: 4,
            content: "task_card_04",
            state: "done",
            project_id: 0,
            contributers: []
          },
          {
            id: 5,
            content: "task_card_05",
            state: "done",
            project_id: 0,
            contributers: []
          },
          {
            id: 2,
            content: "task_card_02",
            state: "done",
            project_id: 0,
            contributers: []
          },
          {
            id: 6,
            content: "task_card_06",
            state: "done",
            project_id: 0,
            contributers: [
              {
                id: 5,
                project_id: null,
                taskCard_id: 3,
                user_id: 4,
                user: {
                  id: 4,
                  profile: "../avatars/avt_9.png",
                  username: "아무개4"
                }
              },
              {
                id: 4,
                project_id: 0,
                taskCard_id: 3,
                user_id: 1,
                user: {
                  id: 1,
                  profile: "../avatars/avt_15.png",
                  username: "아무개1"
                }
              }
            ]
          },
          {
            id: 3,
            content: "task_card_03",
            state: "done",
            project_id: 0,
            contributers: []
          },
        ],
    },
    taskCardCount: {
      todo: 0,
      inprogress: 0,
      done: 7,
      project_id: 2
    },
  },
]
