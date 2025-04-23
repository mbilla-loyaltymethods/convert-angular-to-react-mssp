import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal } from '../../common/Modal/Modal';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (answers: Record<string, string>) => void;
  questions: {
    id: string;
    question: string;
    options: string[];
  }[];
}

const QuestionContainer = styled.div`
  margin-bottom: 24px;
`;

const Question = styled.h3`
  margin: 0 0 16px 0;
  color: #333;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Option = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  background-color: #f5f5f5;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const RadioInput = styled.input`
  margin: 0;
`;

const SubmitButton = styled.button`
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 24px;
  width: 100%;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  questions
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleOptionChange = (questionId: string, option: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleSubmit = () => {
    onSubmit(answers);
    onClose();
  };

  const isComplete = questions.every(question => answers[question.id]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Style Quiz">
      {questions.map(question => (
        <QuestionContainer key={question.id}>
          <Question>{question.question}</Question>
          <OptionsContainer>
            {question.options.map(option => (
              <Option key={option}>
                <RadioInput
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={() => handleOptionChange(question.id, option)}
                />
                {option}
              </Option>
            ))}
          </OptionsContainer>
        </QuestionContainer>
      ))}
      <SubmitButton onClick={handleSubmit} disabled={!isComplete}>
        Submit
      </SubmitButton>
    </Modal>
  );
}; 