import styled, { css } from 'styled-components';

// General Components
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 0 auto;
  margin-top: 35px;
  margin-bottom: 15px;
  padding: 40px;
  padding-bottom: 15px;
  font-family: 'Inter';
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  align-items: center;
  border-radius: 7px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const InputGroup = styled.div`
  position: relative;
  margin-bottom: 0px;
`;

export const InputLabel = styled.label`
  position: absolute;
  top: -15%;
  left: 4%;
  font-size: 14px;
  color: #999;
  transition: all 0.3s ease;
  pointer-events: none;
  font-weight: normal;

  ${props => props.hasContent && css`
    transform: translate(0%, -45%);
    font-size: 10px;
    font-weight: normal;
    color: #999;
  `}
`;

export const Input = styled.input`
  position: absolute
  width: 100%;
  padding-top: ${(props) => (props.hasContent ? "20px" : "12px")};
  padding-bottom: ${(props) => (props.hasContent ? "8px" : "8px")}
  line-height: ${props => props.hasContent ? "24px" : "18px"};
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 12px;
  transition: border 0.3s, box-shadow 0.3s;

  &:focus {
    outline: none;
    border-color: #007b00;
    box-shadow: 0 0 8px rgba(0, 183, 0, 0.8);
  }
`;

export const VisibilityToggle = styled.span`
  position: absolute;
  top: 20%;
  right: 10px;
  color: #666;
  cursor: pointer;
`;

export const LinkedLabel = styled.label`
  color: #666;
  font-size: 12px;
  text-align: center;
  margin-top: 12px;
  font-weight: normal
`;

export const Button = styled.button`
  padding: 8px;
  background-color: #16A44A;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s; // Added box-shadow to the transition for a smooth effect

  &:hover {
    background-color: #138A3E; // Darker green on hover
    border-color: #138A3E;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.2); // Subtle shadow for depth, adjust as needed
  }

  &:focus,
  &:active {
    background-color: #16A44A; // Keep the original green color
    outline: none; // Removes the default focus outline
    border-color: #16A44A; // Ensures the border color stays consistent
    box-shadow: 0 0 0 2px rgba(22, 164, 74, 0.5); // Optional: Adds a custom focus glow
  }

  &:disabled {
    background-color: #8CCBA1;
    cursor: not-allowed;
    border-color: transparent;
  }
`;

export const BottomContainer = styled.div`
  max-width: 400px;
  min-height: 60px;
  margin: 10px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Inter';
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

export const BottomLabel = styled.label`
  color: #666;
  font-size: 14px;
  text-align: center;
  margin: 25px;
  font-weight: normal;
`;

// Components specific to LoginPage.js

export const ForgotPasswordLabel= styled.label`
color: #666;
font-size: 12px;
text-align: center;
margin-top: 20px;
margin-bottom: 10px;
font-weight: normal;
`;

// SignUp.js Specific

export const HeaderLabel = styled.label`
  color: #666;
  font-size: 17px;
  text-align: center;
  margin-bottom: 20px;
`;

export const ValidationIcon = styled.span`
  position: absolute;
  top: 65%;
  right: 10px;
  transform: translateY(-85%);
  color: ${props => props.isValid ? '#138A3E' : 'red'};
`;

// also specific to ResetPasswordPage.js
export const PasswordRules = styled.div`  
  background-color: #f7f7f7;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  position: absolute;
  right: -350px;
  top: 0px;
  width: 300px;
`;

// ProfilePage.js specific

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
`;

export const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  margin: 20px;
  display: block;
`;

export const ProfileField = styled.div`
  margin: 10px 0;
`;

export const ProfileLabel = styled.span`
  font-weight: bold;
`;

export const ProfileValue = styled.span`
  margin-left: 10px;
`;

// Components specific for ForgotPasswordPage.js
export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: flex-start; // Adjusted justify-content
`;


export const BackButton = styled.button`
  padding: 6px 12px;
  font-size: 14px;
  background-color: white;
  color: #999;
  border: none;
  margin: 0;
  margin-bottom: 60px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  outline: none; /* Remove default outline style */

  &:hover {
    color: #138A3E;
    background-color: white;
    border: none;
  }

  &:focus {
    color: #138A3E;
    box-shadow: 0 0 0 2px #138A3E;
    background-color: white;
    border: none;
  }
`;

export const Description = styled.p`
  color: #666;
  font-size: 14px;
  text-align: center;
  margin-bottom: 20px;
`;

// Components specific to ResetPasswordPage.js
export const Rule = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  font-size: 12px;
  color: ${props => props.isValid ? 'green' : 'red'};
`;