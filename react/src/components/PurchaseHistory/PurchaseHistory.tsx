import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useMember } from '../../services/member/memberService';
import { useAlert } from '../../services/alert/alertService';
import { formatCurrency } from '../../utils/formatCurrency';
import { NoData } from '../common/NoData/NoData';
// import { LOB } from '../../enums/lobEnum';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.thead`
  background-color: #f5f5f5;
`;

const TableRow = styled.tr<{ expanded?: boolean }>`
  border-bottom: 1px solid #ddd;
  cursor: ${props => props.expanded ? 'pointer' : 'default'};
  
  &:hover {
    background-color: ${props => props.expanded ? '#f5f5f5' : 'transparent'};
  }
`;

const TableCell = styled.td`
  padding: 12px;
  text-align: left;
`;

const TableHeaderCell = styled.th`
  padding: 12px;
  text-align: left;
  font-weight: bold;
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #1976d2;
  
  &:hover {
    color: #1565c0;
  }
`;

const ExpandedContent = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
`;

const SearchInput = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
  margin-bottom: 20px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: 8px 12px;
  border: 1px solid ${props => props.active ? '#1976d2' : '#ddd'};
  background: ${props => props.active ? '#1976d2' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.active ? '#1565c0' : '#f5f5f5'};
  }
`;

interface PurchaseHistory {
  date: string;
  bookingId: string;
  location: string;
  desc: string;
  total: number;
  serviceStatusPoints: number;
  rewardUsed: number;
  spend: number;
  basePoints: number;
  lob: string;
  type: string;
  value: number;
  id: string;
  isExpandable: boolean;
  expanded: boolean;
  gaming: boolean;
  lineItems: any[];
  nestedData: any[];
  summary: any[];
}

export const PurchaseHistory = () => {
  // const dispatch = useDispatch();
  // const { getActivityHistory } = useMember();
  // const { showError } = useAlert();
  // const member = useSelector((state: any) => state.member);
  
  // const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory[]>([]);
  // const [filteredHistory, setFilteredHistory] = useState<PurchaseHistory[]>([]);
  // const [searchTerm, setSearchTerm] = useState('');
  // const [currentPage, setCurrentPage] = useState(1);
  // const [expandedRow, setExpandedRow] = useState<string | null>(null);
  // const [isLoading, setIsLoading] = useState(false);

  // const itemsPerPage = 10;

  // useEffect(() => {
  //   if (member && Object.keys(member).length) {
  //     fetchActivityHistory();
  //   }
  // }, [member]);

  // useEffect(() => {
  //   const filtered = purchaseHistory.filter(history => 
  //     history.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     history.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     history.desc.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  //   setFilteredHistory(filtered);
  //   setCurrentPage(1);
  // }, [searchTerm, purchaseHistory]);

  // const fetchActivityHistory = async () => {
  //   setIsLoading(true);
  //   try {
  //     const history = await getActivityHistory(member._id);
  //     const processedHistory = history
  //       .filter((h: any) => h.status === 'Processed')
  //       .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
  //       .map(formatHistory);
      
  //     setPurchaseHistory(processedHistory);
  //     setFilteredHistory(processedHistory);
  //   } catch (error: any) {
  //     showError(error?.error?.error || error?.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const formatHistory = (history: any): PurchaseHistory => {
  //   const pointsValue = getTotalPurse(history.result?.data?.purses);
  //   return {
  //     date: history.date,
  //     bookingId: history?.ext?.folioId || '-',
  //     location: history?.location?.name || '-',
  //     desc: history.result?.data?.desc || '-',
  //     total: getPurseValue(history.result?.data?.purses, 'Status Points'),
  //     serviceStatusPoints: getPurseValue(history.result?.data?.purses, 'GCGC Status Points'),
  //     rewardUsed: pointsValue < 0 ? Math.abs(pointsValue) : 0,
  //     spend: history.value,
  //     basePoints: pointsValue,
  //     lob: history?.ext?.lob,
  //     type: history.type,
  //     value: history.value,
  //     id: history._id,
  //     isExpandable: history.type === 'Accrual',
  //     expanded: false,
  //     gaming: history?.ext?.gaming,
  //     lineItems: history.lineItems.map((item: any) => ({ ...item, lob: history?.ext?.lob })),
  //     nestedData: [],
  //     summary: []
  //   };
  // };

  // const getPurseValue = (purses: any[], type: string) => {
  //   const selectedPurse = purses?.find(purse => purse.name === type);
  //   return selectedPurse ? selectedPurse.new - selectedPurse.prev : 0;
  // };

  // const getTotalPurse = (purses: any[], isStatus: boolean = false) => {
  //   const selectedPurse = purses?.filter(purse => 
  //     isStatus ? purse.name.includes('Status') : !purse.name.includes('Status')
  //   );
  //   return selectedPurse?.length ? 
  //     selectedPurse.reduce((acc, purse) => (purse.new - purse.prev) + acc, 0) : 0;
  // };

  // const getNestedData = (lineItems: any[]) => {
  //   const nestedData: any[] = [];
  //   for (const key of Object.keys(LOB)) {
  //     const filteredItems = lineItems.filter(item => item?.lob?.toUpperCase() === key);
  //     if (filteredItems.length) {
  //       nestedData.push({
  //         title: LOB[key],
  //         subTotal: { key: 'Subtotal', value: getTotal(filteredItems, 'Normal') },
  //         offers: getOffers(filteredItems, 'Discount'),
  //         tax: { key: 'Tax', value: getTotal(filteredItems, 'Tax') },
  //         gratuity: { key: 'Gratuity', value: getTotal(filteredItems, 'Gratuity') },
  //         total: { key: `Total ${LOB[key]}`, value: getTotal(filteredItems) }
  //       });
  //     }
  //   }
  //   return nestedData;
  // };

  // const getTotal = (lineItems: any[], type: string = '') => {
  //   return lineItems
  //     .filter(item => !type || (type && item.type === type))
  //     .reduce((acc, val) => acc + val.itemAmount, 0);
  // };

  // const getOffers = (lineItems: any[], type: string) => {
  //   const discountItems = lineItems.filter(item => item.type === type);
  //   const uniqueItems = new Set(discountItems.map(item => item.itemSKU));
  //   return Array.from(uniqueItems).map(uniq => ({
  //     key: uniq,
  //     value: discountItems
  //       .filter(item => item.itemSKU === uniq)
  //       .reduce((a, v) => a + v.itemAmount, 0)
  //   }));
  // };

  // const getSummary = (nestedData: any[]) => {
  //   if (nestedData.length) {
  //     const summaryData = nestedData.map(data => ({
  //       key: data.title,
  //       value: data.total.value
  //     }));
  //     summaryData.push({
  //       key: 'Total Charges',
  //       value: summaryData.reduce((acc, v) => acc + v.value, 0)
  //     });
  //     return summaryData;
  //   }
  //   return [];
  // };

  // const handleExpand = (id: string) => {
  //   setExpandedRow(expandedRow === id ? null : id);
  // };

  // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchTerm(e.target.value);
  // };

  // const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  // const paginatedData = filteredHistory.slice(
  //   (currentPage - 1) * itemsPerPage,
  //   currentPage * itemsPerPage
  // );

  // if (isLoading) {
  //   return <Container>Loading...</Container>;
  // }

  // // if (!filteredHistory.length) {
  // //   return <NoData message="No purchase history available" />;
  // // }

  // return (
  //   <Container>
  //     <SearchInput
  //       type="text"
  //       placeholder="Search by booking ID, location, or description"
  //       value={searchTerm}
  //       onChange={handleSearch}
  //     />

  //     <Table>
  //       <TableHeader>
  //         <tr>
  //           <TableHeaderCell>Date</TableHeaderCell>
  //           <TableHeaderCell>Booking ID</TableHeaderCell>
  //           <TableHeaderCell>Location</TableHeaderCell>
  //           <TableHeaderCell>Description</TableHeaderCell>
  //           <TableHeaderCell>Total Spend</TableHeaderCell>
  //           <TableHeaderCell>Status Points</TableHeaderCell>
  //           <TableHeaderCell>Reward Earned</TableHeaderCell>
  //           <TableHeaderCell></TableHeaderCell>
  //         </tr>
  //       </TableHeader>
  //       <tbody>
  //         {paginatedData.map(history => (
  //           <React.Fragment key={history.id}>
  //             <TableRow
  //               expanded={history.isExpandable}
  //               onClick={() => history.isExpandable && handleExpand(history.id)}
  //             >
  //               <TableCell>{new Date(history.date).toLocaleDateString()}</TableCell>
  //               <TableCell>{history.bookingId}</TableCell>
  //               <TableCell>{history.location}</TableCell>
  //               <TableCell>{history.desc}</TableCell>
  //               <TableCell>{formatCurrency(history.spend)}</TableCell>
  //               <TableCell>{history.total}</TableCell>
  //               <TableCell>{history.rewardUsed}</TableCell>
  //               <TableCell>
  //                 {history.isExpandable && (
  //                   <ExpandButton>
  //                     {expandedRow === history.id ? '▼' : '▶'}
  //                   </ExpandButton>
  //                 )}
  //               </TableCell>
  //             </TableRow>
  //             {expandedRow === history.id && (
  //               <tr>
  //                 <TableCell colSpan={8}>
  //                   <ExpandedContent>
  //                     {getNestedData(history.lineItems).map((data, index) => (
  //                       <div key={index}>
  //                         <h3>{data.title}</h3>
  //                         <SummaryRow>
  //                           <span>Subtotal:</span>
  //                           <span>{formatCurrency(data.subTotal.value)}</span>
  //                         </SummaryRow>
  //                         {data.offers.map((offer: any, i: number) => (
  //                           <SummaryRow key={i}>
  //                             <span>{offer.key}:</span>
  //                             <span>{formatCurrency(offer.value)}</span>
  //                           </SummaryRow>
  //                         ))}
  //                         <SummaryRow>
  //                           <span>Tax:</span>
  //                           <span>{formatCurrency(data.tax.value)}</span>
  //                         </SummaryRow>
  //                         <SummaryRow>
  //                           <span>Gratuity:</span>
  //                           <span>{formatCurrency(data.gratuity.value)}</span>
  //                         </SummaryRow>
  //                         <SummaryRow>
  //                           <span>Total:</span>
  //                           <span>{formatCurrency(data.total.value)}</span>
  //                         </SummaryRow>
  //                       </div>
  //                     ))}
  //                   </ExpandedContent>
  //                 </TableCell>
  //               </tr>
  //             )}
  //           </React.Fragment>
  //         ))}
  //       </tbody>
  //     </Table>

  //     <PaginationContainer>
  //       {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
  //         <PageButton
  //           key={page}
  //           active={currentPage === page}
  //           onClick={() => setCurrentPage(page)}
  //         >
  //           {page}
  //         </PageButton>
  //       ))}
  //     </PaginationContainer>
  //   </Container>
  // );
}; 