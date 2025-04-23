import { Member } from '../../models/member';
import { ADD_MEMBER } from '../actions/memberActions';

interface MemberState {
  member: Member | null;
}

const initialState: MemberState = {
  member: null
};

export const memberReducer = (state = initialState, action: any): MemberState => {
  switch (action.type) {
    case ADD_MEMBER:
      return {
        ...state,
        member: action.payload
      };
    default:
      return state;
  }
}; 