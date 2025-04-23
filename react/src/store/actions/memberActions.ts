import { Member } from '../../models/member';

export const ADD_MEMBER = 'ADD_MEMBER';

export const addMember = (member: Member) => ({
  type: ADD_MEMBER,
  payload: member
}); 