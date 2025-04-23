import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from '../../services/location/locationService';
import { useAlert } from '../../services/alert/alertService';
import { setLocation } from '../../store/actions/locationActions';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const FormField = styled.div`
  width: 100%;
  padding: 0;
`;

const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Icon = styled.span`
  font-family: 'Material Symbols Outlined';
  font-size: 20px;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 16px;
  background-color: white;
  &:focus {
    outline: none;
    border-color: #1976d2;
  }
`;

interface Location {
  name: string;
  number: string;
  ext: {
    hideInMSSP?: boolean;
    operator?: string;
  };
}

export const Locations: React.FC = () => {
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const { getLocations } = useLocation();
  const { showError } = useAlert();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locations = await getLocations();
        const filteredLocations = locations.filter((location: Location) => !location.ext.hideInMSSP);
        setAllLocations(filteredLocations);
        if (filteredLocations.length > 0) {
          setSelectedLocation(filteredLocations[0].name);
          handleLocationChange(filteredLocations[0].name);
        }
      } catch (error: any) {
        showError(error?.error?.error || error?.message);
      }
    };

    fetchLocations();
  }, []);

  const handleLocationChange = (locationName: string) => {
    const location = allLocations.find(loc => loc.name === locationName);
    if (location) {
      dispatch(setLocation(location.number));
    }
  };

  if (!allLocations.length) {
    return null;
  }

  return (
    <Container>
      <FormField>
        <label>Property Name</label>
        <SelectContainer>
          <Icon>distance</Icon>
          <Select
            value={selectedLocation}
            onChange={(e) => {
              setSelectedLocation(e.target.value);
              handleLocationChange(e.target.value);
            }}
          >
            {allLocations.map((location) => (
              <option key={location.name} value={location.name}>
                {location.ext.operator && location.ext.operator !== 'PlayNow'
                  ? `${location.ext.operator} - ${location.name}`
                  : location.name}
              </option>
            ))}
          </Select>
        </SelectContainer>
      </FormField>
    </Container>
  );
}; 