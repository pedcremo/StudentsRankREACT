import { VisibilityFilters } from './actions'
​
const initialState = {
  visibilityFilter: VisibilityFilters.SHOW_ALL,
  todos: [],
  students:[],
  attitudeTasks:[],
  gradedTasks:[],
  settings:{}
}
​
function xbrainApp(state = initialState, action) { 
  switch (action.type) {
      
  }
  // For now, don't handle any actions
  // and just return the state given to us.
  return state
}