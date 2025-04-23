import { useCallback } from 'react';
import axios from 'axios';
import { APP_CONFIG } from '../../config/environment';

interface Segment {
  _id: string;
  name: string;
  description: string;
  ext?: {
    marketing?: boolean;
  };
}

interface MemberSegment {
  _id: string;
  member: string;
  segment: string;
}

export const useSegment = () => {
  const getAllSegments = useCallback(async (query: string): Promise<Segment[]> => {
    try {
      const response = await axios.get<Segment[]>(
        `${APP_CONFIG.config.REST_URL}/api/v1/segments`,
        { params: { query } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  const getMemberSegments = useCallback(async (limit: number, query: string): Promise<MemberSegment[]> => {
    try {
      const response = await axios.get<MemberSegment[]>(
        `${APP_CONFIG.config.REST_URL}/api/v1/member-segments`,
        { params: { limit, query } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  const addMemberSegment = useCallback(async (memberId: string, segmentId: string): Promise<MemberSegment> => {
    try {
      const response = await axios.post<MemberSegment>(
        `${APP_CONFIG.config.REST_URL}/api/v1/member-segments`,
        { member: memberId, segment: segmentId }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  const deleteMemberSegment = useCallback(async (memberSegmentId: string): Promise<void> => {
    try {
      await axios.delete(
        `${APP_CONFIG.config.REST_URL}/api/v1/member-segments/${memberSegmentId}`
      );
    } catch (error) {
      throw error;
    }
  }, []);

  return {
    getAllSegments,
    getMemberSegments,
    addMemberSegment,
    deleteMemberSegment
  };
}; 