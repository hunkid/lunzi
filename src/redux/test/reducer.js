export default (state = {direction: 'DDDD'}, action) => {
  switch(action.type) {
    case 'LEFT':
      return {
        ...state,
        direction: 'LEFT'
      }
    case 'RIGHT':
      return {
        ...state,
        direction:' RIGHT'
      }
    default:
      return state
  }
}