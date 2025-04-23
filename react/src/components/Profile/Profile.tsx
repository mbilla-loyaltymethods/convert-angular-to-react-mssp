import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMember } from '../../services/member/memberService';
import { useAlert } from '../../services/alert/alertService';
import { useAuth } from '../../services/auth/authService';
// import { addMember, clearMember } from '../../store/actions/memberActions';
import { clearCart } from '../../store/actions/cartActions';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const MemberInfo = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Label = styled.span`
  font-weight: bold;
  color: #666;
`;

const Value = styled.span`
  color: #333;
`;

const PointsDisplay = styled.div`
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  margin: 20px 0;
`;

const PointsValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #1976d2;
`;

const TierBadge = styled.div`
  display: inline-block;
  padding: 5px 10px;
  background: #1976d2;
  color: white;
  border-radius: 4px;
  font-size: 14px;
  margin-top: 10px;
`;

const SwitchMemberForm = styled.form`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
`;

const Button = styled.button`
  padding: 8px 16px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: #1565c0;
  }
`;

const LogoutButton = styled(Button)`
  background: #f44336;
  
  &:hover {
    background: #d32f2f;
  }
`;

interface Member {
  loyaltyId: string;
  firstName: string;
  lastName: string;
  email: string;
  purses: Array<{
    name: string;
    availBalance: number;
  }>;
  tiers: Array<{
    level: {
      name: string;
    };
  }>;
}

export const Profile = () => {
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const { getMember, isFetching } = useMember();
  // const { showError } = useAlert();
  // const { logout } = useAuth();
  
  // const [loyaltyId, setLoyaltyId] = useState('');
  // const [member, setMember] = useState<Member | null>(null);
  // const [totalPoints, setTotalPoints] = useState(0);

  // useEffect(() => {
  //   const storedLoyaltyId = localStorage.getItem('loyaltyId');
  //   if (storedLoyaltyId) {
  //     setLoyaltyId(storedLoyaltyId);
  //     fetchMember(storedLoyaltyId);
  //   }
  // }, []);

  // const fetchMember = async (id: string) => {
  //   try {
  //     const memberData = await getMember(id);
  //     setMember(memberData);
  //     const points = memberData.purses.find(x => x.name === 'Anywhere Points')?.availBalance ?? 0;
  //     setTotalPoints(points);
  //     dispatch(addMember(memberData));
  //   } catch (error: any) {
  //     showError(error?.error?.error || error?.message);
  //   }
  // };

  // const handleSwitchMember = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const oldLoyaltyId = localStorage.getItem('loyaltyId');
    
  //   if (loyaltyId) {
  //     try {
  //       localStorage.setItem('loyaltyId', loyaltyId);
  //       await fetchMember(loyaltyId);
  //     } catch (error: any) {
  //       localStorage.setItem('loyaltyId', oldLoyaltyId || '');
  //       setLoyaltyId(oldLoyaltyId || '');
  //       showError(error?.error?.error || error?.message);
  //     }
  //   }
  // };

  // const handleLogout = () => {
  //   dispatch(clearMember());
  //   dispatch(clearCart());
  //   logout();
  //   navigate('/login');
  // };

  // if (!member) {
  //   return <Container>Loading...</Container>;
  // }

  // return (
  //   <Container>
  //     <ProfileHeader>
  //       <h1>Profile</h1>
  //       <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
  //     </ProfileHeader>

  //     <MemberInfo>
  //       <InfoRow>
  //         <Label>Name:</Label>
  //         <Value>{`${member.firstName} ${member.lastName}`}</Value>
  //       </InfoRow>
  //       <InfoRow>
  //         <Label>Email:</Label>
  //         <Value>{member.email}</Value>
  //       </InfoRow>
  //       <InfoRow>
  //         <Label>Loyalty ID:</Label>
  //         <Value>{member.loyaltyId}</Value>
  //       </InfoRow>

  //       <PointsDisplay>
  //         <div>Available Points</div>
  //         <PointsValue>{totalPoints}</PointsValue>
  //         <TierBadge>{member.tiers[0]?.level.name}</TierBadge>
  //       </PointsDisplay>

  //       <SwitchMemberForm onSubmit={handleSwitchMember}>
  //         <Input
  //           type="text"
  //           value={loyaltyId}
  //           onChange={(e) => setLoyaltyId(e.target.value)}
  //           placeholder="Enter Loyalty ID"
  //         />
  //         <Button type="submit" disabled={isFetching}>
  //           Switch Member
  //         </Button>
  //       </SwitchMemberForm>
  //     </MemberInfo>
  //   </Container>
  // );
}; 